// Tarefas: uma lista só. Algumas pertencem a um lançamento (e nascem do modelo de tarefas-chave).

import type { SupabaseClient } from '@supabase/supabase-js'
import { registrarAtividade } from '@/lib/atividades'
import { somarDias, hojeISO } from '@/lib/datas'

export type Tarefa = {
  id: string
  titulo: string
  notas: string | null
  prazo: string | null
  feita: boolean
  feita_em: string | null
  lancamento_id: string | null
  chave: string | null
  ordem: number
  lancamento?: { id: string; projeto: string } | null
}

export type TarefaEditavel = Partial<Pick<Tarefa, 'titulo' | 'notas' | 'prazo' | 'feita' | 'lancamento_id'>>

// O que todo lançamento precisa, com o prazo em dias contados a partir da revelação.
export const TAREFAS_CHAVE: { chave: string; titulo: string; dias: number }[] = [
  { chave: 'data-revelacao', titulo: 'Combinar com a cliente a data da revelação', dias: -60 },
  { chave: 'autorizacao-imagem', titulo: 'Pegar a autorização de imagem da cliente', dias: -50 },
  { chave: 'foto-obra', titulo: 'Agendar fotógrafo para as fotos de obra', dias: -49 },
  { chave: 'preset', titulo: 'Escolher o preset de cor do arco', dias: -45 },
  { chave: 'fotografo-ensaio', titulo: 'Agendar fotógrafo para o ensaio do projeto pronto', dias: -30 },
  { chave: 'video', titulo: 'Agendar a captação de vídeo', dias: -30 },
  { chave: 'maquiagem', titulo: 'Agendar maquiagem e cabelo', dias: -24 },
  { chave: 'looks', titulo: 'Definir os looks do ensaio', dias: -24 },
  { chave: 'producao', titulo: 'Produção do ensaio: flores, objetos, mesa', dias: -22 },
  { chave: 'impressos', titulo: 'Imprimir as folhas e o material de apoio', dias: -21 },
  { chave: 'moodboard', titulo: 'Montar o moodboard com referências reais e créditos', dias: -10 },
  { chave: 'casa-nogs', titulo: 'Escrever a edição da Casa Nogs da revelação', dias: -3 },
  { chave: 'destaque', titulo: 'Criar o destaque do projeto no Instagram', dias: 7 },
  { chave: 'relato-cliente', titulo: 'Pedir à cliente o relato e a autorização para publicar', dias: 35 },
]

export async function listarTarefas(supabase: SupabaseClient, filtro: { lancamentoId?: string; abertas?: boolean } = {}): Promise<Tarefa[]> {
  let q = supabase.from('tarefas').select('*, lancamento:lancamentos(id, projeto)')
  if (filtro.lancamentoId) q = q.eq('lancamento_id', filtro.lancamentoId)
  if (filtro.abertas) q = q.eq('feita', false)
  const { data, error } = await q.order('prazo', { ascending: true, nullsFirst: false }).order('ordem')
  if (error) throw error
  return (data ?? []) as Tarefa[]
}

export async function criarTarefa(supabase: SupabaseClient, dados: TarefaEditavel & { titulo: string; chave?: string }): Promise<Tarefa> {
  const { data, error } = await supabase.from('tarefas').insert(dados).select('*, lancamento:lancamentos(id, projeto)').single()
  if (error) throw error
  await registrarAtividade(supabase, 'criou', 'tarefa', data.id, { titulo: dados.titulo })
  return data as Tarefa
}

export async function salvarTarefa(supabase: SupabaseClient, id: string, dados: TarefaEditavel) {
  const extra = dados.feita === undefined ? {} : { feita_em: dados.feita ? new Date().toISOString() : null }
  const { error } = await supabase.from('tarefas').update({ ...dados, ...extra }).eq('id', id)
  if (error) throw error
  if (dados.feita !== undefined) await registrarAtividade(supabase, 'mudou_status', 'tarefa', id, { feita: dados.feita })
}

export async function apagarTarefa(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('tarefas').delete().eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'arquivou', 'tarefa', id, { apagada: true })
}

/** Cria as tarefas-chave que o lançamento ainda não tem, com prazo a partir da revelação. */
export async function criarTarefasChave(supabase: SupabaseClient, lancamentoId: string, revelacao: string | null) {
  const { data: existentes } = await supabase.from('tarefas').select('chave').eq('lancamento_id', lancamentoId)
  const tem = new Set((existentes ?? []).map((t) => t.chave))
  const novas = TAREFAS_CHAVE.filter((t) => !tem.has(t.chave)).map((t, i) => ({
    titulo: t.titulo,
    chave: t.chave,
    lancamento_id: lancamentoId,
    prazo: revelacao ? somarDias(revelacao, t.dias) : null,
    ordem: i,
  }))
  if (novas.length === 0) return 0
  const { error } = await supabase.from('tarefas').insert(novas)
  if (error) throw error
  await registrarAtividade(supabase, 'criou', 'tarefa', lancamentoId, { tarefas_chave: novas.length })
  return novas.length
}

/** Em que faixa de tempo a tarefa cai, para agrupar a lista. */
export function faixa(t: Pick<Tarefa, 'prazo' | 'feita'>): 'atrasada' | 'hoje' | 'semana' | 'depois' | 'sem_prazo' | 'feita' {
  if (t.feita) return 'feita'
  if (!t.prazo) return 'sem_prazo'
  const hoje = hojeISO()
  if (t.prazo < hoje) return 'atrasada'
  if (t.prazo === hoje) return 'hoje'
  if (t.prazo <= somarDias(hoje, 7)) return 'semana'
  return 'depois'
}

export const FAIXAS = {
  atrasada: 'Atrasadas',
  hoje: 'Hoje',
  semana: 'Próximos 7 dias',
  depois: 'Depois',
  sem_prazo: 'Sem prazo',
  feita: 'Feitas',
} as const

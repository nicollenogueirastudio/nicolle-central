// Lançamentos: leitura e gravação. Toda escrita registra no histórico de atividades.

import type { SupabaseClient } from '@supabase/supabase-js'
import { registrarAtividade } from '@/lib/atividades'
import { instanteDeBR, somarDias } from '@/lib/datas'
import { criarPost } from '@/lib/posts/dados'
import { MOVIMENTOS, movimento } from './estrategia'

export type StatusLancamento = 'planejando' | 'em_andamento' | 'concluido' | 'arquivado'
export const STATUS_LANCAMENTO: Record<StatusLancamento, string> = {
  planejando: 'Planejando',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  arquivado: 'Arquivado',
}

export type MovimentoDoArco = {
  lancamento_id: string
  movimento: number
  data_prevista: string | null
  canal: string | null
  feito: boolean
  observacoes: string | null
  post_id: string | null
  post?: { id: string; status: string; titulo: string | null } | null
}

export type Lancamento = {
  id: string
  projeto: string
  cliente: string | null
  revelacao_em: string | null
  fotografia: string | null
  video: string | null
  status: StatusLancamento
  notas: string | null
  criado_em: string
  movimentos: MovimentoDoArco[]
}

export type LancamentoEditavel = Pick<Lancamento, 'projeto' | 'cliente' | 'revelacao_em' | 'fotografia' | 'video' | 'status' | 'notas'>

/** Data sugerida de um movimento a partir da revelação (null = contínuo ou livre). */
export const dataSugerida = (revelacao: string | null, n: number) => {
  const d = movimento(n).dias
  return revelacao && d != null ? somarDias(revelacao, d) : null
}

export async function listarLancamentos(supabase: SupabaseClient): Promise<Lancamento[]> {
  const { data, error } = await supabase
    .from('lancamentos')
    .select('*, movimentos:lancamento_movimentos(*, post:posts(id, status, titulo))')
    .order('revelacao_em', { ascending: false, nullsFirst: true })
  if (error) throw error
  return ((data ?? []) as Lancamento[]).map((l) => ({ ...l, movimentos: [...l.movimentos].sort((a, b) => a.movimento - b.movimento) }))
}

export async function criarLancamento(supabase: SupabaseClient, dados: Partial<LancamentoEditavel> & { projeto: string }): Promise<string> {
  const { data, error } = await supabase.from('lancamentos').insert(dados).select('id').single()
  if (error) throw error
  const linhas = MOVIMENTOS.map((m) => ({
    lancamento_id: data.id,
    movimento: m.n,
    data_prevista: dataSugerida(dados.revelacao_em ?? null, m.n),
    canal: m.canal,
  }))
  const { error: e2 } = await supabase.from('lancamento_movimentos').insert(linhas)
  if (e2) throw e2
  await registrarAtividade(supabase, 'criou', 'lancamento', data.id, { projeto: dados.projeto })
  return data.id
}

export async function salvarLancamento(supabase: SupabaseClient, id: string, dados: Partial<LancamentoEditavel>) {
  const { error } = await supabase.from('lancamentos').update(dados).eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'editou', 'lancamento', id)
}

export async function apagarLancamento(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('lancamentos').delete().eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'arquivou', 'lancamento', id, { apagado: true })
}

export async function salvarMovimento(supabase: SupabaseClient, lancamentoId: string, n: number, dados: Partial<Omit<MovimentoDoArco, 'lancamento_id' | 'movimento' | 'post'>>) {
  const { error } = await supabase.from('lancamento_movimentos').update(dados).eq('lancamento_id', lancamentoId).eq('movimento', n)
  if (error) throw error
}

/** Refaz as datas dos movimentos ainda não feitos a partir da revelação. */
export async function recalcularDatas(supabase: SupabaseClient, l: Lancamento) {
  for (const m of l.movimentos) {
    if (m.feito || m.post_id) continue
    await salvarMovimento(supabase, l.id, m.movimento, { data_prevista: dataSugerida(l.revelacao_em, m.movimento) })
  }
  await registrarAtividade(supabase, 'editou', 'lancamento', l.id, { recalculou_datas: l.revelacao_em })
}

/** Cria o post do movimento no calendário, em criação, com o briefing do manual. */
export async function criarPostDoMovimento(supabase: SupabaseClient, l: Lancamento, m: MovimentoDoArco): Promise<string> {
  const ref = movimento(m.movimento)
  if (!ref.post) throw new Error('Este movimento não vira post do feed')
  const briefing = [
    `${l.projeto} · movimento ${String(ref.n).padStart(2, '0')} (${ref.nome}) · Fase ${ref.fase}`,
    '',
    ref.oQueE,
    '',
    `Por quê: ${ref.porQue}`,
    '',
    'Como executar:',
    ...ref.comoExecutar.map((c) => `— ${c}`),
    m.observacoes ? `\nObservações: ${m.observacoes}` : '',
  ].join('\n').trim()

  const id = await criarPost(supabase, {
    tipo: ref.post.tipo,
    pilar: ref.post.pilar,
    titulo: `${l.projeto} · ${ref.nome}`,
    status: 'rascunho',
    data_hora: m.data_prevista ? instanteDeBR(m.data_prevista, '18:00') : null,
    briefing,
    fonte: [l.fotografia && `Fotografia: ${l.fotografia}`, l.video && `Vídeo: ${l.video}`].filter(Boolean).join(' · ') || null,
  })
  await salvarMovimento(supabase, l.id, m.movimento, { post_id: id })
  return id
}

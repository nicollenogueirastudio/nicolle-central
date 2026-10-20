// Planejamento: metas editáveis + os horizontes do The Icon Blueprint.

import type { SupabaseClient } from '@supabase/supabase-js'
import { registrarAtividade } from '@/lib/atividades'
import { hojeISO } from '@/lib/datas'

export const FRENTES = {
  marca: 'Marca',
  conteudo: 'Conteúdo',
  visibilidade: 'Visibilidade',
  produto: 'Produto',
  estrutura: 'Estrutura',
  pessoal: 'Pessoal',
} as const
export type Frente = keyof typeof FRENTES

export const STATUS_META = { a_fazer: 'A fazer', em_andamento: 'Em andamento', concluida: 'Concluída' } as const
export type StatusMeta = keyof typeof STATUS_META

export type Meta = {
  id: string
  titulo: string
  detalhe: string | null
  frente: Frente
  ano: number
  trimestre: number | null
  prazo: string | null
  status: StatusMeta
  concluida_em: string | null
  ordem: number
}

export type MetaEditavel = Partial<Pick<Meta, 'titulo' | 'detalhe' | 'frente' | 'ano' | 'trimestre' | 'prazo' | 'status'>>

// The Icon Blueprint: cinco horizontes em doze anos. H1 começou em 2026, o Ano da Fundação.
export const HORIZONTES = [
  { id: 'H1', nome: 'Fundação', quando: '0 a 12 meses', marcos: ['Manifesto', 'Peça Um', '10 mil no Instagram', '1 mil na Casa Nogs'] },
  { id: 'H2', nome: 'Assinatura', quando: '12 a 24 meses', marcos: ['1 projeto de hospitality', '3 publicações nacionais', '50 mil no Instagram'] },
  { id: 'H3', nome: 'Produto', quando: '2 a 4 anos', marcos: ['E-commerce', '3 licenciamentos', '1 livro', '200 mil no Instagram'] },
  { id: 'H4', nome: 'Mídia & escala', quando: '4 a 7 anos', marcos: ['Flagship', 'Série', 'Collab global', '500 mil no Instagram'] },
  { id: 'H5', nome: 'Lifestyle global', quando: '7 a 12 anos', marcos: ['Plataforma multicategoria', 'AD100', '1 milhão no Instagram'] },
]

export async function listarMetas(supabase: SupabaseClient): Promise<Meta[]> {
  const { data, error } = await supabase.from('planejamento_metas').select('*').order('ano').order('ordem')
  if (error) throw error
  return (data ?? []) as Meta[]
}

export async function criarMeta(supabase: SupabaseClient, dados: MetaEditavel & { titulo: string }, ordem: number) {
  const { data, error } = await supabase.from('planejamento_metas').insert({ ...dados, ordem }).select('*').single()
  if (error) throw error
  await registrarAtividade(supabase, 'criou', 'meta', data.id, { titulo: dados.titulo })
  return data as Meta
}

export async function salvarMeta(supabase: SupabaseClient, id: string, dados: MetaEditavel) {
  const extra: Record<string, unknown> = {}
  if (dados.status === 'concluida') extra.concluida_em = hojeISO()
  else if (dados.status) extra.concluida_em = null
  const { error } = await supabase.from('planejamento_metas').update({ ...dados, ...extra }).eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, dados.status ? 'mudou_status' : 'editou', 'meta', id, dados.status ? { para: dados.status } : null)
}

export async function apagarMeta(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('planejamento_metas').delete().eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'arquivou', 'meta', id, { apagada: true })
}

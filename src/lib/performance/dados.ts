// Leitura dos números reais para a Performance e a Newsletter. Nada aqui é inventado:
// o que a Meta ou o Substack não entregam aparece vazio, não como exemplo.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Categoria, Pilar, Tipo } from '@/lib/posts/tipos'

export type Retrato = { dia: string; seguidores: number | null; publicacoes: number | null; detalhe: Record<string, number | string> | null; origem?: 'api' | 'manual' }

export type PostMedido = {
  id: string
  tipo: Tipo
  pilar: Pilar | null
  categoria: Categoria | null
  quadro: string | null
  titulo: string | null
  legenda: string | null
  data_hora: string
  permalink: string | null
  capa?: string
  alcance: number | null
  curtidas: number | null
  comentarios: number | null
  salvos: number | null
  compartilhamentos: number | null
  visualizacoes: number | null
}

export async function retratosDaConta(supabase: SupabaseClient, rede: string): Promise<Retrato[]> {
  const { data, error } = await supabase
    .from('metricas_conta')
    .select('rede, dia, seguidores, publicacoes, detalhe, origem')
    .eq('rede', rede)
    .order('dia', { ascending: true })
  if (error) throw error
  return (data ?? []) as Retrato[]
}

/** Posts publicados entre dois instantes, com a métrica mais recente de cada um e a capa. */
export async function postsMedidos(supabase: SupabaseClient, de: string, ate: string): Promise<PostMedido[]> {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, tipo, pilar, categoria, quadro, titulo, legenda, data_hora, permalink, midias:posts_midia(caminho, ordem)')
    .eq('status', 'postado')
    .is('arquivado_em', null)
    .gte('data_hora', de)
    .lt('data_hora', ate)
    .order('data_hora', { ascending: false })
  if (error) throw error
  const lista = posts ?? []
  if (lista.length === 0) return []

  const ids = lista.map((p) => p.id)
  const metricas: Record<string, Partial<PostMedido>> = {}
  for (let i = 0; i < ids.length; i += 150) {
    const { data } = await supabase
      .from('posts_metricas')
      .select('post_id, dia, alcance, curtidas, comentarios, salvos, compartilhamentos, visualizacoes')
      .in('post_id', ids.slice(i, i + 150))
      .order('dia', { ascending: false })
    // Fica com o retrato mais recente de cada campo (curtidas e alcance podem vir em dias diferentes).
    ;(data ?? []).forEach((m) => {
      const atual = (metricas[m.post_id] ??= {})
      ;(['alcance', 'curtidas', 'comentarios', 'salvos', 'compartilhamentos', 'visualizacoes'] as const).forEach((k) => {
        if (atual[k] == null && m[k] != null) atual[k] = m[k]
      })
    })
  }

  const capas = lista.map((p) => (p.midias as { caminho: string; ordem: number }[]).sort((a, b) => a.ordem - b.ordem)[0]?.caminho).filter(Boolean) as string[]
  const links = new Map<string, string>()
  if (capas.length) {
    const { data } = await supabase.storage.from('posts-midia').createSignedUrls(capas, 3600)
    ;(data ?? []).forEach((d) => { if (d.path && d.signedUrl) links.set(d.path, d.signedUrl) })
  }

  return lista.map((p) => {
    const capa = (p.midias as { caminho: string; ordem: number }[]).sort((a, b) => a.ordem - b.ordem)[0]?.caminho
    const m = metricas[p.id] ?? {}
    return {
      id: p.id, tipo: p.tipo, pilar: p.pilar, categoria: p.categoria, quadro: p.quadro, titulo: p.titulo, legenda: p.legenda,
      data_hora: p.data_hora, permalink: p.permalink, capa: capa ? links.get(capa) : undefined,
      alcance: m.alcance ?? null, curtidas: m.curtidas ?? null, comentarios: m.comentarios ?? null,
      salvos: m.salvos ?? null, compartilhamentos: m.compartilhamentos ?? null, visualizacoes: m.visualizacoes ?? null,
    } as PostMedido
  })
}

// ---- contas (funções puras) ----

const soma = (v: (number | null)[]) => v.reduce<number>((s, x) => s + (x ?? 0), 0)
const comValor = (v: (number | null)[]) => v.filter((x): x is number => x != null)

export function media(v: (number | null)[]): number | null {
  const ok = comValor(v)
  return ok.length ? ok.reduce((s, x) => s + x, 0) / ok.length : null
}

/** Salvos por alcance: o sinal de desejo ("quero guardar isto"). */
export function taxaSalvamento(posts: PostMedido[]): number | null {
  const medidos = posts.filter((p) => p.alcance && p.salvos != null)
  const alcance = soma(medidos.map((p) => p.alcance))
  return alcance ? soma(medidos.map((p) => p.salvos)) / alcance : null
}

export function resumoDoGrupo(posts: PostMedido[]) {
  return {
    posts: posts.length,
    alcanceMedio: media(posts.map((p) => p.alcance)),
    curtidasMedias: media(posts.map((p) => p.curtidas)),
    salvamento: taxaSalvamento(posts),
  }
}

export function agrupar<K extends string>(posts: PostMedido[], chave: (p: PostMedido) => K) {
  const grupos = new Map<K, PostMedido[]>()
  posts.forEach((p) => {
    const k = chave(p)
    grupos.set(k, [...(grupos.get(k) ?? []), p])
  })
  return Array.from(grupos.entries()).map(([k, lista]) => ({ chave: k, ...resumoDoGrupo(lista) }))
}

/** Força do post para o ranking: alcance quando a Meta mediu, senão curtidas + comentários. */
export const forca = (p: PostMedido) => p.alcance ?? (p.curtidas ?? 0) + (p.comentarios ?? 0)

export function compacto(n: number | null | undefined): string {
  if (n == null) return '—'
  if (Math.abs(n) >= 10000) return `${(n / 1000).toFixed(0)} mil`
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')} mil`
  return Math.round(n).toLocaleString('pt-BR')
}

export const pct = (n: number | null) => (n == null ? '—' : `${(n * 100).toFixed(1).replace('.', ',')}%`)

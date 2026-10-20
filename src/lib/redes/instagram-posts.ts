// Fase 4b/4c · posts do Instagram: histórico, capas e métricas por post.
// Roda só no servidor com o cliente admin (o token da Meta vive na Vercel).
// Trabalha em lotes para caber no tempo de uma função da Vercel; cada chamada continua de onde a anterior parou.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Tipo } from '@/lib/posts/tipos'

const API = 'https://graph.facebook.com/v21.0'
const BUCKET = 'posts-midia'
const CAMPOS = 'id,caption,media_type,media_product_type,permalink,timestamp,media_url,thumbnail_url,like_count,comments_count'

type MidiaIG = {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_product_type?: 'FEED' | 'REELS' | 'STORY' | 'AD'
  permalink?: string
  timestamp: string
  media_url?: string
  thumbnail_url?: string
  like_count?: number
  comments_count?: number
}
type Pagina = { data: MidiaIG[]; paging?: { cursors?: { after?: string }; next?: string } }

async function chamar<T>(caminho: string, token: string): Promise<T> {
  const separador = caminho.includes('?') ? '&' : '?'
  const resposta = await fetch(`${API}${caminho}${separador}access_token=${encodeURIComponent(token)}`, { cache: 'no-store' })
  const corpo = await resposta.json()
  if (!resposta.ok || corpo.error) throw new Error(corpo.error?.message ?? `A Meta respondeu ${resposta.status}`)
  return corpo as T
}

export function tipoDoInstagram(m: Pick<MidiaIG, 'media_type' | 'media_product_type'>): Tipo {
  if (m.media_type === 'CAROUSEL_ALBUM') return 'carrossel'
  if (m.media_type === 'VIDEO' || m.media_product_type === 'REELS') return 'reels'
  return 'feed'
}

/** Primeira linha da legenda, curta, para virar o título interno. */
function tituloDaLegenda(legenda: string | undefined): string | null {
  const linha = legenda?.split('\n').map((l) => l.trim()).find(Boolean)
  if (!linha) return null
  return linha.length > 60 ? linha.slice(0, 57).trimEnd() + '…' : linha
}

/** Separa as hashtags do fim da legenda, como o editor guarda. */
function separarHashtags(legenda: string | undefined): { legenda: string | null; hashtags: string | null } {
  if (!legenda) return { legenda: null, hashtags: null }
  const linhas = legenda.trimEnd().split('\n')
  const fim: string[] = []
  while (linhas.length && /^(\s*#[\p{L}\p{N}_]+\s*)+$/u.test(linhas[linhas.length - 1])) fim.unshift(linhas.pop()!.trim())
  return { legenda: linhas.join('\n').trim() || null, hashtags: fim.join(' ') || null }
}

async function lerEstado(supabase: SupabaseClient) {
  const { data } = await supabase.from('sincronizacao_estado').select('valor').eq('chave', 'instagram_historico').maybeSingle()
  return (data?.valor ?? {}) as { cursor?: string; completo?: boolean }
}

async function gravarEstado(supabase: SupabaseClient, valor: { cursor?: string; completo?: boolean }) {
  await supabase.from('sincronizacao_estado').upsert({ chave: 'instagram_historico', valor, atualizado_em: new Date().toISOString() })
}

/** Grava (ou atualiza) os posts de uma página da API. Devolve quantos eram novos. */
async function gravarPosts(supabase: SupabaseClient, midias: MidiaIG[]): Promise<number> {
  if (midias.length === 0) return 0
  const ids = midias.map((m) => m.id)
  const { data: existentes } = await supabase.from('posts').select('id, ig_media_id').in('ig_media_id', ids)
  const jaTem = new Set((existentes ?? []).map((e) => e.ig_media_id))

  const novos = midias.filter((m) => !jaTem.has(m.id)).map((m) => {
    const { legenda, hashtags } = separarHashtags(m.caption)
    return {
      tipo: tipoDoInstagram(m),
      titulo: tituloDaLegenda(m.caption),
      legenda,
      hashtags,
      data_hora: m.timestamp,
      publicado_em: m.timestamp,
      status: 'postado',
      ig_media_id: m.id,
      permalink: m.permalink ?? null,
      origem: 'instagram',
    }
  })
  if (novos.length) {
    const { error } = await supabase.from('posts').insert(novos)
    if (error) throw error
  }
  // Curtidas e comentários vêm de graça na listagem: já vira o retrato do dia.
  await gravarMetricasBasicas(supabase, midias)
  return novos.length
}

async function gravarMetricasBasicas(supabase: SupabaseClient, midias: MidiaIG[]) {
  const { data: posts } = await supabase.from('posts').select('id, ig_media_id').in('ig_media_id', midias.map((m) => m.id))
  const porIg = new Map((posts ?? []).map((p) => [p.ig_media_id, p.id]))
  const dia = new Date().toISOString().slice(0, 10)
  const linhas = midias.filter((m) => porIg.has(m.id)).map((m) => ({
    post_id: porIg.get(m.id)!,
    dia,
    curtidas: m.like_count ?? null,
    comentarios: m.comments_count ?? null,
    coletado_em: new Date().toISOString(),
  }))
  if (linhas.length) await supabase.from('posts_metricas').upsert(linhas, { onConflict: 'post_id,dia', ignoreDuplicates: false })
}

/** Copia a capa do post para o storage (os links da Meta expiram). */
async function copiarCapas(supabase: SupabaseClient, token: string, limite: number): Promise<number> {
  const { data: semCapa } = await supabase
    .from('posts')
    .select('id, ig_media_id, midias:posts_midia(id)')
    .eq('origem', 'instagram')
    .not('ig_media_id', 'is', null)
    .order('data_hora', { ascending: false })
    .limit(limite * 4)
  const pendentes = (semCapa ?? []).filter((p) => (p.midias as unknown[]).length === 0).slice(0, limite)

  let copiadas = 0
  for (const p of pendentes) {
    try {
      const m = await chamar<MidiaIG>(`/${p.ig_media_id}?fields=media_type,media_url,thumbnail_url`, token)
      const origem = m.media_type === 'VIDEO' ? m.thumbnail_url ?? m.media_url : m.media_url ?? m.thumbnail_url
      if (!origem) continue
      const imagem = await fetch(origem)
      if (!imagem.ok) continue
      const caminho = `instagram/${p.ig_media_id}.jpg`
      const { error } = await supabase.storage.from(BUCKET).upload(caminho, await imagem.arrayBuffer(), { contentType: 'image/jpeg', upsert: true })
      if (error) continue
      await supabase.from('posts_midia').insert({ post_id: p.id, ordem: 0, caminho, tipo: 'imagem' })
      copiadas++
    } catch {
      // post apagado ou sem mídia: segue para o próximo
    }
  }
  return copiadas
}

type Insight = { name: string; values?: { value: number }[]; total_value?: { value: number } }

/** Alcance, salvos, compartilhamentos e visualizações de um post. Posts muito antigos podem não ter. */
async function insightsDoPost(igId: string, token: string): Promise<Record<string, number>> {
  const tentativas = ['reach,saved,shares,total_interactions,views', 'reach,saved,shares,total_interactions', 'reach,saved']
  for (const metricas of tentativas) {
    try {
      const r = await chamar<{ data: Insight[] }>(`/${igId}/insights?metric=${metricas}`, token)
      const saida: Record<string, number> = {}
      r.data.forEach((i) => { saida[i.name] = i.values?.[0]?.value ?? i.total_value?.value ?? 0 })
      return saida
    } catch {
      // tenta um conjunto menor de métricas
    }
  }
  return {}
}

/** Atualiza as métricas completas: posts dos últimos 45 dias todo dia; os antigos uma vez só. */
async function atualizarInsights(supabase: SupabaseClient, token: string, limite: number): Promise<number> {
  const dia = new Date().toISOString().slice(0, 10)
  const corte = new Date(Date.now() - 45 * 86400000).toISOString()

  const { data: recentes } = await supabase.from('posts').select('id, ig_media_id').eq('origem', 'instagram').gte('data_hora', corte)
  const { data: medidos } = await supabase.from('posts_metricas').select('post_id').not('alcance', 'is', null)
  const jaMedido = new Set((medidos ?? []).map((m) => m.post_id))
  const { data: hoje } = await supabase.from('posts_metricas').select('post_id').eq('dia', dia).not('alcance', 'is', null)
  const medidoHoje = new Set((hoje ?? []).map((m) => m.post_id))

  let fila = (recentes ?? []).filter((p) => !medidoHoje.has(p.id))
  if (fila.length < limite) {
    const { data: antigos } = await supabase.from('posts').select('id, ig_media_id').eq('origem', 'instagram').lt('data_hora', corte).order('data_hora', { ascending: false })
    fila = fila.concat((antigos ?? []).filter((p) => !jaMedido.has(p.id)))
  }
  fila = fila.slice(0, limite)

  let feitos = 0
  for (const p of fila) {
    const i = await insightsDoPost(p.ig_media_id!, token)
    await supabase.from('posts_metricas').upsert({
      post_id: p.id,
      dia,
      alcance: i.reach ?? 0,
      salvos: i.saved ?? null,
      compartilhamentos: i.shares ?? null,
      visualizacoes: i.views ?? null,
      interacoes: i.total_interactions ?? null,
      coletado_em: new Date().toISOString(),
    }, { onConflict: 'post_id,dia' })
    feitos++
  }
  return feitos
}

/**
 * Um passo da sincronização dos posts: novos posts (do mais recente até achar um que já existe),
 * páginas do histórico enquanto houver tempo, capas e métricas. Cabe no orçamento de tempo dado.
 */
export async function sincronizarPostsInstagram(supabase: SupabaseClient, igId: string, token: string, orcamentoMs = 38000) {
  const inicio = Date.now()
  const restante = () => orcamentoMs - (Date.now() - inicio)

  // 1. Novos posts: primeira página sempre (pega o que saiu desde ontem e atualiza curtidas recentes).
  const primeira = await chamar<Pagina>(`/${igId}/media?fields=${CAMPOS}&limit=50`, token)
  let novos = await gravarPosts(supabase, primeira.data)

  // 2. Histórico: continua de onde parou.
  const estado = await lerEstado(supabase)
  let historicoCompleto = !!estado.completo
  if (!historicoCompleto) {
    let cursor = estado.cursor ?? primeira.paging?.cursors?.after
    let proxima = estado.cursor ? true : !!primeira.paging?.next
    while (proxima && cursor && restante() > orcamentoMs * 0.55) {
      const pagina = await chamar<Pagina>(`/${igId}/media?fields=${CAMPOS}&limit=50&after=${cursor}`, token)
      novos += await gravarPosts(supabase, pagina.data)
      cursor = pagina.paging?.cursors?.after
      proxima = !!pagina.paging?.next
    }
    historicoCompleto = !proxima
    await gravarEstado(supabase, historicoCompleto ? { completo: true } : { cursor })
  }

  // 3. Capas e métricas com o tempo que sobrar.
  const capas = restante() > 15000 ? await copiarCapas(supabase, token, Math.max(5, Math.floor(restante() / 1500))) : 0
  const metricas = restante() > 8000 ? await atualizarInsights(supabase, token, Math.max(5, Math.floor(restante() / 700))) : 0

  const { count: total } = await supabase.from('posts').select('id', { count: 'exact', head: true }).eq('origem', 'instagram')
  return { novos, capas, metricas, total: total ?? 0, historicoCompleto }
}

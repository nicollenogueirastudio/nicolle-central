// Stories do Instagram: a Meta só mostra os que estão no ar (24 horas).
// A rotina diária guarda cada um com a miniatura e os números; como roda uma vez por dia,
// os números são os do momento da coleta (o story pode ainda estar no ar).

import type { SupabaseClient } from '@supabase/supabase-js'

const API = 'https://graph.facebook.com/v21.0'
const BUCKET = 'posts-midia'

type StoryIG = { id: string; media_type?: string; media_url?: string; thumbnail_url?: string; permalink?: string; timestamp: string }
type Insight = { name: string; values?: { value: number }[]; total_value?: { value: number; breakdowns?: { results?: { dimension_values: string[]; value: number }[] }[] } }

async function chamar<T>(caminho: string, token: string): Promise<T> {
  const separador = caminho.includes('?') ? '&' : '?'
  const resposta = await fetch(`${API}${caminho}${separador}access_token=${encodeURIComponent(token)}`, { cache: 'no-store' })
  const corpo = await resposta.json()
  if (!resposta.ok || corpo.error) throw new Error(corpo.error?.message ?? `A Meta respondeu ${resposta.status}`)
  return corpo as T
}

const valor = (i?: Insight) => i?.values?.[0]?.value ?? i?.total_value?.value ?? null

async function numerosDoStory(id: string, token: string) {
  const saida: Record<string, number | null> = {}
  for (const metricas of ['reach,views,replies,shares,total_interactions', 'reach,replies,shares', 'reach']) {
    try {
      const r = await chamar<{ data: Insight[] }>(`/${id}/insights?metric=${metricas}`, token)
      const de = (n: string) => valor(r.data.find((x) => x.name === n))
      Object.assign(saida, { alcance: de('reach'), visualizacoes: de('views'), respostas: de('replies'), compartilhamentos: de('shares'), interacoes: de('total_interactions') })
      break
    } catch {
      // tenta um conjunto menor
    }
  }
  try {
    const r = await chamar<{ data: Insight[] }>(`/${id}/insights?metric=navigation&breakdown=story_navigation_action_type`, token)
    const res = r.data[0]?.total_value?.breakdowns?.[0]?.results ?? []
    const de = (n: string) => res.find((x) => x.dimension_values[0] === n)?.value ?? null
    Object.assign(saida, { avancos: de('tap_forward'), voltas: de('tap_back'), saidas: de('tap_exit'), proximo_perfil: de('swipe_forward') })
  } catch {
    // sem navegação: segue
  }
  return saida
}

export async function sincronizarStories(supabase: SupabaseClient, igId: string, token: string): Promise<number> {
  const r = await chamar<{ data: StoryIG[] }>(`/${igId}/stories?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp`, token)
  const { data: jaTem } = await supabase.from('stories_publicados').select('id, caminho').in('id', r.data.map((s) => s.id).concat(['-']))
  const comCaminho = new Map((jaTem ?? []).map((s) => [s.id, s.caminho as string | null]))

  for (const s of r.data) {
    let caminho = comCaminho.get(s.id) ?? null
    if (!caminho) {
      const origem = s.media_type === 'VIDEO' ? s.thumbnail_url ?? s.media_url : s.media_url ?? s.thumbnail_url
      try {
        const img = origem ? await fetch(origem) : null
        if (img?.ok) {
          const c = `stories/${s.id}.jpg`
          const { error } = await supabase.storage.from(BUCKET).upload(c, await img.arrayBuffer(), { contentType: 'image/jpeg', upsert: true })
          if (!error) caminho = c
        }
      } catch {
        // sem miniatura
      }
    }
    await supabase.from('stories_publicados').upsert({
      id: s.id, publicado_em: s.timestamp, tipo: s.media_type ?? null, permalink: s.permalink ?? null, caminho,
      ...(await numerosDoStory(s.id, token)), coletado_em: new Date().toISOString(),
    }, { onConflict: 'id' })
  }
  return r.data.length
}

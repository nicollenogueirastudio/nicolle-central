// Leitura diária do Pinterest, TikTok e YouTube. Cada uma grava o retrato do dia em `metricas_conta`.
// Escrita com o cliente admin (os tokens ficam em `conexoes_tokens`, que a tela não enxerga).

import type { SupabaseClient } from '@supabase/supabase-js'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { tokenValido, appConfigurado } from './oauth'
import type { ResultadoSincronizacao } from './tipos'

const hoje = () => new Date().toISOString().slice(0, 10)

async function json<T>(r: Response, rede: string): Promise<T> {
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j?.message ?? j?.error?.message ?? `${rede} respondeu ${r.status}`)
  return j as T
}

// ---------- Pinterest ----------
// Conta: seguidores, pins, visualizações mensais. Analytics: impressões, salvos e cliques por dia (até 90 dias para trás).

type ContaPinterest = { username: string; follower_count?: number; following_count?: number; pin_count?: number; board_count?: number; monthly_views?: number }
type AnalyticsPinterest = { all?: { daily_metrics?: { date: string; data_status?: string; metrics?: Record<string, number> }[] } }

const NOMES_PINTEREST: Record<string, string> = {
  IMPRESSION: 'impressoes', SAVE: 'salvos', PIN_CLICK: 'cliques_pin', OUTBOUND_CLICK: 'cliques_saida', ENGAGEMENT: 'engajamento',
}

export async function sincronizarPinterest(): Promise<ResultadoSincronizacao> {
  if (!appConfigurado('pinterest')) return { ok: false, motivo: 'App do Pinterest ainda não configurado', semConfiguracao: true }
  const admin = criarClienteAdmin()
  const acesso = await tokenValido(admin, 'pinterest')
  if (!acesso) return { ok: false, motivo: 'Falta conectar a conta', semConfiguracao: true }
  const cabecalho = { Authorization: `Bearer ${acesso.token}` }

  const conta = await json<ContaPinterest>(await fetch('https://api.pinterest.com/v5/user_account', { headers: cabecalho, cache: 'no-store' }), 'Pinterest')

  // Analytics dos últimos 30 dias: refaz todo dia porque a Pinterest consolida os números com atraso.
  const fim = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const inicio = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
  try {
    const a = await json<AnalyticsPinterest>(await fetch(
      `https://api.pinterest.com/v5/user_account/analytics?start_date=${inicio}&end_date=${fim}&metric_types=${Object.keys(NOMES_PINTEREST).join(',')}`,
      { headers: cabecalho, cache: 'no-store' }
    ), 'Pinterest')
    const linhas = (a.all?.daily_metrics ?? []).filter((d) => d.metrics).map((d) => {
      const detalhe: Record<string, number> = {}
      Object.entries(d.metrics!).forEach(([k, v]) => { if (NOMES_PINTEREST[k]) detalhe[NOMES_PINTEREST[k]] = v })
      return { rede: 'pinterest', dia: d.date, detalhe, coletado_em: new Date().toISOString() }
    })
    if (linhas.length) await admin.from('metricas_conta').upsert(linhas, { onConflict: 'rede,dia' })
  } catch {
    // conta pessoal ou analytics indisponível: segue só com a conta
  }

  const { data: atual } = await admin.from('metricas_conta').select('detalhe').eq('rede', 'pinterest').eq('dia', hoje()).maybeSingle()
  await admin.from('metricas_conta').upsert({
    rede: 'pinterest', dia: hoje(),
    seguidores: conta.follower_count ?? null, seguindo: conta.following_count ?? null, publicacoes: conta.pin_count ?? null,
    detalhe: { ...(atual?.detalhe ?? {}), pastas: conta.board_count ?? null, visualizacoes_mensais: conta.monthly_views ?? null },
    coletado_em: new Date().toISOString(),
  }, { onConflict: 'rede,dia' })
  await admin.from('conexoes').update({ conta: conta.username }).eq('rede', 'pinterest')

  return { ok: true, resumo: `@${conta.username} · ${conta.follower_count ?? '?'} seguidores` }
}

// ---------- TikTok ----------
// Display API: seguidores, curtidas totais, vídeos e os números dos vídeos mais recentes.

type UsuarioTikTok = { data?: { user?: { display_name?: string; follower_count?: number; following_count?: number; likes_count?: number; video_count?: number } } }
type VideosTikTok = { data?: { videos?: { id: string; view_count?: number; like_count?: number; comment_count?: number; share_count?: number; create_time?: number }[] } }

export async function sincronizarTikTok(): Promise<ResultadoSincronizacao> {
  if (!appConfigurado('tiktok')) return { ok: false, motivo: 'App do TikTok ainda não configurado', semConfiguracao: true }
  const admin = criarClienteAdmin()
  const acesso = await tokenValido(admin, 'tiktok')
  if (!acesso) return { ok: false, motivo: 'Falta conectar a conta', semConfiguracao: true }
  const cabecalho = { Authorization: `Bearer ${acesso.token}` }

  const u = await json<UsuarioTikTok>(await fetch(
    'https://open.tiktokapis.com/v2/user/info/?fields=display_name,follower_count,following_count,likes_count,video_count',
    { headers: cabecalho, cache: 'no-store' }
  ), 'TikTok')
  const usuario = u.data?.user ?? {}

  const detalhe: Record<string, number> = { curtidas_total: usuario.likes_count ?? 0 }
  try {
    const v = await json<VideosTikTok>(await fetch(
      'https://open.tiktokapis.com/v2/video/list/?fields=id,view_count,like_count,comment_count,share_count,create_time',
      { method: 'POST', headers: { ...cabecalho, 'Content-Type': 'application/json' }, body: JSON.stringify({ max_count: 20 }), cache: 'no-store' }
    ), 'TikTok')
    const videos = v.data?.videos ?? []
    detalhe.videos_recentes = videos.length
    detalhe.visualizacoes_recentes = videos.reduce((s, x) => s + (x.view_count ?? 0), 0)
    detalhe.curtidas_recentes = videos.reduce((s, x) => s + (x.like_count ?? 0), 0)
    detalhe.compartilhamentos_recentes = videos.reduce((s, x) => s + (x.share_count ?? 0), 0)
  } catch {
    // sem permissão de vídeos ainda: segue com a conta
  }

  await admin.from('metricas_conta').upsert({
    rede: 'tiktok', dia: hoje(),
    seguidores: usuario.follower_count ?? null, seguindo: usuario.following_count ?? null, publicacoes: usuario.video_count ?? null,
    detalhe, coletado_em: new Date().toISOString(),
  }, { onConflict: 'rede,dia' })
  if (usuario.display_name) await admin.from('conexoes').update({ conta: usuario.display_name }).eq('rede', 'tiktok')

  return { ok: true, resumo: `${usuario.display_name ?? 'TikTok'} · ${usuario.follower_count ?? '?'} seguidores` }
}

// ---------- YouTube ----------
// Data API v3 com chave do Google: inscritos, visualizações e vídeos do canal (números públicos).

type CanalYouTube = { items?: { id: string; snippet?: { title?: string }; statistics?: { subscriberCount?: string; viewCount?: string; videoCount?: string; hiddenSubscriberCount?: boolean } }[] }

export async function sincronizarYouTube(supabase: SupabaseClient, conta: string | null): Promise<ResultadoSincronizacao> {
  const chave = process.env.YOUTUBE_API_KEY
  if (!chave) return { ok: false, motivo: 'Chave do Google ainda não configurada', semConfiguracao: true }
  if (!conta) return { ok: false, motivo: 'Falta informar o @ do canal', semConfiguracao: true }

  const filtro = conta.startsWith('UC') ? `id=${conta}` : `forHandle=${encodeURIComponent(conta.startsWith('@') ? conta : '@' + conta)}`
  const r = await json<CanalYouTube>(await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&${filtro}&key=${chave}`, { cache: 'no-store' }), 'YouTube')
  const canal = r.items?.[0]
  if (!canal) return { ok: false, motivo: `Canal ${conta} não encontrado` }
  const e = canal.statistics ?? {}

  const { error } = await supabase.from('metricas_conta').upsert({
    rede: 'youtube', dia: hoje(),
    seguidores: e.hiddenSubscriberCount ? null : Number(e.subscriberCount ?? 0),
    publicacoes: Number(e.videoCount ?? 0),
    detalhe: { visualizacoes_total: Number(e.viewCount ?? 0), canal_id: canal.id },
    coletado_em: new Date().toISOString(),
  }, { onConflict: 'rede,dia' })
  if (error) return { ok: false, motivo: error.message }

  return { ok: true, resumo: `${canal.snippet?.title ?? conta} · ${e.subscriberCount ?? '?'} inscritos` }
}

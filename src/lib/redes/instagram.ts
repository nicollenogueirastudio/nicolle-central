import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResultadoSincronizacao } from './tipos'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { sincronizarPostsInstagram } from './instagram-posts'

// Instagram via API da Meta (Graph API), conta de criador ligada a uma página do Facebook.
// Token de usuário do sistema (não expira) em META_TOKEN, só no servidor.

const API = 'https://graph.facebook.com/v21.0'

type Conta = { id: string; username: string; followers_count?: number; follows_count?: number; media_count?: number }

async function chamar<T>(caminho: string, token: string): Promise<T> {
  const separador = caminho.includes('?') ? '&' : '?'
  const resposta = await fetch(`${API}${caminho}${separador}access_token=${encodeURIComponent(token)}`, { cache: 'no-store' })
  const corpo = await resposta.json()
  if (!resposta.ok || corpo.error) throw new Error(corpo.error?.message ?? `A Meta respondeu ${resposta.status}`)
  return corpo as T
}

/** Descobre a conta do Instagram ligada às páginas que o token enxerga. */
export async function idDaConta(token: string): Promise<string> {
  if (process.env.INSTAGRAM_ID) return process.env.INSTAGRAM_ID
  const paginas = await chamar<{ data: { instagram_business_account?: { id: string } }[] }>(
    '/me/accounts?fields=name,instagram_business_account',
    token
  )
  const comInstagram = paginas.data.find((p) => p.instagram_business_account)
  if (!comInstagram?.instagram_business_account) {
    throw new Error('Nenhuma página do Facebook com Instagram ligado foi encontrada para este token')
  }
  return comInstagram.instagram_business_account.id
}

export async function sincronizarInstagram(supabase: SupabaseClient): Promise<ResultadoSincronizacao> {
  const token = process.env.META_TOKEN
  // Sem token configurado, não faz nada (nem mexe em status).
  if (!token) return { ok: false, motivo: 'Token da Meta ainda não configurado', semConfiguracao: true }

  const id = await idDaConta(token)
  const conta = await chamar<Conta>(`/${id}?fields=username,followers_count,follows_count,media_count`, token)

  const agora = new Date().toISOString()
  const { error } = await supabase.from('metricas_conta').upsert(
    {
      rede: 'instagram',
      dia: agora.slice(0, 10),
      seguidores: conta.followers_count ?? null,
      seguindo: conta.follows_count ?? null,
      publicacoes: conta.media_count ?? null,
      detalhe: { id: conta.id, ...(await insightsDaConta(id, token)) },
      coletado_em: agora,
    },
    { onConflict: 'rede,dia' }
  )
  if (error) return { ok: false, motivo: error.message }

  await supabase.from('conexoes').update({ conta: conta.username }).eq('rede', 'instagram')

  // Posts, capas e métricas por post: escrita só pela rotina (cliente admin), mesmo vindo do botão.
  let resumoPosts = ''
  try {
    const r = await sincronizarPostsInstagram(criarClienteAdmin(), id, token)
    resumoPosts = ` · ${r.total} posts${r.historicoCompleto ? '' : ' (importando histórico)'}`
  } catch (e) {
    resumoPosts = ` · posts: ${(e as Error).message}`
  }
  return { ok: true, resumo: `@${conta.username} · ${conta.followers_count ?? '?'} seguidores${resumoPosts}` }
}

/** Números do dia anterior da conta (alcance, visitas ao perfil, cliques no site). Se a Meta recusar, segue sem eles. */
async function insightsDaConta(id: string, token: string): Promise<Record<string, number>> {
  const ontem = Math.floor(Date.now() / 1000) - 86400
  const hoje = Math.floor(Date.now() / 1000)
  try {
    const r = await chamar<{ data: { name: string; total_value?: { value: number } }[] }>(
      `/${id}/insights?metric=reach,profile_views,accounts_engaged,website_clicks,total_interactions&period=day&metric_type=total_value&since=${ontem}&until=${hoje}`,
      token
    )
    const nomes: Record<string, string> = { reach: 'alcance', profile_views: 'visitas_perfil', accounts_engaged: 'contas_engajadas', website_clicks: 'cliques_site', total_interactions: 'interacoes' }
    const saida: Record<string, number> = {}
    r.data.forEach((m) => { if (nomes[m.name] && m.total_value) saida[nomes[m.name]] = m.total_value.value })
    return saida
  } catch {
    return {}
  }
}

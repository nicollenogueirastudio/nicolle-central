// Login nas redes (OAuth) e tokens que se renovam sozinhos. Só servidor.
// Chaves dos apps vivem na Vercel; os tokens de acesso, em `conexoes_tokens` (sem política: só o service role).

import type { SupabaseClient } from '@supabase/supabase-js'
import type { RedeOAuth } from './tipos'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nicolle-central.vercel.app'
export const redirecionamento = (rede: RedeOAuth) => `${BASE}/api/conectar/${rede}/callback`

type Tokens = { access_token: string; refresh_token?: string; expires_in?: number; refresh_token_expires_in?: number; refresh_expires_in?: number; scope?: string; open_id?: string }

const PROVEDORES: Record<RedeOAuth, {
  id: string | undefined
  segredo: string | undefined
  autorizar: (estado: string) => string
  trocar: (corpo: Record<string, string>) => Promise<Tokens>
}> = {
  pinterest: {
    id: process.env.PINTEREST_APP_ID,
    segredo: process.env.PINTEREST_APP_SECRET,
    autorizar: (estado) => `https://www.pinterest.com/oauth/?${new URLSearchParams({
      client_id: process.env.PINTEREST_APP_ID ?? '',
      redirect_uri: redirecionamento('pinterest'),
      response_type: 'code',
      scope: 'user_accounts:read,boards:read,pins:read',
      state: estado,
    })}`,
    trocar: async (corpo) => {
      const basic = Buffer.from(`${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`).toString('base64')
      const r = await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(corpo.grant_type === 'authorization_code' ? { ...corpo, continuous_refresh: 'true' } : corpo),
      })
      const j = await r.json()
      if (!r.ok || !j.access_token) throw new Error(j.message ?? `Pinterest respondeu ${r.status}`)
      return j
    },
  },
  tiktok: {
    id: process.env.TIKTOK_CLIENT_KEY,
    segredo: process.env.TIKTOK_CLIENT_SECRET,
    autorizar: (estado) => `https://www.tiktok.com/v2/auth/authorize/?${new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY ?? '',
      redirect_uri: redirecionamento('tiktok'),
      response_type: 'code',
      scope: 'user.info.basic,user.info.stats,video.list',
      state: estado,
    })}`,
    trocar: async (corpo) => {
      const r = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_key: process.env.TIKTOK_CLIENT_KEY ?? '', client_secret: process.env.TIKTOK_CLIENT_SECRET ?? '', ...corpo }),
      })
      const j = await r.json()
      if (!r.ok || !j.access_token) throw new Error(j.error_description ?? j.error ?? `TikTok respondeu ${r.status}`)
      return j
    },
  },
}

export const appConfigurado = (rede: RedeOAuth) => !!(PROVEDORES[rede].id && PROVEDORES[rede].segredo)
export const urlAutorizar = (rede: RedeOAuth, estado: string) => PROVEDORES[rede].autorizar(estado)

async function gravar(supabase: SupabaseClient, rede: RedeOAuth, t: Tokens) {
  const agora = Date.now()
  const refreshExpira = t.refresh_token_expires_in ?? t.refresh_expires_in
  const { error } = await supabase.from('conexoes_tokens').upsert({
    rede,
    access_token: t.access_token,
    refresh_token: t.refresh_token ?? null,
    expira_em: t.expires_in ? new Date(agora + t.expires_in * 1000).toISOString() : null,
    refresh_expira_em: refreshExpira ? new Date(agora + refreshExpira * 1000).toISOString() : null,
    escopo: t.scope ?? null,
    conta_id: t.open_id ?? null,
    atualizado_em: new Date().toISOString(),
  })
  if (error) throw error
  await supabase.from('conexoes').update({ token_expira_em: refreshExpira ? new Date(agora + refreshExpira * 1000).toISOString() : null }).eq('rede', rede)
}

/** Callback do login: troca o código pelos tokens e guarda. */
export async function trocarCodigo(supabase: SupabaseClient, rede: RedeOAuth, codigo: string) {
  const t = await PROVEDORES[rede].trocar({ grant_type: 'authorization_code', code: codigo, redirect_uri: redirecionamento(rede) })
  await gravar(supabase, rede, t)
}

/** Token válido para chamar a rede; renova sozinho quando está para vencer. `null` = não conectada. */
export async function tokenValido(supabase: SupabaseClient, rede: RedeOAuth): Promise<{ token: string; contaId: string | null } | null> {
  const { data } = await supabase.from('conexoes_tokens').select('*').eq('rede', rede).maybeSingle()
  if (!data) return null
  const vence = data.expira_em ? Date.parse(data.expira_em) : Infinity
  if (vence - Date.now() > 10 * 60 * 1000) return { token: data.access_token, contaId: data.conta_id }
  if (!data.refresh_token) throw new Error('O acesso venceu: conecte de novo')
  const t = await PROVEDORES[rede].trocar({ grant_type: 'refresh_token', refresh_token: data.refresh_token })
  await gravar(supabase, rede, { ...t, open_id: t.open_id ?? data.conta_id ?? undefined, refresh_token: t.refresh_token ?? data.refresh_token })
  return { token: t.access_token, contaId: t.open_id ?? data.conta_id }
}

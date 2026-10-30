// Peças comuns das rotas de tráfego: sessão, configuração e registro de cada ação mandada à Meta.

import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { criarClienteServidor } from '@/lib/supabase/server'
import type { Config } from './tipos'

export async function sessao() {
  const supabase = criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

export const naoLogado = () => NextResponse.json({ ok: false, motivo: 'Faça login de novo' }, { status: 401 })
export const falha = (e: unknown, status = 400) => NextResponse.json({ ok: false, motivo: (e as Error).message ?? String(e) }, { status })

export async function lerConfig(supabase: SupabaseClient): Promise<Config> {
  const { data, error } = await supabase.from('trafego_config').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  const c = (data ?? {}) as Config
  return {
    ...c,
    conta_anuncios_id: c.conta_anuncios_id ?? process.env.META_AD_ACCOUNT ?? null,
    teto_diario: c.teto_diario != null ? Number(c.teto_diario) : null,
    teto_mensal: c.teto_mensal != null ? Number(c.teto_mensal) : null,
  }
}

export async function registrar(
  supabase: SupabaseClient, userId: string, acao: string, alvo: string | null,
  detalhe: Record<string, unknown> | null, ok: boolean, erro?: string
) {
  await supabase.from('trafego_acoes').insert({ usuario_id: userId, acao, alvo, detalhe, ok, erro: erro ?? null })
}

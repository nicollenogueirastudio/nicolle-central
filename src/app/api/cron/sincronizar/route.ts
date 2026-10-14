import { NextResponse } from 'next/server'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { sincronizarRede } from '@/lib/redes/sincronizar'
import { ORDEM_REDES } from '@/lib/redes/tipos'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Rotina diária da Vercel (vercel.json). A Vercel manda "Authorization: Bearer CRON_SECRET".
export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET
  if (!segredo || request.headers.get('authorization') !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const supabase = criarClienteAdmin()
  const resultados: Record<string, unknown> = {}
  for (let i = 0; i < ORDEM_REDES.length; i++) {
    const rede = ORDEM_REDES[i]
    resultados[rede] = await sincronizarRede(supabase, rede)
  }
  return NextResponse.json({ ok: true, resultados })
}

import { NextResponse } from 'next/server'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { idDaConta } from '@/lib/redes/instagram'
import { sincronizarPostsInstagram } from '@/lib/redes/instagram-posts'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Importação do histórico do Instagram em lotes (só posts, capas e métricas).
// Protegida pelo CRON_SECRET; chamar várias vezes até `historicoCompleto` e não sobrar capa nem métrica.
export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET
  if (!segredo || request.headers.get('authorization') !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const token = process.env.META_TOKEN
  if (!token) return NextResponse.json({ ok: false, motivo: 'Token da Meta ainda não configurado' })

  try {
    const resultado = await sincronizarPostsInstagram(criarClienteAdmin(), await idDaConta(token), token, 52000)
    return NextResponse.json({ ok: true, ...resultado })
  } catch (e) {
    return NextResponse.json({ ok: false, motivo: (e as Error).message }, { status: 500 })
  }
}

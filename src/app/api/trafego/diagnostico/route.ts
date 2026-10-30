import { NextResponse } from 'next/server'
import { diagnostico } from '@/lib/trafego/meta'
import { sessao, naoLogado, falha } from '@/lib/trafego/servidor'

export const dynamic = 'force-dynamic'

// O que o token da Meta enxerga: permissões, contas de anúncio e páginas com Instagram.
export async function GET() {
  const { user } = await sessao()
  if (!user) return naoLogado()
  try {
    return NextResponse.json({ ok: true, ...(await diagnostico()) })
  } catch (e) {
    return falha(e)
  }
}

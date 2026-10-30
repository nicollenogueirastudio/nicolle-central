import { NextResponse } from 'next/server'
import { buscar } from '@/lib/trafego/meta'
import { sessao, naoLogado, falha } from '@/lib/trafego/servidor'

export const dynamic = 'force-dynamic'

// Autocompletar do público: cidades e interesses, direto da Meta.
export async function GET(request: Request) {
  const { user } = await sessao()
  if (!user) return naoLogado()
  const url = new URL(request.url)
  const tipo = url.searchParams.get('tipo'), q = url.searchParams.get('q')?.trim()
  if ((tipo !== 'cidade' && tipo !== 'interesse') || !q) return NextResponse.json({ ok: true, itens: [] })
  try {
    return NextResponse.json({ ok: true, itens: await buscar(tipo, q) })
  } catch (e) {
    return falha(e)
  }
}

import { NextResponse } from 'next/server'
import { criarClienteServidor } from '@/lib/supabase/server'
import { appConfigurado, urlAutorizar } from '@/lib/redes/oauth'
import { REDES_OAUTH, type RedeOAuth } from '@/lib/redes/tipos'

export const dynamic = 'force-dynamic'

// Botão "Conectar": manda para o login da rede, com um código anti-falsificação (state) num cookie.
export async function GET(request: Request, { params }: { params: { rede: string } }) {
  const supabase = criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const rede = params.rede as RedeOAuth
  if (!REDES_OAUTH.includes(rede)) return NextResponse.json({ ok: false, motivo: 'Rede inválida' }, { status: 400 })
  if (!appConfigurado(rede)) return NextResponse.redirect(new URL(`/configuracoes?erro=${rede}-sem-app`, request.url))

  const estado = crypto.randomUUID()
  const resposta = NextResponse.redirect(urlAutorizar(rede, estado))
  resposta.cookies.set(`oauth_${rede}`, estado, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/' })
  return resposta
}

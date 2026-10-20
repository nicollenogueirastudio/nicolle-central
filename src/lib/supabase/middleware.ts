import { createServerClient, type CookieOptions } from '@supabase/ssr'

type CookieParaGravar = { name: string; value: string; options: CookieOptions }
import { NextResponse, type NextRequest } from 'next/server'

// Páginas que abrem sem login. /api/cron se protege sozinha com o CRON_SECRET.
// /privacidade e /termos são exigidas pelas redes para aprovar os apps.
const ROTAS_PUBLICAS = ['/login', '/auth/callback', '/api/cron', '/privacidade', '/termos']

export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieParaGravar[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const caminho = request.nextUrl.pathname
  const publica = ROTAS_PUBLICAS.some((r) => caminho === r || caminho.startsWith(r + '/'))

  if (!user && !publica) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (user && caminho === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

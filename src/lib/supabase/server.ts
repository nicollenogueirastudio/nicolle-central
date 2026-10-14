import { createServerClient, type CookieOptions } from '@supabase/ssr'

type CookieParaGravar = { name: string; value: string; options: CookieOptions }
import { cookies } from 'next/headers'

// Cliente do Supabase para o servidor (server components, route handlers, server actions).
// Usa a sessão do usuário logado guardada nos cookies.
export function criarClienteServidor() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieParaGravar[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Chamado de um server component: o middleware já renova a sessão.
          }
        },
      },
    }
  )
}

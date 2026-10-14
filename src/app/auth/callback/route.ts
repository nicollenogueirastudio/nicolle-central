import { NextResponse } from 'next/server'
import { criarClienteServidor } from '@/lib/supabase/server'
import { registrarAtividade } from '@/lib/atividades'

// O link mágico do e-mail cai aqui: troca o código pela sessão e entra no painel.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = criarClienteServidor()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      await registrarAtividade(supabase, 'entrou', 'sessao')
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}

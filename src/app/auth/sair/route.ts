import { NextResponse } from 'next/server'
import { criarClienteServidor } from '@/lib/supabase/server'
import { registrarAtividade } from '@/lib/atividades'

export async function POST(request: Request) {
  const supabase = criarClienteServidor()
  await registrarAtividade(supabase, 'saiu', 'sessao')
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 })
}

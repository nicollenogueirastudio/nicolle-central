import { NextResponse } from 'next/server'
import { criarClienteServidor } from '@/lib/supabase/server'
import { registrarAtividade } from '@/lib/atividades'
import { sincronizarRede } from '@/lib/redes/sincronizar'
import { ORDEM_REDES, type Rede } from '@/lib/redes/tipos'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Botão "Sincronizar agora": roda com a sessão de quem está logado (RLS vale).
export async function POST(request: Request) {
  const supabase = criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, motivo: 'Faça login de novo' }, { status: 401 })

  const { rede } = (await request.json().catch(() => ({}))) as { rede?: Rede }
  if (!rede || !ORDEM_REDES.includes(rede)) {
    return NextResponse.json({ ok: false, motivo: 'Rede inválida' }, { status: 400 })
  }

  const resultado = await sincronizarRede(supabase, rede)
  if (resultado.ok) await registrarAtividade(supabase, 'sincronizou', 'conexao', rede, { resumo: resultado.resumo })
  return NextResponse.json(resultado)
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { criarClienteServidor } from '@/lib/supabase/server'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { trocarCodigo } from '@/lib/redes/oauth'
import { sincronizarRede } from '@/lib/redes/sincronizar'
import { registrarAtividade } from '@/lib/atividades'
import { REDES_OAUTH, type RedeOAuth } from '@/lib/redes/tipos'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Volta do login da rede: confere o state, troca o código pelos tokens, faz a primeira leitura.
export async function GET(request: Request, { params }: { params: { rede: string } }) {
  const url = new URL(request.url)
  const voltar = (q: string) => NextResponse.redirect(new URL(`/configuracoes?${q}`, request.url))

  const supabase = criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const rede = params.rede as RedeOAuth
  if (!REDES_OAUTH.includes(rede)) return voltar('erro=rede-invalida')

  const estado = cookies().get(`oauth_${rede}`)?.value
  if (!estado || estado !== url.searchParams.get('state')) return voltar(`erro=${rede}-state`)
  const codigo = url.searchParams.get('code')
  if (!codigo) return voltar(`erro=${rede}-${url.searchParams.get('error') ?? 'sem-codigo'}`)

  try {
    await trocarCodigo(criarClienteAdmin(), rede, codigo)
  } catch (e) {
    return voltar(`erro=${rede}-token&detalhe=${encodeURIComponent((e as Error).message)}`)
  }
  const resultado = await sincronizarRede(criarClienteAdmin(), rede)
  await registrarAtividade(supabase, 'sincronizou', 'conexao', rede, { resumo: resultado.ok ? resultado.resumo : resultado.motivo })

  const resposta = voltar(`conectado=${rede}`)
  resposta.cookies.delete(`oauth_${rede}`)
  return resposta
}

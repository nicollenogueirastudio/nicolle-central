import { NextResponse } from 'next/server'
import { campanhas, detalheCampanha, resultadosConta } from '@/lib/trafego/meta'
import { sessao, naoLogado, falha, lerConfig } from '@/lib/trafego/servidor'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Números do período: conta inteira (total e por dia) e cada campanha.
// Com ?campanha=ID devolve os conjuntos e anúncios daquela campanha.
export async function GET(request: Request) {
  const { supabase, user } = await sessao()
  if (!user) return naoLogado()
  const url = new URL(request.url)
  const de = url.searchParams.get('de'), ate = url.searchParams.get('ate')
  if (!de || !ate) return falha(new Error('Período inválido'))
  try {
    const campanhaId = url.searchParams.get('campanha')
    if (campanhaId) return NextResponse.json({ ok: true, ...(await detalheCampanha(campanhaId, de, ate)) })

    const cfg = await lerConfig(supabase)
    if (!cfg.conta_anuncios_id) return NextResponse.json({ ok: false, semConta: true, motivo: 'Escolha a conta de anúncios em Configurar' })
    const hoje = new Date().toISOString().slice(0, 10)
    const [conta, lista, mes] = await Promise.all([
      resultadosConta(cfg.conta_anuncios_id, de, ate),
      campanhas(cfg.conta_anuncios_id, de, ate),
      resultadosConta(cfg.conta_anuncios_id, hoje.slice(0, 8) + '01', hoje),
    ])
    return NextResponse.json({ ok: true, conta: cfg.conta_anuncios_id, ...conta, campanhas: lista, investidoMes: mes.total.spend, tetoMensal: cfg.teto_mensal })
  } catch (e) {
    return falha(e)
  }
}

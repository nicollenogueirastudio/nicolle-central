import { NextResponse } from 'next/server'
import { mudarOrcamentoDiario, mudarStatus } from '@/lib/trafego/meta'
import { sessao, naoLogado, falha, lerConfig, registrar } from '@/lib/trafego/servidor'
import { reais } from '@/lib/trafego/tipos'

export const dynamic = 'force-dynamic'

type Pedido =
  | { acao: 'status'; id: string; status: 'ACTIVE' | 'PAUSED'; nome?: string }
  | { acao: 'orcamento'; id: string; valor: number; nome?: string }

// Ligar, pausar e mudar orçamento de campanha, conjunto ou anúncio na Meta. Toda ação fica registrada.
export async function POST(request: Request) {
  const { supabase, user } = await sessao()
  if (!user) return naoLogado()
  const p = (await request.json().catch(() => null)) as Pedido | null
  if (!p?.id) return falha(new Error('Pedido inválido'))

  try {
    if (p.acao === 'status') {
      if (p.status !== 'ACTIVE' && p.status !== 'PAUSED') throw new Error('Status inválido')
      await mudarStatus(p.id, p.status)
    } else if (p.acao === 'orcamento') {
      const cfg = await lerConfig(supabase)
      if (!(p.valor > 0)) throw new Error('Orçamento inválido')
      if (cfg.teto_diario != null && p.valor > cfg.teto_diario) throw new Error(`Acima do teto diário de ${reais(cfg.teto_diario)}. Mude o teto em Configurar se for de propósito.`)
      await mudarOrcamentoDiario(p.id, p.valor)
    } else {
      throw new Error('Ação inválida')
    }
    await registrar(supabase, user.id, p.acao, p.id, { ...p }, true)
    return NextResponse.json({ ok: true })
  } catch (e) {
    await registrar(supabase, user.id, p.acao, p.id, { ...p }, false, (e as Error).message)
    return falha(e)
  }
}

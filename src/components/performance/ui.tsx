import Link from 'next/link'

export const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

export function Tile({ rotulo, valor, nota }: { rotulo: string; valor: string; nota?: React.ReactNode }) {
  return (
    <div className={`${cartao} p-5`}>
      <div className="text-[12px] text-muted">{rotulo}</div>
      <div className="font-display text-[30px] leading-tight text-charcoal tabular-nums mt-1">{valor}</div>
      {nota && <div className="mt-1">{nota}</div>}
    </div>
  )
}

/** Variação contra o período anterior. `pct` compara taxas em pontos percentuais. */
export function Variacao({ atual, anterior, nome, formato = 'numero' }: { atual: number | null; anterior: number | null; nome: string; formato?: 'numero' | 'pct' }) {
  if (atual == null || anterior == null || anterior === 0) return <span className="text-[12px] text-muted">sem {nome} para comparar</span>
  const d = formato === 'pct' ? (atual - anterior) * 100 : ((atual - anterior) / anterior) * 100
  return (
    <span className="text-[12px] text-muted">
      <span className={d >= 0 ? 'text-olive font-medium' : 'text-[#8C6B3F] font-medium'}>{d > 0 ? '+' : ''}{d.toFixed(0)}{formato === 'pct' ? ' p.p.' : '%'}</span> vs {nome}
    </span>
  )
}

export function NaoConectada({ rede, texto }: { rede: string; texto: string }) {
  return (
    <div className={`${cartao} p-12 text-center`}>
      <p className="text-[15px] font-medium text-charcoal">{rede} ainda não está conectado</p>
      <p className="text-[13px] text-muted mt-1 max-w-[460px] mx-auto">{texto}</p>
      <Link href="/configuracoes" className="inline-block mt-4 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black transition-colors">
        Ir para Conexões
      </Link>
    </div>
  )
}

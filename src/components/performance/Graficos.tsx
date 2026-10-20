'use client'

import { useMemo, useState } from 'react'
import { dataBR } from '@/lib/datas'

// Gráficos simples em SVG: uma série, uma cor (oliva), grade discreta, dica ao passar o mouse.
const COR = '#6B6F4E'

const tickLimpo = (max: number) => {
  const passo = Math.pow(10, Math.floor(Math.log10(Math.max(1, max))))
  const opcoes = [1, 2, 2.5, 5, 10].map((m) => m * passo)
  return opcoes.find((o) => max / o <= 4) ?? passo * 10
}

const fmt = (n: number) => n.toLocaleString('pt-BR')

/** Linha no tempo (ex.: seguidores por dia). A escala não começa no zero: mostra a variação. */
export function LinhaTempo({ pontos, rotulo }: { pontos: { dia: string; valor: number }[]; rotulo: string }) {
  const [foco, setFoco] = useState<number | null>(null)
  const L = 760, A = 220, m = { t: 16, r: 56, b: 28, l: 48 }

  const geo = useMemo(() => {
    const vals = pontos.map((p) => p.valor)
    const min = Math.min(...vals), max = Math.max(...vals)
    const folga = Math.max(1, (max - min) * 0.15)
    const lo = Math.floor(min - folga), hi = Math.ceil(max + folga)
    const x = (i: number) => m.l + (pontos.length === 1 ? (L - m.l - m.r) / 2 : (i / (pontos.length - 1)) * (L - m.l - m.r))
    const y = (v: number) => m.t + (1 - (v - lo) / (hi - lo)) * (A - m.t - m.b)
    const passo = tickLimpo((hi - lo) || 1)
    const ticks: number[] = []
    for (let t = Math.ceil(lo / passo) * passo; t <= hi; t += passo) ticks.push(t)
    return { x, y, ticks }
  }, [pontos])

  if (pontos.length === 0) return null
  const caminho = pontos.map((p, i) => `${i ? 'L' : 'M'}${geo.x(i)},${geo.y(p.valor)}`).join(' ')
  const ultimo = pontos[pontos.length - 1]

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${L} ${A}`} className="w-full h-auto" role="img" aria-label={rotulo}
        onMouseLeave={() => setFoco(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * L
          let melhor = 0
          pontos.forEach((_, i) => { if (Math.abs(geo.x(i) - px) < Math.abs(geo.x(melhor) - px)) melhor = i })
          setFoco(melhor)
        }}>
        {geo.ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={L - m.r} y1={geo.y(t)} y2={geo.y(t)} stroke="rgba(0,0,0,0.07)" />
            <text x={m.l - 8} y={geo.y(t) + 4} textAnchor="end" fontSize="11" fill="#86868B">{fmt(t)}</text>
          </g>
        ))}
        {pontos.length > 1 && <path d={caminho} fill="none" stroke={COR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
        <circle cx={geo.x(pontos.length - 1)} cy={geo.y(ultimo.valor)} r="4.5" fill={COR} stroke="#fff" strokeWidth="2" />
        <text x={geo.x(pontos.length - 1) + 10} y={geo.y(ultimo.valor) + 4} fontSize="12" fontWeight="600" fill="#1D1D1F">{fmt(ultimo.valor)}</text>
        <text x={m.l} y={A - 6} fontSize="11" fill="#86868B">{dataBR(pontos[0].dia + 'T12:00:00Z').slice(0, 5)}</text>
        {pontos.length > 1 && <text x={L - m.r} y={A - 6} fontSize="11" fill="#86868B" textAnchor="end">{dataBR(ultimo.dia + 'T12:00:00Z').slice(0, 5)}</text>}
        {foco != null && (
          <>
            <line x1={geo.x(foco)} x2={geo.x(foco)} y1={m.t} y2={A - m.b} stroke="rgba(0,0,0,0.15)" />
            <circle cx={geo.x(foco)} cy={geo.y(pontos[foco].valor)} r="4.5" fill={COR} stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>
      {foco != null && (
        <div className="pointer-events-none absolute top-1 rounded-lg bg-white border border-linha shadow-card px-2.5 py-1.5 text-[12px]"
          style={{ left: `${(geo.x(foco) / L) * 100}%`, transform: 'translateX(-50%)' }}>
          <div className="text-muted">{dataBR(pontos[foco].dia + 'T12:00:00Z')}</div>
          <div className="text-charcoal font-medium tabular-nums">{fmt(pontos[foco].valor)} {rotulo.toLowerCase()}</div>
        </div>
      )}
    </div>
  )
}

/** Barras horizontais de uma medida só, com o valor na ponta e detalhes na dica. */
export function BarrasH({ linhas, formatar }: {
  linhas: { nome: string; valor: number | null; detalhe: string }[]
  formatar: (n: number | null) => string
}) {
  const max = Math.max(1, ...linhas.map((l) => l.valor ?? 0))
  return (
    <div className="space-y-2.5">
      {linhas.map((l) => (
        <div key={l.nome} className="grid grid-cols-[110px_1fr] items-center gap-3 group" title={l.detalhe}>
          <span className="text-[13px] text-charcoal truncate">{l.nome}</span>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-[18px] rounded-r-[4px] transition-all duration-500 group-hover:opacity-80"
              style={{ width: `${((l.valor ?? 0) / max) * 100}%`, minWidth: l.valor ? 3 : 0, background: COR }} />
            <span className="text-[12px] text-charcoal tabular-nums whitespace-nowrap">{formatar(l.valor)}</span>
            <span className="text-[11px] text-muted whitespace-nowrap truncate opacity-0 group-hover:opacity-100 transition-opacity">{l.detalhe}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

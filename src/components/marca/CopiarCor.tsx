'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { Cor } from '@/lib/marca/identidade'

/** Amostra de cor: clique para copiar o HEX. */
export default function CopiarCor({ cor }: { cor: Cor }) {
  const [copiou, setCopiou] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(cor.hex)
      setCopiou(true)
      setTimeout(() => setCopiou(false), 1400)
    } catch {
      // sem permissão de área de transferência: nada a fazer
    }
  }

  return (
    <button type="button" onClick={copiar} className="group text-left rounded-2xl overflow-hidden border border-linha bg-white hover:shadow-card transition-shadow">
      <div className="relative h-28" style={{ background: cor.hex }}>
        <span className={`absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur-md transition-opacity
          ${cor.claro ? 'bg-black/10 text-black/70' : 'bg-white/15 text-white/90'} ${copiou ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {copiou ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
        </span>
      </div>
      <div className="px-3.5 py-3">
        <div className="text-[13px] font-medium text-charcoal">{cor.nome}</div>
        <div className="mt-1.5 space-y-0.5 text-[11.5px] text-muted tabular-nums">
          <div><span className="inline-block w-[58px] text-charcoal/50">HEX</span><span className="text-charcoal font-medium">{cor.hex}</span></div>
          <div><span className="inline-block w-[58px] text-charcoal/50">CMYK</span>{cor.cmyk}</div>
          <div><span className="inline-block w-[58px] text-charcoal/50">Pantone</span>{cor.pantone}</div>
        </div>
      </div>
    </button>
  )
}

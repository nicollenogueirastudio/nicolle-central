'use client'

import { useCallback, useEffect } from 'react'
import { create } from 'zustand'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'

import { urlPagina, urlMiniatura, type Colecao } from '@/lib/marca/urls'

// Leitor das páginas dos manuais: um só na tela, aberto por qualquer botão <AbrirPagina>.

const useLeitor = create<{ colecao: Colecao | null; pagina: number; abrir: (c: Colecao, p: number) => void; ir: (p: number) => void; fechar: () => void }>((set) => ({
  colecao: null,
  pagina: 1,
  abrir: (colecao, pagina) => set({ colecao, pagina }),
  ir: (pagina) => set({ pagina }),
  fechar: () => set({ colecao: null }),
}))

const TITULOS: Record<Colecao, string> = { manual: 'Manual da Marca', identidade: 'Brand Book · Identidade visual' }

export function AbrirPagina({ colecao, pagina, className, children, titulo }: { colecao: Colecao; pagina: number; className?: string; children: React.ReactNode; titulo?: string }) {
  const abrir = useLeitor((s) => s.abrir)
  return (
    <button type="button" title={titulo} onClick={() => abrir(colecao, pagina)} className={className}>
      {children}
    </button>
  )
}

export function Leitor({ totais }: { totais: Record<Colecao, number> }) {
  const { colecao, pagina, ir, fechar } = useLeitor()
  const total = colecao ? totais[colecao] : 0

  const passo = useCallback((d: -1 | 1) => {
    if (!colecao) return
    const n = pagina + d
    if (n >= 1 && n <= total) ir(n)
  }, [colecao, pagina, total, ir])

  useEffect(() => {
    if (!colecao) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') passo(1)
      if (e.key === 'ArrowLeft') passo(-1)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [colecao, passo, fechar])

  // Rola a miniatura atual para o centro da faixa.
  useEffect(() => {
    document.getElementById(`mini-${pagina}`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [pagina, colecao])

  if (!colecao) return null

  return (
    <div className="fixed inset-0 z-[70] bg-[#111]/95 backdrop-blur-xl flex flex-col animate-surgir" onClick={fechar}>
      <header className="flex items-center gap-4 px-6 py-4 text-white/80" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 text-[13px]">
          <span className="text-white font-medium">{TITULOS[colecao]}</span>
          <span className="ml-3 tabular-nums text-white/50">{pagina} de {total}</span>
        </div>
        <a
          href={`${urlPagina(colecao, pagina)}?baixar=${colecao}-pagina-${pagina}.jpg`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Download size={13} /> Baixar página
        </a>
        <button onClick={fechar} aria-label="Fechar" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X size={16} />
        </button>
      </header>

      <div className="flex-1 min-h-0 flex items-center gap-4 px-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => passo(-1)} disabled={pagina <= 1} aria-label="Página anterior" className="w-11 h-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-20 transition-colors">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 h-full flex items-center justify-center min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`${colecao}-${pagina}`} src={urlPagina(colecao, pagina)} alt={`Página ${pagina}`} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-surgir" />
        </div>
        <button onClick={() => passo(1)} disabled={pagina >= total} aria-label="Próxima página" className="w-11 h-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-20 transition-colors">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="px-6 py-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 w-max mx-auto">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              id={`mini-${n}`}
              onClick={() => ir(n)}
              className={`w-[96px] shrink-0 rounded-md overflow-hidden transition-all ${n === pagina ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-80'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlMiniatura(colecao, n)} alt="" loading="lazy" className="w-full aspect-video object-cover bg-white/5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

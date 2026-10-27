'use client'

import { useEffect, useState } from 'react'

/** Grade de referências com ampliação no clique (Esc ou clique fecha). */
export default function Galeria({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [aberta, setAberta] = useState<string | null>(null)

  useEffect(() => {
    if (!aberta) return
    const fechar = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberta(null) }
    window.addEventListener('keydown', fechar)
    return () => window.removeEventListener('keydown', fechar)
  }, [aberta])

  return (
    <>
      <div className="grid grid-cols-4 gap-1.5">
        {imagens.map((src) => (
          <button key={src} type="button" onClick={() => setAberta(src)} className="rounded-lg overflow-hidden bg-black/[0.04] cursor-zoom-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={nome} loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      {aberta && (
        <div onClick={() => setAberta(null)} className="fixed inset-0 z-[60] bg-[#1D1D1F]/90 backdrop-blur-sm flex items-center justify-center p-10 cursor-zoom-out">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={aberta} alt={nome} className="max-w-full max-h-full rounded-lg shadow-flutuante" />
        </div>
      )}
    </>
  )
}

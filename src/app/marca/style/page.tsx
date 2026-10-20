'use client'

import { useEffect, useState } from 'react'
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { CAPITULOS, PILARES, PALETA, REFERENCIAS, RECUSA, PERGUNTA, INTRO, urlPin } from '@/lib/marca/style'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const TOTAL = CAPITULOS.reduce((s, c) => s + c.imagens.length, 0)

export default function StylePage() {
  const [cap, setCap] = useState<string>('todos')
  const [aberta, setAberta] = useState<number | null>(null)
  const [quebradas, setQuebradas] = useState<Set<string>>(new Set())

  const atual = CAPITULOS.find((c) => c.id === cap)
  const imagens = (atual ? atual.imagens : CAPITULOS.flatMap((c) => c.imagens)).filter((h) => !quebradas.has(h))

  // Ampliada: setas navegam, Esc fecha.
  useEffect(() => {
    if (aberta == null) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberta(null)
      if (e.key === 'ArrowRight') setAberta((i) => (i == null ? i : Math.min(imagens.length - 1, i + 1)))
      if (e.key === 'ArrowLeft') setAberta((i) => (i == null ? i : Math.max(0, i - 1)))
    }
    addEventListener('keydown', tecla)
    return () => removeEventListener('keydown', tecla)
  }, [aberta, imagens.length])

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <div className="flex items-end justify-between">
          <Header title="Nicolle Nogueira Style" subtitle={`O universo estético da marca · ${TOTAL} referências · ${CAPITULOS.length} capítulos`} />
          <a href="/api/marca/style/apresentacao" target="_blank" rel="noreferrer"
            className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal text-white text-[13px] hover:bg-black">
            <Play size={13} fill="currentColor" /> Abrir a apresentação
          </a>
        </div>

        {/* Pergunta + pilares */}
        <section className="rounded-2xl bg-[#1B1917] px-8 py-8 grid grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <div className="text-[12px] text-[#EFE8DC]/50">Um mapa sensorial</div>
            <h2 className="mt-2 text-[28px] leading-tight text-[#EFE8DC] tracking-tight">{PERGUNTA}</h2>
            <p className="mt-4 text-[13.5px] text-[#EFE8DC]/70 leading-relaxed">{INTRO}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {PILARES.map((p, i) => (
              <div key={p.nome}>
                <div className="text-[13.5px] text-[#EFE8DC] font-medium"><span className="text-[#EFE8DC]/40 tabular-nums mr-1.5">{i + 1}</span>{p.nome}</div>
                <p className="mt-1 text-[12.5px] text-[#EFE8DC]/60 leading-relaxed">{p.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Paleta, referências e o que fica de fora */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className={`${cartao} p-5`}>
            <div className="text-[14px] font-medium text-charcoal">Uma única temperatura</div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {PALETA.map((c) => (
                <div key={c.hex}>
                  <div className="aspect-square rounded-lg ring-1 ring-black/[0.06]" style={{ background: c.hex }} />
                  <div className="mt-1 text-[11.5px] text-charcoal">{c.nome}</div>
                  <div className="text-[10.5px] text-muted tabular-nums">{c.hex}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`${cartao} p-5`}>
            <div className="text-[14px] font-medium text-charcoal">Quem habita este universo</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {REFERENCIAS.map((r) => <span key={r} className="px-2.5 py-1 rounded-full bg-black/[0.04] text-[12.5px] text-charcoal/85">{r}</span>)}
            </div>
          </div>
          <div className={`${cartao} p-5`}>
            <div className="text-[14px] font-medium text-charcoal">O que este universo recusa</div>
            <p className="mt-3 text-[13px] text-charcoal/75 leading-relaxed">{RECUSA.texto}</p>
            <p className="mt-3 text-[13px] text-charcoal font-medium">{RECUSA.regra}</p>
          </div>
        </div>

        {/* Capítulos */}
        <div className="flex flex-wrap gap-1.5 mt-8 mb-4">
          {[{ id: 'todos', nome: 'Todos', n: TOTAL }, ...CAPITULOS.map((c) => ({ id: c.id, nome: c.nome, n: c.imagens.length }))].map((c) => (
            <button key={c.id} onClick={() => setCap(c.id)}
              className={`px-3 py-1.5 rounded-full text-[12.5px] transition-colors ${cap === c.id ? 'bg-charcoal text-white' : 'bg-white border border-linha text-charcoal/80 hover:bg-black/[0.03]'}`}>
              {c.nome} <span className={cap === c.id ? 'text-white/60' : 'text-muted'}>{c.n}</span>
            </button>
          ))}
        </div>

        {atual && (
          <div className="mb-5 max-w-[760px]">
            <div className="text-[17px] font-medium text-charcoal tracking-tight">{atual.titulo}</div>
            {atual.texto.map((t) => <p key={t} className="mt-1 text-[13.5px] text-charcoal/70 leading-relaxed">{t}</p>)}
          </div>
        )}

        <div className="columns-2 md:columns-4 xl:columns-5 gap-3">
          {imagens.map((h, i) => (
            <button key={`${h}-${i}`} onClick={() => setAberta(i)} className="mb-3 block w-full break-inside-avoid rounded-xl overflow-hidden bg-black/[0.04]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlPin(h)} alt="" loading="lazy" className="w-full h-auto hover:opacity-90 transition-opacity"
                onError={() => setQuebradas((s) => new Set(s).add(h))} />
            </button>
          ))}
        </div>
      </main>

      {aberta != null && imagens[aberta] && (
        <div className="fixed inset-0 z-[70] bg-[#111]/95 backdrop-blur-xl flex items-center justify-center animate-surgir" onClick={() => setAberta(null)}>
          <button className="absolute top-5 right-5 text-white/70 hover:text-white" aria-label="Fechar"><X size={22} /></button>
          <button className="absolute left-5 text-white/60 hover:text-white p-2" aria-label="Anterior"
            onClick={(e) => { e.stopPropagation(); setAberta(Math.max(0, aberta - 1)) }}><ChevronLeft size={28} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlPin(imagens[aberta])} alt="" className="max-h-[88vh] max-w-[80vw] rounded-lg" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-5 text-white/60 hover:text-white p-2" aria-label="Próxima"
            onClick={(e) => { e.stopPropagation(); setAberta(Math.min(imagens.length - 1, aberta + 1)) }}><ChevronRight size={28} /></button>
          <div className="absolute bottom-5 text-[12px] text-white/50 tabular-nums">{aberta + 1} de {imagens.length}</div>
        </div>
      )}
    </div>
  )
}

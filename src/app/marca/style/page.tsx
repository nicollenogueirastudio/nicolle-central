'use client'

import { useEffect, useMemo, useState } from 'react'
import { Play, ChevronLeft, ChevronRight, X, Trash2, Undo2 } from 'lucide-react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { CAPITULOS, PILARES, PALETA, REFERENCIAS, RECUSA, PERGUNTA, INTRO, urlPin } from '@/lib/marca/style'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

export default function StylePage() {
  const [cap, setCap] = useState<string>('todos')
  const [aberta, setAberta] = useState<number | null>(null)
  const [quebradas, setQuebradas] = useState<Set<string>>(new Set())
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [removidas, setRemovidas] = useState<Set<string>>(new Set())
  const [desfazer, setDesfazer] = useState<string | null>(null)

  // As fotos que ela tirou do moodboard ficam guardadas (style_removidas) e somem de todo lugar.
  useEffect(() => {
    supabase.from('style_removidas').select('pin').then(({ data }) => setRemovidas(new Set((data ?? []).map((r) => r.pin as string))))
  }, [supabase])

  const visivel = (h: string) => !quebradas.has(h) && !removidas.has(h)
  const atual = CAPITULOS.find((c) => c.id === cap)
  const imagens = (atual ? atual.imagens : CAPITULOS.flatMap((c) => c.imagens)).filter(visivel)
  const TOTAL = CAPITULOS.reduce((t, c) => t + c.imagens.filter(visivel).length, 0)

  async function tirar(h: string) {
    setRemovidas((r) => new Set(r).add(h))
    setDesfazer(h)
    if (aberta != null && aberta >= imagens.length - 1) setAberta(imagens.length > 1 ? imagens.length - 2 : null)
    await supabase.from('style_removidas').upsert({ pin: h }, { onConflict: 'pin' })
  }
  async function voltar(h: string) {
    setRemovidas((r) => { const n = new Set(r); n.delete(h); return n })
    setDesfazer(null)
    await supabase.from('style_removidas').delete().eq('pin', h)
  }
  useEffect(() => {
    if (!desfazer) return
    const t = setTimeout(() => setDesfazer(null), 7000)
    return () => clearTimeout(t)
  }, [desfazer])

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
          {[{ id: 'todos', nome: 'Todos', n: TOTAL }, ...CAPITULOS.map((c) => ({ id: c.id, nome: c.nome, n: c.imagens.filter(visivel).length }))].map((c) => (
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
            <div key={`${h}-${i}`} className="group relative mb-3 break-inside-avoid rounded-xl overflow-hidden bg-black/[0.04] animate-surgir">
              <button onClick={() => setAberta(i)} className="block w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlPin(h)} alt="" loading="lazy" className="w-full h-auto group-hover:opacity-90 transition-opacity"
                  onError={() => setQuebradas((s) => new Set(s).add(h))} />
              </button>
              <button onClick={() => tirar(h)} aria-label="Tirar do moodboard" title="Tirar do moodboard"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/55 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/75">
                <Trash2 size={14} />
              </button>
            </div>
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
          <div className="absolute bottom-5 flex items-center gap-4 text-[12px] text-white/50 tabular-nums">
            {aberta + 1} de {imagens.length}
            <button onClick={(e) => { e.stopPropagation(); tirar(imagens[aberta]) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80">
              <Trash2 size={12} /> Tirar do moodboard
            </button>
          </div>
        </div>
      )}
      {desfazer && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 rounded-full bg-[#1D1D1F] text-white pl-5 pr-2 py-2 shadow-lg text-[13px] animate-surgir">
          Foto tirada do moodboard
          <button onClick={() => voltar(desfazer)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"><Undo2 size={13} /> Desfazer</button>
        </div>
      )}
    </div>
  )
}

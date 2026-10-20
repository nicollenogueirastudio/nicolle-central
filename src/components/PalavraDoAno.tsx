'use client'

import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Pencil } from 'lucide-react'
import { lerPalavra, salvarPalavra, type PalavraDoAno as Palavra } from '@/lib/palavra'

/** A palavra do ano, grande. `editavel` mostra o lápis para escrever (no Planejamento). */
export default function PalavraDoAno({ supabase, ano, editavel, escuro, onCarregar }: {
  supabase: SupabaseClient
  ano: number
  editavel?: boolean
  escuro?: boolean
  onCarregar?: (p: Palavra | null) => void
}) {
  const [p, setP] = useState<Palavra | null>(null)
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState({ palavra: '', significado: '' })
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    lerPalavra(supabase, ano).then((x) => { setP(x); onCarregar?.(x) })
  }, [supabase, ano, onCarregar])

  async function salvar() {
    if (!rascunho.palavra.trim()) return
    const nova = { ano, palavra: rascunho.palavra, significado: rascunho.significado || null }
    try {
      await salvarPalavra(supabase, nova)
      setP({ ...nova, palavra: nova.palavra.trim() })
      onCarregar?.(nova)
      setEditando(false)
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    }
  }

  const tom = escuro ? { rotulo: 'text-white/50', texto: 'text-white', sub: 'text-white/70', campo: 'bg-white/10 text-white placeholder:text-white/40 border-white/15' }
    : { rotulo: 'text-muted', texto: 'text-charcoal', sub: 'text-charcoal/70', campo: 'bg-white text-charcoal placeholder:text-muted/60 border-black/10' }

  if (editando) {
    return (
      <div className="space-y-2">
        <div className={`text-[12px] ${tom.rotulo}`}>Palavra de {ano}</div>
        <input autoFocus value={rascunho.palavra} onChange={(e) => setRascunho({ ...rascunho, palavra: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') salvar() }}
          placeholder="Uma palavra" className={`w-full rounded-[10px] border px-3 py-2 font-display text-[24px] tracking-tight outline-none ${tom.campo}`} />
        <input value={rascunho.significado} onChange={(e) => setRascunho({ ...rascunho, significado: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') salvar() }}
          placeholder="O que ela quer dizer neste ano (opcional)" className={`w-full rounded-[10px] border px-3 py-1.5 text-[13px] outline-none ${tom.campo}`} />
        <div className="flex gap-2">
          <button onClick={salvar} className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium ${escuro ? 'bg-white text-charcoal' : 'bg-charcoal text-white'}`}>Salvar</button>
          <button onClick={() => setEditando(false)} className={`px-3.5 py-1.5 rounded-full text-[12.5px] ${escuro ? 'text-white/70 hover:bg-white/10' : 'text-charcoal hover:bg-black/[0.05]'}`}>Cancelar</button>
        </div>
        {erro && <p className="text-[12px] text-[#C9A982]">{erro}</p>}
      </div>
    )
  }

  return (
    <div className="group">
      <div className={`flex items-center gap-2 text-[12px] ${tom.rotulo}`}>
        Palavra de {ano}
        {editavel && (
          <button onClick={() => { setRascunho({ palavra: p?.palavra ?? '', significado: p?.significado ?? '' }); setEditando(true) }} aria-label="Escrever a palavra do ano"
            className="opacity-60 hover:opacity-100 transition-opacity"><Pencil size={12} /></button>
        )}
      </div>
      <div className={`font-display text-[40px] leading-none tracking-tight mt-1.5 ${tom.texto}`}>{p?.palavra ?? (editavel ? 'Escreva a palavra' : '—')}</div>
      {p?.significado && <p className={`text-[13px] mt-2 leading-relaxed ${tom.sub}`}>{p.significado}</p>}
    </div>
  )
}

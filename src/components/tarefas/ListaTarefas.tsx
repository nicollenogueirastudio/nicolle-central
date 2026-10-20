'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Plus, Trash2 } from 'lucide-react'
import { diaCurto, hojeISO } from '@/lib/datas'
import { faixa, FAIXAS, type Tarefa } from '@/lib/tarefas/dados'

/** Uma tarefa: círculo para marcar, título editável no lugar, prazo, lançamento e apagar. */
export function LinhaTarefa({ t, mostrarLancamento, onSalvar, onApagar }: {
  t: Tarefa
  mostrarLancamento?: boolean
  onSalvar: (d: Partial<Tarefa>) => void
  onApagar: () => void
}) {
  const [titulo, setTitulo] = useState(t.titulo)
  useEffect(() => { setTitulo(t.titulo) }, [t.titulo])
  const f = faixa(t)

  return (
    <div className="group flex items-center gap-3 px-4 py-2 hover:bg-black/[0.015]">
      <button
        onClick={() => onSalvar({ feita: !t.feita })}
        aria-label={t.feita ? 'Reabrir tarefa' : 'Marcar como feita'}
        className={`w-[20px] h-[20px] shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${t.feita ? 'bg-olive border-olive text-white' : f === 'atrasada' ? 'border-[#8C6B3F]' : 'border-black/20 hover:border-olive'}`}
      >
        {t.feita && <Check size={11} strokeWidth={3} />}
      </button>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        onBlur={() => { const v = titulo.trim(); if (v && v !== t.titulo) onSalvar({ titulo: v }); else setTitulo(t.titulo) }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        className={`flex-1 min-w-0 bg-transparent rounded-lg px-2 py-1 -ml-2 text-[13.5px] outline-none border border-transparent hover:border-black/10 focus:border-accent focus:bg-white ${t.feita ? 'text-muted line-through decoration-black/20' : 'text-charcoal'}`}
      />
      {mostrarLancamento && t.lancamento && (
        <Link href="/marketing/lancamentos" className="text-[11.5px] text-muted hover:text-charcoal truncate max-w-[140px] shrink-0">{t.lancamento.projeto}</Link>
      )}
      <label className={`relative shrink-0 text-[12px] tabular-nums rounded-full px-2.5 py-0.5 cursor-pointer ${f === 'atrasada' ? 'bg-[#8C6B3F]/12 text-[#8C6B3F] font-medium' : f === 'hoje' ? 'bg-olive/[0.12] text-olive font-medium' : t.prazo ? 'bg-black/[0.04] text-charcoal/80' : 'text-muted/70 hover:bg-black/[0.04]'}`}>
        {t.prazo ? (t.prazo === hojeISO() ? 'hoje' : diaCurto(t.prazo).replace(/\.$/, '')) : 'prazo'}
        <input type="date" value={t.prazo ?? ''} onChange={(e) => onSalvar({ prazo: e.target.value || null })} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Prazo" />
      </label>
      <button onClick={onApagar} aria-label="Apagar tarefa" className="opacity-0 group-hover:opacity-100 text-muted hover:text-charcoal transition-opacity shrink-0"><Trash2 size={13} /></button>
    </div>
  )
}

/** Campo para adicionar: título, prazo opcional, Enter. */
export function NovaTarefa({ onCriar, placeholder = 'Nova tarefa e Enter' }: { onCriar: (titulo: string, prazo: string | null) => void; placeholder?: string }) {
  const [titulo, setTitulo] = useState('')
  const [prazo, setPrazo] = useState('')
  const criar = () => {
    if (!titulo.trim()) return
    onCriar(titulo.trim(), prazo || null)
    setTitulo('')
    setPrazo('')
  }
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <span className="w-[20px] h-[20px] shrink-0 rounded-full border-[1.5px] border-dashed border-black/15 flex items-center justify-center text-muted"><Plus size={11} /></span>
      <input value={titulo} onChange={(e) => setTitulo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') criar() }}
        placeholder={placeholder} className="flex-1 bg-transparent text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 py-1" />
      <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} aria-label="Prazo"
        className="w-[128px] shrink-0 bg-transparent text-[12px] text-muted outline-none rounded-lg px-1.5 py-0.5 hover:bg-black/[0.04]" />
    </div>
  )
}

/** Lista agrupada por faixa de prazo (atrasadas, hoje, próximos 7 dias…). */
export default function ListaTarefas({ tarefas, mostrarLancamento, mostrarFeitas, onSalvar, onApagar, onCriar }: {
  tarefas: Tarefa[]
  mostrarLancamento?: boolean
  mostrarFeitas?: boolean
  onSalvar: (t: Tarefa, d: Partial<Tarefa>) => void
  onApagar: (t: Tarefa) => void
  onCriar?: (titulo: string, prazo: string | null) => void
}) {
  const ordem = (Object.keys(FAIXAS) as (keyof typeof FAIXAS)[]).filter((f) => mostrarFeitas || f !== 'feita')
  return (
    <div>
      {onCriar && <div className="border-b border-linha"><NovaTarefa onCriar={onCriar} /></div>}
      {ordem.map((f) => {
        const lista = tarefas.filter((t) => faixa(t) === f)
        if (lista.length === 0) return null
        return (
          <div key={f}>
            <div className={`px-4 pt-3 pb-1 text-[11.5px] font-medium ${f === 'atrasada' ? 'text-[#8C6B3F]' : 'text-muted'}`}>{FAIXAS[f]} · {lista.length}</div>
            {lista.map((t) => <LinhaTarefa key={t.id} t={t} mostrarLancamento={mostrarLancamento} onSalvar={(d) => onSalvar(t, d)} onApagar={() => onApagar(t)} />)}
          </div>
        )
      })}
      {tarefas.filter((t) => mostrarFeitas || !t.feita).length === 0 && (
        <p className="px-4 py-6 text-center text-[13px] text-muted">Nenhuma tarefa aberta.</p>
      )}
    </div>
  )
}

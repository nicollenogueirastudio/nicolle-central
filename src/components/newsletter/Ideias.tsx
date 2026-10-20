'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ChevronLeft, ChevronRight, Trash2, Plus, ChevronDown } from 'lucide-react'
import { registrarAtividade } from '@/lib/atividades'
import { diaCurto } from '@/lib/datas'

type Status = 'ideia' | 'pesquisa' | 'escrevendo' | 'publicada'
export type Ideia = { id: string; titulo: string; angulo: string | null; referencias: string | null; status: Status; ordem: number; tipo: 'edicao' | 'note'; data_prevista: string | null }

const COLUNAS: { id: Status; nome: string; dica: string }[] = [
  { id: 'ideia', nome: 'Ideias', dica: 'o que pode virar edição' },
  { id: 'pesquisa', nome: 'Em pesquisa', dica: 'juntando repertório' },
  { id: 'escrevendo', nome: 'Escrevendo', dica: 'a próxima edição' },
  { id: 'publicada', nome: 'Publicadas', dica: 'já saíram' },
]
const ORDEM: Status[] = ['ideia', 'pesquisa', 'escrevendo', 'publicada']
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-2.5 py-1.5 text-[13px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15 resize-y'

function CartaoIdeia({ i, onSalvar, onMover, onApagar }: { i: Ideia; onSalvar: (d: Partial<Ideia>) => void; onMover: (d: -1 | 1) => void; onApagar: () => void }) {
  const [aberto, setAberto] = useState(false)
  const [rasc, setRasc] = useState({ titulo: i.titulo, angulo: i.angulo ?? '', referencias: i.referencias ?? '' })
  useEffect(() => { setRasc({ titulo: i.titulo, angulo: i.angulo ?? '', referencias: i.referencias ?? '' }) }, [i])
  const salvarCampo = (k: 'titulo' | 'angulo' | 'referencias') => {
    const v = rasc[k].trim()
    if (k === 'titulo' && !v) return setRasc((r) => ({ ...r, titulo: i.titulo }))
    if ((v || null) !== (i[k] || null)) onSalvar({ [k]: v || null })
  }
  const pos = ORDEM.indexOf(i.status)

  return (
    <div className="group bg-white rounded-xl border border-linha shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3">
      <div className="flex items-start gap-1.5">
        <textarea
          rows={1}
          value={rasc.titulo}
          onChange={(e) => setRasc({ ...rasc, titulo: e.target.value })}
          onBlur={() => salvarCampo('titulo')}
          className="flex-1 bg-transparent text-[13.5px] font-medium text-charcoal outline-none resize-none leading-snug rounded px-1 -mx-1 focus:bg-black/[0.03]"
        />
        <button onClick={() => setAberto(!aberto)} aria-label="Detalhes" className="text-muted shrink-0 pt-0.5"><ChevronDown size={14} className={`transition-transform ${aberto ? 'rotate-180' : ''}`} /></button>
      </div>
      {(i.tipo === 'note' || i.data_prevista) && (
        <div className="flex items-center gap-1.5 mt-1">
          {i.tipo === 'note' && <span className="px-1.5 py-px rounded-full bg-black/[0.05] text-[10.5px] text-charcoal/70">Note</span>}
          {i.data_prevista && <span className="text-[11px] text-olive font-medium">{diaCurto(i.data_prevista)}</span>}
        </div>
      )}
      {!aberto && i.angulo && <p className="text-[12px] text-muted mt-1 line-clamp-2">{i.angulo}</p>}
      {aberto && (
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-[11.5px]">
              {(['edicao', 'note'] as const).map((t) => (
                <button key={t} onClick={() => onSalvar({ tipo: t })} className={`px-2.5 py-0.5 rounded-full ${i.tipo === t ? 'bg-white shadow-sm text-charcoal' : 'text-muted'}`}>{t === 'edicao' ? 'Edição' : 'Note'}</button>
              ))}
            </div>
            <input type="date" value={i.data_prevista ?? ''} onChange={(e) => onSalvar({ data_prevista: e.target.value || null })} title="Data prevista no cronograma"
              className="flex-1 min-w-0 rounded-[10px] border border-black/[0.10] bg-white px-2 py-1 text-[12px] text-charcoal outline-none focus:border-accent" />
          </div>
          <textarea className={`${campo} min-h-[60px]`} placeholder="O ângulo: por que isso é Casa Nogs?" value={rasc.angulo} onChange={(e) => setRasc({ ...rasc, angulo: e.target.value })} onBlur={() => salvarCampo('angulo')} />
          <textarea className={`${campo} min-h-[52px]`} placeholder="Referências: links, livros, lugares" value={rasc.referencias} onChange={(e) => setRasc({ ...rasc, referencias: e.target.value })} onBlur={() => salvarCampo('referencias')} />
        </div>
      )}
      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onMover(-1)} disabled={pos === 0} aria-label="Voltar etapa" className="w-6 h-6 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted disabled:opacity-0"><ChevronLeft size={13} /></button>
        <button onClick={() => onMover(1)} disabled={pos === ORDEM.length - 1} aria-label="Avançar etapa" className="w-6 h-6 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted disabled:opacity-0"><ChevronRight size={13} /></button>
        <button onClick={onApagar} aria-label="Apagar ideia" className="ml-auto w-6 h-6 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted"><Trash2 size={12} /></button>
      </div>
    </div>
  )
}

/** Quadro de ideias da Casa Nogs: da ideia à edição publicada. */
export default function Ideias({ supabase, onLista }: { supabase: SupabaseClient; onLista?: (l: Ideia[]) => void }) {
  const [ideias, setIdeias] = useState<Ideia[]>([])
  const [nova, setNova] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase.from('newsletter_ideias').select('*').order('ordem', { ascending: false })
    if (error) setErro(error.message)
    else setIdeias((data ?? []) as Ideia[])
  }, [supabase])
  useEffect(() => { carregar() }, [carregar])
  useEffect(() => { onLista?.(ideias) }, [ideias, onLista])

  async function criar() {
    const titulo = nova.trim()
    if (!titulo) return
    setNova('')
    const { data, error } = await supabase.from('newsletter_ideias').insert({ titulo, ordem: Math.max(0, ...ideias.map((i) => i.ordem)) + 1 }).select('*').single()
    if (error) return setErro(error.message)
    setIdeias((l) => [data as Ideia, ...l])
    await registrarAtividade(supabase, 'criou', 'ideia_newsletter', data.id, { titulo })
  }
  async function salvar(i: Ideia, d: Partial<Ideia>) {
    setIdeias((l) => l.map((x) => (x.id === i.id ? { ...x, ...d } : x)))
    const { error } = await supabase.from('newsletter_ideias').update(d).eq('id', i.id)
    if (error) { setErro(error.message); carregar() }
  }
  async function apagar(i: Ideia) {
    if (!confirm(`Apagar a ideia "${i.titulo}"?`)) return
    setIdeias((l) => l.filter((x) => x.id !== i.id))
    await supabase.from('newsletter_ideias').delete().eq('id', i.id)
  }

  return (
    <section className="mb-5">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-[22px] text-charcoal tracking-tight">Ideias para a Casa Nogs</h2>
        <span className="text-[12px] text-muted">Abra um cartão para escrever o ângulo e as referências. As setas mudam a etapa.</span>
      </div>
      {erro && <div className="mb-3 rounded-xl bg-gold/15 px-4 py-2.5 text-[13px] text-charcoal">{erro}</div>}
      <div className="grid grid-cols-4 gap-3 items-start">
        {COLUNAS.map((c) => {
          const lista = ideias.filter((i) => i.status === c.id)
          return (
            <div key={c.id} className="rounded-2xl bg-black/[0.03] p-3 min-h-[160px]">
              <div className="flex items-baseline justify-between px-1 mb-2.5">
                <span className="text-[13px] font-medium text-charcoal">{c.nome}</span>
                <span className="text-[11.5px] text-muted tabular-nums">{lista.length || ''}</span>
              </div>
              {c.id === 'ideia' && (
                <div className="flex items-center gap-2 bg-white rounded-xl border border-dashed border-black/15 px-3 py-2 mb-2">
                  <Plus size={13} className="text-muted shrink-0" />
                  <input value={nova} onChange={(e) => setNova(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') criar() }}
                    placeholder="Nova ideia e Enter" className="flex-1 bg-transparent text-[13px] text-charcoal outline-none placeholder:text-muted/60" />
                </div>
              )}
              <div className="space-y-2">
                {lista.map((i) => (
                  <CartaoIdeia key={i.id} i={i} onSalvar={(d) => salvar(i, d)} onApagar={() => apagar(i)}
                    onMover={(d) => salvar(i, { status: ORDEM[ORDEM.indexOf(i.status) + d] })} />
                ))}
                {lista.length === 0 && c.id !== 'ideia' && <p className="text-[11.5px] text-muted px-1">{c.dica}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

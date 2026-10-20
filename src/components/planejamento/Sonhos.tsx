'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Plus, Trash2, Check, ChevronDown, ListTodo, Sparkles } from 'lucide-react'
import { registrarAtividade } from '@/lib/atividades'
import { criarTarefa } from '@/lib/tarefas/dados'
import { hojeISO, dataBR } from '@/lib/datas'

type Sonho = { id: string; titulo: string; porque: string | null; primeiro_passo: string | null; realizado: boolean; realizado_em: string | null; ordem: number }
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-2.5 py-1.5 text-[13px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15 resize-y'

function CartaoSonho({ s, onSalvar, onApagar, onTarefa }: { s: Sonho; onSalvar: (d: Partial<Sonho>) => void; onApagar: () => void; onTarefa: () => Promise<void> }) {
  const [aberto, setAberto] = useState(false)
  const [r, setR] = useState({ titulo: s.titulo, porque: s.porque ?? '', primeiro_passo: s.primeiro_passo ?? '' })
  const [virou, setVirou] = useState(false)
  useEffect(() => { setR({ titulo: s.titulo, porque: s.porque ?? '', primeiro_passo: s.primeiro_passo ?? '' }) }, [s])
  const salvarCampo = (k: 'titulo' | 'porque' | 'primeiro_passo') => {
    const v = r[k].trim()
    if (k === 'titulo' && !v) return setR((x) => ({ ...x, titulo: s.titulo }))
    if ((v || null) !== (s[k] || null)) onSalvar({ [k]: v || null })
  }

  return (
    <div className="group rounded-2xl bg-white border border-linha shadow-card p-4">
      <div className="flex items-start gap-2.5">
        <button onClick={() => onSalvar({ realizado: !s.realizado, realizado_em: s.realizado ? null : hojeISO() })} aria-label="Realizado"
          className={`mt-0.5 w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${s.realizado ? 'bg-olive border-olive text-white' : 'border-black/20 hover:border-olive'}`}>
          {s.realizado && <Check size={11} strokeWidth={3} />}
        </button>
        <textarea rows={1} value={r.titulo} onChange={(e) => setR({ ...r, titulo: e.target.value })} onBlur={() => salvarCampo('titulo')}
          className={`flex-1 bg-transparent text-[14.5px] font-medium outline-none resize-none leading-snug rounded px-1 -mx-1 focus:bg-black/[0.03] ${s.realizado ? 'text-charcoal/60' : 'text-charcoal'}`} />
        <button onClick={() => setAberto(!aberto)} aria-label="Detalhes" className="text-muted shrink-0 pt-0.5"><ChevronDown size={15} className={`transition-transform ${aberto ? 'rotate-180' : ''}`} /></button>
      </div>
      {s.realizado && s.realizado_em && <div className="text-[11.5px] text-olive font-medium mt-1 ml-[30px]">realizado em {dataBR(s.realizado_em + 'T12:00:00Z')}</div>}
      {!aberto && !s.realizado && s.primeiro_passo && <p className="text-[12.5px] text-muted mt-1.5 ml-[30px] line-clamp-2"><span className="text-charcoal/70">Próximo passo:</span> {s.primeiro_passo}</p>}
      {aberto && (
        <div className="space-y-2 mt-3 ml-[30px]">
          <textarea className={`${campo} min-h-[52px]`} placeholder="Por que esse sonho importa?" value={r.porque} onChange={(e) => setR({ ...r, porque: e.target.value })} onBlur={() => salvarCampo('porque')} />
          <textarea className={`${campo} min-h-[52px]`} placeholder="O próximo passo concreto para chegar lá" value={r.primeiro_passo} onChange={(e) => setR({ ...r, primeiro_passo: e.target.value })} onBlur={() => salvarCampo('primeiro_passo')} />
          <div className="flex items-center gap-2">
            {s.primeiro_passo && !s.realizado && (
              <button onClick={async () => { await onTarefa(); setVirou(true) }} disabled={virou}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-[12px] text-charcoal disabled:text-olive">
                <ListTodo size={12} /> {virou ? 'Está nas Tarefas' : 'Pôr o próximo passo nas Tarefas'}
              </button>
            )}
            <button onClick={onApagar} aria-label="Apagar" className="ml-auto w-7 h-7 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted"><Trash2 size={13} /></button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Dream goals: os sonhos grandes, cada um com o próximo passo para sair do papel. */
export default function Sonhos({ supabase }: { supabase: SupabaseClient }) {
  const [sonhos, setSonhos] = useState<Sonho[]>([])
  const [novo, setNovo] = useState('')
  const [verRealizados, setVerRealizados] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase.from('sonhos').select('*').order('ordem', { ascending: false })
    if (error) setErro(error.message)
    else setSonhos((data ?? []) as Sonho[])
  }, [supabase])
  useEffect(() => { carregar() }, [carregar])

  async function criar() {
    const titulo = novo.trim()
    if (!titulo) return
    setNovo('')
    const { data, error } = await supabase.from('sonhos').insert({ titulo, ordem: Math.max(0, ...sonhos.map((s) => s.ordem)) + 1 }).select('*').single()
    if (error) return setErro(error.message)
    setSonhos((l) => [data as Sonho, ...l])
    await registrarAtividade(supabase, 'criou', 'sonho', data.id, { titulo })
  }
  async function salvar(s: Sonho, d: Partial<Sonho>) {
    setSonhos((l) => l.map((x) => (x.id === s.id ? { ...x, ...d } : x)))
    const { error } = await supabase.from('sonhos').update(d).eq('id', s.id)
    if (error) { setErro(error.message); carregar() }
  }
  async function apagar(s: Sonho) {
    if (!confirm(`Apagar o sonho "${s.titulo}"?`)) return
    setSonhos((l) => l.filter((x) => x.id !== s.id))
    await supabase.from('sonhos').delete().eq('id', s.id)
  }

  const abertos = sonhos.filter((s) => !s.realizado)
  const realizados = sonhos.filter((s) => s.realizado).sort((a, b) => ((a.realizado_em ?? '') < (b.realizado_em ?? '') ? 1 : -1))

  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-[24px] text-charcoal tracking-tight flex items-center gap-2"><Sparkles size={18} className="text-olive" /> Dream goals</h2>
        <span className="text-[12px] text-muted">Os sonhos grandes. Cada um com o próximo passo, para ir saindo do papel.</span>
      </div>
      {erro && <div className="mb-3 rounded-xl bg-[#8C6B3F]/10 px-4 py-2.5 text-[13px] text-charcoal">{erro}</div>}
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-dashed border-black/15 px-4 py-3 mb-3">
        <Plus size={15} className="text-muted shrink-0" />
        <input value={novo} onChange={(e) => setNovo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') criar() }}
          placeholder="Um sonho e Enter: expor no Salone, projeto na AD, a primeira coleção de produto…" className="flex-1 bg-transparent text-[14px] text-charcoal outline-none placeholder:text-muted/60" />
      </div>
      <div className="grid grid-cols-3 gap-3 items-start">
        {abertos.map((s) => (
          <CartaoSonho key={s.id} s={s} onSalvar={(d) => salvar(s, d)} onApagar={() => apagar(s)}
            onTarefa={async () => {
              const t = await criarTarefa(supabase, { titulo: s.primeiro_passo!, notas: `Dream goal: ${s.titulo}` })
              await registrarAtividade(supabase, 'criou', 'tarefa', t.id, { de_sonho: s.id })
            }} />
        ))}
      </div>
      {abertos.length === 0 && <p className="text-[13px] text-muted px-1">Nenhum sonho na lista ainda. Comece pelo maior.</p>}
      {realizados.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setVerRealizados(!verRealizados)} className="text-[12.5px] text-olive font-medium flex items-center gap-1.5">
            <Check size={13} strokeWidth={3} /> {realizados.length} {realizados.length === 1 ? 'sonho realizado' : 'sonhos realizados'}
            <ChevronDown size={13} className={`transition-transform ${verRealizados ? 'rotate-180' : ''}`} />
          </button>
          {verRealizados && (
            <div className="grid grid-cols-3 gap-3 items-start mt-2">
              {realizados.map((s) => <CartaoSonho key={s.id} s={s} onSalvar={(d) => salvar(s, d)} onApagar={() => apagar(s)} onTarefa={async () => {}} />)}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

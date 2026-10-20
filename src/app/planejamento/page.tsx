'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Plus, Trash2, ChevronDown } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { hojeISO } from '@/lib/datas'
import {
  listarMetas, criarMeta, salvarMeta, apagarMeta, FRENTES, STATUS_META, HORIZONTES,
  type Meta, type Frente, type StatusMeta,
} from '@/lib/planejamento/dados'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const GRUPOS: { id: number | null; nome: string }[] = [
  { id: null, nome: 'Ao longo do ano' },
  { id: 1, nome: '1º trimestre' },
  { id: 2, nome: '2º trimestre' },
  { id: 3, nome: '3º trimestre' },
  { id: 4, nome: '4º trimestre' },
]

/** Uma meta: círculo para concluir, título editável no lugar, frente, trimestre, status e apagar. */
function LinhaMeta({ m, onSalvar, onApagar }: { m: Meta; onSalvar: (d: Partial<Meta>) => void; onApagar: () => void }) {
  const [titulo, setTitulo] = useState(m.titulo)
  useEffect(() => { setTitulo(m.titulo) }, [m.titulo])
  const feita = m.status === 'concluida'

  return (
    <div className="group grid grid-cols-[28px_1fr_120px_130px_130px_28px] items-center gap-3 px-5 py-2 hover:bg-black/[0.015]">
      <button
        onClick={() => onSalvar({ status: feita ? 'a_fazer' : 'concluida' })}
        aria-label={feita ? 'Reabrir meta' : 'Concluir meta'}
        className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center transition-colors ${feita ? 'bg-olive border-olive text-white' : m.status === 'em_andamento' ? 'border-accent' : 'border-black/20 hover:border-olive'}`}
      >
        {feita ? <Check size={12} strokeWidth={3} /> : m.status === 'em_andamento' && <span className="w-2 h-2 rounded-full bg-accent" />}
      </button>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        onBlur={() => { const t = titulo.trim(); if (t && t !== m.titulo) onSalvar({ titulo: t }); else setTitulo(m.titulo) }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        className={`min-w-0 bg-transparent rounded-lg px-2 py-1 -ml-2 text-[14px] outline-none border border-transparent hover:border-black/10 focus:border-accent focus:bg-white ${feita ? 'text-muted line-through decoration-black/20' : 'text-charcoal'}`}
      />
      <select value={m.frente} onChange={(e) => onSalvar({ frente: e.target.value as Frente })} className="bg-transparent text-[12.5px] text-charcoal/80 outline-none cursor-pointer rounded-lg px-1 py-1 hover:bg-black/[0.04]">
        {(Object.keys(FRENTES) as Frente[]).map((f) => <option key={f} value={f}>{FRENTES[f]}</option>)}
      </select>
      <select value={m.trimestre ?? ''} onChange={(e) => onSalvar({ trimestre: e.target.value ? Number(e.target.value) : null })} className="bg-transparent text-[12.5px] text-charcoal/80 outline-none cursor-pointer rounded-lg px-1 py-1 hover:bg-black/[0.04]">
        {GRUPOS.map((g) => <option key={String(g.id)} value={g.id ?? ''}>{g.id ? `${g.id}º tri` : 'Ano todo'}</option>)}
      </select>
      <select value={m.status} onChange={(e) => onSalvar({ status: e.target.value as StatusMeta })} className={`text-[12px] font-medium outline-none cursor-pointer rounded-full px-2.5 py-1 appearance-none ${feita ? 'bg-olive/[0.12] text-olive' : m.status === 'em_andamento' ? 'bg-accent/10 text-accent' : 'bg-black/[0.05] text-muted'}`}>
        {(Object.keys(STATUS_META) as StatusMeta[]).map((s) => <option key={s} value={s}>{STATUS_META[s]}</option>)}
      </select>
      <button onClick={onApagar} aria-label="Apagar meta" className="opacity-0 group-hover:opacity-100 text-muted hover:text-charcoal transition-opacity"><Trash2 size={14} /></button>
    </div>
  )
}

function NovaMeta({ onCriar }: { onCriar: (titulo: string) => void }) {
  const [t, setT] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="flex items-center gap-3 px-5 py-2">
      <span className="w-[22px] h-[22px] rounded-full border-[1.5px] border-dashed border-black/15 flex items-center justify-center text-muted"><Plus size={12} /></span>
      <input
        ref={ref}
        value={t}
        onChange={(e) => setT(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && t.trim()) { onCriar(t.trim()); setT('') } }}
        placeholder="Adicionar meta e Enter"
        className="flex-1 bg-transparent text-[14px] text-charcoal outline-none placeholder:text-muted/60 py-1"
      />
    </div>
  )
}

export default function PlanejamentoPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [metas, setMetas] = useState<Meta[]>([])
  const [ano, setAno] = useState(Number(hojeISO().slice(0, 4)))
  const [frente, setFrente] = useState<Frente | 'todas'>('todas')
  const [verFeitas, setVerFeitas] = useState(false)
  const [numeros, setNumeros] = useState<{ instagram: number | null; casaNogs: number | null }>({ instagram: null, casaNogs: null })
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    try { setMetas(await listarMetas(supabase)); setErro(null) } catch (e) { setErro((e as Error).message) }
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  // Os números do H1 vêm das conexões (seguidores do Instagram, assinantes anotados da Casa Nogs).
  useEffect(() => {
    const ultimo = (rede: string) => supabase.from('metricas_conta').select('seguidores').eq('rede', rede).not('seguidores', 'is', null).order('dia', { ascending: false }).limit(1).maybeSingle()
    Promise.all([ultimo('instagram'), ultimo('substack')]).then(([i, s]) => setNumeros({ instagram: i.data?.seguidores ?? null, casaNogs: s.data?.seguidores ?? null }))
  }, [supabase])

  async function salvar(m: Meta, d: Partial<Meta>) {
    setMetas((l) => l.map((x) => (x.id === m.id ? { ...x, ...d } : x)))
    try { await salvarMeta(supabase, m.id, d) } catch (e) { setErro((e as Error).message); carregar() }
  }
  async function apagar(m: Meta) {
    if (!confirm(`Apagar a meta "${m.titulo}"?`)) return
    setMetas((l) => l.filter((x) => x.id !== m.id))
    try { await apagarMeta(supabase, m.id) } catch (e) { setErro((e as Error).message); carregar() }
  }
  async function criar(titulo: string, trimestre: number | null) {
    try {
      const nova = await criarMeta(supabase, { titulo, ano, trimestre, frente: frente === 'todas' ? 'marca' : frente }, Math.max(0, ...metas.map((m) => m.ordem)) + 1)
      setMetas((l) => [...l, nova])
    } catch (e) { setErro((e as Error).message) }
  }

  const anos = Array.from(new Set([...metas.map((m) => m.ano), ano, ano + 1])).sort()
  const doAno = metas.filter((m) => m.ano === ano)
  const filtradas = doAno.filter((m) => frente === 'todas' || m.frente === frente)
  const feitas = filtradas.filter((m) => m.status === 'concluida')
  const abertas = filtradas.filter((m) => m.status !== 'concluida')
  const progresso = doAno.length ? doAno.filter((m) => m.status === 'concluida').length / doAno.length : 0
  const pecaUm = metas.find((m) => /peça/i.test(m.titulo) && m.ano === 2026)

  const marcosH1 = [
    { nome: 'Manifesto', valor: 'Feito', parte: 1, nota: 'Manual da Marca' },
    { nome: 'Peça Um', valor: pecaUm ? STATUS_META[pecaUm.status] : '—', parte: pecaUm?.status === 'concluida' ? 1 : pecaUm?.status === 'em_andamento' ? 0.5 : 0, nota: 'design autoral em collab' },
    { nome: 'Instagram', valor: numeros.instagram?.toLocaleString('pt-BR') ?? '—', parte: (numeros.instagram ?? 0) / 10000, nota: 'meta: 10 mil' },
    { nome: 'Casa Nogs', valor: numeros.casaNogs?.toLocaleString('pt-BR') ?? '—', parte: (numeros.casaNogs ?? 0) / 1000, nota: numeros.casaNogs == null ? 'anote em Newsletter · meta: 1 mil' : 'meta: 1 mil' },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1300px]">
        <Header title="Planejamento" subtitle="The Icon Blueprint: doze anos, cinco horizontes, um passo de cada vez" />

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        {/* O ano */}
        <section className="grid grid-cols-[1.1fr_1.4fr] gap-5 mb-6">
          <div className="rounded-2xl bg-[#1D1D1F] text-white p-7 flex flex-col">
            <div className="text-[12px] text-white/50">{ano}</div>
            <h2 className="font-display text-[30px] tracking-tight leading-tight mt-0.5">{ano === 2026 ? 'Ano da Fundação' : `Plano de ${ano}`}</h2>
            {ano === 2026 && <p className="text-[13.5px] text-white/70 leading-relaxed mt-2">Não é ano de explodir audiência: é ano de plantar base sólida para o Horizonte 1. A estratégia é lenta e selecionada por princípio.</p>}
            <div className="mt-auto pt-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-[40px] tabular-nums leading-none">{Math.round(progresso * 100)}%</span>
                <span className="text-[12px] text-white/50">{doAno.filter((m) => m.status === 'concluida').length} de {doAno.length} metas do ano</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-[#A09478] transition-all duration-700" style={{ width: `${progresso * 100}%` }} /></div>
            </div>
          </div>

          <div className={`${cartao} p-6`}>
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[14px] font-medium text-charcoal">Horizonte 1 · Fundação</span>
              <span className="text-[12px] text-muted">os quatro marcos do primeiro ano</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {marcosH1.map((m) => (
                <div key={m.nome}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] text-charcoal">{m.nome}</span>
                    <span className="font-display text-[20px] text-charcoal tabular-nums">{m.valor}</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-black/[0.06] overflow-hidden"><div className="h-full rounded-full bg-olive transition-all duration-700" style={{ width: `${Math.min(1, m.parte) * 100}%` }} /></div>
                  <div className="text-[11px] text-muted mt-1">{m.nota}{m.parte > 0 && m.parte < 1 ? ` · ${Math.round(m.parte * 100)}%` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontes */}
        <section className="grid grid-cols-5 gap-3 mb-10">
          {HORIZONTES.map((h, i) => (
            <div key={h.id} className={`rounded-2xl p-4 border ${i === 0 ? 'bg-white border-black/[0.12] shadow-card' : 'bg-white/50 border-linha'}`}>
              <div className="flex items-baseline justify-between">
                <span className={`text-[12px] font-semibold ${i === 0 ? 'text-olive' : 'text-muted'}`}>{h.id}</span>
                {i === 0 && <span className="text-[10.5px] text-olive">agora</span>}
              </div>
              <div className="text-[15px] font-medium text-charcoal mt-0.5">{h.nome}</div>
              <div className="text-[11.5px] text-muted mb-2">{h.quando}</div>
              <ul className="space-y-0.5">{h.marcos.map((m) => <li key={m} className="text-[12px] text-charcoal/75">{m}</li>)}</ul>
            </div>
          ))}
        </section>

        {/* Metas */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="font-display text-[24px] text-charcoal tracking-tight mr-2">Metas</h2>
          <div className="flex p-[3px] rounded-[10px] bg-black/[0.06]">
            {anos.map((a) => (
              <button key={a} onClick={() => setAno(a)} className={`px-3.5 py-[4px] rounded-[7px] text-[12.5px] tabular-nums transition-all ${ano === a ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`}>{a}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['todas', ...Object.keys(FRENTES)] as (Frente | 'todas')[]).map((f) => (
              <button key={f} onClick={() => setFrente(f)} className={`px-3 py-1 rounded-full text-[12.5px] border transition-all ${frente === f ? 'border-charcoal bg-charcoal text-white' : 'border-black/[0.10] bg-white text-charcoal hover:border-black/25'}`}>
                {f === 'todas' ? 'Todas' : FRENTES[f]}
              </button>
            ))}
          </div>
        </div>

        {feitas.length > 0 && (
          <div className={`${cartao} mb-4 overflow-hidden`}>
            <button onClick={() => setVerFeitas(!verFeitas)} className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-black/[0.015]">
              <span className="w-[22px] h-[22px] rounded-full bg-olive text-white flex items-center justify-center"><Check size={12} strokeWidth={3} /></span>
              <span className="text-[14px] font-medium text-charcoal flex-1">Já construído</span>
              <span className="text-[12.5px] text-muted tabular-nums">{feitas.length} {feitas.length === 1 ? 'meta concluída' : 'metas concluídas'}</span>
              <ChevronDown size={15} className={`text-muted transition-transform ${verFeitas ? 'rotate-180' : ''}`} />
            </button>
            {verFeitas && (
              <div className="border-t border-linha divide-y divide-linha">
                {feitas.map((m) => <LinhaMeta key={m.id} m={m} onSalvar={(d) => salvar(m, d)} onApagar={() => apagar(m)} />)}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {GRUPOS.map((g) => {
            const lista = abertas.filter((m) => (m.trimestre ?? null) === g.id)
            return (
              <div key={String(g.id)} className={`${cartao} overflow-hidden`}>
                <div className="flex items-baseline justify-between px-5 pt-4 pb-2">
                  <span className="text-[14px] font-medium text-charcoal">{g.nome}</span>
                  <span className="text-[12px] text-muted tabular-nums">{lista.length || ''}</span>
                </div>
                <div className="divide-y divide-linha">
                  {lista.map((m) => <LinhaMeta key={m.id} m={m} onSalvar={(d) => salvar(m, d)} onApagar={() => apagar(m)} />)}
                  <NovaMeta onCriar={(t) => criar(t, g.id)} />
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

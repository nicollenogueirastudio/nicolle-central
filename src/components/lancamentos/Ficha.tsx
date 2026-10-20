'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Check, ChevronDown, Plus, RotateCcw, Trash2, Loader2, CalendarPlus } from 'lucide-react'
import { dataBR, diaCurto, hojeISO, somarDias } from '@/lib/datas'
import { FASES, MOVIMENTOS, movimento, type Fase } from '@/lib/lancamentos/estrategia'
import {
  salvarLancamento, apagarLancamento, salvarMovimento, recalcularDatas, criarPostDoMovimento, dataSugerida,
  STATUS_LANCAMENTO, type Lancamento, type MovimentoDoArco, type StatusLancamento,
} from '@/lib/lancamentos/dados'
import { STATUS } from '@/lib/posts/tipos'
import { estiloStatus } from '@/components/posts/estilos'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-3 py-1.5 text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'

/** Campo que grava ao sair (ou no Enter). */
function Texto({ valor, onSalvar, placeholder, tipo = 'text', className = '' }: { valor: string | null; onSalvar: (v: string | null) => void; placeholder?: string; tipo?: string; className?: string }) {
  const [v, setV] = useState(valor ?? '')
  useEffect(() => { setV(valor ?? '') }, [valor])
  return (
    <input
      type={tipo}
      value={v}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { if ((v || null) !== (valor || null)) onSalvar(v.trim() || null) }}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
      className={`${campo} ${className}`}
    />
  )
}

/** Linha do tempo do arco, em semanas: da marcação de início até 16 semanas depois da revelação. */
function Arco({ l }: { l: Lancamento }) {
  if (!l.revelacao_em) return null
  const inicio = somarDias(l.revelacao_em, -49)
  const SEMANAS = 24
  const semanaDe = (dia: string) => Math.floor((Date.parse(dia) - Date.parse(inicio)) / (7 * 86400000))
  const hoje = semanaDe(hojeISO())
  const rev = semanaDe(l.revelacao_em)
  const linhas = l.movimentos.filter((m) => m.data_prevista)

  return (
    <div className={`${cartao} p-5 overflow-x-auto`}>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[14px] font-medium text-charcoal">O arco, semana a semana</span>
        <span className="text-[12px] text-muted">Os movimentos contínuos (06, 07) e os de TikTok (13, 14) correm fora do calendário.</span>
      </div>
      <div className="min-w-[860px]">
        <div className="grid items-center" style={{ gridTemplateColumns: `200px repeat(${SEMANAS}, 1fr)` }}>
          <div />
          {Array.from({ length: SEMANAS }, (_, i) => (
            <div key={i} className={`text-center text-[10px] tabular-nums pb-1.5 ${i === rev ? 'text-charcoal font-semibold' : 'text-muted'}`}>
              {i === rev ? 'rev.' : i - rev > 0 ? `+${i - rev}` : i - rev}
            </div>
          ))}
          {linhas.map((m) => {
            const s = semanaDe(m.data_prevista!)
            const ref = movimento(m.movimento)
            return (
              <div key={m.movimento} className="contents">
                <div className="text-[12px] text-charcoal/85 truncate py-[5px] pr-3">
                  <span className="text-muted tabular-nums mr-1.5">{String(m.movimento).padStart(2, '0')}</span>{ref.nome}
                </div>
                {Array.from({ length: SEMANAS }, (_, i) => (
                  <div key={i} className={`h-[26px] flex items-center justify-center border-l border-black/[0.04] ${i === rev ? 'bg-olive/[0.07]' : ''} ${i === hoje ? 'bg-black/[0.035]' : ''}`}>
                    {i === s && (
                      <span title={`${ref.nome} · ${dataBR(m.data_prevista! + 'T12:00:00Z')}`}
                        className={`w-3 h-3 rounded-full ring-2 ring-white ${m.feito ? 'bg-olive' : 'bg-charcoal'}`} />
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-charcoal" /> previsto</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-olive" /> feito</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[3px] bg-olive/[0.15]" /> semana da revelação</span>
          {hoje >= 0 && hoje < SEMANAS && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[3px] bg-black/[0.07]" /> esta semana</span>}
        </div>
      </div>
    </div>
  )
}

export default function Ficha({ supabase, l, outros, onMudou, onApagou }: {
  supabase: SupabaseClient
  l: Lancamento
  outros: Lancamento[]
  onMudou: () => void
  onApagou: () => void
}) {
  const [aberto, setAberto] = useState<number | null>(null)
  const [ocupado, setOcupado] = useState<number | 'recalc' | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const feitos = l.movimentos.filter((m) => m.feito).length
  const diasAteRevelacao = l.revelacao_em ? Math.round((Date.parse(l.revelacao_em) - Date.parse(hojeISO())) / 86400000) : null

  // Regra do manual: um projeto por vez. Avisa se outro arco ativo cai a menos de 4 meses da revelação.
  const conflito = l.revelacao_em && l.status !== 'concluido' && l.status !== 'arquivado'
    ? outros.find((o) => o.id !== l.id && o.revelacao_em && (o.status === 'planejando' || o.status === 'em_andamento')
      && Math.abs(Date.parse(o.revelacao_em) - Date.parse(l.revelacao_em!)) < 120 * 86400000)
    : null

  async function campoLancamento(dados: Parameters<typeof salvarLancamento>[2]) {
    try { await salvarLancamento(supabase, l.id, dados); onMudou() } catch (e) { setAviso((e as Error).message) }
  }
  async function campoMovimento(m: MovimentoDoArco, dados: Parameters<typeof salvarMovimento>[3]) {
    try { await salvarMovimento(supabase, l.id, m.movimento, dados); onMudou() } catch (e) { setAviso((e as Error).message) }
  }
  async function criarPost(m: MovimentoDoArco) {
    setOcupado(m.movimento)
    try { await criarPostDoMovimento(supabase, l, m); onMudou() } catch (e) { setAviso((e as Error).message) } finally { setOcupado(null) }
  }
  async function recalcular() {
    if (!confirm('Refazer as datas dos movimentos que ainda não foram feitos nem viraram post, a partir da revelação?')) return
    setOcupado('recalc')
    try { await recalcularDatas(supabase, l); onMudou() } finally { setOcupado(null) }
  }
  async function apagar() {
    if (!confirm(`Apagar o lançamento "${l.projeto}"? Os posts já criados no calendário continuam lá.`)) return
    await apagarLancamento(supabase, l.id)
    onApagou()
  }

  return (
    <div className="space-y-5">
      {/* Cabeçalho da ficha */}
      <div className={`${cartao} p-5`}>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <Texto valor={l.projeto} onSalvar={(v) => v && campoLancamento({ projeto: v })} className="!text-[22px] !font-semibold !border-transparent hover:!border-black/10 !px-2 -ml-2 tracking-tight" />
          </div>
          <select value={l.status} onChange={(e) => campoLancamento({ status: e.target.value as StatusLancamento })} className="rounded-full bg-black/[0.05] px-3 py-1.5 text-[12.5px] font-medium text-charcoal outline-none cursor-pointer">
            {(Object.keys(STATUS_LANCAMENTO) as StatusLancamento[]).map((s) => <option key={s} value={s}>{STATUS_LANCAMENTO[s]}</option>)}
          </select>
          <button onClick={apagar} aria-label="Apagar lançamento" title="Apagar lançamento" className="w-8 h-8 rounded-full hover:bg-black/[0.05] flex items-center justify-center text-muted hover:text-charcoal"><Trash2 size={15} /></button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <label><span className="block text-[11.5px] text-muted mb-1">Cliente</span><Texto valor={l.cliente} onSalvar={(v) => campoLancamento({ cliente: v })} /></label>
          <label>
            <span className="block text-[11.5px] text-muted mb-1">Revelação combinada em</span>
            <Texto tipo="date" valor={l.revelacao_em} onSalvar={(v) => campoLancamento({ revelacao_em: v })} />
          </label>
          <label><span className="block text-[11.5px] text-muted mb-1">Fotografia</span><Texto valor={l.fotografia} onSalvar={(v) => campoLancamento({ fotografia: v })} placeholder="quem fotografa" /></label>
          <label><span className="block text-[11.5px] text-muted mb-1">Vídeo</span><Texto valor={l.video} onSalvar={(v) => campoLancamento({ video: v })} placeholder="quem filma" /></label>
        </div>
        <label className="block mt-3"><span className="block text-[11.5px] text-muted mb-1">Notas</span><Texto valor={l.notas} onSalvar={(v) => campoLancamento({ notas: v })} placeholder="o que não pode esquecer neste arco" /></label>

        <div className="flex items-center gap-6 mt-5 pt-4 border-t border-linha">
          <div className="flex-1">
            <div className="flex justify-between text-[12px] mb-1.5"><span className="text-muted">Ficha</span><span className="text-charcoal tabular-nums">{feitos} de 16 movimentos</span></div>
            <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden"><div className="h-full rounded-full bg-olive transition-all duration-500" style={{ width: `${(feitos / 16) * 100}%` }} /></div>
          </div>
          <div className="text-right">
            <div className="font-display text-[22px] text-charcoal tabular-nums leading-none">
              {diasAteRevelacao == null ? '—' : diasAteRevelacao > 0 ? `${diasAteRevelacao} dias` : diasAteRevelacao === 0 ? 'hoje' : `há ${-diasAteRevelacao} dias`}
            </div>
            <div className="text-[11px] text-muted mt-1">{diasAteRevelacao == null ? 'defina a revelação' : diasAteRevelacao >= 0 ? 'até a revelação' : 'desde a revelação'}</div>
          </div>
          <button onClick={recalcular} disabled={!l.revelacao_em || ocupado !== null} className="flex items-center gap-1.5 px-3.5 py-[6px] rounded-full text-[12.5px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09] disabled:opacity-40">
            {ocupado === 'recalc' ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />} Recalcular datas
          </button>
        </div>
        {conflito && (
          <p className="mt-3 text-[12.5px] text-[#8C6B3F]">
            Regra do arco: um projeto por vez. "{conflito.projeto}" tem revelação em {dataBR(conflito.revelacao_em! + 'T12:00:00Z')}, a menos de 4 meses desta.
          </p>
        )}
        {aviso && <p className="mt-3 text-[12.5px] text-accent">{aviso}</p>}
      </div>

      <Arco l={l} />

      {/* Os 16 movimentos por fase */}
      {([1, 2, 3, 4, 5] as Fase[]).map((f) => (
        <div key={f} className={`${cartao} overflow-hidden`}>
          <div className="flex items-baseline gap-3 px-5 py-3 border-b border-linha bg-black/[0.015]">
            <span className="font-display text-[17px] text-charcoal w-7">{FASES[f].numero}</span>
            <span className="text-[14px] font-medium text-charcoal">{FASES[f].nome}</span>
            <span className="text-[12px] text-muted">{FASES[f].quando}</span>
          </div>
          <div className="divide-y divide-linha">
            {l.movimentos.filter((m) => movimento(m.movimento).fase === f).map((m) => {
              const ref = movimento(m.movimento)
              const sugerida = dataSugerida(l.revelacao_em, m.movimento)
              const expandido = aberto === m.movimento
              return (
                <div key={m.movimento}>
                  <div className="grid grid-cols-[28px_1fr_150px_140px_190px_28px] items-center gap-3 px-5 py-2.5">
                    <button
                      onClick={() => campoMovimento(m, { feito: !m.feito })}
                      aria-label={m.feito ? 'Marcar como não feito' : 'Marcar como feito'}
                      className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center transition-colors ${m.feito ? 'bg-olive border-olive text-white' : 'border-black/20 hover:border-olive'}`}
                    >
                      {m.feito && <Check size={12} strokeWidth={3} />}
                    </button>
                    <button onClick={() => setAberto(expandido ? null : m.movimento)} className="text-left min-w-0">
                      <div className={`text-[13.5px] truncate ${m.feito ? 'text-muted line-through decoration-black/20' : 'text-charcoal'}`}>
                        <span className="text-muted tabular-nums mr-2">{String(m.movimento).padStart(2, '0')}</span>{ref.nome}
                      </div>
                      <div className="text-[11.5px] text-muted truncate">{ref.formato} · {ref.quando}</div>
                    </button>
                    <div>
                      {ref.dias == null && !m.data_prevista
                        ? <span className="text-[12px] text-muted">{ref.quando}</span>
                        : <Texto tipo="date" valor={m.data_prevista} onSalvar={(v) => campoMovimento(m, { data_prevista: v })} className="!py-1 !text-[12.5px]" />}
                      {sugerida && m.data_prevista && sugerida !== m.data_prevista && <div className="text-[10.5px] text-muted mt-0.5">sugerida: {diaCurto(sugerida)}</div>}
                    </div>
                    <Texto valor={m.canal} onSalvar={(v) => campoMovimento(m, { canal: v })} className="!py-1 !text-[12.5px]" />
                    <div>
                      {m.post ? (
                        <Link href="/marketing" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium ${estiloStatus[m.post.status as keyof typeof estiloStatus] ?? ''}`}>
                          No calendário · {STATUS[m.post.status as keyof typeof STATUS] ?? m.post.status}
                        </Link>
                      ) : ref.post ? (
                        <button onClick={() => criarPost(m)} disabled={ocupado !== null} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09] disabled:opacity-40">
                          {ocupado === m.movimento ? <Loader2 size={12} className="animate-spin" /> : <CalendarPlus size={12} />} Criar no calendário
                        </button>
                      ) : <span className="text-[11.5px] text-muted">{ref.canal.includes('TikTok') ? 'TikTok, fora do calendário' : ref.n === 16 ? 'na Casa Nogs' : ref.n === 15 ? 'destaques do perfil' : 'recurso contínuo'}</span>}
                    </div>
                    <button onClick={() => setAberto(expandido ? null : m.movimento)} aria-label="Detalhes" className="text-muted"><ChevronDown size={15} className={`transition-transform ${expandido ? 'rotate-180' : ''}`} /></button>
                  </div>
                  {expandido && (
                    <div className="grid grid-cols-[1fr_1fr] gap-6 px-5 pb-4 pl-[60px] animate-surgir">
                      <div className="space-y-2.5 text-[13px] leading-relaxed">
                        <p className="text-charcoal/85">{ref.oQueE}</p>
                        <p className="text-muted">Por quê: {ref.porQue}</p>
                        <label className="block">
                          <span className="block text-[11.5px] text-muted mb-1">Observações deste projeto</span>
                          <Texto valor={m.observacoes} onSalvar={(v) => campoMovimento(m, { observacoes: v })} placeholder="o que muda neste arco" />
                        </label>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-muted mb-1.5">Como executar</div>
                        <ul className="space-y-1">{ref.comoExecutar.map((c) => <li key={c} className="text-[12.5px] text-charcoal/85 flex gap-2"><span className="text-muted">—</span>{c}</li>)}</ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {MOVIMENTOS.length !== l.movimentos.length && (
        <p className="text-[12px] text-muted flex items-center gap-1.5"><Plus size={12} /> Este lançamento tem {l.movimentos.length} movimentos na ficha.</p>
      )}
    </div>
  )
}

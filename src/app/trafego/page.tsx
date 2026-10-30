'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Loader2, Pause, Play, Pencil } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { LinhaTempo } from '@/components/performance/Graficos'
import { cartao, Tile } from '@/components/performance/ui'
import { hojeISO, somarDias } from '@/lib/datas'
import { STATUS_META, reais } from '@/lib/trafego/tipos'
import type { AnuncioMeta, Campanha, Conjunto, Numeros } from '@/lib/trafego/meta'

type Resultados = { total: Numeros; dias: ({ dia: string } & Numeros)[]; campanhas: Campanha[]; investidoMes: number; tetoMensal: number | null; conta: string }

const PERIODOS = [
  { id: '7', nome: '7 dias', dias: 7 },
  { id: '30', nome: '30 dias', dias: 30 },
  { id: '90', nome: '90 dias', dias: 90 },
  { id: 'mes', nome: 'Este mês', dias: 0 },
]

const n = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
const pct = (v: number) => `${v.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
const resultadoPrincipal = (x: Numeros) =>
  x.resultados.link_click ?? x.resultados.post_engagement ?? x.resultados.video_view ?? x.resultados.lead ?? 0

const ativo = (s: string) => s === 'ACTIVE'
const pilulaStatus = (s: string) =>
  `inline-flex items-center px-2 py-px rounded-full text-[11px] font-medium ${ativo(s) ? 'bg-olive/15 text-olive' : s === 'DISAPPROVED' || s === 'WITH_ISSUES' ? 'bg-gold/20 text-[#8C6B3F]' : 'bg-black/[0.05] text-charcoal/70'}`

async function api<T>(url: string, corpo?: unknown): Promise<T> {
  const r = await fetch(url, corpo ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) } : undefined)
  const j = await r.json()
  if (!j.ok) throw Object.assign(new Error(j.motivo ?? 'Falhou'), { semConta: j.semConta })
  return j
}

/** Ligar/pausar e orçamento, sempre com confirmação: é dinheiro de verdade. */
function Controles({ id, nome, status, orcamento, aoMudar }: { id: string; nome: string; status: string; orcamento?: string; aoMudar: () => void }) {
  const [ocupado, setOcupado] = useState(false)
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState(orcamento ? String(Number(orcamento) / 100) : '')

  const mandar = async (corpo: Record<string, unknown>, pergunta: string) => {
    if (!window.confirm(pergunta)) return
    setOcupado(true)
    try { await api('/api/trafego/acao', { ...corpo, id, nome }); aoMudar() } catch (e) { window.alert((e as Error).message) } finally { setOcupado(false); setEditando(false) }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {orcamento && (editando ? (
        <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); mandar({ acao: 'orcamento', valor: Number(valor.replace(',', '.')) }, `Mudar o orçamento diário de "${nome}" para ${reais(Number(valor.replace(',', '.')))}?`) }}>
          <span className="text-[12px] text-muted">R$</span>
          <input value={valor} onChange={(e) => setValor(e.target.value)} className="w-16 px-1.5 py-0.5 rounded-md border border-linha text-[12.5px] tabular-nums" autoFocus />
          <button className="text-[12px] text-olive font-medium">ok</button>
        </form>
      ) : (
        <button onClick={() => setEditando(true)} className="flex items-center gap-1 text-[12.5px] tabular-nums text-charcoal hover:text-olive" title="Mudar orçamento diário">
          {reais(Number(orcamento) / 100)}/dia <Pencil size={11} className="text-muted" />
        </button>
      ))}
      <button
        disabled={ocupado}
        onClick={() => ativo(status)
          ? mandar({ acao: 'status', status: 'PAUSED' }, `Pausar "${nome}"? Para de gastar na hora.`)
          : mandar({ acao: 'status', status: 'ACTIVE' }, `Ligar "${nome}"? A partir de agora a Meta começa a cobrar${orcamento ? ` até ${reais(Number(orcamento) / 100)} por dia` : ''}.`)}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${ativo(status) ? 'bg-olive/15 text-olive hover:bg-olive/25' : 'bg-black/[0.05] text-charcoal/70 hover:bg-black/[0.1]'}`}
        title={ativo(status) ? 'Pausar' : 'Ligar'}
      >
        {ocupado ? <Loader2 size={13} className="animate-spin" /> : ativo(status) ? <Pause size={13} /> : <Play size={13} />}
      </button>
    </div>
  )
}

function Detalhe({ campanha, de, ate, aoMudar }: { campanha: Campanha; de: string; ate: string; aoMudar: () => void }) {
  const [d, setD] = useState<{ conjuntos: Conjunto[]; anuncios: AnuncioMeta[] } | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const carregar = useCallback(() => {
    api<{ conjuntos: Conjunto[]; anuncios: AnuncioMeta[] }>(`/api/trafego/resultados?campanha=${campanha.id}&de=${de}&ate=${ate}`).then(setD).catch((e) => setErro(e.message))
  }, [campanha.id, de, ate])
  useEffect(() => { carregar() }, [carregar])
  const mudou = () => { carregar(); aoMudar() }

  if (erro) return <div className="px-5 py-4 text-[12.5px] text-[#8C6B3F]">{erro}</div>
  if (!d) return <div className="px-5 py-4 text-[12.5px] text-muted flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Carregando conjuntos e anúncios…</div>
  return (
    <div className="px-5 pb-5 pt-1 bg-cream/60 space-y-4">
      {d.conjuntos.map((c) => (
        <div key={c.id} className="flex items-center gap-3 text-[12.5px]">
          <span className="text-muted w-20 shrink-0">Conjunto</span>
          <span className="text-charcoal flex-1 truncate">{c.name}</span>
          <span className={pilulaStatus(c.effective_status)}>{STATUS_META[c.effective_status] ?? c.effective_status}</span>
          <span className="tabular-nums text-muted w-24 text-right">{reais(c.numeros.spend)}</span>
          <Controles id={c.id} nome={c.name} status={c.status} orcamento={c.daily_budget} aoMudar={mudou} />
        </div>
      ))}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {d.anuncios.map((a) => (
          <div key={a.id} className={`${cartao} overflow-hidden`}>
            <div className="aspect-[4/5] bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {(a.creative?.image_url || a.creative?.thumbnail_url) && <img src={a.creative.image_url ?? a.creative.thumbnail_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="p-3 space-y-1.5">
              <div className="text-[12.5px] text-charcoal truncate">{a.name}</div>
              <div className="flex items-center justify-between">
                <span className={pilulaStatus(a.effective_status)}>{STATUS_META[a.effective_status] ?? a.effective_status}</span>
                <Controles id={a.id} nome={a.name} status={a.status} aoMudar={mudou} />
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px] text-muted pt-1">
                <span><b className="block text-charcoal font-medium tabular-nums">{reais(a.numeros.spend)}</b>investido</span>
                <span><b className="block text-charcoal font-medium tabular-nums">{n(a.numeros.reach)}</b>alcance</span>
                <span><b className="block text-charcoal font-medium tabular-nums">{pct(a.numeros.ctr)}</b>CTR</span>
              </div>
              {a.creative?.instagram_permalink_url && <a href={a.creative.instagram_permalink_url} target="_blank" rel="noreferrer" className="text-[11.5px] text-olive hover:underline">Ver post</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TrafegoPage() {
  const [periodo, setPeriodo] = useState('30')
  const [dados, setDados] = useState<Resultados | null>(null)
  const [erro, setErro] = useState<{ msg: string; semConta?: boolean } | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [aberta, setAberta] = useState<string | null>(null)

  const hoje = hojeISO()
  const p = PERIODOS.find((x) => x.id === periodo)!
  const de = p.dias ? somarDias(hoje, -(p.dias - 1)) : hoje.slice(0, 8) + '01'
  const ate = hoje

  const carregar = useCallback(async () => {
    setCarregando(true)
    try { setDados(await api<Resultados>(`/api/trafego/resultados?de=${de}&ate=${ate}`)); setErro(null) }
    catch (e) { setErro({ msg: (e as Error).message, semConta: (e as { semConta?: boolean }).semConta }) }
    finally { setCarregando(false) }
  }, [de, ate])
  useEffect(() => { carregar() }, [carregar])

  const t = dados?.total
  const segmento = (sel: boolean) => `px-4 py-[5px] rounded-[7px] text-[13px] transition-all duration-200 ${sel ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Tráfego pago" subtitle="Anúncios da Meta (Instagram e Facebook): resultados, ligar, pausar e orçamento." />

        <div className="flex items-center gap-3 mb-6">
          <div className="flex p-[3px] rounded-[10px] bg-black/[0.06] w-fit">
            {PERIODOS.map((x) => <button key={x.id} onClick={() => setPeriodo(x.id)} className={segmento(periodo === x.id)}>{x.nome}</button>)}
          </div>
          {carregando && <Loader2 size={15} className="animate-spin text-muted" />}
          <Link href="/trafego/anuncios" className="ml-auto px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black transition-colors">Novo anúncio</Link>
        </div>

        {erro && (
          <div className={`${cartao} p-10 text-center`}>
            <p className="text-[15px] font-medium text-charcoal">{erro.semConta ? 'Falta escolher a conta de anúncios' : 'Não consegui ler a Meta'}</p>
            <p className="text-[13px] text-muted mt-1 max-w-[520px] mx-auto">{erro.msg}</p>
            <Link href="/trafego/configurar" className="inline-block mt-4 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black">Ir para Configurar</Link>
          </div>
        )}

        {t && dados && (
          <div className={`space-y-8 pb-24 transition-opacity ${carregando ? 'opacity-50' : ''}`}>
            {dados.tetoMensal != null && dados.investidoMes > dados.tetoMensal && (
              <div className="rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">
                O investido neste mês ({reais(dados.investidoMes)}) passou do teto mensal de {reais(dados.tetoMensal)}.
              </div>
            )}
            <div className="grid grid-cols-4 gap-3">
              <Tile rotulo="Investido" valor={reais(t.spend)} nota={<span className="text-[12px] text-muted">{reais(dados.investidoMes)} no mês{dados.tetoMensal != null ? ` · teto ${reais(dados.tetoMensal)}` : ''}</span>} />
              <Tile rotulo="Alcance" valor={n(t.reach)} nota={<span className="text-[12px] text-muted">frequência {t.frequency.toFixed(2).replace('.', ',')}</span>} />
              <Tile rotulo="Cliques no link" valor={n(t.inline_link_clicks)} nota={<span className="text-[12px] text-muted">CPC {reais(t.cpc)}</span>} />
              <Tile rotulo="CTR" valor={pct(t.ctr)} nota={<span className="text-[12px] text-muted">CPM {reais(t.cpm)} · {n(t.impressions)} impressões</span>} />
            </div>

            {dados.dias.length > 1 && (
              <div className={`${cartao} p-5`}>
                <div className="text-[13px] font-medium text-charcoal mb-2">Investido por dia</div>
                <LinhaTempo pontos={dados.dias.map((d) => ({ dia: d.dia, valor: Math.round(d.spend) }))} rotulo="Reais" />
              </div>
            )}

            <div className={`${cartao} overflow-hidden`}>
              <div className="grid grid-cols-[1fr_130px_90px_90px_80px_80px_90px_190px] gap-3 px-5 py-3 text-[11.5px] text-muted border-b border-linha">
                <span>Campanha</span><span>Status</span><span className="text-right">Investido</span><span className="text-right">Alcance</span>
                <span className="text-right">CTR</span><span className="text-right">CPC</span><span className="text-right">Resultados</span><span className="text-right">Orçamento · ligar</span>
              </div>
              {dados.campanhas.length === 0 && <p className="px-5 py-10 text-center text-[13px] text-muted">Nenhuma campanha nesta conta ainda.</p>}
              {dados.campanhas.map((c) => (
                <Fragment key={c.id}>
                  <div className="grid grid-cols-[1fr_130px_90px_90px_80px_80px_90px_190px] gap-3 items-center px-5 py-3 border-b border-linha text-[13px] hover:bg-cream/40">
                    <button onClick={() => setAberta(aberta === c.id ? null : c.id)} className="flex items-center gap-1.5 text-left min-w-0">
                      {aberta === c.id ? <ChevronDown size={14} className="text-muted shrink-0" /> : <ChevronRight size={14} className="text-muted shrink-0" />}
                      <span className="truncate text-charcoal">{c.name}</span>
                    </button>
                    <span className={pilulaStatus(c.effective_status)}>{STATUS_META[c.effective_status] ?? c.effective_status}</span>
                    <span className="text-right tabular-nums">{reais(c.numeros.spend)}</span>
                    <span className="text-right tabular-nums">{n(c.numeros.reach)}</span>
                    <span className="text-right tabular-nums">{pct(c.numeros.ctr)}</span>
                    <span className="text-right tabular-nums">{c.numeros.cpc ? reais(c.numeros.cpc) : '—'}</span>
                    <span className="text-right tabular-nums">{n(resultadoPrincipal(c.numeros))}</span>
                    <Controles id={c.id} nome={c.name} status={c.status} orcamento={c.daily_budget} aoMudar={carregar} />
                  </div>
                  {aberta === c.id && <Detalhe campanha={c} de={de} ate={ate} aoMudar={carregar} />}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

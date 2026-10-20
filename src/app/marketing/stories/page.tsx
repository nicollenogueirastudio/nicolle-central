'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Trash2, Check, ExternalLink } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { hojeISO, inicioDaSemana, somarDias, diaCurto, partesBR, instanteDeBR } from '@/lib/datas'
import { SEMANA_STORIES, FREQUENCIA, REGRAS, SEQUENCIA, temaDoDia, type Frame, type Roteiro, type DiaStories } from '@/lib/stories/estrategia'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
type Aba = 'semana' | 'estrategia' | 'publicados'
type Publicado = {
  id: string; publicado_em: string; tipo: string | null; permalink: string | null; caminho: string | null
  alcance: number | null; visualizacoes: number | null; respostas: number | null; compartilhamentos: number | null; saidas: number | null; avancos: number | null
  url?: string
}

const novoId = () => Math.random().toString(36).slice(2, 10)
const diaDe = (p: Publicado) => partesBR(p.publicado_em).data

function Chips({ titulo, itens, onEscolher, tom = 'neutro' }: { titulo: string; itens: string[]; onEscolher?: (t: string) => void; tom?: 'neutro' | 'evitar' }) {
  return (
    <div>
      <div className="text-[11.5px] text-muted mb-1.5">{titulo}</div>
      <div className="flex flex-wrap gap-1.5">
        {itens.map((t) => onEscolher ? (
          <button key={t} onClick={() => onEscolher(t)} title="Pôr no roteiro"
            className="group px-2.5 py-1 rounded-full bg-black/[0.04] hover:bg-olive/[0.12] text-[12.5px] text-charcoal/85 flex items-center gap-1">
            <Plus size={11} className="text-muted group-hover:text-olive" />{t}
          </button>
        ) : (
          <span key={t} className={`px-2.5 py-1 rounded-full text-[12.5px] ${tom === 'evitar' ? 'bg-[#8C6B3F]/[0.10] text-[#6E5432]' : 'bg-olive/[0.10] text-olive'}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function DetalheTema({ t, onEscolher }: { t: DiaStories; onEscolher?: (x: string) => void }) {
  return (
    <div className="space-y-4">
      <Chips titulo="Ideias de stories" itens={t.ideias} onEscolher={onEscolher} />
      {t.frases && <Chips titulo="Frases" itens={t.frases.map((f) => `“${f}”`)} onEscolher={onEscolher} />}
      {t.quadros && <Chips titulo="Quadros" itens={t.quadros} onEscolher={onEscolher} />}
      {t.mostrar && <Chips titulo="Transmitir" itens={t.mostrar} />}
      {t.evitar && <Chips titulo="Evitar" itens={t.evitar} tom="evitar" />}
      {t.sensacao && <div><div className="text-[11.5px] text-muted mb-1">Sensação</div><p className="text-[13px] text-charcoal/85">{t.sensacao}</p></div>}
    </div>
  )
}

export default function StoriesPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const hoje = hojeISO()
  const [aba, setAba] = useState<Aba>('semana')
  const [semana, setSemana] = useState(inicioDaSemana(hoje))
  const [dia, setDia] = useState(hoje)
  const [roteiros, setRoteiros] = useState<Record<string, Roteiro>>({})
  const [publicados, setPublicados] = useState<Publicado[]>([])
  const [novo, setNovo] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const de = somarDias(semana, -60)
    const [r, p] = await Promise.all([
      supabase.from('stories_roteiros').select('*').gte('dia', somarDias(semana, -7)).lte('dia', somarDias(semana, 13)),
      supabase.from('stories_publicados').select('*').gte('publicado_em', instanteDeBR(de, '00:00')).order('publicado_em'),
    ])
    if (r.error || p.error) return setErro((r.error ?? p.error)!.message)
    setRoteiros(Object.fromEntries(((r.data ?? []) as Roteiro[]).map((x) => [x.dia, x])))
    const lista = (p.data ?? []) as Publicado[]
    const caminhos = lista.map((x) => x.caminho).filter(Boolean) as string[]
    if (caminhos.length) {
      const { data: links } = await supabase.storage.from('posts-midia').createSignedUrls(caminhos, 3600)
      const porCaminho = new Map((links ?? []).map((l) => [l.path ?? "", l.signedUrl]))
      lista.forEach((x) => { if (x.caminho) x.url = porCaminho.get(x.caminho) ?? undefined })
    }
    setPublicados(lista)
  }, [supabase, semana])
  useEffect(() => { carregar() }, [carregar])

  const roteiro = roteiros[dia] ?? { dia, frames: [], notas: null }
  const tema = temaDoDia(dia)

  async function gravar(r: Roteiro) {
    setRoteiros((m) => ({ ...m, [r.dia]: r }))
    const { error } = await supabase.from('stories_roteiros').upsert({ dia: r.dia, frames: r.frames, notas: r.notas }, { onConflict: 'dia' })
    if (error) setErro(error.message)
  }
  const mudarFrames = (f: Frame[]) => gravar({ ...roteiro, frames: f })
  const adicionar = (texto: string) => { if (texto.trim()) mudarFrames([...roteiro.frames, { id: novoId(), texto: texto.trim(), feito: false }]) }
  const mover = (i: number, d: -1 | 1) => {
    const f = [...roteiro.frames]; const j = i + d
    if (j < 0 || j >= f.length) return
    ;[f[i], f[j]] = [f[j], f[i]]; mudarFrames(f)
  }

  const dias = Array.from({ length: 7 }, (_, i) => somarDias(semana, i))
  const doDia = (d: string) => publicados.filter((p) => diaDe(p) === d)

  // Alcance médio por tema (pelo dia da semana em que o story saiu).
  const porTema = SEMANA_STORIES.map((t) => {
    const lista = publicados.filter((p) => temaDoDia(diaDe(p)).dow === t.dow && p.alcance != null)
    const diasCom = new Set(lista.map(diaDe)).size
    return { t, n: lista.length, dias: diasCom, alcance: lista.length ? Math.round(lista.reduce((s, p) => s + p.alcance!, 0) / lista.length) : null }
  })
  const maxAlcance = Math.max(1, ...porTema.map((x) => x.alcance ?? 0))

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <div className="flex items-end justify-between">
          <Header title="Stories" subtitle={`Um tema por dia, ${FREQUENCIA.minimo} a ${FREQUENCIA.maximo} stories, sempre em sequência.`} />
          <div className="mb-8 inline-flex rounded-full bg-black/[0.05] p-0.5 text-[12.5px]">
            {([['semana', 'Semana'], ['estrategia', 'A estratégia'], ['publicados', 'Publicados']] as [Aba, string][]).map(([k, n]) => (
              <button key={k} onClick={() => setAba(k)} className={`px-3.5 py-1.5 rounded-full ${aba === k ? 'bg-white shadow-sm text-charcoal font-medium' : 'text-muted'}`}>{n}</button>
            ))}
          </div>
        </div>

        {erro && <div className="mb-4 rounded-xl bg-[#8C6B3F]/10 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        {aba === 'semana' && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => { setSemana(somarDias(semana, -7)); setDia(somarDias(dia, -7)) }} aria-label="Semana anterior" className="w-7 h-7 rounded-full hover:bg-black/[0.05] flex items-center justify-center text-muted"><ChevronLeft size={16} /></button>
              <span className="text-[13.5px] text-charcoal font-medium">Semana de {diaCurto(semana)}</span>
              <button onClick={() => { setSemana(somarDias(semana, 7)); setDia(somarDias(dia, 7)) }} aria-label="Próxima semana" className="w-7 h-7 rounded-full hover:bg-black/[0.05] flex items-center justify-center text-muted"><ChevronRight size={16} /></button>
              {semana !== inicioDaSemana(hoje) && <button onClick={() => { setSemana(inicioDaSemana(hoje)); setDia(hoje) }} className="text-[12px] text-muted hover:text-charcoal ml-1">Hoje</button>}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-5">
              {dias.map((d) => {
                const t = temaDoDia(d)
                const r = roteiros[d]
                const planejados = r?.frames.length ?? 0
                const pub = doDia(d)
                const ativo = d === dia
                return (
                  <button key={d} onClick={() => setDia(d)}
                    className={`text-left rounded-xl p-3 min-h-[128px] border transition-colors ${ativo ? 'bg-white border-black/15 shadow-card' : 'bg-white/60 border-linha hover:bg-white'}`}>
                    <div className={`text-[11px] ${d === hoje ? 'text-charcoal font-semibold' : 'text-muted'}`}>{t.dia.slice(0, 3).toLowerCase()} {d.slice(8)}{d === hoje ? ' · hoje' : ''}</div>
                    <div className="text-[13.5px] text-charcoal font-medium mt-0.5 leading-tight">{t.tema}</div>
                    <div className="text-[11.5px] text-muted mt-2">{planejados ? `${planejados} no roteiro` : 'sem roteiro'}</div>
                    {pub.length > 0 && <div className="text-[11.5px] text-olive font-medium">{pub.length} {pub.length === 1 ? 'publicado' : 'publicados'}</div>}
                    {pub.length > 0 && (
                      <div className="flex gap-0.5 mt-1.5">
                        {pub.slice(0, 5).map((p) => <div key={p.id} className="w-4 h-7 rounded-[3px] bg-black/[0.06] overflow-hidden">{p.url && <img src={p.url} alt="" className="w-full h-full object-cover" />}</div>)}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-[1fr_420px] gap-5 items-start">
              {/* Roteiro */}
              <section className={`${cartao} p-5`}>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[12px] text-muted">{tema.dia} · {diaCurto(dia)}</div>
                    <div className="text-[19px] text-charcoal font-medium tracking-tight">{tema.tema}</div>
                    <div className="text-[13px] text-muted">{tema.objetivo}</div>
                  </div>
                  {(() => {
                    const n = roteiro.frames.length
                    const ok = n >= FREQUENCIA.minimo && n <= FREQUENCIA.maximo
                    return <span className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${ok ? 'bg-olive/[0.12] text-olive' : 'bg-black/[0.05] text-muted'}`}>{n} de {FREQUENCIA.minimo} a {FREQUENCIA.maximo}</span>
                  })()}
                </div>

                <div className="mt-4 space-y-1">
                  {roteiro.frames.map((f, i) => (
                    <div key={f.id} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-black/[0.025]">
                      <button onClick={() => mudarFrames(roteiro.frames.map((x) => (x.id === f.id ? { ...x, feito: !x.feito } : x)))} aria-label="Marcar como postado"
                        className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${f.feito ? 'bg-olive border-olive text-white' : 'border-black/20 hover:border-olive'}`}>
                        {f.feito && <Check size={11} strokeWidth={3} />}
                      </button>
                      <span className="text-[11.5px] text-muted tabular-nums w-5">{i + 1}</span>
                      <input defaultValue={f.texto} key={f.texto}
                        onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== f.texto) mudarFrames(roteiro.frames.map((x) => (x.id === f.id ? { ...x, texto: v } : x))) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                        className={`flex-1 bg-transparent text-[13.5px] outline-none rounded px-1 focus:bg-black/[0.03] ${f.feito ? 'text-muted line-through' : 'text-charcoal'}`} />
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => mover(i, -1)} aria-label="Subir" className="w-6 h-6 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted"><ChevronUp size={13} /></button>
                        <button onClick={() => mover(i, 1)} aria-label="Descer" className="w-6 h-6 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted"><ChevronDown size={13} /></button>
                        <button onClick={() => mudarFrames(roteiro.frames.filter((x) => x.id !== f.id))} aria-label="Tirar" className="w-6 h-6 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                  {roteiro.frames.length === 0 && <p className="text-[13px] text-muted px-2 py-2">Monte a sequência tocando nas ideias ao lado, ou escreva abaixo.</p>}
                </div>
                <div className="flex items-center gap-2 mt-2 px-2">
                  <Plus size={14} className="text-muted" />
                  <input value={novo} onChange={(e) => setNovo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { adicionar(novo); setNovo('') } }}
                    placeholder="Um story e Enter" className="flex-1 bg-transparent text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 py-1" />
                </div>

                <textarea defaultValue={roteiro.notas ?? ''} key={dia + (roteiro.notas ?? '')}
                  onBlur={(e) => { const v = e.target.value.trim() || null; if (v !== roteiro.notas) gravar({ ...roteiro, notas: v }) }}
                  placeholder="Notas do dia: onde gravar, música, o link do fechamento…"
                  className="mt-4 w-full min-h-[64px] rounded-[10px] border border-black/[0.10] bg-white px-3 py-2 text-[13px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15 resize-y" />

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-linha">
                  {SEQUENCIA.map((s, i) => (
                    <div key={s.nome}>
                      <div className="text-[12px] text-charcoal font-medium"><span className="text-muted mr-1">{i + 1}</span>{s.nome}</div>
                      <p className="text-[12px] text-muted leading-snug mt-0.5">{s.texto}</p>
                    </div>
                  ))}
                </div>

                {doDia(dia).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-linha">
                    <div className="text-[12px] text-muted mb-2">Publicados neste dia</div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {doDia(dia).map((p) => (
                        <a key={p.id} href={p.permalink ?? '#'} target="_blank" rel="noreferrer" className="shrink-0 w-[72px]">
                          <div className="w-[72px] h-[128px] rounded-lg bg-black/[0.05] overflow-hidden">{p.url && <img src={p.url} alt="" className="w-full h-full object-cover" />}</div>
                          <div className="text-[10.5px] text-muted mt-1 tabular-nums">{partesBR(p.publicado_em).hora} · {p.alcance ?? '—'}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* O tema do dia */}
              <section className={`${cartao} p-5`}>
                <div className="text-[14px] font-medium text-charcoal mb-4">Para {tema.tema.toLowerCase()}</div>
                <DetalheTema t={tema} onEscolher={(x) => adicionar(x.replace(/^“|”$/g, ''))} />
              </section>
            </div>
          </>
        )}

        {aba === 'estrategia' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {SEMANA_STORIES.map((t) => (
                <section key={t.dow} className={`${cartao} p-5`}>
                  <div className="text-[12px] text-muted">{t.dia}</div>
                  <div className="text-[17px] text-charcoal font-medium tracking-tight">{t.tema}</div>
                  <div className="text-[13px] text-muted mb-4">{t.objetivo}</div>
                  <DetalheTema t={t} />
                </section>
              ))}
              <section className={`${cartao} p-5 space-y-4`}>
                <div className="text-[17px] text-charcoal font-medium tracking-tight">Regras gerais</div>
                <div className="text-[13px] text-charcoal/85">Frequência: {FREQUENCIA.minimo} a {FREQUENCIA.maximo} stories por dia.</div>
                <Chips titulo="Visual" itens={REGRAS.visual} />
                <Chips titulo="Sensação do perfil" itens={REGRAS.sensacao} />
                <Chips titulo="Evitar" itens={REGRAS.evitar} tom="evitar" />
                <Chips titulo="O que constrói percepção de luxo" itens={REGRAS.luxo} />
              </section>
            </div>
          </div>
        )}

        {aba === 'publicados' && (
          <div className="space-y-5">
            <section className={`${cartao} p-5`}>
              <div className="text-[14px] font-medium text-charcoal">Alcance médio por tema</div>
              <p className="text-[12px] text-muted mb-4">Stories dos últimos 60 dias, pelo dia da semana em que saíram. A rotina guarda os stories uma vez por dia, enquanto ainda estão no ar.</p>
              <div className="space-y-2">
                {porTema.map(({ t, n, dias: d, alcance }) => (
                  <div key={t.dow} className="grid grid-cols-[150px_1fr_150px] items-center gap-3 text-[13px]">
                    <span className="text-charcoal">{t.dia.slice(0, 3)} · {t.tema}</span>
                    <div className="h-2.5 rounded-full bg-black/[0.04] overflow-hidden">
                      {alcance != null && <div className="h-full rounded-full bg-olive" style={{ width: `${(alcance / maxAlcance) * 100}%` }} />}
                    </div>
                    <span className="text-muted tabular-nums text-[12px]">{alcance == null ? 'sem dados ainda' : `${alcance} · ${n} stories em ${d} ${d === 1 ? 'dia' : 'dias'}`}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cartao} overflow-hidden`}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[11px] text-muted border-b border-linha">
                    <th className="font-medium px-5 py-2">Story</th>
                    <th className="font-medium py-2">Tema do dia</th>
                    {['Alcance', 'Respostas', 'Compart.', 'Avançou', 'Saiu'].map((c) => <th key={c} className="font-medium py-2 pr-5 text-right">{c}</th>)}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {[...publicados].reverse().map((p) => (
                    <tr key={p.id} className="border-b border-linha last:border-0 hover:bg-black/[0.02]">
                      <td className="px-5 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-14 rounded-md bg-black/[0.05] overflow-hidden shrink-0">{p.url && <img src={p.url} alt="" className="w-full h-full object-cover" />}</div>
                          <span className="text-charcoal tabular-nums">{diaCurto(diaDe(p))} · {partesBR(p.publicado_em).hora}</span>
                        </div>
                      </td>
                      <td className="py-2 text-charcoal/80">{temaDoDia(diaDe(p)).tema}</td>
                      {[p.alcance, p.respostas, p.compartilhamentos, p.avancos, p.saidas].map((v, i) => <td key={i} className="py-2 pr-5 text-right tabular-nums text-charcoal">{v ?? '—'}</td>)}
                      <td className="pr-4">{p.permalink && <a href={p.permalink} target="_blank" rel="noreferrer" className="text-muted hover:text-charcoal"><ExternalLink size={13} /></a>}</td>
                    </tr>
                  ))}
                  {publicados.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-muted">Nenhum story guardado ainda. A rotina diária passa a guardar a partir de hoje.</td></tr>}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, ExternalLink, Star, Bell, Pencil, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { hojeISO, diaCurto } from '@/lib/datas'
import { registrarAtividade } from '@/lib/atividades'
import { proximoMarco, estaProximo, dataDeOrdem, emQuantosDias, type Evento, type TipoEvento } from '@/lib/eventos'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-2.5 py-1.5 text-[13px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const nomeMes = (iso: string) => `${MESES[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`
const comAno = (iso: string) => `${diaCurto(iso)} ${iso.slice(0, 4)}`

type Rascunho = Omit<Evento, 'id' | 'origem' | 'vou'>
const vazio = (tipo: TipoEvento): Rascunho => ({ tipo, nome: '', descricao: null, local: null, abrangencia: 'internacional', inicio: null, fim: null, inscricao_ate: null, confirmado: true, site: null, notas: null })

/** Formulário de evento: serve para acrescentar e para corrigir. */
function Formulario({ inicial, onSalvar, onCancelar }: { inicial: Rascunho; onSalvar: (r: Rascunho) => void; onCancelar: () => void }) {
  const [r, setR] = useState<Rascunho>(inicial)
  const texto = (k: keyof Rascunho) => ({ value: (r[k] as string | null) ?? '', onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setR({ ...r, [k]: e.target.value || null }) })
  const premio = r.tipo === 'premio'
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <input className={campo} placeholder={premio ? 'Nome do prêmio' : 'Nome da feira'} value={r.nome} onChange={(e) => setR({ ...r, nome: e.target.value })} autoFocus />
        <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-[12px] self-center">
          {(['feira', 'premio'] as const).map((t) => <button key={t} onClick={() => setR({ ...r, tipo: t })} className={`px-2.5 py-1 rounded-full ${r.tipo === t ? 'bg-white shadow-sm text-charcoal' : 'text-muted'}`}>{t === 'feira' ? 'Feira' : 'Prêmio'}</button>)}
        </div>
        <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-[12px] self-center">
          {(['nacional', 'internacional'] as const).map((t) => <button key={t} onClick={() => setR({ ...r, abrangencia: t })} className={`px-2.5 py-1 rounded-full ${r.abrangencia === t ? 'bg-white shadow-sm text-charcoal' : 'text-muted'}`}>{t === 'nacional' ? 'Nacional' : 'Internacional'}</button>)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-[11.5px] text-muted">{premio ? 'Resultado ou cerimônia' : 'Começa'}<input type="date" className={campo} {...texto('inicio')} /></label>
        {premio
          ? <label className="text-[11.5px] text-muted">Inscrições até<input type="date" className={campo} {...texto('inscricao_ate')} /></label>
          : <label className="text-[11.5px] text-muted">Termina<input type="date" className={campo} {...texto('fim')} /></label>}
        <label className="text-[11.5px] text-muted">Local<input className={campo} placeholder="Cidade, país" {...texto('local')} /></label>
      </div>
      <input className={campo} placeholder="Site" {...texto('site')} />
      <textarea className={`${campo} min-h-[52px] resize-y`} placeholder="Notas: por que ir, com quem, o que levar…" {...texto('notas')} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-[12.5px] text-charcoal/80"><input type="checkbox" checked={!r.confirmado} onChange={(e) => setR({ ...r, confirmado: !e.target.checked })} /> Data ainda não confirmada</label>
        <div className="flex-1" />
        <button onClick={onCancelar} className="px-3 py-1.5 rounded-full text-[12.5px] text-muted hover:text-charcoal">Cancelar</button>
        <button onClick={() => r.nome.trim() && onSalvar({ ...r, nome: r.nome.trim() })} className="px-4 py-1.5 rounded-full bg-charcoal text-white text-[12.5px] hover:bg-black">Salvar</button>
      </div>
    </div>
  )
}

function Linha({ e, hoje, onVou, onEditar, onApagar }: { e: Evento; hoje: string; onVou: () => void; onEditar: () => void; onApagar: () => void }) {
  const marco = proximoMarco(e, hoje)
  const perto = estaProximo(e, hoje)
  const ref = e.inicio ?? e.inscricao_ate
  return (
    <div className="group flex gap-4 px-5 py-4 hover:bg-black/[0.015]">
      <div className="w-[64px] shrink-0 text-center pt-0.5">
        {ref ? (
          <>
            <div className="text-[22px] leading-none text-charcoal tabular-nums font-medium">{ref.slice(8)}</div>
            <div className="text-[11.5px] text-muted mt-0.5">{MESES[Number(ref.slice(5, 7)) - 1].slice(0, 3)}</div>
          </>
        ) : <div className="text-[11.5px] text-muted">sem data</div>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14.5px] font-medium text-charcoal">{e.nome}</span>
          {e.vou && <span className="px-2 py-px rounded-full bg-olive/[0.12] text-olive text-[11px] font-medium">{e.tipo === 'feira' ? 'vou' : 'vou me inscrever'}</span>}
          {perto && (
            <span className="px-2 py-px rounded-full bg-[#8C6B3F]/[0.12] text-[#6E5432] text-[11px] font-medium flex items-center gap-1">
              <Bell size={10} /> {perto.acontecendo ? 'acontecendo agora' : `${perto.rotulo} ${diaCurto(perto.data)} · ${emQuantosDias(perto.dias)}`}
            </span>
          )}
          {!e.confirmado && <span className="px-2 py-px rounded-full bg-black/[0.05] text-muted text-[11px]">data prevista</span>}
        </div>
        <div className="text-[12.5px] text-muted mt-0.5">
          {[
            e.tipo === 'feira' && e.inicio ? (e.fim && e.fim !== e.inicio ? `${diaCurto(e.inicio)} a ${comAno(e.fim)}` : comAno(e.inicio)) : null,
            e.tipo === 'premio' && e.inscricao_ate ? `inscrições até ${comAno(e.inscricao_ate)}` : null,
            e.tipo === 'premio' && e.inicio ? `resultado ${comAno(e.inicio)}` : null,
            e.local,
            e.abrangencia === 'nacional' ? 'Brasil' : null,
          ].filter(Boolean).join(' · ')}
        </div>
        {e.descricao && <p className="text-[13px] text-charcoal/75 mt-1.5 leading-relaxed">{e.descricao}</p>}
        {e.notas && <p className="text-[12.5px] text-charcoal/60 mt-1 italic">{e.notas}</p>}
        {!marco && <p className="text-[11.5px] text-muted mt-1">Já passou. Atualize a data quando sair a próxima edição.</p>}
      </div>
      <div className="flex items-start gap-0.5 shrink-0">
        <button onClick={onVou} aria-label="Quero ir" title={e.tipo === 'feira' ? 'Quero ir' : 'Quero me inscrever'}
          className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/[0.05] ${e.vou ? 'text-olive' : 'text-muted/60'}`}><Star size={15} fill={e.vou ? 'currentColor' : 'none'} /></button>
        {e.site && <a href={e.site} target="_blank" rel="noreferrer" aria-label="Site" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/[0.05] text-muted"><ExternalLink size={14} /></a>}
        <button onClick={onEditar} aria-label="Corrigir" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/[0.05] text-muted opacity-0 group-hover:opacity-100"><Pencil size={13} /></button>
        <button onClick={onApagar} aria-label="Tirar do calendário" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/[0.05] text-muted opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
      </div>
    </div>
  )
}

export default function CalendarioPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const hoje = hojeISO()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [tipo, setTipo] = useState<TipoEvento>('feira')
  const [onde, setOnde] = useState<'todas' | 'nacional' | 'internacional'>('todas')
  const [soVou, setSoVou] = useState(false)
  const [novo, setNovo] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [verPassados, setVerPassados] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase.from('eventos').select('*')
    if (error) setErro(error.message)
    else setEventos((data ?? []) as Evento[])
  }, [supabase])
  useEffect(() => { carregar() }, [carregar])

  async function criar(r: Rascunho) {
    const { data, error } = await supabase.from('eventos').insert({ ...r, origem: 'manual' }).select('*').single()
    if (error) return setErro(error.message)
    setEventos((l) => [...l, data as Evento])
    setNovo(false)
    setTipo(r.tipo)
    await registrarAtividade(supabase, 'criou', 'evento', data.id, { nome: r.nome })
  }
  async function salvar(e: Evento, d: Partial<Evento>) {
    setEventos((l) => l.map((x) => (x.id === e.id ? { ...x, ...d } : x)))
    const { error } = await supabase.from('eventos').update(d).eq('id', e.id)
    if (error) { setErro(error.message); carregar() }
  }
  async function apagar(e: Evento) {
    if (!confirm(`Tirar "${e.nome}" do calendário?`)) return
    setEventos((l) => l.filter((x) => x.id !== e.id))
    const { error } = await supabase.from('eventos').delete().eq('id', e.id)
    if (error) { setErro(error.message); carregar() }
  }

  const doTipo = eventos.filter((e) => e.tipo === tipo && (onde === 'todas' || e.abrangencia === onde) && (!soVou || e.vou))
  const futuros = doTipo.filter((e) => proximoMarco(e, hoje)).sort((a, b) => (dataDeOrdem(a, hoje) < dataDeOrdem(b, hoje) ? -1 : 1))
  const comData = futuros.filter((e) => e.inicio || e.inscricao_ate)
  const semData = doTipo.filter((e) => !e.inicio && !e.inscricao_ate)
  const passados = doTipo.filter((e) => (e.inicio || e.inscricao_ate) && !proximoMarco(e, hoje))
  const proximos = eventos.map((e) => ({ e, m: estaProximo(e, hoje) })).filter((x) => x.m).sort((a, b) => a.m!.dias - b.m!.dias)

  // Agrupa por mês do próximo marco.
  const meses: [string, Evento[]][] = []
  for (const e of comData) {
    const m = dataDeOrdem(e, hoje).slice(0, 7)
    const ultimo = meses[meses.length - 1]
    if (ultimo && ultimo[0] === m) ultimo[1].push(e)
    else meses.push([m, [e]])
  }

  const lista = (l: Evento[]) => (
    <div className={`${cartao} divide-y divide-linha overflow-hidden`}>
      {l.map((e) => editando === e.id ? (
        <div key={e.id} className="p-5 bg-black/[0.015]">
          <Formulario inicial={e} onCancelar={() => setEditando(null)} onSalvar={(r) => { salvar(e, r); setEditando(null) }} />
        </div>
      ) : (
        <Linha key={e.id} e={e} hoje={hoje} onVou={() => salvar(e, { vou: !e.vou })} onEditar={() => setEditando(e.id)} onApagar={() => apagar(e)} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1100px]">
        <div className="flex items-end justify-between">
          <Header title="Calendário" subtitle="As grandes feiras e os prêmios de arquitetura, interiores e design." />
          <button onClick={() => { setNovo(true); setEditando(null) }} className="mb-8 flex items-center gap-1.5 px-4 py-2 rounded-full bg-charcoal text-white text-[13px] hover:bg-black">
            <Plus size={14} /> Acrescentar
          </button>
        </div>

        {erro && <div className="mb-4 rounded-xl bg-[#8C6B3F]/10 px-4 py-3 text-[13px] text-charcoal flex justify-between">{erro}<button onClick={() => setErro(null)}><X size={14} /></button></div>}

        {proximos.length > 0 && (
          <section className="mb-6 rounded-2xl bg-[#1D1D1F] p-5">
            <div className="flex items-center gap-2 text-[12px] text-white/60 mb-3"><Bell size={13} /> Está chegando</div>
            <div className="grid grid-cols-3 gap-3">
              {proximos.slice(0, 6).map(({ e, m }) => (
                <button key={e.id} onClick={() => setTipo(e.tipo)} className="text-left rounded-xl bg-white/[0.06] hover:bg-white/[0.1] px-4 py-3">
                  <div className="text-[11.5px] text-white/50">{e.tipo === 'feira' ? 'Feira' : 'Prêmio'}{e.vou ? ' · você marcou' : ''}</div>
                  <div className="text-[14px] text-white font-medium leading-snug mt-0.5">{e.nome}</div>
                  <div className="text-[12.5px] text-[#D9C9A8] mt-1">{m!.acontecendo ? 'acontecendo agora' : `${m!.rotulo} ${diaCurto(m!.data)} · ${emQuantosDias(m!.dias)}`}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-[13px]">
            {(['feira', 'premio'] as const).map((t) => (
              <button key={t} onClick={() => setTipo(t)} className={`px-4 py-1.5 rounded-full ${tipo === t ? 'bg-white shadow-sm text-charcoal font-medium' : 'text-muted'}`}>
                {t === 'feira' ? 'Feiras' : 'Prêmios'} <span className="text-muted font-normal">{eventos.filter((e) => e.tipo === t).length}</span>
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-[12.5px]">
            {([['todas', 'Todas'], ['nacional', 'Brasil'], ['internacional', 'Mundo']] as const).map(([k, n]) => (
              <button key={k} onClick={() => setOnde(k)} className={`px-3 py-1 rounded-full ${onde === k ? 'bg-white shadow-sm text-charcoal' : 'text-muted'}`}>{n}</button>
            ))}
          </div>
          <button onClick={() => setSoVou(!soVou)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] ${soVou ? 'bg-olive/[0.12] text-olive' : 'text-muted hover:text-charcoal'}`}>
            <Star size={12} fill={soVou ? 'currentColor' : 'none'} /> Só as marcadas
          </button>
        </div>

        {novo && (
          <section className={`${cartao} p-5 mb-5`}>
            <div className="text-[14px] font-medium text-charcoal mb-3">Acrescentar ao calendário</div>
            <Formulario inicial={vazio(tipo)} onCancelar={() => setNovo(false)} onSalvar={criar} />
          </section>
        )}

        <div className="space-y-6">
          {meses.map(([m, l]) => (
            <section key={m}>
              <div className="text-[13px] font-medium text-charcoal mb-2 first-letter:uppercase">{nomeMes(m + '-01')}</div>
              {lista(l)}
            </section>
          ))}
          {semData.length > 0 && (
            <section>
              <div className="text-[13px] font-medium text-charcoal mb-2">Sem data definida</div>
              {lista(semData)}
            </section>
          )}
          {meses.length === 0 && semData.length === 0 && <p className="text-[13px] text-muted py-10 text-center">Nada aqui com esses filtros.</p>}
          {passados.length > 0 && (
            <section>
              <button onClick={() => setVerPassados(!verPassados)} className="text-[12.5px] text-muted hover:text-charcoal">{verPassados ? 'Esconder' : 'Ver'} os que já passaram ({passados.length})</button>
              {verPassados && <div className="mt-2">{lista(passados)}</div>}
            </section>
          )}
        </div>
        <p className="text-[12px] text-muted mt-8">“Data prevista” quer dizer que o organizador ainda não confirmou: a data segue o padrão dos anos anteriores. O aviso aparece {45} dias antes de uma feira e 30 dias antes do fim das inscrições, também no Dashboard.</p>
      </main>
    </div>
  )
}

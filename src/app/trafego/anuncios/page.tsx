'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Plus, X, Search, Check } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { cartao } from '@/components/performance/ui'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { listarPosts } from '@/lib/posts/dados'
import { registrarAtividade } from '@/lib/atividades'
import { hojeISO, instanteDeBR, somarDias, dataBR } from '@/lib/datas'
import type { Post } from '@/lib/posts/tipos'
import { CHAMADAS, OBJETIVOS, STATUS_ANUNCIO, gastoMaximo, reais, type Anuncio, type Config, type Objetivo, type Publico, type StatusAnuncio } from '@/lib/trafego/tipos'

const COLUNAS: { id: string; nome: string; status: StatusAnuncio[] }[] = [
  { id: 'montando', nome: 'Montando', status: ['rascunho', 'ajuste'] },
  { id: 'aprovacao', nome: 'Esperando você', status: ['aprovacao'] },
  { id: 'aprovado', nome: 'Aprovados', status: ['aprovado', 'erro'] },
  { id: 'meta', nome: 'Na Meta', status: ['publicado'] },
]

const vazio = (): Partial<Anuncio> => ({
  nome: '', objetivo: 'alcance', orcamento_diario: 20, inicio: somarDias(hojeISO(), 1), fim: somarDias(hojeISO(), 7),
  publico: { idade_min: 25, idade_max: 60, generos: [], paises: ['BR'], cidades: [], interesses: [] }, chamada: 'LEARN_MORE', status: 'rascunho',
})

const campo = 'w-full px-3 py-2 rounded-lg border border-linha bg-white text-[13.5px] text-charcoal focus:outline-none focus:border-olive'
const rotulo = 'block text-[12px] text-muted mb-1'
const botao = (tom: 'escuro' | 'claro' | 'oliva') =>
  `px-4 py-[7px] rounded-full text-[13px] font-medium transition-colors disabled:opacity-40 ${tom === 'escuro' ? 'text-white bg-charcoal hover:bg-black' : tom === 'oliva' ? 'text-white bg-olive hover:bg-[#5a5e41]' : 'text-charcoal bg-black/[0.05] hover:bg-black/[0.09]'}`

/** Autocompletar de cidades/interesses direto da Meta. */
function BuscaMeta({ tipo, escolhidos, aoMudar }: { tipo: 'cidade' | 'interesse'; escolhidos: { id: string; nome: string }[]; aoMudar: (v: { id: string; nome: string }[]) => void }) {
  const [q, setQ] = useState('')
  const [itens, setItens] = useState<{ id: string; nome: string; tamanho?: number }[]>([])
  useEffect(() => {
    if (q.trim().length < 2) { setItens([]); return }
    const t = setTimeout(() => fetch(`/api/trafego/busca?tipo=${tipo}&q=${encodeURIComponent(q)}`).then((r) => r.json()).then((j) => setItens(j.itens ?? [])), 350)
    return () => clearTimeout(t)
  }, [q, tipo])
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {escolhidos.map((e) => (
          <span key={e.id} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-olive/12 text-[12px] text-charcoal">
            {e.nome}<button onClick={() => aoMudar(escolhidos.filter((x) => x.id !== e.id))}><X size={12} className="text-muted" /></button>
          </span>
        ))}
      </div>
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tipo === 'cidade' ? 'Buscar cidade' : 'Buscar interesse (design de interiores, arquitetura…)'} className={`${campo} pl-8`} />
        {itens.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-lg border border-linha shadow-flutuante max-h-56 overflow-auto">
            {itens.map((i) => (
              <button key={i.id} onClick={() => { if (!escolhidos.some((x) => x.id === i.id)) aoMudar([...escolhidos, { id: i.id, nome: i.nome }]); setQ('') }}
                className="w-full text-left px-3 py-2 text-[13px] hover:bg-cream flex justify-between gap-3">
                <span>{i.nome}</span>{i.tamanho ? <span className="text-muted text-[11.5px]">até {(i.tamanho / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi</span> : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Editor({ inicial, posts, config, aoFechar, aoSalvar }: {
  inicial: Partial<Anuncio>; posts: Post[]; config: Config | null; aoFechar: () => void; aoSalvar: (a: Partial<Anuncio>, proximo?: StatusAnuncio, nota?: string) => Promise<void>
}) {
  const [a, setA] = useState<Partial<Anuncio>>(inicial)
  const [ocupado, setOcupado] = useState(false)
  const [nota, setNota] = useState('')
  const pub = a.publico as Publico
  const setPub = (p: Partial<Publico>) => setA({ ...a, publico: { ...pub, ...p } })
  const travado = a.status === 'publicado'
  const gasto = gastoMaximo({ orcamento_diario: Number(a.orcamento_diario ?? 0), inicio: a.inicio ?? null, fim: a.fim ?? null })
  const acimaTeto = config?.teto_diario != null && Number(a.orcamento_diario) > config.teto_diario
  const post = posts.find((p) => p.id === a.post_id)
  const pronto = !!(a.nome && a.post_id && a.orcamento_diario && (a.objetivo !== 'trafego' || a.link)) && !acimaTeto

  const salvar = async (proximo?: StatusAnuncio, n?: string) => {
    setOcupado(true)
    try { await aoSalvar(a, proximo, n) } finally { setOcupado(false) }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20 animate-surgir" onClick={aoFechar}>
      <div className="w-[620px] h-full bg-cream overflow-y-auto animate-entrar shadow-flutuante" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur px-7 py-4 border-b border-linha flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[17px] font-medium text-charcoal">{inicial.id ? a.nome || 'Anúncio' : 'Novo anúncio'}</div>
            <div className="text-[12px] text-muted">{STATUS_ANUNCIO[(a.status ?? 'rascunho') as StatusAnuncio]}</div>
          </div>
          <button onClick={aoFechar} className="w-8 h-8 rounded-full hover:bg-black/[0.06] flex items-center justify-center"><X size={16} /></button>
        </div>

        <fieldset disabled={travado} className="px-7 py-6 space-y-6">
          {a.status === 'ajuste' && a.nota_aprovacao && <div className="rounded-xl bg-gold/15 px-4 py-3 text-[13px]"><b className="font-medium">Ajuste pedido:</b> {a.nota_aprovacao}</div>}
          {a.status === 'erro' && a.erro && <div className="rounded-xl bg-gold/15 px-4 py-3 text-[13px]"><b className="font-medium">A Meta recusou:</b> {a.erro}</div>}

          <div><label className={rotulo}>Nome</label><input className={campo} value={a.nome ?? ''} onChange={(e) => setA({ ...a, nome: e.target.value })} placeholder="Casa 23 · alcance São Paulo" /></div>

          <div>
            <label className={rotulo}>Objetivo</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(OBJETIVOS) as Objetivo[]).map((o) => (
                <button key={o} type="button" onClick={() => setA({ ...a, objetivo: o })}
                  className={`${cartao} p-3 text-left ${a.objetivo === o ? 'ring-2 ring-olive' : ''}`}>
                  <div className="text-[13px] font-medium text-charcoal">{OBJETIVOS[o].nome}</div>
                  <div className="text-[11.5px] text-muted leading-snug mt-0.5">{OBJETIVOS[o].explica}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={rotulo}>Post do Instagram</label>
            <div className="grid grid-cols-6 gap-1.5 max-h-[260px] overflow-y-auto pr-1">
              {posts.map((p) => {
                const capa = p.midias[0]
                return (
                  <button key={p.id} type="button" onClick={() => setA({ ...a, post_id: p.id, ig_media_id: p.ig_media_id })}
                    className={`relative aspect-[4/5] rounded-md overflow-hidden bg-white ${a.post_id === p.id ? 'ring-2 ring-olive ring-offset-1' : ''}`} title={p.legenda ?? ''}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {capa?.url && (capa.tipo === 'video' ? <video src={capa.url} className="w-full h-full object-cover" muted /> : <img src={capa.url} alt="" className="w-full h-full object-cover" />)}
                    {a.post_id === p.id && <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-olive text-white flex items-center justify-center"><Check size={12} /></span>}
                  </button>
                )
              })}
            </div>
            {post && <p className="text-[12px] text-muted mt-2 line-clamp-2">{dataBR(post.data_hora!)} · {post.legenda}</p>}
          </div>

          {a.objetivo === 'trafego' && (
            <div className="space-y-3">
              <div><label className={rotulo}>Link</label><input className={campo} value={a.link ?? ''} onChange={(e) => setA({ ...a, link: e.target.value })} placeholder="https://nicollenogueira.com.br" /></div>
              <div><label className={rotulo}>Texto do anúncio</label><textarea className={`${campo} h-24`} value={a.texto ?? ''} onChange={(e) => setA({ ...a, texto: e.target.value })} /></div>
              <div><label className={rotulo}>Botão</label>
                <select className={campo} value={a.chamada ?? 'LEARN_MORE'} onChange={(e) => setA({ ...a, chamada: e.target.value })}>
                  {Object.entries(CHAMADAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className={`${cartao} p-4 space-y-4`}>
            <div className="text-[13px] font-medium text-charcoal">Público</div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={rotulo}>Idade mínima</label><input type="number" min={18} max={65} className={campo} value={pub.idade_min ?? 18} onChange={(e) => setPub({ idade_min: Number(e.target.value) })} /></div>
              <div><label className={rotulo}>Idade máxima</label><input type="number" min={18} max={65} className={campo} value={pub.idade_max ?? 65} onChange={(e) => setPub({ idade_max: Number(e.target.value) })} /></div>
              <div><label className={rotulo}>Gênero</label>
                <select className={campo} value={pub.generos?.join(',') ?? ''} onChange={(e) => setPub({ generos: e.target.value ? e.target.value.split(',').map(Number) : [] })}>
                  <option value="">Todos</option><option value="2">Mulheres</option><option value="1">Homens</option>
                </select>
              </div>
            </div>
            <div><label className={rotulo}>Cidades (vazio = Brasil todo)</label><BuscaMeta tipo="cidade" escolhidos={pub.cidades ?? []} aoMudar={(v) => setPub({ cidades: v })} /></div>
            {!!pub.cidades?.length && <div className="w-40"><label className={rotulo}>Raio (km)</label><input type="number" min={1} max={80} className={campo} value={pub.raio ?? 25} onChange={(e) => setPub({ raio: Number(e.target.value) })} /></div>}
            <div><label className={rotulo}>Interesses</label><BuscaMeta tipo="interesse" escolhidos={pub.interesses ?? []} aoMudar={(v) => setPub({ interesses: v })} /></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div><label className={rotulo}>Orçamento por dia (R$)</label><input type="number" min={6} step="1" className={campo} value={a.orcamento_diario ?? ''} onChange={(e) => setA({ ...a, orcamento_diario: Number(e.target.value) })} /></div>
            <div><label className={rotulo}>Início</label><input type="date" className={campo} value={a.inicio ?? ''} onChange={(e) => setA({ ...a, inicio: e.target.value || null })} /></div>
            <div><label className={rotulo}>Fim</label><input type="date" className={campo} value={a.fim ?? ''} onChange={(e) => setA({ ...a, fim: e.target.value || null })} /></div>
          </div>
          <div className="text-[13px] text-charcoal">
            Gasto máximo: <b className="font-medium">{reais(gasto.valor)}</b> <span className="text-muted">({gasto.aberto ? 'sem data de fim, conta 30 dias' : `${gasto.dias} dias`})</span>
            {acimaTeto && <div className="mt-1 text-[#8C6B3F]">Acima do teto diário de {reais(config!.teto_diario)}. Diminua ou mude o teto em Configurar.</div>}
          </div>
        </fieldset>

        <div className="sticky bottom-0 bg-cream/95 backdrop-blur px-7 py-4 border-t border-linha space-y-3">
          {a.status === 'aprovacao' && (
            <textarea className={`${campo} h-16`} placeholder="Se for pedir ajuste, diga o quê" value={nota} onChange={(e) => setNota(e.target.value)} />
          )}
          <div className="flex flex-wrap items-center gap-2">
            {ocupado && <Loader2 size={15} className="animate-spin text-muted" />}
            {!travado && <button disabled={ocupado || !a.nome} onClick={() => salvar()} className={botao('claro')}>Salvar</button>}
            {(a.status === 'rascunho' || a.status === 'ajuste') && <button disabled={ocupado || !pronto} onClick={() => salvar('aprovacao')} className={botao('escuro')}>Mandar para aprovação</button>}
            {a.status === 'aprovacao' && <>
              <button disabled={ocupado || !pronto} onClick={() => salvar('aprovado')} className={botao('oliva')}>Aprovar</button>
              <button disabled={ocupado || !nota.trim()} onClick={() => salvar('ajuste', nota)} className={botao('claro')}>Pedir ajuste</button>
            </>}
            {(a.status === 'aprovado' || a.status === 'erro') && <button disabled={ocupado} onClick={() => salvar('publicado')} className={botao('escuro')}>Publicar na Meta (pausado)</button>}
            {(a.status === 'aprovado' || a.status === 'aprovacao') && <button disabled={ocupado} onClick={() => salvar('rascunho')} className={botao('claro')}>Voltar para rascunho</button>}
          </div>
          {!pronto && !travado && <p className="text-[11.5px] text-muted">Para mandar para aprovação: nome, post, orçamento{a.objetivo === 'trafego' ? ' e link' : ''}.</p>}
          {travado && <p className="text-[12px] text-muted">Já está na Meta. Ligue, pause e mude o orçamento em <Link href="/trafego" className="text-olive hover:underline">Visão geral</Link>.</p>}
        </div>
      </div>
    </div>
  )
}

export default function AnunciosPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [editando, setEditando] = useState<Partial<Anuncio> | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [ligando, setLigando] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const [{ data, error }, { data: cfg }] = await Promise.all([
      supabase.from('anuncios').select('*').neq('status', 'arquivado').order('atualizado_em', { ascending: false }),
      supabase.from('trafego_config').select('*').eq('id', 1).maybeSingle(),
    ])
    if (error) setErro(error.message)
    setAnuncios(((data ?? []) as Anuncio[]).map((a) => ({ ...a, orcamento_diario: Number(a.orcamento_diario) })))
    setConfig(cfg ? { ...cfg, teto_diario: cfg.teto_diario != null ? Number(cfg.teto_diario) : null, teto_mensal: cfg.teto_mensal != null ? Number(cfg.teto_mensal) : null } : null)
  }, [supabase])

  useEffect(() => {
    carregar()
    const hoje = hojeISO()
    listarPosts(supabase, { de: instanteDeBR(somarDias(hoje, -365), '00:00'), ate: instanteDeBR(somarDias(hoje, 1), '00:00') })
      .then((ps) => setPosts(ps.filter((p) => p.ig_media_id && p.midias.length).reverse()))
      .catch(() => setPosts([]))
  }, [carregar, supabase])

  const salvar = async (a: Partial<Anuncio>, proximo?: StatusAnuncio, nota?: string) => {
    const dados = {
      nome: a.nome, objetivo: a.objetivo, post_id: a.post_id ?? null, ig_media_id: a.ig_media_id ?? null, texto: a.texto ?? null, link: a.link ?? null,
      chamada: a.chamada ?? null, publico: a.publico, orcamento_diario: a.orcamento_diario, inicio: a.inicio || null, fim: a.fim || null,
    }
    let id = a.id
    if (id) {
      const { error } = await supabase.from('anuncios').update(dados).eq('id', id)
      if (error) return window.alert(error.message)
    } else {
      const { data, error } = await supabase.from('anuncios').insert(dados).select('id').single()
      if (error) return window.alert(error.message)
      id = data.id
      await registrarAtividade(supabase, 'criou', 'anuncio', id, { nome: a.nome })
    }
    if (proximo === 'publicado') {
      const r = await fetch('/api/trafego/publicar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).then((x) => x.json())
      if (!r.ok) window.alert(`A Meta recusou: ${r.motivo}`)
    } else if (proximo) {
      const { error } = await supabase.from('anuncios').update({ status: proximo, ...(nota !== undefined ? { nota_aprovacao: nota } : {}) }).eq('id', id)
      if (error) return window.alert(error.message)
      await registrarAtividade(supabase, 'mudou_status', 'anuncio', id, { de: a.status, para: proximo })
    }
    setEditando(null)
    carregar()
  }

  /** Liga campanha, conjunto e anúncio de uma vez, depois de confirmar o gasto. */
  const ligar = async (a: Anuncio) => {
    const g = gastoMaximo(a)
    if (!window.confirm(`Ligar "${a.nome}"?\n\nA Meta começa a cobrar até ${reais(a.orcamento_diario)} por dia (máximo ${reais(g.valor)}${g.aberto ? ' em 30 dias' : ` em ${g.dias} dias`}).`)) return
    setLigando(a.id)
    try {
      for (const id of [a.meta_anuncio_id, a.meta_conjunto_id, a.meta_campanha_id]) {
        const r = await fetch('/api/trafego/acao', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ acao: 'status', id, status: 'ACTIVE', nome: a.nome }) }).then((x) => x.json())
        if (!r.ok) throw new Error(r.motivo)
      }
      window.alert('Ligado. A Meta ainda revisa o anúncio antes de começar a veicular (costuma levar de minutos a algumas horas).')
    } catch (e) { window.alert((e as Error).message) } finally { setLigando(null) }
  }

  const arquivar = async (a: Anuncio) => {
    if (!window.confirm(`Arquivar "${a.nome}"? ${a.status === 'publicado' ? 'Ele continua na Meta; pause por lá se estiver ligado.' : ''}`)) return
    await supabase.from('anuncios').update({ status: 'arquivado' }).eq('id', a.id)
    await registrarAtividade(supabase, 'arquivou', 'anuncio', a.id, { nome: a.nome })
    carregar()
  }

  const capa = (a: Anuncio) => posts.find((p) => p.id === a.post_id)?.midias[0]

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Anúncios" subtitle="Monte, aprove e publique. Tudo vai para a Meta pausado; ligar é um clique à parte, com o gasto na tela." />
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditando(vazio())} className={`${botao('escuro')} flex items-center gap-1.5`}><Plus size={14} /> Novo anúncio</button>
          {config?.teto_diario != null && <span className="text-[12.5px] text-muted">Teto por anúncio: {reais(config.teto_diario)}/dia</span>}
        </div>
        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px]">Não foi possível carregar: {erro}</div>}

        <div className="grid grid-cols-4 gap-4 items-start pb-24">
          {COLUNAS.map((col) => {
            const lista = anuncios.filter((a) => col.status.includes(a.status))
            return (
              <div key={col.id}>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <span className="text-[13px] font-medium text-charcoal">{col.nome}</span>
                  <span className="text-[12px] text-muted tabular-nums">{lista.length}</span>
                </div>
                <div className="space-y-3">
                  {lista.map((a) => {
                    const m = capa(a)
                    return (
                      <div key={a.id} className={`${cartao} overflow-hidden`}>
                        <button onClick={() => setEditando(a)} className="w-full text-left">
                          <div className="flex gap-3 p-3">
                            <div className="w-14 aspect-[4/5] rounded-md bg-cream overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              {m?.url && (m.tipo === 'video' ? <video src={m.url} className="w-full h-full object-cover" muted /> : <img src={m.url} alt="" className="w-full h-full object-cover" />)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13px] text-charcoal font-medium truncate">{a.nome}</div>
                              <div className="text-[11.5px] text-muted">{OBJETIVOS[a.objetivo].nome} · {reais(a.orcamento_diario)}/dia</div>
                              <div className="text-[11.5px] text-muted">{a.inicio ? dataBR(a.inicio + 'T12:00:00Z').slice(0, 5) : 'sem início'}{a.fim ? ` a ${dataBR(a.fim + 'T12:00:00Z').slice(0, 5)}` : ''}</div>
                              <div className="text-[11.5px] mt-1">
                                <span className={a.status === 'erro' || a.status === 'ajuste' ? 'text-[#8C6B3F]' : 'text-muted'}>{STATUS_ANUNCIO[a.status]}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-2 px-3 pb-3">
                          {a.status === 'publicado' && (
                            <button disabled={ligando === a.id} onClick={() => ligar(a)} className={`${botao('oliva')} !py-1 !px-3 !text-[12px] flex items-center gap-1`}>
                              {ligando === a.id && <Loader2 size={12} className="animate-spin" />} Ligar
                            </button>
                          )}
                          <button onClick={() => arquivar(a)} className="text-[12px] text-muted hover:text-charcoal ml-auto">Arquivar</button>
                        </div>
                      </div>
                    )
                  })}
                  {lista.length === 0 && <div className="rounded-2xl border border-dashed border-linha py-8 text-center text-[12px] text-muted">vazio</div>}
                </div>
              </div>
            )
          })}
        </div>
      </main>
      {editando && <Editor key={editando.id ?? 'novo'} inicial={editando} posts={posts} config={config} aoFechar={() => setEditando(null)} aoSalvar={salvar} />}
    </div>
  )
}

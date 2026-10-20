'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Film, Layers, Image as ImageIcon, Circle, RefreshCw, CalendarPlus, X, Loader2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { dataBR } from '@/lib/datas'
import { criarPost } from '@/lib/posts/dados'
import { FORMATOS, type Formato } from '@/lib/posts/formatos'
import { CATEGORIAS, PILARES, TIPOS, type Tipo } from '@/lib/posts/tipos'
import { compacto } from '@/lib/performance/dados'

const iconeTipo = { feed: ImageIcon, carrossel: Layers, reels: Film, story: Circle }
const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

type Exemplo = {
  id: string
  tipo: Tipo
  titulo: string | null
  legenda: string | null
  permalink: string | null
  data_hora: string | null
  capa?: string
  alcance: number | null
  curtidas: number | null
  salvos: number | null
}

async function lerExemplos(supabase: ReturnType<typeof criarClienteNavegador>, ids: string[]): Promise<Exemplo[]> {
  if (ids.length === 0) return []
  const { data } = await supabase.from('posts').select('id, tipo, titulo, legenda, permalink, data_hora, midias:posts_midia(caminho, ordem)').in('id', ids)
  const posts = (data ?? []) as (Omit<Exemplo, 'capa' | 'alcance' | 'curtidas' | 'salvos'> & { midias: { caminho: string; ordem: number }[] })[]
  const capas = posts.map((p) => [...p.midias].sort((a, b) => a.ordem - b.ordem)[0]?.caminho).filter(Boolean) as string[]
  const links = new Map<string, string>()
  for (let i = 0; i < capas.length; i += 100) {
    const { data: l } = await supabase.storage.from('posts-midia').createSignedUrls(capas.slice(i, i + 100), 3600)
    ;(l ?? []).forEach((x) => { if (x.path && x.signedUrl) links.set(x.path, x.signedUrl) })
  }
  const metricas = new Map<string, { alcance: number | null; curtidas: number | null; salvos: number | null }>()
  for (let i = 0; i < ids.length; i += 150) {
    const { data: m } = await supabase.from('posts_metricas').select('post_id, alcance, curtidas, salvos').in('post_id', ids.slice(i, i + 150))
    ;(m ?? []).forEach((x) => {
      const a = metricas.get(x.post_id) ?? { alcance: null, curtidas: null, salvos: null }
      metricas.set(x.post_id, { alcance: Math.max(a.alcance ?? 0, x.alcance ?? 0) || a.alcance, curtidas: Math.max(a.curtidas ?? 0, x.curtidas ?? 0) || a.curtidas, salvos: Math.max(a.salvos ?? 0, x.salvos ?? 0) || a.salvos })
    })
  }
  return posts.map((p) => {
    const capa = [...p.midias].sort((a, b) => a.ordem - b.ordem)[0]?.caminho
    const m = metricas.get(p.id)
    return { ...p, capa: capa ? links.get(capa) : undefined, alcance: m?.alcance ?? null, curtidas: m?.curtidas ?? null, salvos: m?.salvos ?? null }
  })
}

/** Grade para escolher outro post do feed como exemplo do formato. */
function Escolher({ formato, onEscolher, onFechar }: { formato: Formato; onEscolher: (id: string) => void; onFechar: () => void }) {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [posts, setPosts] = useState<Exemplo[]>([])
  const [soTipo, setSoTipo] = useState(true)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setCarregando(true)
    let q = supabase.from('posts').select('id').eq('status', 'postado').order('data_hora', { ascending: false }).limit(180)
    if (soTipo) q = q.eq('tipo', formato.tipo)
    q.then(async ({ data }) => {
      const lista = await lerExemplos(supabase, (data ?? []).map((x) => x.id))
      setPosts(lista.sort((a, b) => ((b.data_hora ?? '') > (a.data_hora ?? '') ? 1 : -1)))
      setCarregando(false)
    })
  }, [supabase, soTipo, formato.tipo])

  return (
    <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[2px] flex items-center justify-center p-8 animate-surgir" onClick={onFechar}>
      <div className="bg-cream rounded-2xl shadow-flutuante w-full max-w-[980px] max-h-full flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-4 bg-white/70 border-b border-linha">
          <div className="flex-1">
            <div className="text-[12px] text-muted">Escolher o exemplo de</div>
            <div className="text-[17px] font-medium text-charcoal">{formato.nome}</div>
          </div>
          <button onClick={() => setSoTipo(!soTipo)} className={`px-3 py-1 rounded-full text-[12.5px] ${soTipo ? 'bg-charcoal text-white' : 'bg-black/[0.05] text-charcoal'}`}>
            {soTipo ? `Só ${TIPOS[formato.tipo].toLowerCase()}` : 'Todos os formatos'}
          </button>
          <button onClick={onFechar} aria-label="Fechar" className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.09] flex items-center justify-center text-muted"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto p-5">
          {carregando ? <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-muted" /></div> : (
            <div className="grid grid-cols-6 gap-2">
              {posts.map((p) => (
                <button key={p.id} onClick={() => onEscolher(p.id)} title={p.titulo ?? ''} className="group text-left">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.capa && <img src={p.capa} alt="" loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-[1.04]" />}
                  </div>
                  <div className="text-[11px] text-charcoal truncate mt-1">{p.titulo || 'Sem título'}</div>
                  <div className="text-[10.5px] text-muted tabular-nums">{p.alcance != null ? `${compacto(p.alcance)} alcance` : p.data_hora ? dataBR(p.data_hora) : ''}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EstrategiaPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const router = useRouter()
  const [escolhas, setEscolhas] = useState<Record<string, string | null>>({})
  const [exemplos, setExemplos] = useState<Map<string, Exemplo>>(new Map())
  const [trocando, setTrocando] = useState<Formato | null>(null)
  const [criando, setCriando] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const { data } = await supabase.from('estrategia_formatos').select('formato, post_id')
    const mapa = Object.fromEntries((data ?? []).map((x) => [x.formato, x.post_id]))
    setEscolhas(mapa)
    const lista = await lerExemplos(supabase, Object.values(mapa).filter(Boolean) as string[])
    setExemplos(new Map(lista.map((e) => [e.id, e])))
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  async function escolher(formato: Formato, postId: string) {
    setTrocando(null)
    await supabase.from('estrategia_formatos').upsert({ formato: formato.id, post_id: postId, atualizado_em: new Date().toISOString() })
    carregar()
  }

  async function planejar(f: Formato) {
    setCriando(f.id)
    try {
      await criarPost(supabase, {
        tipo: f.tipo, pilar: f.pilar, categoria: f.categoria, status: 'ideia',
        titulo: `${f.nome} · ideia`,
        briefing: [`Formato: ${f.nome} (${f.grupo})`, '', `Para que serve: ${f.paraQueServe}`, '', 'Como fazer:', ...f.comoFazer.map((c) => `— ${c}`), '', `Pelo manual: ${f.filtro}`].join('\n'),
      })
      router.push('/marketing')
    } finally {
      setCriando(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1300px]">
        <Header title="Estratégia de conteúdo" subtitle="Os formatos de post, para que cada um serve, e o seu melhor exemplo de cada" />

        <section className="rounded-2xl bg-[#1D1D1F] text-white p-7 mb-8 grid grid-cols-[1fr_1.3fr] gap-8">
          <div>
            <div className="text-[12px] text-white/50">Estratégia de redes sociais · Brutte, nov/2025</div>
            <h2 className="font-display text-[26px] tracking-tight leading-tight mt-1">Seis formatos desenhados. Todos já estão no seu feed.</h2>
            <p className="text-[13.5px] text-white/70 leading-relaxed mt-3">
              Cada formato tem uma função na economia da marca. Aqui eles aparecem com um post seu que cumpre a função, o que a agência orientou e como o manual de hoje lê aquele formato.
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-2">
            {FORMATOS.map((f) => (
              <a key={f.id} href={`#${f.id}`} className="px-3 py-1.5 rounded-full text-[12.5px] bg-white/10 hover:bg-white/20 transition-colors">
                <span className="text-white/50 mr-1.5">{f.grupo.split(' · ')[0]}</span>{f.nome}
              </a>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          {FORMATOS.map((f) => {
            const ex = escolhas[f.id] ? exemplos.get(escolhas[f.id]!) : undefined
            const Icone = iconeTipo[ex?.tipo ?? f.tipo]
            return (
              <section key={f.id} id={f.id} className={`${cartao} scroll-mt-6 overflow-hidden grid grid-cols-[300px_1fr]`}>
                <div className="bg-black/[0.03] p-4 flex flex-col">
                  <a href={ex?.permalink ?? '#'} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-card">
                    {ex?.capa
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={ex.capa} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      : <span className="absolute inset-0 flex items-center justify-center text-[12px] text-muted">{ex ? 'sem capa' : 'escolha um exemplo'}</span>}
                    <Icone size={16} className="absolute top-2.5 right-2.5 text-white drop-shadow" />
                  </a>
                  {ex && (
                    <div className="mt-3 text-[12px]">
                      <div className="text-charcoal font-medium line-clamp-2 leading-snug">{ex.titulo || ex.legenda?.slice(0, 80)}</div>
                      <div className="flex items-center gap-3 text-muted mt-1.5 tabular-nums">
                        {ex.alcance != null && <span><span className="text-charcoal font-medium">{compacto(ex.alcance)}</span> alcance</span>}
                        {ex.salvos != null && <span><span className="text-charcoal font-medium">{ex.salvos}</span> salvos</span>}
                        {ex.alcance == null && ex.curtidas != null && <span><span className="text-charcoal font-medium">{ex.curtidas}</span> curtidas</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {ex.data_hora && <span className="text-muted">{dataBR(ex.data_hora)}</span>}
                        {ex.permalink && <a href={ex.permalink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted hover:text-charcoal"><ExternalLink size={11} /> Instagram</a>}
                      </div>
                    </div>
                  )}
                  <button onClick={() => setTrocando(f)} className="mt-auto pt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted hover:text-charcoal">
                    <RefreshCw size={12} /> {ex ? 'Trocar exemplo' : 'Escolher exemplo'}
                  </button>
                </div>

                <div className="p-6 flex flex-col">
                  <div className="text-[12px] text-muted">{f.grupo}</div>
                  <h3 className="font-display text-[26px] text-charcoal tracking-tight leading-tight">{f.nome}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11.5px] bg-black/[0.05] text-charcoal">{TIPOS[f.tipo]}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11.5px] bg-black/[0.05] text-charcoal">{PILARES[f.pilar]}</span>
                    {f.categoria && <span className="px-2.5 py-0.5 rounded-full text-[11.5px] bg-black/[0.05] text-charcoal">{CATEGORIAS[f.categoria]}</span>}
                  </div>

                  <div className="mt-5">
                    <div className="text-[11.5px] font-medium text-muted mb-1">Para que serve</div>
                    <p className="text-[16px] text-charcoal leading-relaxed">{f.paraQueServe}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-5">
                    <div>
                      <div className="text-[11.5px] font-medium text-muted mb-1.5">Como fazer</div>
                      <ul className="space-y-1">{f.comoFazer.map((c) => <li key={c} className="text-[13px] text-charcoal/85 flex gap-2"><span className="text-muted">—</span>{c}</li>)}</ul>
                    </div>
                    <div>
                      <div className="text-[11.5px] font-medium text-muted mb-1.5">Pelo manual da marca</div>
                      <p className="text-[13px] text-charcoal/85 leading-relaxed border-l-2 border-olive pl-3">{f.filtro}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 flex justify-end">
                    <button onClick={() => planejar(f)} disabled={criando !== null} className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09] disabled:opacity-40">
                      {criando === f.id ? <Loader2 size={14} className="animate-spin" /> : <CalendarPlus size={14} />} Guardar uma ideia neste formato
                    </button>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </main>

      {trocando && <Escolher formato={trocando} onEscolher={(id) => escolher(trocando, id)} onFechar={() => setTrocando(null)} />}
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Lightbulb, Archive } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Calendario, { diasVisiveis } from '@/components/posts/Calendario'
import GradeFeed from '@/components/posts/GradeFeed'
import CartaoPost from '@/components/posts/CartaoPost'
import EditorPost from '@/components/posts/EditorPost'
import { corPilar } from '@/components/posts/estilos'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { listarPosts, moverPost } from '@/lib/posts/dados'
import { PILARES, type Post } from '@/lib/posts/tipos'
import { hojeISO, instanteDeBR, partesBR, somarDias, mesExtenso, diaCurto } from '@/lib/datas'

type Visao = 'mes' | 'semana' | 'grade'

const VISOES: { id: Visao; nome: string }[] = [
  { id: 'mes', nome: 'Mês' },
  { id: 'semana', nome: 'Semana' },
  { id: 'grade', nome: 'Grade do feed' },
]

export default function MarketingPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [visao, setVisao] = useState<Visao>('mes')
  const [referencia, setReferencia] = useState(hojeISO())
  const [posts, setPosts] = useState<Post[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [arquivados, setArquivados] = useState(false)
  const [editor, setEditor] = useState<{ post: Post | null; data: string | null } | null>(null)

  const intervalo = useMemo(() => {
    if (visao === 'grade') {
      return { de: instanteDeBR(somarDias(referencia, -120), '00:00'), ate: instanteDeBR(somarDias(referencia, 120), '00:00') }
    }
    const dias = diasVisiveis(visao, referencia)
    return { de: instanteDeBR(dias[0], '00:00'), ate: instanteDeBR(somarDias(dias[dias.length - 1], 1), '00:00') }
  }, [visao, referencia])

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setPosts(await listarPosts(supabase, { ...intervalo, arquivados }))
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [supabase, intervalo, arquivados])

  useEffect(() => { carregar() }, [carregar])

  const ideias = posts.filter((p) => !p.data_hora)
  const comData = posts.filter((p) => p.data_hora)

  async function mover(id: string, dia: string) {
    const post = posts.find((p) => p.id === id)
    if (!post) return
    if (post.data_hora && partesBR(post.data_hora).data === dia) return
    const hora = post.data_hora ? partesBR(post.data_hora).hora : '12:00'
    await moverPost(supabase, id, instanteDeBR(dia, hora))
    carregar()
  }

  function navegar(direcao: -1 | 1) {
    if (visao === 'semana') return setReferencia(somarDias(referencia, 7 * direcao))
    const [a, m] = referencia.split('-').map(Number)
    setReferencia(new Date(Date.UTC(a, m - 1 + direcao, 1)).toISOString().slice(0, 10))
  }

  const semana = diasVisiveis('semana', referencia)
  const tituloPeriodo = visao === 'semana'
    ? `${diaCurto(semana[0])} – ${diaCurto(semana[6])}`
    : mesExtenso(referencia.slice(0, 7))

  // Contagem por pilar dos posts do mês mostrado (base para as metas da fase 2).
  const doMes = comData.filter((p) => partesBR(p.data_hora!).data.slice(0, 7) === referencia.slice(0, 7))
  const abrir = (post: Post) => setEditor({ post, data: null })

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 p-8">
        <Header title="Marketing" subtitle="Calendário de posts" />

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex border border-black/10 bg-soft-white">
            {VISOES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVisao(v.id)}
                className={`px-4 py-2 text-sm transition-colors ${visao === v.id ? 'bg-dark text-cream' : 'text-muted hover:text-charcoal'}`}
              >
                {v.nome}
              </button>
            ))}
          </div>

          {visao !== 'grade' && !arquivados && (
            <div className="flex items-center gap-2">
              <button onClick={() => navegar(-1)} className="p-2 text-muted hover:text-charcoal"><ChevronLeft size={18} /></button>
              <span className="font-display text-xl text-charcoal min-w-[190px] text-center">{tituloPeriodo}</span>
              <button onClick={() => navegar(1)} className="p-2 text-muted hover:text-charcoal"><ChevronRight size={18} /></button>
              <button onClick={() => setReferencia(hojeISO())} className="text-xs text-accent hover:text-charcoal ml-1">Hoje</button>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setArquivados(!arquivados)}
              className={`flex items-center gap-1.5 text-xs ${arquivados ? 'text-charcoal' : 'text-muted hover:text-charcoal'}`}
            >
              <Archive size={14} /> {arquivados ? 'Voltar ao calendário' : 'Arquivados'}
            </button>
            <button
              onClick={() => setEditor({ post: null, data: null })}
              className="flex items-center gap-1.5 border border-dark/20 px-4 py-2 text-sm text-charcoal hover:bg-soft-white"
            >
              <Lightbulb size={15} /> Nova ideia
            </button>
            <button
              onClick={() => setEditor({ post: null, data: visao === 'grade' ? hojeISO() : referencia })}
              className="flex items-center gap-1.5 bg-dark text-cream px-4 py-2 text-sm hover:bg-charcoal"
            >
              <Plus size={15} /> Novo post
            </button>
          </div>
        </div>

        {erro && <p className="mb-4 text-sm text-accent">Erro ao carregar: {erro}</p>}

        {arquivados ? (
          <div className="bg-soft-white border border-black/5 p-6">
            <h2 className="font-display text-xl mb-4">Arquivados</h2>
            {posts.length === 0 && !carregando && <p className="text-sm text-muted">Nada arquivado.</p>}
            <div className="grid grid-cols-4 gap-2">
              {posts.map((p) => <CartaoPost key={p.id} post={p} onAbrir={abrir} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_220px] gap-6">
            <div className={carregando ? 'opacity-60 transition-opacity' : ''}>
              {visao === 'grade'
                ? <GradeFeed posts={comData} onAbrir={abrir} />
                : (
                  <Calendario
                    visao={visao}
                    referencia={referencia}
                    posts={comData}
                    onAbrir={abrir}
                    onNovo={(data) => setEditor({ post: null, data })}
                    onMover={mover}
                  />
                )}
            </div>

            <aside className="space-y-6">
              {visao !== 'grade' && (
                <div className="bg-soft-white border border-black/5 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-3">No mês · {doMes.length} posts</div>
                  {(Object.keys(PILARES) as (keyof typeof PILARES)[]).map((k) => (
                    <div key={k} className="flex items-center gap-2 text-sm text-charcoal py-0.5">
                      <span className={`w-2 h-2 rounded-full ${corPilar[k]}`} />
                      {PILARES[k]}
                      <span className="ml-auto font-mono text-xs text-muted">{doMes.filter((p) => p.pilar === k).length}</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-2">Ideias sem data · {ideias.length}</div>
                <p className="text-[11px] text-muted mb-2">Arraste uma ideia para um dia do calendário.</p>
                <div className="space-y-1.5">
                  {ideias.map((p) => <CartaoPost key={p.id} post={p} onAbrir={abrir} />)}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {editor && (
        <EditorPost
          key={editor.post?.id ?? `novo-${editor.data}`}
          post={editor.post}
          dataInicial={editor.data}
          onFechar={() => setEditor(null)}
          onMudou={carregar}
        />
      )}
    </div>
  )
}

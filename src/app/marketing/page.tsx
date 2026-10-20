'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Lightbulb, Archive } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Calendario, { diasVisiveis } from '@/components/posts/Calendario'
import GradeFeed from '@/components/posts/GradeFeed'
import CartaoPost from '@/components/posts/CartaoPost'
import EditorPost from '@/components/posts/EditorPost'
import PautaMes from '@/components/posts/PautaMes'
import { corPilar } from '@/components/posts/estilos'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { listarPosts, moverPost, trocarLugares, criarPost, enviarMidias, salvarPost } from '@/lib/posts/dados'
import { podeMudarPara } from '@/lib/posts/regras'
import { PILARES, type Post, type Status } from '@/lib/posts/tipos'
import { hojeISO, instanteDeBR, partesBR, somarDias, mesExtenso, diaCurto } from '@/lib/datas'

type Visao = 'mes' | 'semana' | 'grade' | 'pauta'

const VISOES: { id: Visao; nome: string }[] = [
  { id: 'mes', nome: 'Mês' },
  { id: 'semana', nome: 'Semana' },
  { id: 'grade', nome: 'Grade do feed' },
  { id: 'pauta', nome: 'Pauta do mês' },
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
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  const intervalo = useMemo(() => {
    if (visao === 'grade') {
      return { de: instanteDeBR(somarDias(referencia, -120), '00:00'), ate: instanteDeBR(somarDias(referencia, 120), '00:00') }
    }
    const dias = diasVisiveis(visao === 'pauta' ? 'mes' : visao, referencia)
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

  // Grade: arrastar um post (ou uma ideia da lateral) sobre outro troca os dois de lugar.
  async function trocar(arrastadoId: string, alvoId: string) {
    const a = posts.find((p) => p.id === arrastadoId)
    const b = posts.find((p) => p.id === alvoId)
    if (!a || !b || a.status === 'postado' || b.status === 'postado') return
    setAviso(null)
    try {
      await trocarLugares(supabase, a, b)
      if (!a.data_hora) setAviso(`"${b.titulo || 'O post'}" voltou para as ideias sem data.`)
    } catch (e) {
      setAviso(`Não foi possível trocar: ${(e as Error).message}`)
    }
    carregar()
  }

  // Grade: cada imagem solta vira um post em criação, no fim da fila (dois dias depois do último).
  async function testarArquivos(arquivos: File[]) {
    setEnviando(true)
    setAviso(null)
    try {
      const datas = comData.map((p) => partesBR(p.data_hora!).data).sort()
      let dia = datas.length ? datas[datas.length - 1] : hojeISO()
      for (const arquivo of arquivos) {
        dia = somarDias(dia, 2)
        const video = arquivo.type.startsWith('video')
        const id = await criarPost(supabase, {
          tipo: video ? 'reels' : 'feed',
          status: 'rascunho',
          titulo: arquivo.name.replace(/\.[^.]+$/, ''),
          data_hora: instanteDeBR(dia, '18:00'),
        })
        await enviarMidias(supabase, id, [arquivo], 0)
      }
    } catch (e) {
      setAviso(`Falha no envio: ${(e as Error).message}`)
    } finally {
      setEnviando(false)
      carregar()
    }
  }

  // Pauta: mudar o status direto na linha, com as mesmas regras do editor.
  async function mudarStatus(post: Post, status: Status): Promise<string | null> {
    const pode = podeMudarPara(status, post, post.midias)
    if (!pode.ok) return pode.motivo ?? 'Não pode mudar agora.'
    try {
      await salvarPost(supabase, post.id, { status }, post.status)
      carregar()
      return null
    } catch (e) {
      return (e as Error).message
    }
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

      <main className="ml-64 px-10 py-8 max-w-[1600px]">
        <Header title="Calendário de posts" subtitle="Planeje, organize e acompanhe o Instagram" />

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="flex p-[3px] rounded-[10px] bg-black/[0.06]">
            {VISOES.map((v) => (
              <button
                key={v.id}
                onClick={() => { setVisao(v.id); setArquivados(false) }}
                className={`px-4 py-[5px] rounded-[7px] text-[13px] transition-all duration-200
                  ${visao === v.id && !arquivados ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`}
              >
                {v.nome}
              </button>
            ))}
          </div>

          {visao !== 'grade' && !arquivados && (
            <div className="flex items-center gap-1">
              <button onClick={() => navegar(-1)} aria-label="Anterior" className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-black/[0.05] transition-colors"><ChevronLeft size={18} /></button>
              <button onClick={() => navegar(1)} aria-label="Próximo" className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-black/[0.05] transition-colors"><ChevronRight size={18} /></button>
              <span className="font-display text-[22px] text-charcoal ml-2 mr-3 inline-block first-letter:uppercase">{tituloPeriodo}</span>
              <button onClick={() => setReferencia(hojeISO())} className="px-3 py-1 rounded-full text-[12px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09] transition-colors">Hoje</button>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setArquivados(!arquivados)}
              className={`flex items-center gap-1.5 px-3 py-[7px] rounded-full text-[13px] transition-colors
                ${arquivados ? 'bg-black/[0.07] text-charcoal font-medium' : 'text-muted hover:text-charcoal hover:bg-black/[0.04]'}`}
            >
              <Archive size={14} /> Arquivados
            </button>
            <button
              onClick={() => setEditor({ post: null, data: null })}
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-charcoal bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-white/60 transition-colors"
            >
              <Lightbulb size={14} /> Nova ideia
            </button>
            <button
              onClick={() => setEditor({ post: null, data: visao === 'grade' ? hojeISO() : referencia })}
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black active:scale-[0.98] transition-all"
            >
              <Plus size={15} /> Novo post
            </button>
          </div>
        </div>

        {aviso && (
          <div className="mb-4 rounded-xl bg-black/[0.04] px-4 py-3 text-[13px] text-charcoal flex items-center">
            <span className="flex-1">{aviso}</span>
            <button onClick={() => setAviso(null)} className="text-muted hover:text-charcoal text-[12px]">Fechar</button>
          </div>
        )}

        {erro && (
          <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">Não foi possível carregar: {erro}</div>
        )}

        {arquivados ? (
          <div className="bg-white rounded-2xl border border-linha shadow-card p-6">
            <h2 className="font-display text-[20px] mb-1">Arquivados</h2>
            <p className="text-[13px] text-muted mb-5">Posts guardados fora do calendário. Abra um para restaurar.</p>
            {posts.length === 0 && !carregando && <p className="text-[13px] text-muted py-8 text-center">Nada arquivado.</p>}
            <div className="grid grid-cols-4 gap-2.5">
              {posts.map((p) => <CartaoPost key={p.id} post={p} onAbrir={abrir} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_250px] gap-6 items-start">
            <div className={`transition-opacity duration-300 ${carregando ? 'opacity-50' : ''}`}>
              {visao === 'grade'
                ? <GradeFeed posts={comData} onAbrir={abrir} onTrocar={trocar} onSoltarArquivos={testarArquivos} enviando={enviando} />
                : visao === 'pauta'
                ? <PautaMes posts={doMes} nomeMes={mesExtenso(referencia.slice(0, 7))} onAbrir={abrir} onMudarStatus={mudarStatus} />
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

            <aside className="space-y-4 sticky top-6">
              {visao !== 'grade' && (
                <div className="bg-white rounded-2xl border border-linha shadow-card p-5">
                  <div className="text-[12px] text-muted first-letter:uppercase">{mesExtenso(referencia.slice(0, 7))}</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5 mb-4">
                    <span className="font-display text-[34px] leading-none text-charcoal tabular-nums">{doMes.length}</span>
                    <span className="text-[13px] text-muted">{doMes.length === 1 ? 'post' : 'posts'}</span>
                  </div>
                  <div className="space-y-3">
                    {(Object.keys(PILARES) as (keyof typeof PILARES)[]).map((k) => {
                      const qtd = doMes.filter((p) => p.pilar === k).length
                      const parte = doMes.length ? (qtd / doMes.length) * 100 : 0
                      return (
                        <div key={k}>
                          <div className="flex items-center gap-2 text-[13px] text-charcoal">
                            <span className={`w-2 h-2 rounded-full ${corPilar[k]}`} />
                            {PILARES[k]}
                            <span className="ml-auto text-muted tabular-nums">{qtd}</span>
                          </div>
                          <div className="mt-1.5 h-1 rounded-full bg-black/[0.06] overflow-hidden">
                            <div className={`h-full rounded-full ${corPilar[k]} transition-all duration-500`} style={{ width: `${parte}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-linha shadow-card p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[13px] font-medium text-charcoal">Ideias sem data</span>
                  <span className="text-[12px] text-muted tabular-nums">{ideias.length}</span>
                </div>
                <p className="text-[12px] text-muted mb-3">{visao === 'grade' ? 'Arraste sobre um post da grade para trocar de lugar.' : 'Arraste para um dia do calendário.'}</p>
                {ideias.length === 0
                  ? (
                    <button
                      onClick={() => setEditor({ post: null, data: null })}
                      className="w-full rounded-xl border-[1.5px] border-dashed border-black/10 py-5 text-[12px] text-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      Guardar uma ideia
                    </button>
                  )
                  : (
                    <div className="space-y-1.5">
                      {ideias.map((p) => <CartaoPost key={p.id} post={p} onAbrir={abrir} />)}
                    </div>
                  )}
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

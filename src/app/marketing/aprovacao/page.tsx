'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, MessageSquareText, PenLine, Undo2, Loader2, Layers, Film } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import PreviaInstagram from '@/components/posts/PreviaInstagram'
import EditorPost from '@/components/posts/EditorPost'
import { corPilar } from '@/components/posts/estilos'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { listarPorStatus, listarPosts, salvarPost } from '@/lib/posts/dados'
import { podeMudarPara, apareceNaGrade } from '@/lib/posts/regras'
import { PILARES, TIPOS, type Post, type Status } from '@/lib/posts/tipos'
import { dataExtensoBR, hojeISO, instanteDeBR, partesBR, somarDias } from '@/lib/datas'

type Fila = 'aprovacao' | 'ajuste' | 'agendado'

const FILAS: { id: Fila; nome: string; vazio: string }[] = [
  { id: 'aprovacao', nome: 'Aguardando', vazio: 'Nada esperando aprovação. Quando um post passar para "Em aprovação", ele aparece aqui.' },
  { id: 'ajuste', nome: 'Em ajuste', vazio: 'Nenhum post voltou para ajuste.' },
  { id: 'agendado', nome: 'Aprovados', vazio: 'Nenhum post aprovado na fila de publicação.' },
]

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-3 py-2 text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'

/** Um post na fila: a prévia grande, como no feed, e a decisão logo abaixo. */
function PostNaFila({ post, onMudar, onAbrir }: { post: Post; onMudar: (p: Post, status: Status, nota?: string) => Promise<string | null>; onAbrir: (p: Post) => void }) {
  const [pedindo, setPedindo] = useState(false)
  const [nota, setNota] = useState(post.nota_aprovacao ?? '')
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  async function mudar(status: Status, comNota?: string) {
    setOcupado(true)
    setAviso(await onMudar(post, status, comNota))
    setOcupado(false)
  }

  const botao = 'flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium transition-colors disabled:opacity-50'

  return (
    <article id={`post-${post.id}`} className="scroll-mt-6">
      <div className="max-w-[540px] mx-auto flex items-center gap-2 mb-2.5 text-[12.5px] text-muted">
        {post.pilar && <span className={`w-2 h-2 rounded-full ${corPilar[post.pilar]}`} />}
        <span className="text-charcoal font-medium truncate">{post.titulo || 'Sem título'}</span>
        <span>· {TIPOS[post.tipo]}{post.pilar ? ` · ${PILARES[post.pilar]}` : ''}</span>
        <span className="ml-auto shrink-0 first-letter:uppercase">
          {post.data_hora ? `${dataExtensoBR(new Date(post.data_hora))}, ${partesBR(post.data_hora).hora}` : 'sem data'}
        </span>
      </div>

      <PreviaInstagram post={post} midias={post.midias} grande />

      <div className="max-w-[540px] mx-auto mt-3">
        {post.status === 'ajuste' && post.nota_aprovacao && (
          <div className="mb-3 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">
            <div className="text-[11px] font-medium text-accent mb-0.5">Ajuste pedido</div>
            <p className="whitespace-pre-line">{post.nota_aprovacao}</p>
          </div>
        )}

        {pedindo ? (
          <div className={`${cartao} p-3 space-y-2`}>
            <textarea autoFocus className={`${campo} min-h-[80px] resize-y`} placeholder="O que precisa mudar? Legenda, imagem, ordem do carrossel, data…" value={nota} onChange={(e) => setNota(e.target.value)} />
            <div className="flex gap-2">
              <button disabled={ocupado || !nota.trim()} onClick={() => mudar('ajuste', nota.trim())} className={`${botao} text-white bg-charcoal hover:bg-black`}>
                {ocupado && <Loader2 size={13} className="animate-spin" />} Enviar para ajuste
              </button>
              <button onClick={() => setPedindo(false)} className={`${botao} text-charcoal bg-black/[0.05] hover:bg-black/[0.09]`}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {post.status === 'aprovacao' && (
              <>
                <button disabled={ocupado} onClick={() => mudar('agendado')} className={`${botao} text-white bg-olive hover:bg-olive/90`}>
                  {ocupado ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Aprovar
                </button>
                <button disabled={ocupado} onClick={() => setPedindo(true)} className={`${botao} text-charcoal bg-white border border-black/[0.08] hover:bg-white/60`}>
                  <MessageSquareText size={14} /> Pedir ajuste
                </button>
              </>
            )}
            {post.status !== 'aprovacao' && (
              <button disabled={ocupado} onClick={() => mudar('aprovacao')} className={`${botao} text-charcoal bg-white border border-black/[0.08] hover:bg-white/60`}>
                <Undo2 size={14} /> {post.status === 'ajuste' ? 'Ajustado, voltar para aprovação' : 'Voltar para aprovação'}
              </button>
            )}
            <button onClick={() => onAbrir(post)} className={`${botao} ml-auto text-muted hover:text-charcoal hover:bg-black/[0.04]`}>
              <PenLine size={14} /> Abrir no editor
            </button>
          </div>
        )}
        {aviso && <p className="mt-2 text-[12.5px] text-accent">{aviso}</p>}
      </div>
    </article>
  )
}

export default function AprovacaoPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [fila, setFila] = useState<Fila>('aprovacao')
  const [posts, setPosts] = useState<Post[]>([])
  const [perfil, setPerfil] = useState<Post[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [editor, setEditor] = useState<Post | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const hoje = hojeISO()
      const [lista, grade] = await Promise.all([
        listarPorStatus(supabase, ['aprovacao', 'ajuste', 'agendado']),
        listarPosts(supabase, { de: instanteDeBR(somarDias(hoje, -90), '00:00'), ate: instanteDeBR(somarDias(hoje, 90), '00:00') }),
      ])
      setPosts(lista)
      setPerfil(grade.filter((p) => p.data_hora && apareceNaGrade(p.tipo)).sort((a, b) => (b.data_hora! > a.data_hora! ? 1 : -1)))
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  async function mudar(post: Post, status: Status, nota?: string): Promise<string | null> {
    const pode = podeMudarPara(status, post, post.midias)
    if (!pode.ok) return pode.motivo ?? 'Não pode mudar agora.'
    try {
      await salvarPost(supabase, post.id, nota === undefined ? { status } : { status, nota_aprovacao: nota }, post.status)
      carregar()
      return null
    } catch (e) {
      return (e as Error).message
    }
  }

  const daFila = posts.filter((p) => p.status === fila)
  const naFila = new Set(daFila.map((p) => p.id))
  const atual = FILAS.find((f) => f.id === fila)!

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Aprovação" subtitle="Os posts grandes, como no feed. Aprove ou peça ajuste." />

        <div className="flex p-[3px] rounded-[10px] bg-black/[0.06] w-fit mb-6">
          {FILAS.map((f) => {
            const qtd = posts.filter((p) => p.status === f.id).length
            return (
              <button
                key={f.id}
                onClick={() => setFila(f.id)}
                className={`px-4 py-[5px] rounded-[7px] text-[13px] transition-all duration-200 flex items-center gap-1.5
                  ${fila === f.id ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`}
              >
                {f.nome}
                <span className={`tabular-nums text-[11.5px] ${fila === f.id ? 'text-muted' : 'text-muted/80'}`}>{qtd}</span>
              </button>
            )
          })}
        </div>

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">Não foi possível carregar: {erro}</div>}

        <div className="grid grid-cols-[1fr_280px] gap-8 items-start">
          <div className={`space-y-14 pb-24 transition-opacity duration-300 ${carregando ? 'opacity-50' : ''}`}>
            {daFila.map((p) => <PostNaFila key={`${p.id}-${p.status}`} post={p} onMudar={mudar} onAbrir={setEditor} />)}
            {!carregando && daFila.length === 0 && (
              <div className={`${cartao} max-w-[540px] mx-auto py-16 px-8 text-center`}>
                <p className="text-[15px] text-charcoal font-medium">Tudo em dia</p>
                <p className="text-[13px] text-muted mt-1">{atual.vazio}</p>
              </div>
            )}
          </div>

          <aside className="sticky top-6">
            <div className={`${cartao} p-4`}>
              <div className="text-[13px] font-medium text-charcoal">Como fica o perfil</div>
              <p className="text-[12px] text-muted mb-3">Os destacados são os desta fila. Clique para ir até o post.</p>
              <div className="rounded-lg overflow-hidden grid grid-cols-3 gap-[2px]">
                {perfil.map((p) => {
                  const capa = p.midias[0]
                  const destaque = naFila.has(p.id)
                  return (
                    <a
                      key={p.id}
                      href={destaque ? `#post-${p.id}` : undefined}
                      onClick={(e) => { if (!destaque) return; e.preventDefault(); document.getElementById(`post-${p.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}
                      className={`relative aspect-[4/5] bg-cream overflow-hidden ${destaque ? 'cursor-pointer' : ''}`}
                    >
                      {capa?.url
                        ? (capa.tipo === 'video'
                          ? <video src={capa.url} className="w-full h-full object-cover" muted />
                          // eslint-disable-next-line @next/next/no-img-element
                          : <img src={capa.url} alt="" className="w-full h-full object-cover" />)
                        : <span className="absolute inset-0 flex items-center justify-center p-1 text-[9px] text-muted text-center">{p.titulo || 'Sem mídia'}</span>}
                      {p.tipo === 'carrossel' && <Layers size={11} className="absolute top-1 right-1 text-white drop-shadow" />}
                      {p.tipo === 'reels' && <Film size={11} className="absolute top-1 right-1 text-white drop-shadow" />}
                      <span className={`absolute inset-0 ${destaque ? 'ring-2 ring-inset ring-olive' : naFila.size ? 'bg-white/45' : ''}`} />
                    </a>
                  )
                })}
              </div>
              {perfil.length === 0 && <p className="text-[12px] text-muted text-center py-6">Nenhum post com data por perto.</p>}
            </div>
          </aside>
        </div>
      </main>

      {editor && (
        <EditorPost
          key={editor.id}
          post={editor}
          dataInicial={null}
          onFechar={() => setEditor(null)}
          onMudou={carregar}
        />
      )}
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layers, Film, ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import PreviaInstagram from '@/components/posts/PreviaInstagram'
import EditorPost from '@/components/posts/EditorPost'
import AcoesAprovacao, { type MudarStatus } from '@/components/posts/AcoesAprovacao'
import AprovacaoMes from '@/components/posts/AprovacaoMes'
import { corPilar } from '@/components/posts/estilos'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { listarPorStatus, listarPosts, salvarPost } from '@/lib/posts/dados'
import { podeMudarPara, apareceNaGrade } from '@/lib/posts/regras'
import { PILARES, TIPOS, type Post } from '@/lib/posts/tipos'
import { dataExtensoBR, hojeISO, instanteDeBR, partesBR, somarDias, mesExtenso } from '@/lib/datas'

type Fila = 'aprovacao' | 'ajuste' | 'agendado'
type Visao = 'fila' | 'mes'

const FILAS: { id: Fila; nome: string; vazio: string }[] = [
  { id: 'aprovacao', nome: 'Aguardando', vazio: 'Nada esperando aprovação. Quando um post passar para "Em aprovação", ele aparece aqui.' },
  { id: 'ajuste', nome: 'Em ajuste', vazio: 'Nenhum post voltou para ajuste.' },
  { id: 'agendado', nome: 'Aprovados', vazio: 'Nenhum post aprovado na fila de publicação.' },
]

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

/** '2026-11' → '2026-12' (ou '2026-10' com passo -1) */
function outroMes(mes: string, passo: number) {
  const [a, m] = mes.split('-').map(Number)
  const d = new Date(Date.UTC(a, m - 1 + passo, 1))
  return d.toISOString().slice(0, 7)
}

/** Um post na fila: a prévia grande, como no feed, e a decisão logo abaixo. */
function PostNaFila({ post, onMudar, onAbrir }: { post: Post; onMudar: MudarStatus; onAbrir: (p: Post) => void }) {
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
        <AcoesAprovacao post={post} onMudar={onMudar} onAbrir={onAbrir} />
      </div>
    </article>
  )
}

export default function AprovacaoPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [visao, setVisao] = useState<Visao>('mes')
  const [fila, setFila] = useState<Fila>('aprovacao')
  const [mes, setMes] = useState(() => hojeISO().slice(0, 7))
  const [posts, setPosts] = useState<Post[]>([])
  const [perfil, setPerfil] = useState<Post[]>([])
  const [doMes, setDoMes] = useState<Post[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [editor, setEditor] = useState<Post | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const hoje = hojeISO()
      const [lista, grade, mensal] = await Promise.all([
        listarPorStatus(supabase, ['aprovacao', 'ajuste', 'agendado']),
        listarPosts(supabase, { de: instanteDeBR(somarDias(hoje, -90), '00:00'), ate: instanteDeBR(somarDias(hoje, 90), '00:00') }),
        listarPosts(supabase, { de: instanteDeBR(`${mes}-01`, '00:00'), ate: instanteDeBR(`${outroMes(mes, 1)}-01`, '00:00') }),
      ])
      setPosts(lista)
      setPerfil(grade.filter((p) => p.data_hora && apareceNaGrade(p.tipo)).sort((a, b) => (b.data_hora! > a.data_hora! ? 1 : -1)))
      // Só o que vai para o feed, em ordem de publicação.
      setDoMes(mensal.filter((p) => p.data_hora && apareceNaGrade(p.tipo)))
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [supabase, mes])

  useEffect(() => { carregar() }, [carregar])

  const mudar: MudarStatus = async (post, status, nota) => {
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
  const segmento = (ativo: boolean) => `px-4 py-[5px] rounded-[7px] text-[13px] transition-all duration-200 flex items-center gap-1.5
    ${ativo ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Aprovação" subtitle="O mês inteiro como vai ficar no perfil, ou a fila post a post. Aprove ou peça ajuste." />

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex p-[3px] rounded-[10px] bg-black/[0.06] w-fit">
            <button onClick={() => setVisao('mes')} className={segmento(visao === 'mes')}>Mês</button>
            <button onClick={() => setVisao('fila')} className={segmento(visao === 'fila')}>Fila</button>
          </div>

          {visao === 'mes' ? (
            <div className="flex items-center gap-1">
              <button onClick={() => setMes(outroMes(mes, -1))} className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-black/[0.05]" aria-label="Mês anterior"><ChevronLeft size={16} /></button>
              <span className="text-[14px] text-charcoal font-medium min-w-[150px] text-center first-letter:uppercase">{mesExtenso(mes)}</span>
              <button onClick={() => setMes(outroMes(mes, 1))} className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-black/[0.05]" aria-label="Próximo mês"><ChevronRight size={16} /></button>
            </div>
          ) : (
            <div className="flex p-[3px] rounded-[10px] bg-black/[0.06] w-fit">
              {FILAS.map((f) => (
                <button key={f.id} onClick={() => setFila(f.id)} className={segmento(fila === f.id)}>
                  {f.nome}
                  <span className="tabular-nums text-[11.5px] text-muted">{posts.filter((p) => p.status === f.id).length}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">Não foi possível carregar: {erro}</div>}

        {visao === 'mes' ? (
          <div className={`transition-opacity duration-300 ${carregando ? 'opacity-50' : ''}`}>
            <AprovacaoMes posts={doMes} onMudar={mudar} onAbrir={setEditor} />
          </div>
        ) : (
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
        )}
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

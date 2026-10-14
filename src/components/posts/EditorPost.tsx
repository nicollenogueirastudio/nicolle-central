'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Upload, Archive, ArchiveRestore, Check, Loader2 } from 'lucide-react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { instanteDeBR, partesBR, dataHoraBR } from '@/lib/datas'
import { oQueFaltaParaAgendar, podeMudarPara, contarHashtags, legendaFinal } from '@/lib/posts/regras'
import { criarPost, salvarPost, arquivarPost, restaurarPost, enviarMidias, reordenarMidias, removerMidia } from '@/lib/posts/dados'
import { PILARES, STATUS, STATUS_MANUAIS, TIPOS, type Midia, type Pilar, type Post, type PostEditavel, type Status, type Tipo } from '@/lib/posts/tipos'
import PreviaInstagram from './PreviaInstagram'

interface Props {
  post: Post | null           // null = post novo
  dataInicial?: string | null // dia clicado no calendário
  onFechar: () => void
  onMudou: () => void         // recarregar a lista
}

type Form = {
  tipo: Tipo
  pilar: Pilar | ''
  titulo: string
  legenda: string
  hashtags: string
  primeiro_comentario: string
  data: string
  hora: string
  status: Status
}

function formDe(post: Post | null, dataInicial?: string | null): Form {
  const partes = post?.data_hora ? partesBR(post.data_hora) : null
  return {
    tipo: post?.tipo ?? 'feed',
    pilar: post?.pilar ?? '',
    titulo: post?.titulo ?? '',
    legenda: post?.legenda ?? '',
    hashtags: post?.hashtags ?? '',
    primeiro_comentario: post?.primeiro_comentario ?? '',
    data: partes?.data ?? dataInicial ?? '',
    hora: partes?.hora ?? (dataInicial ? '18:00' : ''),
    status: post?.status ?? (dataInicial ? 'rascunho' : 'ideia'),
  }
}

function paraBanco(f: Form): PostEditavel {
  return {
    tipo: f.tipo,
    pilar: f.pilar || null,
    titulo: f.titulo.trim() || null,
    legenda: f.legenda || null,
    hashtags: f.hashtags.trim() || null,
    primeiro_comentario: f.primeiro_comentario.trim() || null,
    data_hora: f.data ? instanteDeBR(f.data, f.hora || '12:00') : null,
    status: f.status,
  }
}

export default function EditorPost({ post, dataInicial, onFechar, onMudou }: Props) {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [id, setId] = useState<string | null>(post?.id ?? null)
  const [form, setForm] = useState<Form>(() => formDe(post, dataInicial))
  const [midias, setMidias] = useState<Midia[]>(post?.midias ?? [])
  const [statusSalvo, setStatusSalvo] = useState<Status | undefined>(post?.status)
  const [ocupado, setOcupado] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const inputArquivo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onFechar])

  const dados = paraBanco(form)
  const falta = oQueFaltaParaAgendar(dados, midias)
  const automatico = !STATUS_MANUAIS.includes(form.status)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  async function salvar(): Promise<string | null> {
    const mudanca = podeMudarPara(dados.status, dados, midias)
    if (statusSalvo !== dados.status && !mudanca.ok) {
      setAviso(mudanca.motivo ?? null)
      return null
    }
    setOcupado('salvar')
    setAviso(null)
    try {
      let atual = id
      if (atual) await salvarPost(supabase, atual, dados, statusSalvo)
      else {
        atual = await criarPost(supabase, dados)
        setId(atual)
      }
      setStatusSalvo(dados.status)
      onMudou()
      return atual
    } catch (e) {
      setAviso(`Não foi possível salvar: ${(e as Error).message}`)
      return null
    } finally {
      setOcupado(null)
    }
  }

  async function recarregarMidias(postId: string) {
    const { data } = await supabase.from('posts_midia').select('*').eq('post_id', postId).order('ordem')
    const lista = (data ?? []) as Midia[]
    if (lista.length) {
      const { data: links } = await supabase.storage.from('posts-midia').createSignedUrls(lista.map((m) => m.caminho), 3600)
      const mapa = new Map((links ?? []).map((l) => [l.path, l.signedUrl]))
      lista.forEach((m) => { m.url = mapa.get(m.caminho) ?? undefined })
    }
    setMidias(lista)
  }

  async function adicionarArquivos(arquivos: FileList | null) {
    if (!arquivos?.length) return
    const lista = Array.from(arquivos)
    const atual = id ?? (await salvar())
    if (!atual) return
    setOcupado('upload')
    setAviso(null)
    try {
      await enviarMidias(supabase, atual, lista, midias.length)
      await recarregarMidias(atual)
      onMudou()
    } catch (e) {
      setAviso(`Falha no envio: ${(e as Error).message}`)
    } finally {
      setOcupado(null)
    }
  }

  async function mover(i: number, direcao: -1 | 1) {
    const j = i + direcao
    if (!id || j < 0 || j >= midias.length) return
    const nova = [...midias]
    const troca = nova[i]
    nova[i] = nova[j]
    nova[j] = troca
    setMidias(nova)
    await reordenarMidias(supabase, id, nova.map((m) => m.id))
    onMudou()
  }

  async function remover(m: Midia) {
    if (!confirm('Remover esta mídia do post?')) return
    await removerMidia(supabase, m)
    setMidias((lista) => lista.filter((x) => x.id !== m.id))
    onMudou()
  }

  async function alternarArquivo() {
    if (!id) return onFechar()
    if (post?.arquivado_em) {
      await restaurarPost(supabase, id)
    } else {
      if (!confirm('Arquivar este post? Ele sai do calendário, mas pode ser restaurado depois.')) return
      await arquivarPost(supabase, id)
    }
    onMudou()
    onFechar()
  }

  const totalLegenda = legendaFinal(dados).length
  const totalHashtags = contarHashtags(form.hashtags) + contarHashtags(form.legenda)

  const campo = 'w-full border border-warm-beige bg-soft-white px-3 py-2 text-sm text-charcoal outline-none focus:border-accent'
  const rotulo = 'block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-1'

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-dark/30" onClick={onFechar}>
      <aside className="w-full max-w-[980px] h-full bg-cream shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{id ? 'Editar post' : 'Novo post'}</div>
            <h2 className="font-display text-2xl text-charcoal">{form.titulo || 'Sem título'}</h2>
          </div>
          <button onClick={onFechar} className="p-2 text-muted hover:text-charcoal"><X size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto grid grid-cols-[1fr_360px] gap-6 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <label>
                <span className={rotulo}>Tipo</span>
                <select className={campo} value={form.tipo} onChange={(e) => set('tipo', e.target.value as Tipo)}>
                  {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label>
                <span className={rotulo}>Pilar</span>
                <select className={campo} value={form.pilar} onChange={(e) => set('pilar', e.target.value as Pilar | '')}>
                  <option value="">—</option>
                  {Object.entries(PILARES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label>
                <span className={rotulo}>Status</span>
                <select className={campo} value={form.status} onChange={(e) => set('status', e.target.value as Status)} disabled={automatico}>
                  {(automatico ? [form.status] : STATUS_MANUAIS).map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
                </select>
              </label>
            </div>

            <label className="block">
              <span className={rotulo}>Título interno</span>
              <input className={campo} value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ex.: Detalhe assinatura · marcenaria Ocean" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className={rotulo}>Data</span>
                <input type="date" className={campo} value={form.data} onChange={(e) => set('data', e.target.value)} />
              </label>
              <label>
                <span className={rotulo}>Hora (Brasília)</span>
                <input type="time" className={campo} value={form.hora} onChange={(e) => set('hora', e.target.value)} />
              </label>
            </div>

            <div>
              <span className={rotulo}>Mídias {form.tipo === 'carrossel' && '· a ordem é a do carrossel'}</span>
              <div className="flex flex-wrap gap-2">
                {midias.map((m, i) => (
                  <div key={m.id} className="relative w-24 h-[120px] bg-warm-beige group">
                    {m.url && (m.tipo === 'video'
                      ? <video src={m.url} className="w-full h-full object-cover" muted />
                      : <img src={m.url} alt="" className="w-full h-full object-cover" />)}
                    <span className="absolute top-1 left-1 bg-dark/70 text-cream text-[10px] font-mono px-1">{i + 1}</span>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-dark/60 opacity-0 group-hover:opacity-100">
                      <button onClick={() => mover(i, -1)} className="p-1 text-cream disabled:opacity-30" disabled={i === 0}><ChevronLeft size={14} /></button>
                      <button onClick={() => remover(m)} className="p-1 text-cream"><X size={14} /></button>
                      <button onClick={() => mover(i, 1)} className="p-1 text-cream disabled:opacity-30" disabled={i === midias.length - 1}><ChevronRight size={14} /></button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => inputArquivo.current?.click()}
                  disabled={!!ocupado}
                  className="w-24 h-[120px] border border-dashed border-muted/40 flex flex-col items-center justify-center gap-1 text-xs text-muted hover:border-accent hover:text-accent"
                >
                  {ocupado === 'upload' ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {ocupado === 'upload' ? 'Enviando' : 'Adicionar'}
                </button>
                <input
                  ref={inputArquivo}
                  type="file"
                  multiple
                  accept="image/*,video/mp4,video/quicktime"
                  className="hidden"
                  onChange={(e) => { adicionarArquivos(e.target.files); e.target.value = '' }}
                />
              </div>
            </div>

            <label className="block">
              <span className={rotulo}>Legenda</span>
              <textarea className={`${campo} min-h-[180px] leading-relaxed`} value={form.legenda} onChange={(e) => set('legenda', e.target.value)} />
            </label>
            <label className="block">
              <span className={rotulo}>Hashtags · {totalHashtags}/30</span>
              <textarea className={`${campo} min-h-[60px]`} value={form.hashtags} onChange={(e) => set('hashtags', e.target.value)} placeholder="#arquiteturadeinteriores #nicollenogueirastudio" />
            </label>
            <label className="block">
              <span className={rotulo}>Primeiro comentário</span>
              <textarea className={`${campo} min-h-[60px]`} value={form.primeiro_comentario} onChange={(e) => set('primeiro_comentario', e.target.value)} />
            </label>
            <p className="font-mono text-[10px] text-muted">{totalLegenda}/2200 caracteres na legenda final</p>
          </div>

          <div className="space-y-4">
            <PreviaInstagram post={dados} midias={midias} />
            <div className="bg-soft-white border border-black/5 p-4">
              <div className={rotulo}>Para poder agendar</div>
              {falta.length === 0
                ? <p className="text-sm text-olive flex items-center gap-1.5"><Check size={14} /> Tudo pronto.</p>
                : <ul className="text-sm text-charcoal space-y-1">{falta.map((f) => <li key={f}>· {f}</li>)}</ul>}
            </div>
            {post?.publicado_em && <p className="font-mono text-[10px] text-muted">Postado em {dataHoraBR(post.publicado_em)}</p>}
          </div>
        </div>

        <footer className="flex items-center gap-3 px-6 py-4 border-t border-black/5 bg-soft-white">
          <button onClick={alternarArquivo} className="flex items-center gap-1.5 text-sm text-muted hover:text-charcoal">
            {post?.arquivado_em
              ? <><ArchiveRestore size={16} /> Restaurar</>
              : <><Archive size={16} /> {id ? 'Arquivar' : 'Descartar'}</>}
          </button>
          {aviso && <p className="text-sm text-accent flex-1 text-right">{aviso}</p>}
          <button
            onClick={async () => { if (await salvar()) onFechar() }}
            disabled={!!ocupado}
            className="ml-auto bg-dark text-cream px-6 py-2.5 text-sm tracking-wide hover:bg-charcoal disabled:opacity-60 flex items-center gap-2"
          >
            {ocupado === 'salvar' && <Loader2 size={14} className="animate-spin" />} Salvar
          </button>
        </footer>
      </aside>
    </div>
  )
}

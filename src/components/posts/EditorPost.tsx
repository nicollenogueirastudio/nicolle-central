'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Plus, Archive, ArchiveRestore, Check, Loader2, Image as ImageIcon, Layers, Film, Circle, AlertTriangle } from 'lucide-react'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { instanteDeBR, partesBR, dataHoraBR } from '@/lib/datas'
import { oQueFaltaParaAgendar, podeMudarPara, contarHashtags, legendaFinal } from '@/lib/posts/regras'
import { criarPost, salvarPost, arquivarPost, restaurarPost, enviarMidias, reordenarMidias, removerMidia } from '@/lib/posts/dados'
import { PILARES, STATUS, STATUS_MANUAIS, TIPOS, type Midia, type Pilar, type Post, type PostEditavel, type Status, type Tipo } from '@/lib/posts/tipos'
import { QUADROS, FASES, TERRITORIOS, quadroPorId, lerVoz, type Fase, type Territorio } from '@/lib/posts/estrategia'
import PreviaInstagram from './PreviaInstagram'
import { corPilar, estiloStatus } from './estilos'

const iconeTipo = { feed: ImageIcon, carrossel: Layers, reels: Film, story: Circle }

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
  quadro: string
  fase: Fase | ''
  territorio: Territorio | ''
  briefing: string
  fonte: string
  nota_aprovacao: string
  responsavel: string
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
    quadro: post?.quadro ?? '',
    fase: post?.fase ?? '',
    territorio: post?.territorio ?? '',
    briefing: post?.briefing ?? '',
    fonte: post?.fonte ?? '',
    nota_aprovacao: post?.nota_aprovacao ?? '',
    responsavel: post?.responsavel ?? '',
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
    quadro: f.quadro || null,
    fase: f.fase || null,
    territorio: f.territorio || null,
    briefing: f.briefing.trim() || null,
    fonte: f.fonte.trim() || null,
    nota_aprovacao: f.nota_aprovacao.trim() || null,
    responsavel: f.responsavel.trim() || null,
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
  const [arrastando, setArrastando] = useState(false)
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


  // Escolher um quadro já traz o pilar e o formato sugeridos pelo manual.
  function escolherQuadro(qid: string) {
    const q = quadroPorId(qid)
    setForm((f) => ({
      ...f,
      quadro: qid,
      pilar: q ? q.pilar : f.pilar,
      tipo: q && midias.length === 0 ? q.tipo : f.tipo,
    }))
  }

  const quadro = quadroPorId(form.quadro)
  const voz = lerVoz(form.legenda)
  const totalLegenda = legendaFinal(dados).length
  const totalHashtags = contarHashtags(form.hashtags) + contarHashtags(form.legenda)

  const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-3 py-2 text-[14px] text-charcoal outline-none transition-shadow placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'
  const rotulo = 'block text-[12px] font-medium text-muted mb-1.5'
  const grupo = 'bg-white rounded-2xl border border-linha shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-4'

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/20 backdrop-blur-[2px] animate-surgir" onClick={onFechar}>
      <aside
        className="w-full max-w-[1000px] h-[calc(100%-16px)] my-2 mr-2 bg-cream rounded-2xl shadow-flutuante flex flex-col overflow-hidden animate-entrar"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-4 px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-linha">
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-muted">{id ? 'Editar post' : 'Novo post'}</div>
            <h2 className="font-display text-[20px] leading-tight text-charcoal truncate">{form.titulo || 'Sem título'}</h2>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${estiloStatus[form.status]}`}>{STATUS[form.status]}</span>
          <button onClick={onFechar} aria-label="Fechar" className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.09] flex items-center justify-center text-muted transition-colors">
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto grid grid-cols-[1fr_360px] gap-6 p-6">
          <div className="space-y-4">
            <div className={grupo + ' space-y-4'}>
              <div>
                <span className={rotulo}>Formato</span>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-[10px] bg-black/[0.05]">
                  {(Object.keys(TIPOS) as Tipo[]).map((k) => {
                    const Icone = iconeTipo[k]
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => set('tipo', k)}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] text-[13px] transition-all
                          ${form.tipo === k ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-muted hover:text-charcoal'}`}
                      >
                        <Icone size={13} /> {TIPOS[k]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className={rotulo}>Pilar</span>
                <div className="flex gap-2">
                  {(Object.keys(PILARES) as Pilar[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set('pilar', form.pilar === k ? '' : k)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] border transition-all
                        ${form.pilar === k ? 'border-charcoal bg-charcoal text-white' : 'border-black/[0.10] bg-white text-charcoal hover:border-black/25'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${corPilar[k]} ${form.pilar === k ? 'ring-1 ring-white/60' : ''}`} />
                      {PILARES[k]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className={rotulo}>Quadro editorial</span>
                <select className={campo} value={form.quadro} onChange={(e) => escolherQuadro(e.target.value)}>
                  <option value="">Sem quadro</option>
                  {(Object.keys(PILARES) as Pilar[]).map((p) => (
                    <optgroup key={p} label={PILARES[p]}>
                      {QUADROS.filter((q) => q.pilar === p).map((q) => <option key={q.id} value={q.id}>{q.nome}</option>)}
                    </optgroup>
                  ))}
                </select>
                {quadro && <span className="block text-[12px] text-muted mt-1.5">{quadro.descricao} <span className="text-charcoal/70">Formato: {quadro.formato}.</span></span>}
              </label>

              <label className="block">
                <span className={rotulo}>Título interno</span>
                <input className={campo} value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ex.: Detalhe assinatura · marcenaria Ocean" />
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label>
                  <span className={rotulo}>Data</span>
                  <input type="date" className={campo} value={form.data} onChange={(e) => set('data', e.target.value)} />
                </label>
                <label>
                  <span className={rotulo}>Hora (Brasília)</span>
                  <input type="time" className={campo} value={form.hora} onChange={(e) => set('hora', e.target.value)} />
                </label>
                <label>
                  <span className={rotulo}>Status</span>
                  <select className={campo} value={form.status} onChange={(e) => set('status', e.target.value as Status)} disabled={automatico}>
                    {(automatico ? [form.status] : STATUS_MANUAIS).map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div
              className={`${grupo} transition-colors ${arrastando ? 'ring-2 ring-accent/40 bg-accent/[0.03]' : ''}`}
              onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setArrastando(true) } }}
              onDragLeave={() => setArrastando(false)}
              onDrop={(e) => { e.preventDefault(); setArrastando(false); adicionarArquivos(e.dataTransfer.files) }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[13px] font-medium text-charcoal">Mídias</span>
                <span className="text-[12px] text-muted">
                  {form.tipo === 'carrossel' ? 'A ordem aqui é a ordem do carrossel' : `${midias.length} ${midias.length === 1 ? 'arquivo' : 'arquivos'}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {midias.map((m, i) => (
                  <div key={m.id} className="relative w-[92px] h-[115px] rounded-xl overflow-hidden bg-cream group">
                    {m.url && (m.tipo === 'video'
                      ? <video src={m.url} className="w-full h-full object-cover" muted />
                      : <img src={m.url} alt="" className="w-full h-full object-cover" />)}
                    <span className="absolute top-1.5 left-1.5 min-w-[20px] h-5 px-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium flex items-center justify-center tabular-nums">{i + 1}</span>
                    <button
                      onClick={() => remover(m)}
                      aria-label="Remover"
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                    <div className="absolute bottom-1.5 inset-x-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Mover para a esquerda" className="w-6 h-6 rounded-full bg-white/90 text-charcoal flex items-center justify-center disabled:opacity-0"><ChevronLeft size={13} /></button>
                      <button onClick={() => mover(i, 1)} disabled={i === midias.length - 1} aria-label="Mover para a direita" className="w-6 h-6 rounded-full bg-white/90 text-charcoal flex items-center justify-center disabled:opacity-0"><ChevronRight size={13} /></button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => inputArquivo.current?.click()}
                  disabled={!!ocupado}
                  className="w-[92px] h-[115px] rounded-xl border-[1.5px] border-dashed border-black/15 flex flex-col items-center justify-center gap-1.5 text-[12px] text-muted hover:border-accent hover:text-accent hover:bg-accent/[0.03] transition-colors"
                >
                  {ocupado === 'upload' ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
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

            <div className={grupo + ' space-y-4'}>
              <label className="block">
                <span className="flex justify-between">
                  <span className={rotulo}>Legenda</span>
                  <span className={`text-[12px] tabular-nums ${totalLegenda > 2200 ? 'text-accent font-medium' : 'text-muted/70'}`}>{totalLegenda} / 2200</span>
                </span>
                <textarea className={`${campo} min-h-[190px] leading-relaxed resize-y`} value={form.legenda} onChange={(e) => set('legenda', e.target.value)} placeholder="Escreva a legenda…" />
              </label>
              <label className="block">
                <span className="flex justify-between">
                  <span className={rotulo}>Hashtags</span>
                  <span className={`text-[12px] tabular-nums ${totalHashtags > 30 ? 'text-accent font-medium' : 'text-muted/70'}`}>{totalHashtags} / 30</span>
                </span>
                <textarea className={`${campo} min-h-[64px] resize-y`} value={form.hashtags} onChange={(e) => set('hashtags', e.target.value)} placeholder="#arquiteturadeinteriores #nicollenogueirastudio" />
              </label>
              <label className="block">
                <span className={rotulo}>Primeiro comentário</span>
                <textarea className={`${campo} min-h-[64px] resize-y`} value={form.primeiro_comentario} onChange={(e) => set('primeiro_comentario', e.target.value)} />
              </label>
            </div>

            <div className={grupo + ' space-y-4'}>
              <div>
                <div className="text-[13px] font-medium text-charcoal">Produção</div>
                <p className="text-[12px] text-muted mt-0.5">Para quem for criar a peça. Vai junto no pacote do mês.</p>
              </div>
              <label className="block">
                <span className={rotulo}>Briefing</span>
                <textarea className={`${campo} min-h-[80px] resize-y`} value={form.briefing} onChange={(e) => set('briefing', e.target.value)} placeholder="O que a peça precisa ser: imagens, ordem, capa, lettering, áudio…" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className={rotulo}>Fonte e créditos</span>
                  <input className={campo} value={form.fonte} onChange={(e) => set('fonte', e.target.value)} placeholder="Fotógrafo, revista, @perfil" />
                </label>
                <label>
                  <span className={rotulo}>Responsável</span>
                  <input className={campo} value={form.responsavel} onChange={(e) => set('responsavel', e.target.value)} placeholder="Nicolle, freela…" />
                </label>
              </div>
              <label className="block">
                <span className={rotulo}>Comentário da aprovação</span>
                <textarea className={`${campo} min-h-[64px] resize-y`} value={form.nota_aprovacao} onChange={(e) => set('nota_aprovacao', e.target.value)} placeholder="O que ajustar antes de agendar" />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="pt-1 pb-2">
              <PreviaInstagram post={dados} midias={midias} />
            </div>
            <div className={grupo}>
              <div className="text-[13px] font-medium text-charcoal mb-2">Para poder agendar</div>
              {falta.length === 0
                ? <p className="text-[13px] text-olive flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-olive text-white flex items-center justify-center"><Check size={12} strokeWidth={3} /></span> Tudo pronto.</p>
                : (
                  <ul className="space-y-1.5">
                    {falta.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-charcoal">
                        <span className="mt-[3px] w-3.5 h-3.5 shrink-0 rounded-full border-[1.5px] border-black/20" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
            <div className={grupo}>
              <div className="text-[13px] font-medium text-charcoal mb-1">Filtro da marca</div>
              <p className="text-[12px] text-muted mb-3">Se não faz nenhuma das quatro, não entra.</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(Object.keys(FASES) as Fase[]).map((k) => (
                  <button key={k} type="button" onClick={() => set('fase', form.fase === k ? '' : k)} title={FASES[k].pergunta}
                    className={`px-3 py-1 rounded-full text-[12px] border transition-all ${form.fase === k ? 'border-olive bg-olive text-white' : 'border-black/[0.10] bg-white text-charcoal hover:border-black/25'}`}>
                    {FASES[k].nome}
                  </button>
                ))}
              </div>
              <div className="text-[12px] font-medium text-muted mb-1.5">Território</div>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TERRITORIOS) as Territorio[]).map((k) => (
                  <button key={k} type="button" onClick={() => set('territorio', form.territorio === k ? '' : k)}
                    className={`px-3 py-1 rounded-full text-[12px] border transition-all ${form.territorio === k ? 'border-charcoal bg-charcoal text-white' : 'border-black/[0.10] bg-white text-charcoal hover:border-black/25'}`}>
                    {TERRITORIOS[k]}
                  </button>
                ))}
              </div>
            </div>

            <div className={grupo}>
              <div className="text-[13px] font-medium text-charcoal mb-2">Voz da marca</div>
              {!form.legenda.trim()
                ? <p className="text-[13px] text-muted">A leitura aparece quando houver legenda.</p>
                : (
                  <div className="space-y-2.5 text-[13px]">
                    {voz.banidas.length > 0 && (
                      <p className="flex items-start gap-2 text-[#8C6B3F]">
                        <AlertTriangle size={14} className="mt-[2px] shrink-0" />
                        <span>Fora do registro: {voz.banidas.map((b) => `“${b}”`).join(', ')}.</span>
                      </p>
                    )}
                    {voz.exclamacoes > 1 && <p className="text-[#8C6B3F]">{voz.exclamacoes} exclamações. A marca não grita.</p>}
                    {voz.longas > 0 && <p className="text-charcoal/80">{voz.longas} {voz.longas === 1 ? 'frase longa' : 'frases longas'}. Cinco palavras dizem mais do que vinte.</p>}
                    {voz.assinatura.length > 0
                      ? <p className="text-olive">Vocabulário-assinatura: {voz.assinatura.join(', ')}.</p>
                      : <p className="text-muted">Nenhuma palavra-assinatura (refúgio, ritual, silêncio, matéria, gesto…).</p>}
                    {voz.banidas.length === 0 && voz.exclamacoes <= 1 && voz.longas === 0 && <p className="flex items-center gap-2 text-olive"><Check size={13} strokeWidth={3} /> No tom.</p>}
                  </div>
                )}
            </div>

            {post?.publicado_em && <p className="text-[12px] text-muted px-1">Postado em {dataHoraBR(post.publicado_em)}</p>}
          </div>
        </div>

        <footer className="flex items-center gap-3 px-6 py-3.5 bg-white/70 backdrop-blur-xl border-t border-linha">
          <button onClick={alternarArquivo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] text-muted hover:text-charcoal hover:bg-black/[0.05] transition-colors">
            {post?.arquivado_em
              ? <><ArchiveRestore size={15} /> Restaurar</>
              : <><Archive size={15} /> {id ? 'Arquivar' : 'Descartar'}</>}
          </button>
          {aviso && <p className="text-[13px] text-accent flex-1 text-right">{aviso}</p>}
          <button
            onClick={onFechar}
            className="ml-auto px-4 py-2 rounded-full text-[14px] text-charcoal bg-black/[0.05] hover:bg-black/[0.09] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => { if (await salvar()) onFechar() }}
            disabled={!!ocupado}
            className="px-5 py-2 rounded-full text-[14px] font-medium bg-charcoal text-white hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {ocupado === 'salvar' && <Loader2 size={14} className="animate-spin" />} Salvar
          </button>
        </footer>
      </aside>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Check, ChevronLeft, Copy, ImagePlus, Loader2, Plus, Trash2, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Leituras from '@/components/newsletter/Leituras'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { registrarAtividade } from '@/lib/atividades'
import {
  BUCKET_NEWSLETTER, CALIBRAR, CHECKLIST_FECHAMENTO, CHECKLIST_GERAL, PALAVRAS, SECOES, STATUS_RASCUNHO,
  contarPalavras, lerVozEdicao, montarHTML, montarTexto, novoItem, textoCorrido,
  type Item, type Rascunho, type StatusRascunho,
} from '@/lib/newsletter/escrita'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-2.5 py-1.5 text-[13px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'

/** Área de texto que cresce com o que se escreve. */
function Texto({ valor, onMudar, placeholder, className = '' }: { valor: string; onMudar: (v: string) => void; placeholder?: string; className?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [valor])
  return (
    <textarea ref={ref} rows={2} value={valor} placeholder={placeholder} onChange={(e) => onMudar(e.target.value)}
      className={`w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-muted/50 ${className}`} />
  )
}

function Divisor() {
  return <div className="text-center text-muted tracking-[0.4em] text-[13px] my-8 select-none">* * *</div>
}

function EditorItem({ item, rascunhoId, onMudar, onMover, onApagar, primeiro, ultimo }: {
  item: Item; rascunhoId: string; onMudar: (i: Item) => void; onMover: (d: -1 | 1) => void; onApagar: () => void; primeiro: boolean; ultimo: boolean
}) {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(arquivo: File | undefined) {
    if (!arquivo) return
    setEnviando(true)
    setErro(null)
    const ext = (arquivo.name.split('.').pop() || 'jpg').toLowerCase()
    const caminho = `${rascunhoId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(BUCKET_NEWSLETTER).upload(caminho, arquivo, { contentType: arquivo.type })
    if (error) setErro(error.message)
    else onMudar({ ...item, imagem: supabase.storage.from(BUCKET_NEWSLETTER).getPublicUrl(caminho).data.publicUrl })
    setEnviando(false)
  }

  return (
    <div className="group relative grid grid-cols-[180px_1fr] gap-5 py-5 border-b border-linha last:border-0">
      <div>
        {item.imagem ? (
          <div className="relative rounded-xl overflow-hidden bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imagem} alt="" className="w-full aspect-[4/5] object-cover" />
            <button onClick={() => onMudar({ ...item, imagem: null })} aria-label="Tirar imagem" className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 shadow-controle flex items-center justify-center text-charcoal"><X size={12} /></button>
          </div>
        ) : (
          <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); enviar(e.dataTransfer.files[0]) }}
            className="flex flex-col items-center justify-center gap-1.5 aspect-[4/5] rounded-xl border border-dashed border-black/15 text-muted text-[12px] cursor-pointer hover:border-accent/60 hover:bg-black/[0.015]">
            {enviando ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {enviando ? 'Enviando' : 'Soltar ou escolher imagem'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => enviar(e.target.files?.[0])} />
          </label>
        )}
        {erro && <p className="text-[11px] text-[#8C6B3F] mt-1">{erro}</p>}
        <input value={item.credito} onChange={(e) => onMudar({ ...item, credito: e.target.value })} placeholder="Crédito da imagem"
          className="w-full mt-2 bg-transparent text-[11.5px] italic text-muted outline-none placeholder:text-muted/50" />
      </div>
      <div className="min-w-0">
        <input value={item.titulo} onChange={(e) => onMudar({ ...item, titulo: e.target.value })} placeholder="Nome da referência"
          className="w-full bg-transparent text-[17px] font-semibold text-charcoal tracking-tight outline-none placeholder:text-muted/50" />
        <Texto valor={item.texto} onMudar={(v) => onMudar({ ...item, texto: v })} placeholder="Por que está no radar, o que ela mostra."
          className="mt-1.5 text-[15px] leading-[1.7] text-charcoal/90" />
        <input value={item.link} onChange={(e) => onMudar({ ...item, link: e.target.value })} placeholder="Link (opcional)"
          className="w-full mt-1 bg-transparent text-[12px] text-accent outline-none placeholder:text-muted/50" />
      </div>
      <div className="absolute -right-10 top-5 flex flex-col gap-1 opacity-0 group-hover:opacity-100">
        <button disabled={primeiro} onClick={() => onMover(-1)} aria-label="Subir" className="text-muted hover:text-charcoal disabled:opacity-30"><ArrowUp size={14} /></button>
        <button disabled={ultimo} onClick={() => onMover(1)} aria-label="Descer" className="text-muted hover:text-charcoal disabled:opacity-30"><ArrowDown size={14} /></button>
        <button onClick={onApagar} aria-label="Apagar" className="text-muted hover:text-charcoal mt-1"><Trash2 size={13} /></button>
      </div>
    </div>
  )
}

function ListaItens({ titulo, dica, subtitulo, itens, rascunhoId, onMudar }: {
  titulo: string; dica: string; subtitulo?: string; itens: Item[]; rascunhoId: string; onMudar: (l: Item[]) => void
}) {
  const mover = (i: number, d: -1 | 1) => {
    const l = [...itens]
    ;[l[i], l[i + d]] = [l[i + d], l[i]]
    onMudar(l)
  }
  return (
    <section>
      <h2 className="text-[22px] font-semibold text-charcoal tracking-tight">{titulo}</h2>
      {subtitulo && <p className="text-[14px] italic text-charcoal/70 mt-0.5">{subtitulo}</p>}
      <p className="text-[12px] text-muted mt-1">{dica}</p>
      <div>
        {itens.map((it, i) => (
          <EditorItem key={it.id} item={it} rascunhoId={rascunhoId} primeiro={i === 0} ultimo={i === itens.length - 1}
            onMudar={(n) => onMudar(itens.map((x) => (x.id === n.id ? n : x)))}
            onMover={(d) => mover(i, d)}
            onApagar={() => onMudar(itens.filter((x) => x.id !== it.id))} />
        ))}
      </div>
      <button onClick={() => onMudar([...itens, novoItem()])} className="mt-3 text-[12.5px] text-accent flex items-center gap-1"><Plus size={13} /> Adicionar referência</button>
    </section>
  )
}

function Aviso({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[12.5px] leading-snug">
      <span className={`mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 ${ok ? 'bg-olive' : 'bg-[#8C6B3F]'}`} />
      <span className={ok ? 'text-charcoal/75' : 'text-charcoal'}>{children}</span>
    </div>
  )
}

export default function EditorEdicaoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [r, setR] = useState<Rascunho | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [salvo, setSalvo] = useState<'salvo' | 'salvando' | 'pendente'>('salvo')
  const [modo, setModo] = useState<'escrever' | 'previa'>('escrever')
  const [copiado, setCopiado] = useState<'html' | 'texto' | null>(null)
  const pendente = useRef(false)

  useEffect(() => {
    supabase.from('newsletter_rascunhos').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error) setErro(error.message)
      else setR(data as Rascunho)
    })
  }, [supabase, id])

  const mudar = useCallback((d: Partial<Rascunho>) => {
    pendente.current = true
    setSalvo('pendente')
    setR((atual) => (atual ? { ...atual, ...d } : atual))
  }, [])

  // Grava sozinho, um instante depois da última tecla.
  useEffect(() => {
    if (!r || !pendente.current) return
    const t = setTimeout(async () => {
      pendente.current = false
      setSalvo('salvando')
      const { id: _id, criado_em: _c, atualizado_em: _a, ...dados } = r
      const { error } = await supabase.from('newsletter_rascunhos').update(dados).eq('id', r.id)
      if (error) { setErro(error.message); setSalvo('pendente') } else setSalvo('salvo')
    }, 900)
    return () => clearTimeout(t)
  }, [r, supabase])

  useEffect(() => {
    const sair = (e: BeforeUnloadEvent) => { if (pendente.current) e.preventDefault() }
    window.addEventListener('beforeunload', sair)
    return () => window.removeEventListener('beforeunload', sair)
  }, [])

  async function mudarStatus(s: StatusRascunho) {
    if (!r) return
    mudar({ status: s })
    await registrarAtividade(supabase, 'mudou_status', 'newsletter_rascunho', r.id, { status: s })
    if (r.ideia_id && s === 'publicada') await supabase.from('newsletter_ideias').update({ status: 'publicada' }).eq('id', r.ideia_id)
  }

  async function apagar() {
    if (!r || !confirm('Apagar este rascunho? O texto não volta.')) return
    await supabase.from('newsletter_rascunhos').delete().eq('id', r.id)
    router.push('/newsletter/escrever')
  }

  async function copiar(tipo: 'html' | 'texto') {
    if (!r) return
    const texto = montarTexto(r)
    if (tipo === 'html' && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([montarHTML(r)], { type: 'text/html' }),
        'text/plain': new Blob([texto], { type: 'text/plain' }),
      })])
    } else await navigator.clipboard.writeText(texto)
    setCopiado(tipo)
    setTimeout(() => setCopiado(null), 1800)
  }

  if (!r) {
    return (
      <div className="min-h-screen bg-cream">
        <Sidebar />
        <main className="ml-64 px-10 py-8 text-[13px] text-muted">{erro ?? 'Abrindo o rascunho…'}</main>
      </div>
    )
  }

  const palavras = contarPalavras(textoCorrido(r))
  const voz = lerVozEdicao(r)
  const pctPalavras = Math.min(100, (palavras / PALAVRAS.maximo) * 100)
  const marcar = (k: string) => mudar({ checklist: { ...r.checklist, [k]: !r.checklist[k] } })

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <div className="flex items-center justify-between mb-6">
          <Link href="/newsletter/escrever" className="text-[13px] text-muted hover:text-charcoal flex items-center gap-1"><ChevronLeft size={14} /> Edições em escrita</Link>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-muted flex items-center gap-1">
              {salvo === 'salvando' ? <><Loader2 size={11} className="animate-spin" /> Salvando</> : salvo === 'pendente' ? 'Alterações por salvar' : <><Check size={11} className="text-olive" /> Salvo</>}
            </span>
            <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-[12.5px]">
              {(['escrever', 'previa'] as const).map((m) => (
                <button key={m} onClick={() => setModo(m)} className={`px-3 py-1 rounded-full ${modo === m ? 'bg-white shadow-controle text-charcoal' : 'text-muted'}`}>{m === 'escrever' ? 'Escrever' : 'Prévia'}</button>
              ))}
            </div>
          </div>
        </div>
        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
          {modo === 'escrever' ? (
            <article className={`${cartao} px-14 py-12`}>
              <div className="max-w-[680px] mx-auto">
                <Texto valor={r.titulo} onMudar={(v) => mudar({ titulo: v.replace(/\n/g, ' ') })} placeholder="Título da edição"
                  className="text-[34px] font-semibold leading-tight tracking-tight text-charcoal" />
                <Texto valor={r.subtitulo ?? ''} onMudar={(v) => mudar({ subtitulo: v.replace(/\n/g, ' ') || null })} placeholder="Subtítulo"
                  className="text-[18px] text-muted leading-snug mt-1" />

                <p className="text-[12px] text-muted mt-8 mb-2">{SECOES.abertura}</p>
                <Texto valor={r.abertura ?? ''} onMudar={(v) => mudar({ abertura: v || null })} placeholder="Comece pela cena."
                  className="text-[16px] leading-[1.8] text-charcoal min-h-[180px]" />

                <Divisor />
                <ListaItens titulo="No meu radar" dica={SECOES.radar} itens={r.radar} rascunhoId={r.id} onMudar={(l) => mudar({ radar: l })} />
                <Divisor />
                <ListaItens titulo="Consumindo" subtitulo="O que estou vendo, lendo, descobrindo." dica="Thumbnail ao lado e texto curto." itens={r.consumindo} rascunhoId={r.id} onMudar={(l) => mudar({ consumindo: l })} />
                <Divisor />

                <h2 className="text-[22px] font-semibold text-charcoal tracking-tight">Para levar para casa</h2>
                <p className="text-[12px] text-muted mt-1 mb-2">{SECOES.levar}</p>
                <Texto valor={r.levar ?? ''} onMudar={(v) => mudar({ levar: v || null })} placeholder="Menos copiar, mais ajustar o olhar…"
                  className="text-[16px] leading-[1.8] text-charcoal min-h-[100px]" />
                <p className="text-[15px] text-charcoal mt-3">NN</p>

                <div className="mt-12 rounded-xl bg-black/[0.03] p-4">
                  <div className="text-[12px] font-medium text-charcoal">Fontes de pesquisa <span className="text-muted font-normal">· uso interno, não vai para o Substack</span></div>
                  <Texto valor={r.fontes ?? ''} onMudar={(v) => mudar({ fontes: v || null })} placeholder="Links das matérias, livros, exposições."
                    className="text-[12.5px] leading-relaxed text-charcoal/80 mt-1" />
                </div>
              </div>
            </article>
          ) : (
            <article className={`${cartao} px-14 py-12`}>
              <div className="max-w-[640px] mx-auto">
                <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-charcoal">{r.titulo || 'Sem título'}</h1>
                {r.subtitulo && <p className="text-[18px] text-muted mt-1">{r.subtitulo}</p>}
                <div className="mt-8 text-[16px] leading-[1.8] text-charcoal [&_p]:mb-5 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-4 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_img]:rounded-lg [&_img]:mt-6 [&_img]:mb-1 [&_a]:underline [&_em]:text-muted [&_em]:text-[13px]"
                  dangerouslySetInnerHTML={{ __html: montarHTML(r) }} />
              </div>
            </article>
          )}

          <aside className="space-y-4">
            <div className={`${cartao} p-4`}>
              <div className="text-[12px] text-muted mb-1.5">Status</div>
              <div className="grid grid-cols-2 gap-1">
                {STATUS_RASCUNHO.map((s) => (
                  <button key={s.id} onClick={() => mudarStatus(s.id)} className={`px-2 py-1 rounded-full text-[12px] ${r.status === s.id ? 'bg-charcoal text-white' : 'bg-black/[0.04] text-charcoal/75'}`}>{s.nome}</button>
                ))}
              </div>
              <label className="block text-[12px] text-muted mt-3 mb-1">Data prevista</label>
              <input type="date" value={r.data_prevista ?? ''} onChange={(e) => mudar({ data_prevista: e.target.value || null })} className={campo} />
              {r.status === 'publicada' && (
                <>
                  <label className="block text-[12px] text-muted mt-3 mb-1">Link no Substack</label>
                  <input value={r.link_substack ?? ''} onChange={(e) => mudar({ link_substack: e.target.value || null })} placeholder="https://casanogs.substack.com/p/…" className={campo} />
                </>
              )}
            </div>

            <div className={`${cartao} p-4`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-muted">Palavras</span>
                <span className="text-[12px] text-muted">meta {PALAVRAS.minimo} a {PALAVRAS.maximo}</span>
              </div>
              <div className="text-[26px] font-semibold text-charcoal tabular-nums">{palavras}</div>
              <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden mt-1">
                <div className={`h-full rounded-full ${palavras > PALAVRAS.maximo ? 'bg-[#8C6B3F]' : 'bg-olive'}`} style={{ width: `${pctPalavras}%` }} />
              </div>
              <div className="text-[11.5px] text-muted mt-1">
                {palavras < PALAVRAS.minimo ? `faltam ${PALAVRAS.minimo - palavras} para o mínimo` : palavras > PALAVRAS.maximo ? `${palavras - PALAVRAS.maximo} acima do máximo` : 'no tamanho da Casa Nogs'}
              </div>
            </div>

            <div className={`${cartao} p-4 space-y-1.5`}>
              <div className="text-[12px] text-muted mb-1">Voz</div>
              <Aviso ok={voz.travessoes === 0}>{voz.travessoes === 0 ? 'Sem travessão' : `${voz.travessoes} ${voz.travessoes === 1 ? 'travessão' : 'travessões'}: troque por vírgula, ponto ou dois-pontos`}</Aviso>
              <Aviso ok={voz.banidas.length === 0}>{voz.banidas.length === 0 ? 'Nenhuma palavra banida' : `Banidas: ${voz.banidas.join(', ')}`}</Aviso>
              <Aviso ok={voz.empilhados === 0}>{voz.empilhados === 0 ? 'Prosa corrida na abertura' : 'Parágrafos curtos empilhados na abertura: encadeie as frases'}</Aviso>
              <Aviso ok={voz.exclamacoes === 0}>{voz.exclamacoes === 0 ? 'Sem exclamação' : `${voz.exclamacoes} ${voz.exclamacoes === 1 ? 'exclamação' : 'exclamações'}`}</Aviso>
              {voz.longas > 0 && <Aviso ok={false}>{voz.longas} {voz.longas === 1 ? 'frase longa' : 'frases longas'} (mais de 28 palavras)</Aviso>}
              <Aviso ok={r.radar.length >= 3 && r.radar.length <= 5}>{r.radar.length} {r.radar.length === 1 ? 'referência' : 'referências'} no radar (3 a 5)</Aviso>
              {voz.assinatura.length > 0 && <p className="text-[11.5px] text-muted pt-1">Vocabulário da marca: {voz.assinatura.join(', ')}</p>}
            </div>

            <div className={`${cartao} p-4`}>
              <div className="text-[12px] text-muted mb-1.5">O fechamento</div>
              {[...CHECKLIST_FECHAMENTO, ...CHECKLIST_GERAL].map((c, i) => (
                <label key={c.id} className={`flex items-start gap-2 text-[12.5px] leading-snug py-1 cursor-pointer ${i === CHECKLIST_FECHAMENTO.length ? 'border-t border-linha mt-1.5 pt-2.5' : ''}`}>
                  <input type="checkbox" checked={!!r.checklist[c.id]} onChange={() => marcar(c.id)} className="mt-0.5 accent-[#6B6F4E]" />
                  <span className={r.checklist[c.id] ? 'text-muted' : 'text-charcoal'}>{c.texto}</span>
                </label>
              ))}
            </div>

            <div className={`${cartao} p-4 space-y-2`}>
              <button onClick={() => copiar('html')} className="w-full px-3 py-2 rounded-full bg-charcoal text-white text-[12.5px] flex items-center justify-center gap-1.5">
                {copiado === 'html' ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar para o Substack</>}
              </button>
              <button onClick={() => copiar('texto')} className="w-full px-3 py-1.5 rounded-full bg-black/[0.05] text-charcoal text-[12px]">
                {copiado === 'texto' ? 'Copiado' : 'Copiar só o texto'}
              </button>
              <p className="text-[11px] text-muted leading-snug">Cola no editor do Substack com títulos, divisores e imagens. As fontes de pesquisa ficam de fora.</p>
            </div>

            <div className={`${cartao} p-4`}>
              <div className="text-[12px] text-muted mb-1.5">Para calibrar a voz</div>
              {CALIBRAR.map((c) => <div key={c.nome} className="text-[12.5px] text-charcoal py-0.5">{c.nome} <span className="text-muted">· {c.motivo}</span></div>)}
            </div>

            <div className={`${cartao} p-4`}>
              <Leituras supabase={supabase} compacto />
            </div>

            <button onClick={apagar} className="text-[12px] text-muted hover:text-charcoal flex items-center gap-1 px-1"><Trash2 size={12} /> Apagar rascunho</button>
          </aside>
        </div>
      </main>
    </div>
  )
}

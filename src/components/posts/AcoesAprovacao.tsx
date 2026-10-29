'use client'

import { useState } from 'react'
import { Check, MessageSquareText, PenLine, Undo2, Loader2 } from 'lucide-react'
import type { Post, Status } from '@/lib/posts/tipos'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-3 py-2 text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'
const botao = 'flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium transition-colors disabled:opacity-50'

export type MudarStatus = (p: Post, status: Status, nota?: string) => Promise<string | null>

/** Aprovar, pedir ajuste (com nota) ou devolver para aprovação. Usado na fila e na visão do mês. */
export default function AcoesAprovacao({ post, onMudar, onAbrir }: { post: Post; onMudar: MudarStatus; onAbrir: (p: Post) => void }) {
  const [pedindo, setPedindo] = useState(false)
  const [nota, setNota] = useState(post.nota_aprovacao ?? '')
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  async function mudar(status: Status, comNota?: string) {
    setOcupado(true)
    setAviso(await onMudar(post, status, comNota))
    setOcupado(false)
  }

  return (
    <div>
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
          {(post.status === 'ajuste' || post.status === 'agendado') && (
            <button disabled={ocupado} onClick={() => mudar('aprovacao')} className={`${botao} text-charcoal bg-white border border-black/[0.08] hover:bg-white/60`}>
              <Undo2 size={14} /> {post.status === 'ajuste' ? 'Ajustado, voltar para aprovação' : 'Voltar para aprovação'}
            </button>
          )}
          {(post.status === 'ideia' || post.status === 'rascunho') && (
            <button disabled={ocupado} onClick={() => mudar('aprovacao')} className={`${botao} text-charcoal bg-white border border-black/[0.08] hover:bg-white/60`}>
              Mandar para aprovação
            </button>
          )}
          <button onClick={() => onAbrir(post)} className={`${botao} ml-auto text-muted hover:text-charcoal hover:bg-black/[0.04]`}>
            <PenLine size={14} /> Abrir no editor
          </button>
        </div>
      )}
      {aviso && <p className="mt-2 text-[12.5px] text-accent">{aviso}</p>}
    </div>
  )
}

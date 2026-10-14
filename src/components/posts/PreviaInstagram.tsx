'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import type { Midia, PostEditavel } from '@/lib/posts/tipos'

const PERFIL = 'nicollenogueirastudio'

interface Props {
  post: PostEditavel
  midias: Midia[]
}

/** Como o post fica no feed do Instagram (ou na tela cheia, se for story). */
export default function PreviaInstagram({ post, midias }: Props) {
  const [indice, setIndice] = useState(0)
  const atual = midias[Math.min(indice, midias.length - 1)]
  const story = post.tipo === 'story'

  const midia = atual?.url ? (atual.tipo === 'video'
    ? <video src={atual.url} className="w-full h-full object-cover" controls muted />
    : <img src={atual.url} alt="" className="w-full h-full object-cover" />)
    : <div className="w-full h-full flex items-center justify-center text-xs text-muted">sem mídia</div>

  if (story) {
    return (
      <div className="w-[260px] aspect-[9/16] bg-dark relative overflow-hidden rounded-[22px] shadow-flutuante mx-auto">
        {midia}
        <div className="absolute top-2 inset-x-2 h-0.5 bg-white/40" />
        <div className="absolute top-4 left-3 flex items-center gap-2 text-white text-xs font-semibold drop-shadow">
          <span className="w-6 h-6 rounded-full bg-white text-dark flex items-center justify-center text-[11px] font-semibold">N</span>{PERFIL}
        </div>
      </div>
    )
  }

  return (
    <div className="w-[320px] bg-white rounded-[22px] shadow-flutuante overflow-hidden mx-auto text-[13px] text-black">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="w-7 h-7 rounded-full bg-dark text-white flex items-center justify-center text-[12px] font-semibold ring-2 ring-white outline outline-1 outline-black/10">N</span>
        <span className="font-semibold">{PERFIL}</span>
      </div>
      <div className={`relative bg-warm-beige ${post.tipo === 'reels' ? 'aspect-[9/16]' : 'aspect-[4/5]'}`}>
        {midia}
        {midias.length > 1 && (
          <>
            {indice > 0 && (
              <button onClick={() => setIndice(indice - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><ChevronLeft size={14} /></button>
            )}
            {indice < midias.length - 1 && (
              <button onClick={() => setIndice(indice + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><ChevronRight size={14} /></button>
            )}
            <span className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">{indice + 1}/{midias.length}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 px-3 pt-2.5">
        <Heart size={20} /><MessageCircle size={20} /><Send size={20} />
        {midias.length > 1 && (
          <div className="flex-1 flex justify-center gap-1 -ml-16">
            {midias.map((m, i) => <span key={m.id} className={`w-1.5 h-1.5 rounded-full ${i === indice ? 'bg-sky-500' : 'bg-black/20'}`} />)}
          </div>
        )}
        <Bookmark size={20} className="ml-auto" />
      </div>
      <div className="px-3 py-2 whitespace-pre-wrap break-words leading-snug">
        <span className="font-semibold mr-1">{PERFIL}</span>
        {post.legenda || <span className="text-black/40">sua legenda aparece aqui</span>}
        {post.hashtags && <div className="text-[#00376b] mt-2">{post.hashtags}</div>}
      </div>
      {post.primeiro_comentario && (
        <div className="px-3 pb-3 text-black/70 break-words">
          <span className="font-semibold text-black mr-1">{PERFIL}</span>{post.primeiro_comentario}
        </div>
      )}
    </div>
  )
}

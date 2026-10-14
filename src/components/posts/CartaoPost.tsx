'use client'

import { Film, Layers, Image as ImageIcon, Circle } from 'lucide-react'
import { partesBR } from '@/lib/datas'
import { STATUS, type Post } from '@/lib/posts/tipos'
import { corPilar, estiloStatus } from './estilos'

const iconeTipo = { feed: ImageIcon, carrossel: Layers, reels: Film, story: Circle }

interface Props {
  post: Post
  onAbrir: (post: Post) => void
  compacto?: boolean
}

export default function CartaoPost({ post, onAbrir, compacto }: Props) {
  const Icone = iconeTipo[post.tipo]
  const capa = post.midias[0]
  const hora = post.data_hora ? partesBR(post.data_hora).hora : null
  const nome = post.titulo || post.legenda?.slice(0, 40) || 'Sem título'

  // Versão de uma linha, como um evento no Calendário do Mac.
  if (compacto) {
    return (
      <button
        type="button"
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text/post-id', post.id)}
        onClick={(e) => { e.stopPropagation(); onAbrir(post) }}
        className="w-full text-left flex items-center gap-1.5 rounded-md px-1.5 py-[3px] hover:bg-black/[0.05] transition-colors cursor-grab active:cursor-grabbing"
      >
        <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${post.pilar ? corPilar[post.pilar] : 'bg-black/15'}`} />
        <span className="text-[12px] text-charcoal truncate flex-1">{nome}</span>
        {hora && <span className="text-[11px] text-muted tabular-nums">{hora}</span>}
      </button>
    )
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/post-id', post.id)}
      onClick={(e) => { e.stopPropagation(); onAbrir(post) }}
      className="w-full text-left bg-white rounded-xl border border-linha shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-card transition-shadow flex items-center gap-2.5 p-2 cursor-grab active:cursor-grabbing"
    >
      <div className="w-10 h-12 shrink-0 rounded-lg bg-cream overflow-hidden flex items-center justify-center">
        {capa?.url
          ? (capa.tipo === 'video'
            ? <video src={capa.url} className="w-full h-full object-cover" muted />
            : <img src={capa.url} alt="" className="w-full h-full object-cover" />)
          : <Icone size={14} className="text-muted/70" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-charcoal truncate">{nome}</div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted">
          {post.pilar && <span className={`w-1.5 h-1.5 rounded-full ${corPilar[post.pilar]}`} />}
          <Icone size={11} />
          {hora && <span className="tabular-nums">{hora}</span>}
          <span className={`ml-auto px-2 py-px rounded-full text-[10px] font-medium ${estiloStatus[post.status]}`}>
            {STATUS[post.status]}
          </span>
        </div>
      </div>
    </button>
  )
}

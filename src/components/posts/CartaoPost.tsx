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

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/post-id', post.id)}
      onClick={(e) => { e.stopPropagation(); onAbrir(post) }}
      className="w-full text-left bg-soft-white border border-black/5 hover:border-accent/40 transition-colors flex items-center gap-2 p-1.5 cursor-grab active:cursor-grabbing"
    >
      {!compacto && (
        <div className="w-10 h-12 shrink-0 bg-warm-beige overflow-hidden">
          {capa?.url && (capa.tipo === 'video'
            ? <video src={capa.url} className="w-full h-full object-cover" muted />
            : <img src={capa.url} alt="" className="w-full h-full object-cover" />)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] text-muted font-mono">
          {post.pilar && <span className={`w-1.5 h-1.5 rounded-full ${corPilar[post.pilar]}`} />}
          <Icone size={10} />
          {hora && <span>{hora}</span>}
        </div>
        <div className="text-xs text-charcoal truncate">{nome}</div>
        {!compacto && (
          <span className={`inline-block mt-0.5 px-1.5 py-px text-[9px] uppercase tracking-wider ${estiloStatus[post.status]}`}>
            {STATUS[post.status]}
          </span>
        )}
      </div>
    </button>
  )
}

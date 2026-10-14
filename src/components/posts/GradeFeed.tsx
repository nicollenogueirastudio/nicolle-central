'use client'

import { Film, Layers } from 'lucide-react'
import { dataBR } from '@/lib/datas'
import { apareceNaGrade } from '@/lib/posts/regras'
import { STATUS, type Post } from '@/lib/posts/tipos'

interface Props {
  posts: Post[]
  onAbrir: (post: Post) => void
}

/** Grade do perfil: 3 colunas, mais recente (ou mais futuro) primeiro, como o Instagram mostra. */
export default function GradeFeed({ posts, onAbrir }: Props) {
  const grade = posts
    .filter((p) => apareceNaGrade(p.tipo) && p.data_hora)
    .sort((a, b) => (b.data_hora! > a.data_hora! ? 1 : -1))

  if (grade.length === 0) {
    return <p className="text-sm text-muted p-8 text-center bg-soft-white border border-black/5">Nenhum post com data para montar a grade.</p>
  }

  return (
    <div className="max-w-[540px] mx-auto">
      <div className="grid grid-cols-3 gap-0.5 bg-soft-white">
        {grade.map((p) => {
          const capa = p.midias[0]
          const planejado = p.status !== 'postado'
          return (
            <button key={p.id} onClick={() => onAbrir(p)} className="relative aspect-[4/5] bg-warm-beige overflow-hidden group">
              {capa?.url ? (capa.tipo === 'video'
                ? <video src={capa.url} className="w-full h-full object-cover" muted />
                : <img src={capa.url} alt="" className="w-full h-full object-cover" />)
                : <span className="absolute inset-0 flex items-center justify-center p-2 text-[10px] text-muted text-center">{p.titulo || 'sem mídia'}</span>}
              {p.tipo === 'carrossel' && <Layers size={14} className="absolute top-1.5 right-1.5 text-white drop-shadow" />}
              {p.tipo === 'reels' && <Film size={14} className="absolute top-1.5 right-1.5 text-white drop-shadow" />}
              {planejado && (
                <span className="absolute bottom-0 inset-x-0 bg-dark/70 text-cream text-[9px] font-mono uppercase tracking-wider py-0.5">
                  {STATUS[p.status]} · {dataBR(p.data_hora!).slice(0, 5)}
                </span>
              )}
              <span className="absolute inset-0 ring-inset group-hover:ring-2 ring-gold" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

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
    return (
      <div className="bg-white rounded-2xl border border-linha shadow-card p-16 text-center">
        <p className="text-[15px] text-charcoal font-medium">A grade ainda está vazia</p>
        <p className="text-[13px] text-muted mt-1">Posts com data aparecem aqui como no seu perfil.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-linha shadow-card p-6">
      <div className="max-w-[500px] mx-auto rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 gap-[3px]">
          {grade.map((p) => {
            const capa = p.midias[0]
            const planejado = p.status !== 'postado'
            return (
              <button key={p.id} onClick={() => onAbrir(p)} className="relative aspect-[4/5] bg-cream overflow-hidden group">
                {capa?.url ? (capa.tipo === 'video'
                  ? <video src={capa.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" muted />
                  : <img src={capa.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />)
                  : <span className="absolute inset-0 flex items-center justify-center p-3 text-[11px] text-muted text-center">{p.titulo || 'Sem mídia'}</span>}
                {p.tipo === 'carrossel' && <Layers size={15} className="absolute top-2 right-2 text-white drop-shadow" />}
                {p.tipo === 'reels' && <Film size={15} className="absolute top-2 right-2 text-white drop-shadow" />}
                {planejado && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5">
                    {STATUS[p.status]} · {dataBR(p.data_hora!).slice(0, 5)}
                  </span>
                )}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

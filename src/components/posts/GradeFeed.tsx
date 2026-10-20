'use client'

import { useState } from 'react'
import { Film, Layers, Lock, ImagePlus, Loader2 } from 'lucide-react'
import { dataBR } from '@/lib/datas'
import { apareceNaGrade } from '@/lib/posts/regras'
import { STATUS, type Post } from '@/lib/posts/tipos'
import { corPilar } from './estilos'

interface Props {
  posts: Post[]
  onAbrir: (post: Post) => void
  onTrocar: (arrastado: string, alvo: string) => void   // troca o lugar (a data) de dois posts
  onSoltarArquivos: (arquivos: File[]) => void           // cada arquivo vira um post novo no fim da fila
  enviando?: boolean
}

/**
 * Planejador do feed: 3 colunas, mais recente (ou mais futuro) primeiro, como o Instagram mostra.
 * Arraste um post sobre outro para trocar de lugar; arraste uma ideia da lateral para pô-la no feed;
 * solte imagens do computador para testar como ficam na grade.
 */
export default function GradeFeed({ posts, onAbrir, onTrocar, onSoltarArquivos, enviando }: Props) {
  const [alvo, setAlvo] = useState<string | null>(null)
  const [arquivosEmCima, setArquivosEmCima] = useState(false)

  const grade = posts
    .filter((p) => apareceNaGrade(p.tipo) && p.data_hora)
    .sort((a, b) => (b.data_hora! > a.data_hora! ? 1 : -1))

  const temArquivos = (e: React.DragEvent) => e.dataTransfer.types.includes('Files')

  function soltarArquivos(e: React.DragEvent) {
    e.preventDefault()
    setArquivosEmCima(false)
    const lista = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
    if (lista.length) onSoltarArquivos(lista)
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-linha shadow-card p-6 transition-shadow ${arquivosEmCima ? 'ring-2 ring-accent/40' : ''}`}
      onDragOver={(e) => { if (temArquivos(e)) { e.preventDefault(); setArquivosEmCima(true) } }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setArquivosEmCima(false) }}
      onDrop={(e) => { if (temArquivos(e)) soltarArquivos(e) }}
    >
      <div className="max-w-[500px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[12px] text-muted flex-1">
            Arraste um post sobre outro para trocar de lugar. Os postados ficam fixos.
          </p>
          <label className="flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[12px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09] transition-colors cursor-pointer shrink-0">
            {enviando ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
            {enviando ? 'Enviando' : 'Testar imagens'}
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/quicktime"
              className="hidden"
              onChange={(e) => { const l = Array.from(e.target.files ?? []); e.target.value = ''; if (l.length) onSoltarArquivos(l) }}
            />
          </label>
        </div>

        {grade.length === 0 ? (
          <div className="rounded-xl border-[1.5px] border-dashed border-black/10 py-16 text-center">
            <p className="text-[15px] text-charcoal font-medium">A grade ainda está vazia</p>
            <p className="text-[13px] text-muted mt-1">Solte imagens aqui ou arraste uma ideia da lateral.</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden grid grid-cols-3 gap-[3px]">
            {grade.map((p) => {
              const capa = p.midias[0]
              const fixo = p.status === 'postado' || p.status === 'publicando'
              const emCima = alvo === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  draggable={!fixo}
                  onDragStart={(e) => e.dataTransfer.setData('text/post-id', p.id)}
                  onDragOver={(e) => {
                    if (fixo || !e.dataTransfer.types.includes('text/post-id')) return
                    e.preventDefault()
                    setAlvo(p.id)
                  }}
                  onDragLeave={() => setAlvo((a) => (a === p.id ? null : a))}
                  onDrop={(e) => {
                    const id = e.dataTransfer.getData('text/post-id')
                    setAlvo(null)
                    if (!id || fixo) return
                    e.preventDefault()
                    e.stopPropagation()
                    if (id !== p.id) onTrocar(id, p.id)
                  }}
                  onClick={() => onAbrir(p)}
                  className={`relative aspect-[4/5] bg-cream overflow-hidden group ${fixo ? '' : 'cursor-grab active:cursor-grabbing'}`}
                >
                  {capa?.url ? (capa.tipo === 'video'
                    ? <video src={capa.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" muted />
                    : <img src={capa.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />)
                    : <span className="absolute inset-0 flex items-center justify-center p-3 text-[11px] text-muted text-center">{p.titulo || 'Sem mídia'}</span>}
                  {p.tipo === 'carrossel' && <Layers size={15} className="absolute top-2 right-2 text-white drop-shadow" />}
                  {p.tipo === 'reels' && <Film size={15} className="absolute top-2 right-2 text-white drop-shadow" />}
                  {fixo && <Lock size={12} className="absolute top-2 left-2 text-white/90 drop-shadow" />}
                  {!fixo && (
                    <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5">
                      {p.pilar && <span className={`w-1.5 h-1.5 rounded-full ${corPilar[p.pilar]} ring-1 ring-white/50`} />}
                      {STATUS[p.status]} · {dataBR(p.data_hora!).slice(0, 5)}
                    </span>
                  )}
                  <span className={`absolute inset-0 transition-colors ${emCima ? 'bg-accent/25 ring-2 ring-inset ring-white' : 'bg-black/0 group-hover:bg-black/10'}`} />
                </button>
              )
            })}
          </div>
        )}

        {arquivosEmCima && (
          <p className="mt-3 text-center text-[12px] text-accent">Solte para criar um post com cada arquivo, no fim da fila.</p>
        )}
      </div>
    </div>
  )
}

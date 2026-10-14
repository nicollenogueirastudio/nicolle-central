'use client'

import { Plus } from 'lucide-react'
import { hojeISO, partesBR, somarDias, inicioDaSemana } from '@/lib/datas'
import type { Post } from '@/lib/posts/tipos'
import CartaoPost from './CartaoPost'

const NOMES_DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

interface Props {
  visao: 'mes' | 'semana'
  referencia: string // 'YYYY-MM-DD' dentro do mês/semana mostrado
  posts: Post[]
  onAbrir: (post: Post) => void
  onNovo: (data: string) => void
  onMover: (postId: string, data: string) => void
}

/** Dias visíveis: semana = 7 dias; mês = semanas completas (seg–dom) que cobrem o mês. */
export function diasVisiveis(visao: 'mes' | 'semana', referencia: string): string[] {
  if (visao === 'semana') {
    const inicio = inicioDaSemana(referencia)
    return Array.from({ length: 7 }, (_, i) => somarDias(inicio, i))
  }
  const primeiro = referencia.slice(0, 8) + '01'
  const ultimo = somarDias(somarDias(primeiro, 31).slice(0, 8) + '01', -1)
  const fim = somarDias(inicioDaSemana(ultimo), 6)
  const dias: string[] = []
  for (let d = inicioDaSemana(primeiro); d <= fim; d = somarDias(d, 1)) dias.push(d)
  return dias
}

export default function Calendario({ visao, referencia, posts, onAbrir, onNovo, onMover }: Props) {
  const dias = diasVisiveis(visao, referencia)
  const hoje = hojeISO()
  const mes = referencia.slice(0, 7)

  const porDia = new Map<string, Post[]>()
  for (const p of posts) {
    if (!p.data_hora) continue
    const dia = partesBR(p.data_hora).data
    porDia.set(dia, [...(porDia.get(dia) ?? []), p])
  }

  return (
    <div className="bg-soft-white border border-black/5">
      <div className="grid grid-cols-7 border-b border-black/5">
        {NOMES_DIAS.map((n) => (
          <div key={n} className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{n}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia) => {
          const doMes = visao === 'semana' || dia.slice(0, 7) === mes
          const lista = porDia.get(dia) ?? []
          return (
            <div
              key={dia}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const id = e.dataTransfer.getData('text/post-id')
                if (id) onMover(id, dia)
              }}
              onClick={() => onNovo(dia)}
              className={`group border-r border-b border-black/5 p-1.5 cursor-pointer hover:bg-cream/60 transition-colors
                ${visao === 'semana' ? 'min-h-[420px]' : 'min-h-[118px]'} ${doMes ? '' : 'bg-cream/40'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-xs w-6 h-6 flex items-center justify-center
                  ${dia === hoje ? 'bg-dark text-cream rounded-full' : doMes ? 'text-charcoal' : 'text-muted/50'}`}>
                  {Number(dia.slice(8))}
                </span>
                <Plus size={12} className="text-muted opacity-0 group-hover:opacity-100" />
              </div>
              <div className="space-y-1">
                {lista.map((p) => (
                  <CartaoPost key={p.id} post={p} onAbrir={onAbrir} compacto={visao === 'mes'} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

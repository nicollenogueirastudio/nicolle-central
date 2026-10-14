'use client'

import { Plus } from 'lucide-react'
import { hojeISO, partesBR, somarDias, inicioDaSemana } from '@/lib/datas'
import type { Post } from '@/lib/posts/tipos'
import CartaoPost from './CartaoPost'

const NOMES_DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

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
    <div className="bg-white rounded-2xl border border-linha shadow-card overflow-hidden">
      <div className="grid grid-cols-7">
        {NOMES_DIAS.map((n, i) => (
          <div key={n} className={`px-3 pt-3 pb-2 text-[11px] font-medium text-right ${i >= 5 ? 'text-muted/70' : 'text-muted'}`}>{n}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia, i) => {
          const doMes = visao === 'semana' || dia.slice(0, 7) === mes
          const lista = porDia.get(dia) ?? []
          const ehHoje = dia === hoje
          const fimDeSemana = i % 7 >= 5
          return (
            <div
              key={dia}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.dataset.alvo = '1' }}
              onDragLeave={(e) => { delete e.currentTarget.dataset.alvo }}
              onDrop={(e) => {
                e.preventDefault()
                delete e.currentTarget.dataset.alvo
                const id = e.dataTransfer.getData('text/post-id')
                if (id) onMover(id, dia)
              }}
              onClick={() => onNovo(dia)}
              className={`group relative border-t border-linha p-1.5 cursor-pointer transition-colors
                data-[alvo]:bg-accent/[0.07] hover:bg-black/[0.015]
                ${i % 7 !== 0 ? 'border-l' : ''}
                ${visao === 'semana' ? 'min-h-[440px]' : 'min-h-[124px]'}
                ${fimDeSemana && doMes ? 'bg-black/[0.012]' : ''}`}
            >
              <div className="flex items-center justify-between mb-1 px-0.5">
                <Plus size={13} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`text-[13px] tabular-nums w-[26px] h-[26px] flex items-center justify-center rounded-full
                  ${ehHoje ? 'bg-accent text-white font-semibold' : doMes ? 'text-charcoal' : 'text-muted/40'}`}>
                  {Number(dia.slice(8))}
                </span>
              </div>
              <div className={visao === 'semana' ? 'space-y-1.5' : 'space-y-px'}>
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

'use client'

import { cartao } from './ui'
import { dataBR } from '@/lib/datas'
import type { Retrato } from '@/lib/performance/dados'
import { intervalo, rotulo, type Periodo } from '@/lib/performance/periodos'
import { REDES, type Conexao, type Rede } from '@/lib/redes/tipos'

/** Todas as redes lado a lado: público atual e quanto mudou no período. */
export default function AbaGeral({ redes, retratos, conexoes, periodo, onAbrir }: {
  redes: Rede[]
  retratos: Partial<Record<Rede, Retrato[]>>
  conexoes: Conexao[]
  periodo: Periodo
  onAbrir: (r: Rede) => void
}) {
  const i = intervalo(periodo)
  const linhas = redes.map((rede) => {
    const lista = (retratos[rede] ?? []).filter((r) => r.seguidores != null)
    const ultimo = lista[lista.length - 1]
    const noPeriodo = lista.filter((r) => r.dia >= i.diaDe && r.dia < i.diaAte)
    const ganho = noPeriodo.length > 1 ? noPeriodo[noPeriodo.length - 1].seguidores! - noPeriodo[0].seguidores! : null
    const c = conexoes.find((x) => x.rede === rede)
    return { rede, ultimo, ganho, status: c?.status ?? 'desconectada', manual: lista.some((r) => r.origem === 'manual'), desde: lista[0]?.dia }
  })
  const total = linhas.reduce((s, l) => s + (l.ultimo?.seguidores ?? 0), 0)

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-[260px_1fr] gap-5">
        <div className={`${cartao} p-5`}>
          <div className="text-[12px] text-muted">Público somado</div>
          <div className="font-display text-[34px] leading-tight text-charcoal tabular-nums mt-1">{total ? total.toLocaleString('pt-BR') : '—'}</div>
          <p className="text-[12px] text-muted mt-1">Seguidores, inscritos e assinantes de todas as redes com número. Uma pessoa pode estar em mais de uma.</p>
        </div>

        <div className={`${cartao} overflow-hidden`}>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-linha">
                <th className="font-medium px-5 py-2.5">Rede</th>
                <th className="font-medium py-2.5 text-right pr-6">Público</th>
                <th className="font-medium py-2.5 text-right pr-6">Em {rotulo(periodo)}</th>
                <th className="font-medium py-2.5 pr-5">Origem dos números</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.rede} onClick={() => onAbrir(l.rede)} className="border-b border-linha last:border-0 hover:bg-black/[0.02] cursor-pointer">
                  <td className="px-5 py-3 text-charcoal font-medium">{l.rede === 'substack' ? 'Casa Nogs' : REDES[l.rede]}</td>
                  <td className="py-3 text-right pr-6 tabular-nums text-charcoal">{l.ultimo?.seguidores?.toLocaleString('pt-BR') ?? <span className="text-muted">—</span>}</td>
                  <td className="py-3 text-right pr-6 tabular-nums">
                    {l.ganho == null ? <span className="text-muted">—</span> : <span className={l.ganho >= 0 ? 'text-olive font-medium' : 'text-[#8C6B3F] font-medium'}>{l.ganho > 0 ? '+' : ''}{l.ganho.toLocaleString('pt-BR')}</span>}
                  </td>
                  <td className="py-3 pr-5 text-[12px] text-muted">
                    {l.status === 'conectada' ? 'automático' : l.manual ? 'anotado à mão' : 'não conectada'}
                    {l.desde && <> · desde {dataBR(l.desde + 'T12:00:00Z')}</>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="text-[12px] text-muted">A variação no período aparece quando há pelo menos dois dias com número dentro dele. Clique numa rede para abrir a aba.</p>
    </div>
  )
}

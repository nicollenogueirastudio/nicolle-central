'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ExternalLink } from 'lucide-react'
import { ColunasMes } from './Graficos'
import { cartao, Tile, Variacao } from './ui'
import { dataBR, partesBR } from '@/lib/datas'
import { media, type Retrato } from '@/lib/performance/dados'
import { intervalo, moverPeriodo, mesesDoPeriodo, rotulo, nomeAnterior, type Periodo } from '@/lib/performance/periodos'

type Edicao = { id: string; titulo: string; link: string; imagem: string | null; publicado_em: string | null; aberturas_pct: number | null; visualizacoes: number | null; novos_assinantes: number | null }
const MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export default function AbaCasaNogs({ supabase, periodo, retratos }: { supabase: SupabaseClient; periodo: Periodo; retratos: Retrato[] }) {
  const [edicoes, setEdicoes] = useState<Edicao[]>([])

  useEffect(() => {
    supabase.from('substack_edicoes').select('id, titulo, link, imagem, publicado_em, aberturas_pct, visualizacoes, novos_assinantes')
      .order('publicado_em', { ascending: false })
      .then(({ data }) => setEdicoes((data ?? []) as Edicao[]))
  }, [supabase])

  const i = intervalo(periodo), a = intervalo(moverPeriodo(periodo, -1))
  const dentro = (e: Edicao, x: { de: string; ate: string }) => !!e.publicado_em && e.publicado_em >= x.de && e.publicado_em < x.ate
  const doPeriodo = edicoes.filter((e) => dentro(e, i))
  const doAnterior = edicoes.filter((e) => dentro(e, a))
  const nomeAnt = nomeAnterior[periodo.escala]

  const abertura = media(doPeriodo.map((e) => e.aberturas_pct))
  const aberturaAntes = media(doAnterior.map((e) => e.aberturas_pct))
  const novos = doPeriodo.reduce((s, e) => s + (e.novos_assinantes ?? 0), 0)
  const assinantes = [...retratos].reverse().find((r) => r.seguidores != null)
  const porMes = mesesDoPeriodo(periodo).map((m) => ({
    rotulo: MES_CURTO[Number(m.slice(5)) - 1],
    valor: edicoes.filter((e) => e.publicado_em && partesBR(e.publicado_em).data.slice(0, 7) === m).length || null,
  }))

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-4 gap-4">
        <Tile rotulo="Edições publicadas" valor={String(doPeriodo.length)} nota={<Variacao atual={doPeriodo.length} anterior={doAnterior.length || null} nome={nomeAnt} />} />
        <Tile rotulo="Abertura média" valor={abertura == null ? '—' : `${abertura.toFixed(0)}%`} nota={abertura == null ? <span className="text-[12px] text-muted">anote em <Link href="/newsletter" className="underline underline-offset-2">Newsletter</Link></span> : <Variacao atual={abertura} anterior={aberturaAntes} nome={nomeAnt} />} />
        <Tile rotulo="Novos assinantes" valor={novos ? novos.toLocaleString('pt-BR') : '—'} nota={<span className="text-[12px] text-muted">soma do anotado nas edições</span>} />
        <Tile rotulo="Assinantes" valor={assinantes?.seguidores?.toLocaleString('pt-BR') ?? '—'} nota={<span className="text-[12px] text-muted">{assinantes ? `anotado em ${dataBR(assinantes.dia + 'T12:00:00Z')}` : 'anote em Newsletter'}</span>} />
      </section>

      {porMes.length > 1 && (
        <section className={`${cartao} p-5`}>
          <div className="text-[14px] font-medium text-charcoal">Edições por mês</div>
          <p className="text-[12px] text-muted">A promessa é semanal: 4 ou 5 por mês.</p>
          <ColunasMes colunas={porMes} formatar={(n) => String(n ?? '')} />
        </section>
      )}

      <section className={`${cartao} overflow-hidden`}>
        <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
          <span className="text-[14px] font-medium text-charcoal">Edições · {rotulo(periodo)}</span>
          <Link href="/newsletter" className="text-[12px] text-muted hover:text-charcoal">Anotar números →</Link>
        </div>
        {doPeriodo.length === 0
          ? <p className="text-[13px] text-muted pb-8 text-center">Nenhuma edição em {rotulo(periodo)}.</p>
          : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] text-muted border-y border-linha">
                  <th className="font-medium px-5 py-2">Edição</th>
                  <th className="font-medium py-2 w-[100px]">Data</th>
                  <th className="font-medium py-2 pr-5 text-right w-[90px]">Abertura</th>
                  <th className="font-medium py-2 pr-5 text-right w-[100px]">Visualiz.</th>
                  <th className="font-medium py-2 pr-5 text-right w-[100px]">Novos assin.</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {doPeriodo.map((e) => (
                  <tr key={e.id} className="border-b border-linha last:border-0">
                    <td className="px-5 py-2.5 text-charcoal truncate max-w-[420px]">{e.titulo}</td>
                    <td className="py-2.5 text-charcoal/80 tabular-nums">{dataBR(e.publicado_em!)}</td>
                    <td className="py-2.5 pr-5 text-right tabular-nums">{e.aberturas_pct == null ? <span className="text-muted">—</span> : `${e.aberturas_pct}%`}</td>
                    <td className="py-2.5 pr-5 text-right tabular-nums">{e.visualizacoes?.toLocaleString('pt-BR') ?? <span className="text-muted">—</span>}</td>
                    <td className="py-2.5 pr-5 text-right tabular-nums">{e.novos_assinantes?.toLocaleString('pt-BR') ?? <span className="text-muted">—</span>}</td>
                    <td className="py-2.5 pr-4"><a href={e.link} target="_blank" rel="noreferrer" aria-label="Abrir" className="text-muted hover:text-charcoal"><ExternalLink size={13} /></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </section>
    </div>
  )
}

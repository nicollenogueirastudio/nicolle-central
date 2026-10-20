'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import { ExternalLink } from 'lucide-react'
import { hojeISO, inicioDaSemana, somarDias, diaCurto, partesBR } from '@/lib/datas'
import type { Ideia } from './Ideias'

type Edicao = { id: string; titulo: string; link: string; publicado_em: string | null }
export type Note = { id: number; publicado_em: string; texto: string | null; imagens: string[]; curtidas: number | null; restacks: number | null; respostas: number | null }

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const ANTES = 3
const DEPOIS = 6
const STATUS: Record<string, string> = { ideia: 'ideia', pesquisa: 'em pesquisa', escrevendo: 'escrevendo', publicada: 'publicada' }

/** O texto do note sem a assinatura "NN" do fim. */
export const textoDoNote = (n: Note) => (n.texto ?? '').replace(/\s*NN\s*$/, '')

/** Semana a semana: a edição (a promessa é semanal) e os notes, publicados e planejados. */
export default function Cronograma({ supabase, edicoes, notes, ideias, onMudou }: {
  supabase: SupabaseClient; edicoes: Edicao[]; notes: Note[]; ideias: Ideia[]; onMudou: () => void
}) {
  const hoje = hojeISO()
  const atual = inicioDaSemana(hoje)
  const semanas = Array.from({ length: ANTES + DEPOIS }, (_, i) => somarDias(atual, 7 * (i - ANTES)))
  const naSemana = (dia: string | null, s: string) => !!dia && dia >= s && dia < somarDias(s, 7)
  const semData = (tipo: Ideia['tipo']) => ideias.filter((i) => i.tipo === tipo && !i.data_prevista && i.status !== 'publicada')

  async function agendar(id: string, dia: string) {
    await supabase.from('newsletter_ideias').update({ data_prevista: dia }).eq('id', id)
    onMudou()
  }

  function Escolher({ tipo, semana }: { tipo: Ideia['tipo']; semana: string }) {
    const opcoes = semData(tipo)
    if (!opcoes.length) return null
    return (
      <select value="" onChange={(e) => e.target.value && agendar(e.target.value, semana < hoje ? hoje : semana)}
        className="mt-1 max-w-full rounded-lg border border-dashed border-black/15 bg-transparent px-2 py-1 text-[12px] text-muted outline-none hover:border-black/30">
        <option value="">+ pôr {tipo === 'edicao' ? 'uma ideia de edição' : 'um note'} aqui</option>
        {opcoes.map((i) => <option key={i.id} value={i.id}>{i.titulo}</option>)}
      </select>
    )
  }

  return (
    <section className={`${cartao} overflow-hidden mb-5`}>
      <div className="px-5 pt-5 pb-3 flex items-baseline justify-between gap-4">
        <span className="text-[14px] font-medium text-charcoal">Cronograma</span>
        <span className="text-[12px] text-muted">Publicados vêm do Substack. Planejados são as ideias com data: escolha Edição ou Note no cartão da ideia.</span>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11px] text-muted border-y border-linha">
            <th className="font-medium px-5 py-2 w-[130px]">Semana</th>
            <th className="font-medium py-2 w-[44%]">Edição</th>
            <th className="font-medium py-2 pr-5">Notes</th>
          </tr>
        </thead>
        <tbody>
          {semanas.map((s) => {
            const passada = somarDias(s, 7) <= hoje
            const eds = edicoes.filter((e) => e.publicado_em && naSemana(partesBR(e.publicado_em).data, s))
            const edPlan = ideias.filter((i) => i.tipo === 'edicao' && i.status !== 'publicada' && naSemana(i.data_prevista, s))
            const nts = notes.filter((n) => naSemana(partesBR(n.publicado_em).data, s))
            const ntPlan = ideias.filter((i) => i.tipo === 'note' && i.status !== 'publicada' && naSemana(i.data_prevista, s))
            return (
              <tr key={s} className={`border-b border-linha last:border-0 align-top ${s === atual ? 'bg-olive/[0.04]' : ''}`}>
                <td className="px-5 py-3">
                  <div className={`tabular-nums ${s === atual ? 'text-charcoal font-medium' : 'text-charcoal/80'}`}>{diaCurto(s)}</div>
                  <div className="text-[11px] text-muted">{s === atual ? 'esta semana' : passada ? '' : 'a planejar'}</div>
                </td>
                <td className="py-3 pr-4 space-y-1">
                  {eds.map((e) => (
                    <a key={e.id} href={e.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-charcoal hover:underline underline-offset-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-olive shrink-0" />{e.titulo}<ExternalLink size={11} className="text-muted" />
                    </a>
                  ))}
                  {edPlan.map((i) => (
                    <div key={i.id} className="flex items-center gap-1.5 text-charcoal/85">
                      <span className="w-1.5 h-1.5 rounded-full border border-olive shrink-0" />{i.titulo}
                      <span className="text-[11px] text-muted">· {STATUS[i.status]} · {diaCurto(i.data_prevista!)}</span>
                    </div>
                  ))}
                  {!eds.length && !edPlan.length && passada && <span className="text-[12px] text-[#8C6B3F]">sem edição</span>}
                  {!eds.length && !passada && <Escolher tipo="edicao" semana={s} />}
                </td>
                <td className="py-3 pr-5 space-y-1">
                  {nts.map((n) => (
                    <div key={n.id} className="flex items-start gap-1.5 text-charcoal/85">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-olive shrink-0" />
                      <span className="line-clamp-1">{textoDoNote(n) || 'Só imagem'}</span>
                      <span className="text-[11px] text-muted whitespace-nowrap tabular-nums">· {n.curtidas ?? 0} curtidas</span>
                    </div>
                  ))}
                  {ntPlan.map((i) => (
                    <div key={i.id} className="flex items-center gap-1.5 text-charcoal/85">
                      <span className="w-1.5 h-1.5 rounded-full border border-olive shrink-0" />{i.titulo}<span className="text-[11px] text-muted">· {diaCurto(i.data_prevista!)}</span>
                    </div>
                  ))}
                  {!nts.length && !ntPlan.length && passada && <span className="text-[12px] text-muted">—</span>}
                  {!passada && <Escolher tipo="note" semana={s} />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

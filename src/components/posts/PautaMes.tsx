'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, Loader2, Film, Layers, Image as ImageIcon, Circle } from 'lucide-react'
import { partesBR, diaCurto, inicioDaSemana } from '@/lib/datas'
import { quadroPorId, RITMO_SEMANA } from '@/lib/posts/estrategia'
import { montarPacote, planilhaCSV } from '@/lib/posts/pacote'
import { apareceNaGrade } from '@/lib/posts/regras'
import { CATEGORIAS, PILARES, STATUS, STATUS_MANUAIS, TIPOS, type Post, type Status } from '@/lib/posts/tipos'
import { corPilar, estiloStatus } from './estilos'

const iconeTipo = { feed: ImageIcon, carrossel: Layers, reels: Film, story: Circle }

// As etapas do fluxo, na ordem em que o post anda.
const FLUXO: Status[] = ['ideia', 'rascunho', 'aprovacao', 'ajuste', 'agendado', 'postado']

interface Props {
  posts: Post[]       // posts com data do mês mostrado
  nomeMes: string
  onAbrir: (post: Post) => void
  onMudarStatus: (post: Post, status: Status) => Promise<string | null> // devolve o motivo se não puder
}

function baixar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** A planilha da agência, viva: pauta do mês, fluxo de aprovação e o pacote para quem for produzir. */
export default function PautaMes({ posts, nomeMes, onAbrir, onMudarStatus }: Props) {
  const [progresso, setProgresso] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const ordenados = [...posts].sort((a, b) => (a.data_hora! < b.data_hora! ? -1 : 1))

  // Ritmo: posts de feed por semana, contra os 2 a 3 do manual.
  const porSemana = new Map<string, number>()
  ordenados.filter((p) => apareceNaGrade(p.tipo)).forEach((p) => {
    const semana = inicioDaSemana(partesBR(p.data_hora!).data)
    porSemana.set(semana, (porSemana.get(semana) ?? 0) + 1)
  })
  const semanas = Array.from(porSemana.entries()).sort(([a], [b]) => (a < b ? -1 : 1))

  async function pacote() {
    setAviso(null)
    setProgresso('Preparando…')
    try {
      const blob = await montarPacote(ordenados, nomeMes, (f, t) => setProgresso(`Baixando mídias ${f} de ${t}`))
      baixar(blob, `Pacote ${nomeMes}.zip`)
    } catch (e) {
      setAviso(`Não foi possível montar o pacote: ${(e as Error).message}`)
    } finally {
      setProgresso(null)
    }
  }

  async function mudar(p: Post, s: Status) {
    setAviso(null)
    const motivo = await onMudarStatus(p, s)
    if (motivo) setAviso(motivo)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-linha shadow-card p-5">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[300px]">
            <div className="text-[13px] font-medium text-charcoal mb-3">Fluxo de produção</div>
            <div className="flex items-stretch gap-1">
              {FLUXO.map((s) => {
                const qtd = ordenados.filter((p) => p.status === s).length
                return (
                  <div key={s} className="flex-1 min-w-0">
                    <div className={`rounded-lg px-2.5 py-2 ${qtd ? estiloStatus[s] : 'bg-black/[0.03] text-muted'}`}>
                      <div className="text-[20px] leading-none font-display tabular-nums">{qtd}</div>
                      <div className="text-[11px] mt-1 truncate">{STATUS[s]}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="min-w-[220px]">
            <div className="text-[13px] font-medium text-charcoal mb-1">Ritmo do feed</div>
            <p className="text-[12px] text-muted mb-2.5">Manual: {RITMO_SEMANA.minimo} a {RITMO_SEMANA.maximo} por semana. Discrição é registro.</p>
            <div className="flex flex-wrap gap-1.5">
              {semanas.length === 0 && <span className="text-[12px] text-muted">Nada no mês ainda.</span>}
              {semanas.map(([semana, qtd]) => {
                const fora = qtd > RITMO_SEMANA.maximo
                return (
                  <span key={semana} title={`Semana de ${diaCurto(semana)}`}
                    className={`px-2.5 py-1 rounded-full text-[12px] tabular-nums ${fora ? 'bg-[#8C6B3F]/15 text-[#8C6B3F] font-medium' : 'bg-black/[0.05] text-charcoal'}`}>
                    {diaCurto(semana).replace(/\.$/, '')}: {qtd}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={pacote}
              disabled={!!progresso || ordenados.length === 0}
              className="flex items-center justify-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {progresso ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Pacote do mês
            </button>
            <button
              onClick={() => baixar(new Blob([planilhaCSV(ordenados)], { type: 'text/csv;charset=utf-8' }), `Planilha ${nomeMes}.csv`)}
              disabled={ordenados.length === 0}
              className="flex items-center justify-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09] transition-colors disabled:opacity-40"
            >
              <FileSpreadsheet size={14} /> Só a planilha
            </button>
          </div>
        </div>
        {(progresso || aviso) && <p className="mt-3 text-[12px] text-accent">{progresso ?? aviso}</p>}
        <p className="mt-3 text-[12px] text-muted">
          O pacote traz uma pasta por post, na ordem do mês, com as mídias numeradas como no carrossel, a legenda pronta para colar e uma planilha com tudo.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-linha shadow-card overflow-hidden">
        {ordenados.length === 0 ? (
          <p className="text-[13px] text-muted py-14 text-center">Nenhum post com data neste mês. Planeje pelo calendário ou pela grade.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-linha">
                <th className="font-medium px-4 py-2.5 w-[92px]">Data</th>
                <th className="font-medium py-2.5 w-[56px]"></th>
                <th className="font-medium py-2.5">Post</th>
                <th className="font-medium py-2.5 w-[130px]">Pilar</th>
                <th className="font-medium py-2.5 w-[110px]">Responsável</th>
                <th className="font-medium py-2.5 pr-4 w-[150px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((p) => {
                const partes = partesBR(p.data_hora!)
                const capa = p.midias[0]
                const Icone = iconeTipo[p.tipo]
                const q = quadroPorId(p.quadro)
                const manual = STATUS_MANUAIS.includes(p.status)
                return (
                  <tr key={p.id} className="border-b border-linha last:border-0 hover:bg-black/[0.02] cursor-pointer" onClick={() => onAbrir(p)}>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="text-charcoal tabular-nums first-letter:uppercase">{diaCurto(partes.data)}</div>
                      <div className="text-[11px] text-muted tabular-nums">{partes.hora}</div>
                    </td>
                    <td className="py-2">
                      <div className="w-10 h-12 rounded-md bg-cream overflow-hidden flex items-center justify-center">
                        {capa?.url
                          ? (capa.tipo === 'video' ? <video src={capa.url} className="w-full h-full object-cover" muted /> : <img src={capa.url} alt="" className="w-full h-full object-cover" />)
                          : <Icone size={13} className="text-muted/70" />}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="text-charcoal font-medium truncate max-w-[420px]">{p.titulo || p.legenda?.slice(0, 50) || 'Sem título'}</div>
                      <div className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
                        <Icone size={11} /> {TIPOS[p.tipo]}{p.categoria && <> · {CATEGORIAS[p.categoria]}</>}{q && <> · {q.nome}</>}
                        {p.nota_aprovacao && (p.status === 'ajuste' || p.status === 'aprovacao') && (
                          <span className="text-[#8C6B3F] truncate max-w-[260px]">· {p.nota_aprovacao}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5">
                      {p.pilar
                        ? <span className="flex items-center gap-1.5 text-charcoal"><span className={`w-2 h-2 rounded-full ${corPilar[p.pilar]}`} />{PILARES[p.pilar]}</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td className="py-2.5 text-charcoal/80 truncate">{p.responsavel || <span className="text-muted">—</span>}</td>
                    <td className="py-2.5 pr-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={p.status}
                        disabled={!manual}
                        onChange={(e) => mudar(p, e.target.value as Status)}
                        className={`w-full rounded-full px-2.5 py-1 text-[12px] font-medium border-0 outline-none cursor-pointer appearance-none ${estiloStatus[p.status]}`}
                      >
                        {(manual ? STATUS_MANUAIS : [p.status]).map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

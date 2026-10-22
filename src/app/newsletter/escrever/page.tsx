'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PenLine, Plus } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Leituras from '@/components/newsletter/Leituras'
import type { Ideia } from '@/components/newsletter/Ideias'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { registrarAtividade } from '@/lib/atividades'
import { dataBR, diaCurto } from '@/lib/datas'
import { contarPalavras, textoCorrido, STATUS_RASCUNHO, type Rascunho } from '@/lib/newsletter/escrita'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

export default function EscreverPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const router = useRouter()
  const [rascunhos, setRascunhos] = useState<Rascunho[]>([])
  const [ideias, setIdeias] = useState<Ideia[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [criando, setCriando] = useState(false)

  const carregar = useCallback(async () => {
    const r = await supabase.from('newsletter_rascunhos').select('*').order('atualizado_em', { ascending: false })
    if (r.error) return setErro(r.error.message)
    setRascunhos((r.data ?? []) as Rascunho[])
    const i = await supabase.from('newsletter_ideias').select('*').eq('tipo', 'edicao').neq('status', 'publicada').order('ordem')
    setIdeias((i.data ?? []) as Ideia[])
  }, [supabase])
  useEffect(() => { carregar() }, [carregar])

  async function nova(ideia?: Ideia) {
    setCriando(true)
    const { data, error } = await supabase.from('newsletter_rascunhos')
      .insert({ titulo: ideia?.titulo ?? '', ideia_id: ideia?.id ?? null, data_prevista: ideia?.data_prevista ?? null, fontes: ideia?.referencias ?? null })
      .select('id').single()
    if (error || !data) { setCriando(false); return setErro(error?.message ?? 'Não deu para criar') }
    if (ideia && ideia.status !== 'escrevendo') await supabase.from('newsletter_ideias').update({ status: 'escrevendo' }).eq('id', ideia.id)
    await registrarAtividade(supabase, 'criou', 'newsletter_rascunho', data.id, { titulo: ideia?.titulo ?? null })
    router.push(`/newsletter/escrever/${data.id}`)
  }

  const comRascunho = new Set(rascunhos.map((r) => r.ideia_id).filter(Boolean))
  const ideiasLivres = ideias.filter((i) => !comRascunho.has(i.id))

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Escrever" subtitle="As edições da Casa Nogs nascem aqui, na estrutura de sempre" />
        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        <div className="grid grid-cols-[1.4fr_1fr] gap-5 items-start">
          <div className="space-y-5">
            <section className={`${cartao} p-5`}>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[14px] font-medium text-charcoal">Edições em escrita</span>
                <button disabled={criando} onClick={() => nova()} className="px-3.5 py-1.5 rounded-full bg-charcoal text-white text-[12.5px] flex items-center gap-1.5 disabled:opacity-50"><Plus size={13} /> Nova edição</button>
              </div>
              <div className="divide-y divide-linha">
                {rascunhos.map((r) => {
                  const palavras = contarPalavras(textoCorrido(r))
                  return (
                    <Link key={r.id} href={`/newsletter/escrever/${r.id}`} className="flex items-center gap-4 py-3 -mx-2 px-2 rounded-lg hover:bg-black/[0.02]">
                      <PenLine size={15} className="text-muted shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] text-charcoal font-medium truncate">{r.titulo || 'Sem título'}</div>
                        <div className="text-[12px] text-muted">{palavras} palavras · {r.radar.length} no radar · editada em {dataBR(r.atualizado_em)}</div>
                      </div>
                      {r.data_prevista && <span className="text-[12px] text-olive font-medium">{diaCurto(r.data_prevista)}</span>}
                      <span className={`px-2 py-0.5 rounded-full text-[11.5px] ${r.status === 'pronta' ? 'bg-olive/15 text-olive' : 'bg-black/[0.05] text-charcoal/70'}`}>
                        {STATUS_RASCUNHO.find((s) => s.id === r.status)?.nome}
                      </span>
                    </Link>
                  )
                })}
                {rascunhos.length === 0 && <p className="text-[13px] text-muted py-8 text-center">Nenhuma edição em escrita. Comece uma nova ou parta de uma ideia ao lado.</p>}
              </div>
            </section>

            {ideiasLivres.length > 0 && (
              <section className={`${cartao} p-5`}>
                <div className="text-[14px] font-medium text-charcoal">Começar de uma ideia</div>
                <p className="text-[12px] text-muted mb-3">As ideias de edição do quadro da Casa Nogs. O título e as referências viram o começo do rascunho.</p>
                <div className="grid grid-cols-2 gap-2">
                  {ideiasLivres.map((i) => (
                    <button key={i.id} disabled={criando} onClick={() => nova(i)} className="text-left rounded-xl border border-linha p-3 hover:border-accent/50 hover:bg-black/[0.015] disabled:opacity-50">
                      <div className="text-[13px] text-charcoal font-medium leading-snug">{i.titulo}</div>
                      {i.angulo && <div className="text-[12px] text-muted line-clamp-2 mt-0.5">{i.angulo}</div>}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <section className={`${cartao} p-5`}>
            <Leituras supabase={supabase} />
          </section>
        </div>
      </main>
    </div>
  )
}

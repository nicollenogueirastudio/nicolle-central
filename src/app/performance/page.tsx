'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import AbaGeral from '@/components/performance/AbaGeral'
import AbaInstagram from '@/components/performance/AbaInstagram'
import AbaCasaNogs from '@/components/performance/AbaCasaNogs'
import AbaRede from '@/components/performance/AbaRede'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { hojeISO } from '@/lib/datas'
import type { Retrato } from '@/lib/performance/dados'
import { ESCALAS, periodoDe, moverPeriodo, rotulo, ehAtualOuFuturo, type Escala, type Periodo } from '@/lib/performance/periodos'
import { ORDEM_REDES, REDES, type Conexao, type Rede } from '@/lib/redes/tipos'

type Aba = 'geral' | Rede
const ABAS: { id: Aba; nome: string }[] = [
  { id: 'geral', nome: 'Visão geral' },
  ...ORDEM_REDES.map((r) => ({ id: r as Aba, nome: r === 'substack' ? 'Casa Nogs' : REDES[r] })),
]

export default function PerformancePage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const hojeMes = hojeISO().slice(0, 7)
  const [aba, setAba] = useState<Aba>('geral')
  const [periodo, setPeriodo] = useState<Periodo>(periodoDe('mes', hojeMes))
  const [retratos, setRetratos] = useState<Partial<Record<Rede, Retrato[]>>>({})
  const [conexoes, setConexoes] = useState<Conexao[]>([])
  const [erro, setErro] = useState<string | null>(null)

  // Lembra a aba e a escala escolhidas (conveniência por navegador).
  useEffect(() => {
    try {
      const a = localStorage.getItem('performance:aba') as Aba | null
      const e = localStorage.getItem('performance:escala') as Escala | null
      if (a && ABAS.some((x) => x.id === a)) setAba(a)
      if (e && ESCALAS.some((x) => x.id === e)) setPeriodo(periodoDe(e, hojeMes))
    } catch { /* sem armazenamento: segue com o padrão */ }
  }, [hojeMes])

  useEffect(() => {
    // Lê os retratos em páginas de 1000 (limite do Supabase por consulta).
    async function todosOsRetratos() {
      const linhas: (Retrato & { rede: Rede })[] = []
      for (let de = 0; ; de += 1000) {
        const { data, error } = await supabase.from('metricas_conta').select('rede, dia, seguidores, publicacoes, detalhe, origem')
          .order('dia', { ascending: true }).order('rede').range(de, de + 999)
        if (error) throw error
        linhas.push(...((data ?? []) as (Retrato & { rede: Rede })[]))
        if (!data || data.length < 1000) return linhas
      }
    }
    Promise.all([todosOsRetratos(), supabase.from('conexoes').select('*')])
      .then(([m, c]) => {
        const porRede: Partial<Record<Rede, Retrato[]>> = {}
        m.forEach((r) => { (porRede[r.rede] ??= []).push(r) })
        setRetratos(porRede)
        setConexoes((c.data ?? []) as Conexao[])
      })
      .catch((e) => setErro((e as Error).message))
  }, [supabase])

  function escolherAba(a: Aba) {
    setAba(a)
    try { localStorage.setItem('performance:aba', a) } catch { /* ignora */ }
  }
  function escolherEscala(e: Escala) {
    setPeriodo(periodoDe(e, hojeMes))
    try { localStorage.setItem('performance:escala', e) } catch { /* ignora */ }
  }

  const noFim = ehAtualOuFuturo(periodo, hojeMes)

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Performance" subtitle="Números reais de cada rede, lidos todos os dias às 7h" />

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">Não foi possível carregar: {erro}</div>}

        <div className="flex flex-wrap p-[3px] rounded-[10px] bg-black/[0.06] w-max mb-5">
          {ABAS.map((a) => (
            <button
              key={a.id}
              onClick={() => escolherAba(a.id)}
              className={`px-4 py-[5px] rounded-[7px] text-[13px] transition-all duration-200
                ${aba === a.id ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`}
            >
              {a.nome}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex p-[3px] rounded-[10px] bg-black/[0.06]">
            {ESCALAS.map((e) => (
              <button
                key={e.id}
                onClick={() => escolherEscala(e.id)}
                className={`px-3.5 py-[4px] rounded-[7px] text-[12.5px] transition-all duration-200
                  ${periodo.escala === e.id ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`}
              >
                {e.nome}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPeriodo(moverPeriodo(periodo, -1))} aria-label="Período anterior" className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-black/[0.05]"><ChevronLeft size={18} /></button>
            <button onClick={() => setPeriodo(moverPeriodo(periodo, 1))} disabled={noFim} aria-label="Próximo período" className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-black/[0.05] disabled:opacity-30"><ChevronRight size={18} /></button>
            <span className="font-display text-[22px] text-charcoal ml-2 first-letter:uppercase">{rotulo(periodo)}</span>
            {!noFim && <button onClick={() => setPeriodo(periodoDe(periodo.escala, hojeMes))} className="ml-3 px-3 py-1 rounded-full text-[12px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Atual</button>}
          </div>
        </div>

        {aba === 'geral' && <AbaGeral redes={ORDEM_REDES} retratos={retratos} conexoes={conexoes} periodo={periodo} onAbrir={(r) => escolherAba(r)} />}
        {aba === 'instagram' && <AbaInstagram supabase={supabase} periodo={periodo} retratos={retratos.instagram ?? []} />}
        {aba === 'substack' && <AbaCasaNogs supabase={supabase} periodo={periodo} retratos={retratos.substack ?? []} />}
        {(aba === 'pinterest' || aba === 'tiktok' || aba === 'youtube' || aba === 'linkedin') && (
          <AbaRede key={aba} rede={aba} nome={REDES[aba]} conexao={conexoes.find((c) => c.rede === aba)} retratos={retratos[aba] ?? []} periodo={periodo} />
        )}
      </main>
    </div>
  )
}

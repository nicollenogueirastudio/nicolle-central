'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { hojeISO } from '@/lib/datas'
import { PROPOSITO, VALORES, CULTURA, CLIENTES, FINANCAS, PRESTACAO, ORACAO, PASSOS, valorDoDia, type Valor } from '@/lib/principios'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

function Secao({ titulo, sub, children }: { titulo: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-[17px] font-medium text-charcoal tracking-tight">{titulo}</h2>
        {sub && <p className="text-[13px] text-muted mt-0.5">{sub}</p>}
      </div>
      {children}
    </section>
  )
}

function Lista({ itens }: { itens: string[] }) {
  return (
    <ul className="space-y-1.5">
      {itens.map((t) => (
        <li key={t} className="flex gap-2.5 text-[13.5px] text-charcoal/85 leading-relaxed">
          <span className="mt-[9px] w-1 h-1 rounded-full bg-olive shrink-0" />{t}
        </li>
      ))}
    </ul>
  )
}

export default function PrincipiosPage() {
  // O valor do dia é calculado no navegador, na data de Brasília.
  const [hoje, setHoje] = useState<Valor | null>(null)
  useEffect(() => { setHoje(valorDoDia(hojeISO())) }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1100px]">
        <Header title="Princípios" subtitle="O alicerce de cada decisão, parceria e entrega do studio." />

        <div className="space-y-10">
          {/* Propósito */}
          <section className="rounded-2xl bg-[#1D1D1F] px-8 py-8">
            <div className="text-[12px] text-white/50">Missão e propósito</div>
            <p className="mt-3 text-[22px] leading-snug text-white tracking-tight max-w-[760px]">“{PROPOSITO.declaracao}”</p>
            <p className="mt-5 text-[13px] text-white/60">Pergunta-chave: {PROPOSITO.pergunta}</p>
          </section>

          {/* Valores */}
          <Secao titulo="Valores inegociáveis" sub="Um por dia no dashboard, com a pergunta para o trabalho.">
            <div className="grid grid-cols-2 gap-4">
              {VALORES.map((v, i) => {
                const ehHoje = hoje?.nome === v.nome
                return (
                  <div key={v.nome} className={`${cartao} p-5 ${ehHoje ? 'ring-1 ring-olive/40' : ''}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-medium text-charcoal">
                        <span className="text-muted tabular-nums mr-2">{String(i + 1).padStart(2, '0')}</span>{v.nome}
                      </span>
                      {ehHoje && <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-olive/[0.12] text-olive">hoje</span>}
                    </div>
                    <p className="mt-3 text-[13.5px] text-charcoal/75 leading-relaxed">“{v.texto}”</p>
                    <p className="mt-1 text-[12px] text-muted">{v.referencia} (NVI)</p>
                    <p className="mt-4 pt-3 border-t border-linha text-[13px] text-charcoal leading-snug">{v.pergunta}</p>
                  </div>
                )
              })}
            </div>
          </Secao>

          {/* Cultura e clientes */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`${cartao} p-5`}>
              <div className="text-[14px] font-medium text-charcoal mb-1">Cultura da empresa</div>
              <p className="text-[12.5px] text-muted mb-3">Um ambiente onde:</p>
              <Lista itens={CULTURA} />
            </div>
            <div className={`${cartao} p-5`}>
              <div className="text-[14px] font-medium text-charcoal mb-1">Relacionamentos e clientes</div>
              <p className="text-[12.5px] text-muted mb-3">Em cada atendimento e projeto:</p>
              <Lista itens={CLIENTES} />
            </div>
          </div>

          {/* Finanças */}
          <Secao titulo="Estrutura financeira" sub="Os recursos do studio tratados como mordomia.">
            <div className={`${cartao} divide-y divide-linha`}>
              {FINANCAS.map((f, i) => (
                <div key={f.nome} className="grid grid-cols-[220px_1fr] gap-6 px-5 py-4">
                  <div className="text-[14px] font-medium text-charcoal leading-snug">
                    <span className="text-muted tabular-nums mr-2">{i + 1}</span>{f.nome}
                  </div>
                  <div className="space-y-2.5">
                    {f.texto && (
                      <p className="text-[13.5px] text-charcoal/75 leading-relaxed">“{f.texto}” <span className="text-[12px] text-muted whitespace-nowrap">· {f.referencia} (NVI)</span></p>
                    )}
                    <Lista itens={f.praticas} />
                    {!f.texto && (
                      <div className="rounded-xl bg-black/[0.025] px-4 py-3 space-y-1">
                        {PRESTACAO.map((p) => <p key={p} className="text-[13.5px] text-charcoal">{p}</p>)}
                        <p className="text-[12px] text-muted pt-1">Aparece no dashboard nos três primeiros dias de cada mês.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Secao>

          {/* Oração */}
          <Secao titulo="Oração para dedicar a empresa a Deus">
            <div className={`${cartao} px-8 py-7`}>
              <p className="text-[16px] text-charcoal/85 leading-relaxed max-w-[760px]">“{ORACAO}”</p>
            </div>
          </Secao>

          {/* Próximos passos */}
          <Secao titulo="Próximos passos práticos">
            <div className={`${cartao} overflow-hidden`}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[11.5px] text-muted border-b border-linha">
                    <th className="px-5 py-2.5 font-medium">Ação</th>
                    <th className="px-5 py-2.5 font-medium">Quando</th>
                    <th className="px-5 py-2.5 font-medium">Observações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linha">
                  {PASSOS.map((p) => (
                    <tr key={p.acao}>
                      <td className="px-5 py-3 text-charcoal">{p.acao}</td>
                      <td className="px-5 py-3 text-charcoal/75 whitespace-nowrap">{p.quando}</td>
                      <td className="px-5 py-3 text-muted">{p.obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Secao>
        </div>
      </main>
    </div>
  )
}

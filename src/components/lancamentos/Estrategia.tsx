'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FASES, MOVIMENTOS, REGRAS_DO_ARCO, LEGENDA, CHECKLIST, O_QUE_SE_MEDE, PROXIMOS, type Fase } from '@/lib/lancamentos/estrategia'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

/** O manual de lançamento, para consultar: princípio, fases, movimentos, legenda, checklist e o que se mede. */
export default function Estrategia() {
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-[1.2fr_1fr] gap-5">
        <div className="rounded-2xl bg-[#1D1D1F] text-white p-8">
          <div className="text-[12px] text-white/50">O princípio do arco</div>
          <h2 className="font-display text-[28px] tracking-tight leading-tight mt-1">Um projeto nunca estreia em um post só.</h2>
          <p className="text-[14px] text-white/75 leading-relaxed mt-3">
            Cada projeto é contado como um arco: começa no canteiro de obras, passa pelo clima, chega à revelação e se desdobra em prova social, arquivo e aprofundamento. Cerca de quatro meses entre o primeiro registro e o arquivamento.
          </p>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[['16', 'movimentos'], ['5', 'fases'], ['~4', 'meses por projeto'], ['4–5', 'posts de feed/mês']].map(([n, t]) => (
              <div key={t}>
                <div className="font-display text-[30px] tabular-nums">{n}</div>
                <div className="text-[11px] text-white/50">{t}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${cartao} p-6`}>
          <div className="text-[14px] font-medium text-charcoal mb-3">Regras do arco</div>
          <ol className="space-y-2.5">
            {REGRAS_DO_ARCO.map((r, i) => (
              <li key={r} className="flex gap-3 text-[13.5px] text-charcoal/85 leading-snug">
                <span className="text-[12px] text-muted tabular-nums pt-px">{String(i + 1).padStart(2, '0')}</span>{r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <h3 className="font-display text-[22px] text-charcoal tracking-tight mb-4">As cinco fases e os dezesseis movimentos</h3>
        <div className="space-y-5">
          {([1, 2, 3, 4, 5] as Fase[]).map((f) => (
            <div key={f} className={`${cartao} overflow-hidden`}>
              <div className="flex items-baseline gap-4 px-5 py-4 border-b border-linha">
                <span className="font-display text-[22px] text-charcoal w-8">{FASES[f].numero}</span>
                <div className="flex-1">
                  <div className="text-[15px] font-medium text-charcoal">{FASES[f].nome}</div>
                  <div className="text-[12.5px] text-muted">{FASES[f].resumo}</div>
                </div>
                <span className="text-[12px] text-muted">{FASES[f].quando}</span>
              </div>
              <div className="divide-y divide-linha">
                {MOVIMENTOS.filter((m) => m.fase === f).map((m) => {
                  const expandido = aberto === m.n
                  return (
                    <div key={m.n}>
                      <button onClick={() => setAberto(expandido ? null : m.n)} className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-black/[0.02]">
                        <span className="text-[12px] text-muted tabular-nums w-8">{String(m.n).padStart(2, '0')}</span>
                        <span className="text-[14px] text-charcoal flex-1">{m.nome}</span>
                        <span className="text-[12px] text-muted w-[180px] truncate">{m.formato}</span>
                        <span className="text-[12px] text-muted w-[150px] truncate">{m.canal}</span>
                        <ChevronDown size={15} className={`text-muted transition-transform ${expandido ? 'rotate-180' : ''}`} />
                      </button>
                      {expandido && (
                        <div className="grid grid-cols-[1fr_1fr] gap-6 px-5 pb-5 pl-[68px] animate-surgir">
                          <div className="space-y-3 text-[13.5px] leading-relaxed">
                            <div><div className="text-[11px] font-medium text-muted mb-0.5">O que é</div><p className="text-charcoal/85">{m.oQueE}</p></div>
                            <div><div className="text-[11px] font-medium text-muted mb-0.5">Por quê</div><p className="text-charcoal/85">{m.porQue}</p></div>
                            <div className="text-[12px] text-muted">Quando: <span className="text-charcoal">{m.quando}</span></div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-muted mb-1.5">Como executar</div>
                            <ul className="space-y-1.5">
                              {m.comoExecutar.map((c) => <li key={c} className="text-[13px] text-charcoal/85 flex gap-2"><span className="text-muted">—</span>{c}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-5">
        <div className={`${cartao} p-6`}>
          <div className="text-[12px] text-muted">A legenda</div>
          <div className="font-display text-[20px] text-charcoal tracking-tight mb-4">Toda comunicação é chance de subtrair.</div>
          <div className="space-y-2.5 mb-5">
            {LEGENDA.estrutura.map((e) => (
              <div key={e.parte} className="grid grid-cols-[110px_1fr] gap-3 text-[13.5px]">
                <span className="font-medium text-charcoal">{e.parte}</span>
                <span className="text-charcoal/80">{e.texto}</span>
              </div>
            ))}
          </div>
          <div className="text-[12px] font-medium text-muted mb-1.5">O que nunca entra</div>
          <ul className="space-y-1">
            {LEGENDA.nunca.map((n) => <li key={n} className="text-[13px] text-[#8C6B3F] flex gap-2"><span>—</span>{n}</li>)}
          </ul>
        </div>
        <div className={`${cartao} p-6`}>
          <div className="text-[12px] text-muted">Checklist de publicação</div>
          <div className="font-display text-[20px] text-charcoal tracking-tight mb-4">Sete perguntas antes de publicar.</div>
          <ol className="space-y-2">
            {CHECKLIST.map((c, i) => (
              <li key={c} className="flex gap-3 text-[13.5px] text-charcoal/85">
                <span className="w-5 h-5 shrink-0 rounded-full border-[1.5px] border-black/20 text-[10px] text-muted flex items-center justify-center tabular-nums">{i + 1}</span>{c}
              </li>
            ))}
          </ol>
          <p className="text-[12px] text-muted mt-4">Uma resposta negativa segura a peça.</p>
        </div>
      </section>

      <section className={`${cartao} p-6`}>
        <div className="text-[12px] text-muted">O que se mede</div>
        <div className="font-display text-[20px] text-charcoal tracking-tight mb-4">O arco se avalia pela profundidade, não pelo volume.</div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="text-[12px] font-medium text-olive">Medir</div>
            {O_QUE_SE_MEDE.medir.map((m) => (
              <div key={m.o} className="flex justify-between gap-4 text-[13.5px] border-b border-linha pb-2">
                <span className="text-charcoal">{m.o}</span><span className="text-muted text-[12.5px]">{m.porque}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-[12px] font-medium text-muted">Ignorar</div>
            {O_QUE_SE_MEDE.ignorar.map((m) => <div key={m} className="text-[13.5px] text-muted line-through decoration-black/20 border-b border-linha pb-2">{m}</div>)}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display text-[22px] text-charcoal tracking-tight mb-1">Evoluir · próximos movimentos</h3>
        <p className="text-[13px] text-muted mb-4">Ainda não têm regra: cada um passa pelo filtro da marca antes de entrar no arco.</p>
        <div className="grid grid-cols-3 gap-3">
          {PROXIMOS.map((p, i) => (
            <div key={p.nome} className={`${cartao} p-4`}>
              <div className="text-[11px] text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</div>
              <div className="text-[14px] font-medium text-charcoal">{p.nome}</div>
              <p className="text-[12.5px] text-charcoal/75 mt-1 leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

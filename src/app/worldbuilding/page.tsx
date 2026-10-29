import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { CONCEITO, EXEMPLOS, PREMISSA, MUNDO, REGIOES, nomeRegiao, PALETA, FORA, CANAIS, TESTE, PROXIMOS } from '@/lib/marca/worldbuilding'
import type { Territorio } from '@/lib/posts/estrategia'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const rotulo = 'text-[11px] font-medium text-muted uppercase tracking-[0.06em]'
const titulo = 'text-[22px] text-charcoal tracking-tight font-semibold'

export default function WorldbuildingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1200px] pb-24">
        <Header title="Worldbuilding" subtitle="O mundo da marca NN e como cada post, story e edição abre uma janela para ele." />

        {/* O conceito */}
        <section className="grid grid-cols-[1.4fr_1fr] gap-6 mb-12">
          <div className={`${cartao} p-6`}>
            <div className={rotulo}>O conceito</div>
            <p className="text-[15px] text-charcoal/90 leading-relaxed mt-2">{CONCEITO.definicao}</p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {CONCEITO.diferenca.map((d, i) => (
                <div key={d.nome} className={`rounded-xl px-4 py-3 ${i === 2 ? 'bg-olive/10' : 'bg-black/[0.035]'}`}>
                  <div className={`text-[12.5px] font-medium ${i === 2 ? 'text-olive' : 'text-charcoal'}`}>{d.nome}</div>
                  <p className="text-[12.5px] text-charcoal/80 leading-snug mt-0.5">{d.txt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className={`${cartao} p-6`}>
              <div className={rotulo}>O que você já fazia</div>
              <p className="text-[13.5px] text-charcoal/85 leading-relaxed mt-2">{CONCEITO.seusMoods}</p>
            </div>
            <div className={`${cartao} p-6`}>
              <div className={rotulo}>Marcas que constroem mundos</div>
              <ul className="mt-2 space-y-2">
                {EXEMPLOS.map((e) => (
                  <li key={e.marca} className="text-[13px] text-charcoal/85 leading-snug"><b className="font-medium text-charcoal">{e.marca}.</b> {e.txt}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* A premissa */}
        <section className="mb-12 rounded-2xl px-10 py-12 text-center" style={{ background: '#4E4639', color: '#F8F6F2' }}>
          <div className="text-[11px] uppercase tracking-[0.12em] opacity-70">A premissa do mundo NN</div>
          <p className="text-[26px] font-light leading-snug mt-3 max-w-[720px] mx-auto">{PREMISSA}</p>
          <p className="text-[13px] opacity-70 mt-3">Vem da sua frase: projetar é decidir o que permanece.</p>
        </section>

        {/* A bíblia do mundo */}
        <h2 className={titulo}>A bíblia do mundo</h2>
        <p className="text-[14px] text-muted mb-5">O que existe dentro dele. Quando um fotógrafo, uma agência ou você mesma for criar, é daqui que se parte.</p>
        <div className="grid grid-cols-2 gap-4 mb-12">
          {MUNDO.map((b) => (
            <article key={b.titulo} className={`${cartao} p-6`}>
              <h3 className="text-[16px] font-semibold text-charcoal">{b.titulo}</h3>
              <p className="text-[12.5px] text-muted mt-0.5 mb-3">{b.intro}</p>
              <dl className="divide-y divide-linha">
                {b.itens.map((it) => (
                  <div key={it.nome} className="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <dt className="text-[13px] font-medium text-charcoal">{it.nome}</dt>
                    <dd className="text-[13px] text-charcoal/80 leading-snug">{it.txt}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}

          <article className={`${cartao} p-6`}>
            <h3 className="text-[16px] font-semibold text-charcoal">Paleta</h3>
            <p className="text-[12.5px] text-muted mt-0.5 mb-3">As cores do feed, lidas como coisas do mundo.</p>
            <div className="grid grid-cols-3 gap-2">
              {PALETA.map((c) => (
                <div key={c.hex}>
                  <div className="h-14 rounded-lg border border-black/[0.06]" style={{ background: c.hex }} />
                  <div className="text-[12px] font-medium text-charcoal mt-1">{c.nome}</div>
                  <div className="text-[11.5px] text-muted leading-snug">{c.uso}</div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Regiões = territórios */}
        <h2 className={titulo}>As cinco regiões</h2>
        <p className="text-[14px] text-muted mb-5">Os territórios que já estão no editor de posts, agora com endereço. Cada post acontece em uma região.</p>
        <div className="grid grid-cols-5 gap-3 mb-12">
          {(Object.keys(REGIOES) as Territorio[]).map((t) => (
            <div key={t} className={`${cartao} p-4`}>
              <div className="text-[14px] font-semibold text-charcoal">{nomeRegiao(t)}</div>
              <div className="text-[12px] text-olive font-medium mt-0.5">{REGIOES[t].lugar}</div>
              <p className="text-[12.5px] text-charcoal/80 leading-snug mt-1.5">{REGIOES[t].txt}</p>
            </div>
          ))}
        </div>

        {/* Aplicação */}
        <h2 className={titulo}>Como aplicar no marketing</h2>
        <p className="text-[14px] text-muted mb-5">O mesmo mundo em todos os pontos de contato, dentro e fora da tela.</p>
        <div className={`${cartao} divide-y divide-linha mb-12`}>
          {CANAIS.map((c) => (
            <div key={c.canal} className="grid grid-cols-[200px_1fr] gap-4 px-6 py-3.5">
              <div className="text-[13.5px] font-medium text-charcoal">{c.canal}</div>
              <p className="text-[13.5px] text-charcoal/85 leading-relaxed">{c.txt}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className={`${cartao} p-6`}>
            <h3 className="text-[16px] font-semibold text-charcoal">O teste do mundo</h3>
            <p className="text-[12.5px] text-muted mt-0.5 mb-3">Antes de publicar. Se duas respostas forem &ldquo;não sei&rdquo;, o post fica de fora.</p>
            <ol className="space-y-2">
              {TESTE.map((t, i) => (
                <li key={t} className="flex gap-3 text-[13.5px] text-charcoal/90">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-olive/10 text-olive text-[12px] font-medium flex items-center justify-center">{i + 1}</span>{t}
                </li>
              ))}
            </ol>
          </div>
          <div className={`${cartao} p-6`}>
            <h3 className="text-[16px] font-semibold text-charcoal">O que não existe neste mundo</h3>
            <p className="text-[12.5px] text-muted mt-0.5 mb-3">Tão importante quanto o que existe.</p>
            <ul className="space-y-1.5">
              {FORA.map((f) => <li key={f} className="text-[13.5px] text-charcoal/85 flex gap-2"><span className="text-muted">·</span>{f}</li>)}
            </ul>
          </div>
        </div>

        <div className={`${cartao} p-6`}>
          <div className={rotulo}>Próximos passos</div>
          <ul className="mt-2 space-y-1.5">
            {PROXIMOS.map((p) => <li key={p} className="text-[13.5px] text-charcoal/85 flex gap-2"><span className="text-olive">→</span>{p}</li>)}
          </ul>
        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { MARCAS, MAPA, SINTESE, BRECHAS, CAMINHO, DECIDIR, imagensDe } from '@/lib/magazine/pesquisa'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const titulo = 'font-display text-[24px] text-charcoal tracking-tight'
const comercio = new Set(['orb', 'oblist'])

export default function MagazinePage() {
  const capas = MARCAS.filter((m) => m.imagens).map((m) => imagensDe(m)[0])

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px] pb-24">
        <Header title="Magazine" subtitle="A plataforma de conteúdo da revista. Nome a definir." />

        <section className="rounded-2xl bg-[#1D1D1F] text-white overflow-hidden grid grid-cols-[1.1fr_1fr] mb-14">
          <div className="px-8 py-10">
            <div className="text-[13px] text-white/50">O plano · out 2026</div>
            <p className="font-display text-[28px] leading-tight tracking-tight mt-2">
              Uma revista do viver bem a partir do Brasil, que roda sozinha e leva o leitor do olhar ao objeto.
            </p>
            <p className="text-[14px] text-white/60 mt-4 leading-relaxed">
              Nove plataformas estudadas, seis brechas e um caminho de receita em quatro fases. O próximo passo são as decisões no fim desta página, e depois o nome.
            </p>
            <div className="flex gap-2 mt-6">
              <Link href="/magazine/concorrentes" className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-charcoal bg-white hover:bg-white/90">Concorrentes <ArrowRight size={14} /></Link>
              <Link href="/magazine/marca" className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-white/10 hover:bg-white/15">Manual da marca <ArrowRight size={14} /></Link>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-[2px] content-start">
            {capas.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="w-full aspect-square object-cover opacity-90" />
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className={titulo}>Síntese em seis leituras</h2>
          <p className="text-[14px] text-muted mb-4">O que se repete entre as nove e importa para quem entra agora.</p>
          <div className="grid grid-cols-3 gap-3">
            {SINTESE.map((s, i) => (
              <div key={s.titulo} className={`${cartao} p-5`}>
                <div className="text-[11px] font-medium text-olive tabular-nums">{String(i + 1).padStart(2, '0')}</div>
                <div className="text-[15px] font-medium text-charcoal mt-0.5">{s.titulo}</div>
                <p className="text-[13px] text-charcoal/75 leading-relaxed mt-1.5">{s.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className={titulo}>Mapa de posicionamento</h2>
          <p className="text-[14px] text-muted mb-4">Da mídia (vende atenção) ao comércio (vende objeto), do lifestyle à arquitetura profissional. Posições por leitura qualitativa.</p>
          <div className={`${cartao} relative aspect-[16/8] overflow-hidden`}>
            <div className="absolute left-[6%] right-[6%] top-1/2 h-px bg-linha" />
            <div className="absolute top-[8%] bottom-[8%] left-1/2 w-px bg-linha" />
            <span className="absolute left-[6%] top-[calc(50%+8px)] text-[11px] text-muted uppercase tracking-[0.06em]">Mídia</span>
            <span className="absolute right-[6%] top-[calc(50%+8px)] text-[11px] text-muted uppercase tracking-[0.06em]">Comércio</span>
            <span className="absolute left-[calc(50%+8px)] top-[6%] text-[11px] text-muted uppercase tracking-[0.06em]">Lifestyle · viver</span>
            <span className="absolute left-[calc(50%+8px)] bottom-[6%] text-[11px] text-muted uppercase tracking-[0.06em]">Arquitetura · profissional</span>
            <div className="absolute left-[63%] top-[36%] -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-[1.7] rounded-[50%] border-[1.5px] border-dashed border-olive bg-olive/[0.06] flex items-center justify-center text-center text-[12.5px] font-medium text-olive px-3">
              espaço livre<br />Brasil · casa vivida · objeto
            </div>
            {MARCAS.map((m) => (
              <div key={m.id} className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[13px] font-medium text-charcoal whitespace-nowrap" style={{ left: `${MAPA[m.id].x}%`, top: `${MAPA[m.id].y}%` }}>
                <span className={`w-2.5 h-2.5 rounded-full ${comercio.has(m.id) ? 'bg-olive' : 'bg-accent'}`} />{m.nome}
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted mt-2 flex gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> mídia editorial</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-olive" /> comércio com editorial</span>
          </p>
        </section>

        <section className="mb-14">
          <h2 className={titulo}>Onde fazer melhor</h2>
          <p className="text-[14px] text-muted mb-4">O que nenhuma das nove ocupa e que a sua trajetória já tem.</p>
          <div className="grid grid-cols-2 gap-3">
            {BRECHAS.map((b, i) => (
              <div key={b.titulo} className={`${cartao} p-5`}>
                <div className="text-[11px] font-medium text-olive">Brecha {i + 1}</div>
                <div className="text-[15px] font-medium text-charcoal mt-0.5">{b.titulo}</div>
                <p className="text-[13px] text-charcoal/75 leading-relaxed mt-1.5">{b.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className={titulo}>Caminho de receita</h2>
          <p className="text-[14px] text-muted mb-4">Na ordem em que as nove mostram que funciona. Cada fase financia a seguinte.</p>
          <div className="grid grid-cols-4 gap-3">
            {CAMINHO.map((c) => (
              <div key={c.fase} className={`${cartao} p-5 border-t-[3px] border-t-olive`}>
                <div className="text-[13px] font-medium text-charcoal">{c.fase}</div>
                <p className="text-[13px] text-charcoal/75 leading-relaxed mt-1.5">{c.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={titulo}>Para decidir antes do nome</h2>
          <p className="text-[14px] text-muted mb-4">Já decidido: a marca roda sozinha, sem você como rosto. Você aparece quando quiser, como empresária.</p>
          <div className="grid grid-cols-2 gap-3">
            {DECIDIR.map((d, i) => (
              <div key={d.titulo} className={`${cartao} p-5`}>
                <div className="text-[15px] font-medium text-charcoal">{i + 1}. {d.titulo}</div>
                <p className="text-[13px] text-muted leading-relaxed mt-1">{d.texto}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

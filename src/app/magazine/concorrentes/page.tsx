import { ExternalLink } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Galeria from '@/components/magazine/Galeria'
import { MARCAS, RECEITA, FONTES_RECEITA, imagensDe } from '@/lib/magazine/pesquisa'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const rotulo = 'text-[11px] font-medium text-muted uppercase tracking-[0.06em] mb-1'

function Ponto({ nivel }: { nivel: number }) {
  if (nivel === 2) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-olive" />
  if (nivel === 1) return <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-olive" />
  return <span className="text-black/15">·</span>
}

export default function ConcorrentesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px] pb-24">
        <Header title="Concorrentes" subtitle="Nove plataformas que você admira, lidas como concorrentes. Pesquisa de outubro de 2026." />

        <nav className="flex flex-wrap gap-1.5 mb-8">
          {MARCAS.map((m) => (
            <a key={m.id} href={`#${m.id}`} className="px-3 py-1 rounded-full text-[12.5px] text-charcoal bg-white border border-linha hover:border-accent/50">{m.nome}</a>
          ))}
        </nav>

        <section className="mb-14">
          <h2 className="font-display text-[24px] text-charcoal tracking-tight">De onde vem o dinheiro</h2>
          <p className="text-[14px] text-muted mb-4">Cada linha de receita que encontramos, marca por marca.</p>
          <div className={`${cartao} overflow-hidden`}>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-black/[0.03] text-[11px] text-muted">
                  <th className="text-left font-medium px-4 py-2.5">Marca</th>
                  {FONTES_RECEITA.map((f) => <th key={f} className="font-medium px-2 py-2.5 text-center">{f}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-linha">
                {MARCAS.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2.5 font-medium text-charcoal">{m.nome}</td>
                    {RECEITA[m.id].map((n, i) => <td key={i} className="text-center px-2 py-2.5"><Ponto nivel={n} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-muted mt-2 flex gap-4">
            <span className="flex items-center gap-1.5"><Ponto nivel={2} /> fonte central</span>
            <span className="flex items-center gap-1.5"><Ponto nivel={1} /> secundária ou pontual</span>
          </p>
        </section>

        <div className="space-y-12">
          {MARCAS.map((m) => (
            <article key={m.id} id={m.id} className={`${cartao} p-6 scroll-mt-6`}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-4">
                <h2 className="font-display text-[24px] text-charcoal tracking-tight">{m.nome}</h2>
                <a href={m.link} target="_blank" rel="noreferrer" className="text-muted hover:text-charcoal"><ExternalLink size={13} /></a>
                <div className="flex flex-wrap gap-1.5 ml-auto">
                  {m.tags.map((t) => <span key={t} className="px-2.5 py-0.5 rounded-full text-[11.5px] bg-black/[0.04] text-charcoal/70">{t}</span>)}
                  {m.destaque && <span className="px-2.5 py-0.5 rounded-full text-[11.5px] bg-olive/15 text-olive">{m.destaque}</span>}
                </div>
              </div>

              {m.imagens > 0
                ? <Galeria imagens={imagensDe(m)} nome={m.nome} />
                : <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-[13px] text-muted">Sem imagens: só existe no Instagram, que bloqueia o download. <a href={m.link} target="_blank" rel="noreferrer" className="text-charcoal underline">Ver o perfil</a>.</p>}
              {m.imagens > 0 && <p className="text-[11.5px] text-muted mt-1.5">Imagens: {m.credito}.</p>}

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 mt-6">
                <div><div className={rotulo}>O que é</div><p className="text-[13.5px] text-charcoal/85 leading-relaxed">{m.oQueE}</p></div>
                <div><div className={rotulo}>Instagram</div><p className="text-[13.5px] text-charcoal/85 leading-relaxed">{m.instagram}</p></div>
                <div>
                  <div className={rotulo}>O que oferece</div>
                  <ul className="text-[13.5px] text-charcoal/85 leading-relaxed list-disc pl-4 space-y-0.5">{m.oferta.map((o) => <li key={o}>{o}</li>)}</ul>
                </div>
                <div><div className={rotulo}>Como monetiza</div><p className="text-[13.5px] text-charcoal/85 leading-relaxed">{m.monetiza}</p></div>
              </div>

              <p className="text-[14px] italic text-accent mt-5">&ldquo;{m.voz}&rdquo;</p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-olive/10 px-4 py-3">
                  <div className="text-[11px] font-medium text-olive mb-0.5">Aprender</div>
                  <p className="text-[13px] text-charcoal/85 leading-relaxed">{m.aprender}</p>
                </div>
                <div className="rounded-xl bg-black/[0.035] px-4 py-3">
                  <div className="text-[11px] font-medium text-muted mb-0.5">Brecha</div>
                  <p className="text-[13px] text-charcoal/85 leading-relaxed">{m.brecha}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="text-[12px] text-muted mt-10 max-w-[760px] leading-relaxed">
          Fontes: sites e páginas &quot;about&quot; das marcas, entrevistas (magCulture, Stack, Betoneira, Locals Insider), ArchDaily e páginas públicas do Instagram.
          Não confirmamos os seguidores de Yatzer, The Orb e Oblist, nem os preços atuais de assinatura de Wallpaper* e Cereal. A versão completa, com links, está em MAGAZINE/pesquisa-mercado.html no Drive.
        </p>
      </main>
    </div>
  )
}

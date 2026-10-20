import { BookOpen, FileText } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { AbrirPagina, Leitor } from '@/components/marca/Leitor'
import { urlMiniatura } from '@/lib/marca/urls'
import { MANUAL, PAGINAS_MANUAL, ASSINATURA, type Bloco } from '@/lib/marca/manual'
import { PAGINAS_IV } from '@/lib/marca/identidade'
import { QUADROS } from '@/lib/posts/estrategia'
import { PILARES, type Pilar } from '@/lib/posts/tipos'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const colunas = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }

function RenderBloco({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case 'paragrafos':
      return <div className="space-y-3 max-w-[760px]">{bloco.itens.map((p) => <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-charcoal/85">{p}</p>)}</div>
    case 'destaque':
      return <p className="text-[19px] leading-snug text-charcoal font-medium tracking-tight max-w-[760px] border-l-2 border-olive pl-4">{bloco.texto}</p>
    case 'cartoes':
      return (
        <div className={`grid ${colunas[bloco.colunas ?? 3]} gap-3`}>
          {bloco.itens.map((c) => (
            <div key={c.titulo + (c.rotulo ?? '')} className={`${cartao} p-4`}>
              {c.rotulo && <div className="text-[11px] font-medium text-muted mb-1">{c.rotulo}</div>}
              <div className="text-[14px] font-medium text-charcoal leading-snug">{c.titulo}</div>
              {c.texto && <p className="text-[13px] text-charcoal/75 leading-relaxed mt-1.5">{c.texto}</p>}
            </div>
          ))}
        </div>
      )
    case 'numerada':
      return (
        <ol className={`${cartao} divide-y divide-linha`}>
          {bloco.itens.map((it, i) => (
            <li key={i} className="flex gap-4 px-5 py-3">
              <span className="text-[13px] text-muted tabular-nums w-5 shrink-0 pt-px">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[14px] text-charcoal/85 leading-relaxed">
                {it.titulo && <span className="font-medium text-charcoal">{it.titulo}. </span>}
                {it.texto}
              </span>
            </li>
          ))}
        </ol>
      )
    case 'palavras':
      return (
        <div className="flex items-baseline gap-3 flex-wrap">
          {bloco.titulo && <span className="text-[12px] font-medium text-muted w-[170px] shrink-0">{bloco.titulo}</span>}
          <div className="flex flex-wrap gap-1.5">
            {bloco.itens.map((p) => (
              <span key={p} className={`px-3 py-1 rounded-full text-[13px] ${bloco.banidas ? 'bg-[#8C6B3F]/10 text-[#8C6B3F] line-through decoration-[#8C6B3F]/50' : 'bg-white border border-linha text-charcoal'}`}>{p}</span>
            ))}
          </div>
        </div>
      )
    case 'contraste':
      return (
        <div className={`${cartao} overflow-hidden`}>
          <div className="grid grid-cols-2 text-[12px] font-medium text-muted border-b border-linha">
            <div className="px-5 py-2.5">{bloco.esquerda}</div>
            <div className="px-5 py-2.5 border-l border-linha">{bloco.direita}</div>
          </div>
          {bloco.linhas.map(([a, b]) => (
            <div key={a} className="grid grid-cols-2 text-[14px] border-b border-linha last:border-0">
              <div className="px-5 py-3 text-charcoal">{a}</div>
              <div className="px-5 py-3 border-l border-linha text-muted line-through decoration-black/20">{b}</div>
            </div>
          ))}
        </div>
      )
    case 'imagens':
      return (
        <div className="grid grid-cols-3 gap-3">
          {bloco.paginas.map((p) => (
            <AbrirPagina key={p} colecao="manual" pagina={p} className="rounded-xl overflow-hidden border border-linha hover:shadow-card transition-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlMiniatura('manual', p)} alt={`Página ${p}`} loading="lazy" className="w-full aspect-video object-cover" />
            </AbrirPagina>
          ))}
        </div>
      )
  }
}

export default function ManualDaMarcaPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Manual da marca" subtitle="Fundamentos, voz, público, estratégia e conteúdo" />

        <div className="grid grid-cols-[210px_1fr] gap-10 items-start">
          <nav className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto pb-6 space-y-5">
            <AbrirPagina colecao="manual" pagina={1} className="w-full flex items-center justify-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black active:scale-[0.98] transition-all">
              <BookOpen size={14} /> Folhear o manual
            </AbrirPagina>
            {MANUAL.map((parte) => (
              <div key={parte.id}>
                <a href={`#${parte.id}`} className="block text-[11px] font-medium text-muted mb-1 hover:text-charcoal">{parte.titulo} · {parte.subtitulo}</a>
                <div className="space-y-px">
                  {parte.secoes.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="block px-2.5 py-[5px] -mx-2.5 rounded-lg text-[13px] text-charcoal/80 hover:bg-black/[0.04] hover:text-charcoal transition-colors">
                      {s.titulo}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="min-w-0 space-y-14 pb-24">
            {MANUAL.map((parte) => (
              <section key={parte.id} id={parte.id} className="scroll-mt-6 space-y-12">
                <div className="rounded-2xl bg-[#1D1D1F] text-white px-8 py-10">
                  <div className="text-[13px] text-white/50">{parte.titulo}</div>
                  <div className="font-display text-[30px] tracking-tight mt-1">{parte.subtitulo}</div>
                </div>

                {parte.secoes.map((secao) => (
                  <article key={secao.id} id={secao.id} className="scroll-mt-6">
                    <div className="flex items-baseline gap-3 mb-4">
                      <h2 className="font-display text-[24px] text-charcoal tracking-tight">{secao.titulo}</h2>
                      <AbrirPagina colecao="manual" pagina={secao.pagina} titulo="Ver a página original" className="flex items-center gap-1 text-[12px] text-muted hover:text-charcoal transition-colors">
                        <FileText size={12} /> p. {secao.pagina}
                      </AbrirPagina>
                    </div>
                    <div className="space-y-4">
                      {secao.blocos.map((b, i) => <RenderBloco key={i} bloco={b} />)}
                      {secao.id === 'o-que-postar' && (
                        <div className="grid grid-cols-3 gap-3">
                          {(Object.keys(PILARES) as Pilar[]).map((p) => (
                            <div key={p} className={`${cartao} p-4`}>
                              <div className="text-[14px] font-medium text-charcoal mb-3">{PILARES[p]}</div>
                              <div className="space-y-3">
                                {QUADROS.filter((q) => q.pilar === p).map((q) => (
                                  <div key={q.id}>
                                    <div className="text-[13px] font-medium text-charcoal">{q.nome}</div>
                                    <p className="text-[12.5px] text-charcoal/70 leading-relaxed">{q.descricao}</p>
                                    <div className="text-[11px] text-muted mt-0.5">Formato: {q.formato}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </section>
            ))}

            <p className="text-center font-display text-[20px] text-charcoal tracking-tight pt-6">{ASSINATURA}</p>
          </div>
        </div>
      </main>

      <Leitor totais={{ manual: PAGINAS_MANUAL, identidade: PAGINAS_IV }} />
    </div>
  )
}

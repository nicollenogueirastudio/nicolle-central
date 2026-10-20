import { BookOpen } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { AbrirPagina, Leitor } from '@/components/marca/Leitor'
import SecaoManual from '@/components/marca/SecaoManual'
import { criarClienteServidor } from '@/lib/supabase/server'
import { MANUAL, PAGINAS_MANUAL, ASSINATURA, type Bloco, type Secao } from '@/lib/marca/manual'
import { PAGINAS_IV } from '@/lib/marca/identidade'
import { QUADROS } from '@/lib/posts/estrategia'
import { PILARES, type Pilar } from '@/lib/posts/tipos'

// Lê as edições do banco a cada visita: o manual muda quando ela edita.
export const dynamic = 'force-dynamic'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

export default async function ManualDaMarcaPage() {
  const supabase = criarClienteServidor()
  const { data } = await supabase.from('marca_manual').select('secao_id, titulo, blocos')
  const edicoes = new Map((data ?? []).map((e) => [e.secao_id as string, e as { titulo: string | null; blocos: Bloco[] }]))
  const comEdicao = (s: Secao): Secao => {
    const e = edicoes.get(s.id)
    return e ? { ...s, titulo: e.titulo ?? s.titulo, blocos: e.blocos } : s
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Manual da marca" subtitle="Fundamentos, voz, público, estratégia e conteúdo. Passe o mouse numa seção para editar." />

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
                      {comEdicao(s).titulo}
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
                  <SecaoManual key={secao.id} secao={comEdicao(secao)} original={secao} editada={edicoes.has(secao.id)}>
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
                  </SecaoManual>
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

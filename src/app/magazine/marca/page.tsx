import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import SecaoManual from '@/components/marca/SecaoManual'
import { criarClienteServidor } from '@/lib/supabase/server'
import { MANUAL_MAGAZINE, ASSINATURA_MAGAZINE } from '@/lib/magazine/manual'
import type { Bloco, Secao } from '@/lib/marca/manual'

// Lê as edições do banco a cada visita: o manual muda quando ela edita.
export const dynamic = 'force-dynamic'

export default async function ManualMagazinePage() {
  const supabase = criarClienteServidor()
  const { data } = await supabase.from('magazine_manual').select('secao_id, titulo, blocos')
  const edicoes = new Map((data ?? []).map((e) => [e.secao_id as string, e as { titulo: string | null; blocos: Bloco[] }]))
  const comEdicao = (s: Secao): Secao => {
    const e = edicoes.get(s.id)
    return e ? { ...s, titulo: e.titulo ?? s.titulo, blocos: e.blocos } : s
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Manual da marca · Magazine" subtitle="Rascunho no mesmo molde do manual NN. Passe o mouse numa seção para editar." />

        <div className="grid grid-cols-[210px_1fr] gap-10 items-start">
          <nav className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto pb-6 space-y-5">
            {MANUAL_MAGAZINE.map((parte) => (
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
            {MANUAL_MAGAZINE.map((parte) => (
              <section key={parte.id} id={parte.id} className="scroll-mt-6 space-y-12">
                <div className="rounded-2xl bg-[#1D1D1F] text-white px-8 py-10">
                  <div className="text-[13px] text-white/50">{parte.titulo}</div>
                  <div className="font-display text-[30px] tracking-tight mt-1">{parte.subtitulo}</div>
                </div>

                {parte.secoes.map((secao) => (
                  <SecaoManual key={secao.id} secao={comEdicao(secao)} original={secao} editada={edicoes.has(secao.id)} tabela="magazine_manual" />
                ))}
              </section>
            ))}

            <p className="text-center font-display text-[20px] text-charcoal tracking-tight pt-6">{ASSINATURA_MAGAZINE}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

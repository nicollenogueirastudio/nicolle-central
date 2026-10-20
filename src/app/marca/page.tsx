import { Inter, JetBrains_Mono } from 'next/font/google'
import { Download, BookOpen } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import CopiarCor from '@/components/marca/CopiarCor'
import { AbrirPagina, Leitor } from '@/components/marca/Leitor'
import { urlArquivo, urlPagina } from '@/lib/marca/urls'
import { PAGINAS_MANUAL } from '@/lib/marca/manual'
import {
  PALETA, COMBINACOES, LOGOS, REDUCAO, TIPOGRAFIAS, REGUA, CONCEITO, MANIFESTO_IV,
  PAGINAS_IV, MOCKUPS, TEXTURAS,
} from '@/lib/marca/identidade'

// As fontes oficiais da marca, só para as amostras desta página (a interface segue com a fonte do sistema).
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '700'], display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['300', '400', '700'], display: 'swap' })
const fonte = { inter: inter.className, jetbrains: jetbrains.className }

const SECOES = [
  { id: 'conceito', nome: 'Conceito' },
  { id: 'logos', nome: 'Logos' },
  { id: 'cores', nome: 'Cores' },
  { id: 'tipografia', nome: 'Tipografia' },
  { id: 'avatares', nome: 'Avatares' },
  { id: 'textura', nome: 'Textura' },
  { id: 'aplicacoes', nome: 'Aplicações' },
]

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

function Titulo({ id, titulo, texto }: { id: string; titulo: string; texto?: string }) {
  return (
    <div id={id} className="scroll-mt-6 mb-4">
      <h2 className="font-display text-[24px] text-charcoal tracking-tight">{titulo}</h2>
      {texto && <p className="text-[14px] text-muted mt-0.5 max-w-[680px]">{texto}</p>}
    </div>
  )
}

export default function IdentidadeVisualPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Identidade visual" subtitle="O Brand Book da marca, para consultar e baixar sem abrir o PDF" />

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="flex flex-wrap p-[3px] rounded-[10px] bg-black/[0.06]">
            {SECOES.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="px-3.5 py-[5px] rounded-[7px] text-[13px] text-charcoal/70 hover:text-charcoal hover:bg-white/60 transition-colors">
                {s.nome}
              </a>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <a href={urlArquivo('fontes', 'Fontes Nicolle Nogueira Studio.rar')} className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-charcoal bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-white/60 transition-colors">
              <Download size={14} /> Fontes
            </a>
            <AbrirPagina colecao="identidade" pagina={1} className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black active:scale-[0.98] transition-all">
              <BookOpen size={14} /> Folhear o Brand Book
            </AbrirPagina>
          </div>
        </div>

        {/* Abertura */}
        <section className="rounded-2xl overflow-hidden bg-black text-[#DBD7C7] shadow-card mb-12">
          <div className="grid grid-cols-[1.1fr_1fr]">
            <div className="p-10 flex flex-col justify-between min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlArquivo('logos/negativo/2')} alt="Símbolo NN" className="w-14 opacity-90" />
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlArquivo('logos/negativo/5')} alt="Nicolle Nogueira Studio" className="w-[340px] max-w-full opacity-90 mb-6" />
                <p className={`${fonte.jetbrains} text-[12px] leading-relaxed uppercase tracking-wide text-[#9F9681] max-w-[460px]`}>{MANIFESTO_IV}</p>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urlPagina('identidade', 49)} alt="Fachada com o símbolo NN" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Conceito */}
        <section className="mb-12">
          <Titulo id="conceito" titulo="Conceito" />
          <div className="grid grid-cols-[1fr_1fr] gap-5">
            <div className={`${cartao} p-6 space-y-3`}>
              {CONCEITO.map((p) => <p key={p.slice(0, 20)} className="text-[14px] leading-relaxed text-charcoal/85">{p}</p>)}
            </div>
            <div className={`${cartao} p-6`}>
              <div className="text-[13px] font-medium text-charcoal mb-1">“Olá, sou uma marca…”</div>
              <p className="text-[12px] text-muted mb-4">A régua de personalidade do Brand Book.</p>
              <div className="space-y-2">
                {REGUA.map((r) => (
                  <div key={r.pergunta} className="grid grid-cols-[1fr_88px_72px_88px] items-center gap-2 text-[12.5px]">
                    <span className="text-muted">{r.pergunta}</span>
                    <span className={`text-right ${r.ponto === 0 ? 'text-charcoal font-medium' : 'text-muted/70'}`}>{r.esquerda}</span>
                    <span className="flex items-center justify-between px-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={`rounded-full ${i === r.ponto ? 'w-2.5 h-2.5 bg-charcoal' : 'w-1.5 h-1.5 bg-black/15'}`} />
                      ))}
                    </span>
                    <span className={r.ponto === 2 ? 'text-charcoal font-medium' : 'text-muted/70'}>{r.direita}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="mb-12">
          <Titulo id="logos" titulo="Logos" texto="Oito versões, em positivo (sobre claro) e negativo (sobre escuro). Clique para baixar o PNG em alta." />
          {(['positivo', 'negativo'] as const).map((versao) => (
            <div key={versao} className="mb-5">
              <div className="text-[12px] font-medium text-muted mb-2 first-letter:uppercase">{versao}</div>
              <div className="grid grid-cols-4 gap-3">
                {LOGOS.map((l) => (
                  <a
                    key={l.n}
                    href={urlArquivo(`logos/${versao}/${l.n}`, `NN-logo-${l.n}-${versao}.png`)}
                    className="group rounded-2xl overflow-hidden border border-linha bg-white hover:shadow-card transition-shadow"
                  >
                    <div className={`h-32 flex items-center justify-center p-6 ${versao === 'positivo' ? 'bg-[#DBD7C7]' : 'bg-black'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={urlArquivo(`logos/${versao}/${l.n}`)} alt={l.nome} className="max-h-full max-w-[85%] object-contain" />
                    </div>
                    <div className="px-3.5 py-2.5 flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-medium text-charcoal truncate">{l.nome}</div>
                        <div className="text-[11px] text-muted truncate">{l.uso} · mín. {REDUCAO.find((r) => r.logo === l.n)?.minimo}</div>
                      </div>
                      <Download size={14} className="text-muted group-hover:text-charcoal transition-colors shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Cores */}
        <section className="mb-12">
          <Titulo id="cores" titulo="Cores" texto="Clique em uma cor para copiar o HEX." />
          <div className="space-y-6">
            {PALETA.map((g) => (
              <div key={g.grupo}>
                <div className="flex items-baseline gap-3 mb-2.5">
                  <span className="text-[14px] font-medium text-charcoal">{g.grupo}</span>
                  <span className="text-[12.5px] text-muted">{g.descricao}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {g.cores.map((c) => <CopiarCor key={c.hex} cor={c} />)}
                </div>
              </div>
            ))}
            <div>
              <div className="text-[14px] font-medium text-charcoal mb-2.5">Combinações aprovadas</div>
              <div className="grid grid-cols-6 gap-3">
                {COMBINACOES.map((combo) => (
                  <div key={combo.join()} className="h-32 rounded-2xl overflow-hidden border border-linha flex flex-col">
                    <div className="flex-1" style={{ background: combo[0] }} />
                    <div className="flex-1 flex">
                      {(combo.length > 1 ? combo.slice(1) : combo).map((c, i) => <div key={i} className="flex-1" style={{ background: c }} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tipografia */}
        <section className="mb-12">
          <Titulo id="tipografia" titulo="Tipografia" texto="JetBrains Mono nos títulos, Inter no corpo." />
          <div className="grid grid-cols-2 gap-5">
            {TIPOGRAFIAS.map((t) => (
              <div key={t.nome} className={`${cartao} overflow-hidden`}>
                <div className={`${fonte[t.familia as keyof typeof fonte]} bg-[#DBD7C7] text-[#350000] px-7 pt-7 pb-6`}>
                  <div className="flex items-end gap-6">
                    <span className="text-[64px] leading-none font-light">Aa</span>
                    <span className="text-[64px] leading-none font-bold">Aa</span>
                  </div>
                  <div className="mt-5 text-[13px] tracking-[0.12em]">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                  <div className="text-[13px] tracking-[0.12em]">abcdefghijklmnopqrstuvwxyz</div>
                  <div className="text-[13px] tracking-[0.3em] mt-1">1234567890</div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-medium text-charcoal">{t.nome}</span>
                    <span className="text-[12px] text-muted">{t.papel}</span>
                  </div>
                  <p className="text-[13px] text-charcoal/80 mt-1">{t.uso}</p>
                  <p className="text-[11.5px] text-muted mt-2">{t.pesos}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`${cartao} mt-5 p-8 grid grid-cols-[1fr_1fr] gap-10 items-center`}>
            <div>
              <div className={`${fonte.jetbrains} text-[22px] leading-snug uppercase text-charcoal`}>Transformar o cotidiano em extraordinário.</div>
              <div className="h-px bg-charcoal my-5" />
              <p className={`${fonte.inter} text-[14px] leading-relaxed text-charcoal/80`}>
                Projetamos refúgios contemporâneos onde o cotidiano se torna ritual e a casa, obra. Título em JetBrains Mono, caixa-alta; corpo em Inter.
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urlPagina('identidade', 29)} alt="Aplicação das tipografias" className="rounded-xl border border-linha" />
          </div>
        </section>

        {/* Avatares */}
        <section className="mb-12">
          <Titulo id="avatares" titulo="Avatares" texto="Para redes sociais, e-mail, WhatsApp e aplicativos." />
          <div className={`${cartao} p-6 grid grid-cols-5 gap-6`}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <a key={n} href={urlArquivo(`avatares/${n}`, `NN-avatar-${n}.png`)} className="group flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlArquivo(`avatares/${n}`)} alt={`Avatar ${n}`} className="w-24 h-24 object-contain transition-transform group-hover:scale-[1.04]" />
                <span className="text-[11px] text-muted group-hover:text-charcoal flex items-center gap-1"><Download size={11} /> Avatar {n}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Textura */}
        <section className="mb-12">
          <Titulo id="textura" titulo="Elemento visual · textura cobogó" texto="O módulo cobogó em duas escalas. Funciona sobre qualquer cor da paleta." />
          <div className="grid grid-cols-2 gap-3">
            {TEXTURAS.map((t) => (
              <a key={t.arquivo} href={urlArquivo(`textura/${t.arquivo}`, `NN-textura-${t.arquivo}.jpg`)} className="group rounded-2xl overflow-hidden border border-linha bg-white hover:shadow-card transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlArquivo(`textura/${t.arquivo}`)} alt={t.nome} className="w-full h-40 object-cover" />
                <div className="px-3.5 py-2.5 flex items-center justify-between text-[12.5px]">
                  <span className="text-charcoal">{t.nome}</span>
                  <Download size={14} className="text-muted group-hover:text-charcoal" />
                </div>
              </a>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[37, 38, 39].map((p) => (
              <AbrirPagina key={p} colecao="identidade" pagina={p} className="rounded-2xl overflow-hidden border border-linha hover:shadow-card transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlPagina('identidade', p)} alt="" className="w-full aspect-video object-cover" />
              </AbrirPagina>
            ))}
          </div>
        </section>

        {/* Aplicações */}
        <section className="mb-12">
          <Titulo id="aplicacoes" titulo="Aplicações & mockups" />
          <div className="grid grid-cols-3 gap-3">
            {MOCKUPS.map((p, i) => (
              <AbrirPagina key={p} colecao="identidade" pagina={p} className={`rounded-2xl overflow-hidden border border-linha hover:shadow-card transition-shadow ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlPagina('identidade', p)} alt="" className="w-full h-full aspect-video object-cover" />
              </AbrirPagina>
            ))}
          </div>
        </section>
      </main>

      <Leitor totais={{ identidade: PAGINAS_IV, manual: PAGINAS_MANUAL }} />
    </div>
  )
}

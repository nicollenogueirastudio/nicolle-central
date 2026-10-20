'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ExternalLink, Film, Layers, Image as ImageIcon, Circle } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { LinhaTempo, BarrasH } from '@/components/performance/Graficos'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { hojeISO, instanteDeBR, mesExtenso, dataBR, partesBR } from '@/lib/datas'
import { PILARES, TIPOS, type Pilar, type Tipo } from '@/lib/posts/tipos'
import { quadroPorId } from '@/lib/posts/estrategia'
import {
  retratosDaConta, postsMedidos, resumoDoGrupo, agrupar, forca, compacto, pct,
  type Retrato, type PostMedido,
} from '@/lib/performance/dados'

const iconeTipo = { feed: ImageIcon, carrossel: Layers, reels: Film, story: Circle }
const cartao = 'bg-white rounded-2xl border border-linha shadow-card'

const somarMes = (mes: string, d: number) => {
  const [a, m] = mes.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1 + d, 1)).toISOString().slice(0, 7)
}
const intervaloDoMes = (mes: string) => ({ de: instanteDeBR(`${mes}-01`, '00:00'), ate: instanteDeBR(`${somarMes(mes, 1)}-01`, '00:00') })

function Variacao({ atual, anterior, formato = 'numero' }: { atual: number | null; anterior: number | null; formato?: 'numero' | 'pct' }) {
  if (atual == null || anterior == null || anterior === 0) return <span className="text-[12px] text-muted">sem mês anterior para comparar</span>
  const d = formato === 'pct' ? (atual - anterior) * 100 : ((atual - anterior) / anterior) * 100
  const sinal = d > 0 ? '+' : ''
  return (
    <span className="text-[12px] text-muted">
      <span className={d >= 0 ? 'text-olive font-medium' : 'text-[#8C6B3F] font-medium'}>{sinal}{d.toFixed(0)}{formato === 'pct' ? ' p.p.' : '%'}</span> vs mês anterior
    </span>
  )
}

function Tile({ rotulo, valor, nota }: { rotulo: string; valor: string; nota?: React.ReactNode }) {
  return (
    <div className={`${cartao} p-5`}>
      <div className="text-[12px] text-muted">{rotulo}</div>
      <div className="font-display text-[30px] leading-tight text-charcoal tabular-nums mt-1">{valor}</div>
      {nota && <div className="mt-1">{nota}</div>}
    </div>
  )
}

export default function PerformancePage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [mes, setMes] = useState(hojeISO().slice(0, 7))
  const [retratos, setRetratos] = useState<Retrato[]>([])
  const [posts, setPosts] = useState<PostMedido[]>([])
  const [anteriores, setAnteriores] = useState<PostMedido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => { retratosDaConta(supabase, 'instagram').then(setRetratos).catch((e) => setErro(e.message)) }, [supabase])

  useEffect(() => {
    setCarregando(true)
    const atual = intervaloDoMes(mes), antes = intervaloDoMes(somarMes(mes, -1))
    Promise.all([postsMedidos(supabase, atual.de, atual.ate), postsMedidos(supabase, antes.de, antes.ate)])
      .then(([a, b]) => { setPosts(a); setAnteriores(b); setErro(null) })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [supabase, mes])

  const ultimo = retratos[retratos.length - 1]
  const primeiro = retratos[0]
  const ganho = ultimo && primeiro && retratos.length > 1 ? (ultimo.seguidores ?? 0) - (primeiro.seguidores ?? 0) : null
  const detalhe = (ultimo?.detalhe ?? {}) as Record<string, number>

  const resumo = resumoDoGrupo(posts)
  const resumoAntes = resumoDoGrupo(anteriores)
  const temAlcance = posts.some((p) => p.alcance != null)

  const porPilar = agrupar(posts, (p) => (p.pilar ?? 'sem') as Pilar | 'sem')
    .sort((a, b) => (b.alcanceMedio ?? 0) - (a.alcanceMedio ?? 0))
  const porTipo = agrupar(posts, (p) => p.tipo as Tipo).sort((a, b) => (b.alcanceMedio ?? 0) - (a.alcanceMedio ?? 0))
  const semPilar = posts.filter((p) => !p.pilar).length
  const top = [...posts].sort((a, b) => forca(b) - forca(a)).slice(0, 5)
  const mesAtual = mes === hojeISO().slice(0, 7)

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Performance" subtitle="Números reais do Instagram, lidos da Meta todos os dias" />

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">Não foi possível carregar: {erro}</div>}

        {/* Conta */}
        <section className="grid grid-cols-[1fr_1.6fr] gap-5 mb-10">
          <div className="grid grid-cols-2 gap-4 content-start">
            <Tile
              rotulo="Seguidores"
              valor={ultimo?.seguidores != null ? ultimo.seguidores.toLocaleString('pt-BR') : '—'}
              nota={<span className="text-[12px] text-muted">{ganho == null ? `desde ${primeiro ? dataBR(primeiro.dia + 'T12:00:00Z') : 'hoje'}` : `${ganho >= 0 ? '+' : ''}${ganho} desde ${dataBR(primeiro.dia + 'T12:00:00Z').slice(0, 5)}`}</span>}
            />
            <Tile rotulo="Publicações no perfil" valor={ultimo?.publicacoes != null ? String(ultimo.publicacoes) : '—'} />
            <Tile rotulo="Alcance da conta (24h)" valor={compacto(detalhe.alcance)} nota={<span className="text-[12px] text-muted">contas diferentes que viram algo</span>} />
            <Tile rotulo="Visitas ao perfil (24h)" valor={compacto(detalhe.visitas_perfil)} nota={detalhe.cliques_site != null ? <span className="text-[12px] text-muted">{detalhe.cliques_site} cliques no site</span> : undefined} />
          </div>

          <div className={`${cartao} p-5`}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[14px] font-medium text-charcoal">Seguidores por dia</span>
              <span className="text-[12px] text-muted">um ponto por dia</span>
            </div>
            {retratos.length >= 2
              ? <LinhaTempo pontos={retratos.filter((r) => r.seguidores != null).map((r) => ({ dia: r.dia, valor: r.seguidores! }))} rotulo="Seguidores" />
              : (
                <div className="h-[200px] flex flex-col items-center justify-center text-center px-10">
                  <div className="font-display text-[34px] text-charcoal tabular-nums">{ultimo?.seguidores?.toLocaleString('pt-BR') ?? '—'}</div>
                  <p className="text-[13px] text-muted mt-2 max-w-[420px]">
                    A curva começa em {primeiro ? dataBR(primeiro.dia + 'T12:00:00Z') : 'hoje'}, quando o Instagram foi conectado. A Meta não guarda o histórico de seguidores; a partir de agora cada dia ganha um ponto.
                  </p>
                </div>
              )}
          </div>
        </section>

        {/* Estudo do mês */}
        <div className="flex items-center gap-1 mb-5">
          <button onClick={() => setMes(somarMes(mes, -1))} aria-label="Mês anterior" className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-black/[0.05]"><ChevronLeft size={18} /></button>
          <button onClick={() => setMes(somarMes(mes, 1))} disabled={mesAtual} aria-label="Próximo mês" className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-black/[0.05] disabled:opacity-30"><ChevronRight size={18} /></button>
          <h2 className="font-display text-[24px] text-charcoal ml-2 first-letter:uppercase">Estudo de {mesExtenso(mes)}</h2>
          {!mesAtual && <button onClick={() => setMes(hojeISO().slice(0, 7))} className="ml-3 px-3 py-1 rounded-full text-[12px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Este mês</button>}
        </div>

        <div className={`transition-opacity ${carregando ? 'opacity-50' : ''}`}>
          <section className="grid grid-cols-4 gap-4 mb-5">
            <Tile rotulo="Posts publicados" valor={String(resumo.posts)} nota={<Variacao atual={resumo.posts} anterior={resumoAntes.posts || null} />} />
            <Tile rotulo="Alcance médio por post" valor={compacto(resumo.alcanceMedio)} nota={<Variacao atual={resumo.alcanceMedio} anterior={resumoAntes.alcanceMedio} />} />
            <Tile rotulo="Curtidas médias" valor={compacto(resumo.curtidasMedias)} nota={<Variacao atual={resumo.curtidasMedias} anterior={resumoAntes.curtidasMedias} />} />
            <Tile rotulo="Taxa de salvamento" valor={pct(resumo.salvamento)} nota={<span className="text-[12px] text-muted">salvos ÷ alcance: o sinal de desejo</span>} />
          </section>

          {posts.length === 0 ? (
            <div className={`${cartao} p-14 text-center text-[13px] text-muted`}>Nenhum post publicado em {mesExtenso(mes)}.</div>
          ) : (
            <>
              <section className="grid grid-cols-2 gap-5 mb-5">
                <div className={`${cartao} p-5`}>
                  <div className="text-[14px] font-medium text-charcoal">Alcance médio por pilar</div>
                  <p className="text-[12px] text-muted mb-4">Passe o mouse para ver posts e salvamento.</p>
                  <BarrasH
                    formatar={temAlcance ? compacto : () => 'sem alcance'}
                    linhas={porPilar.map((g) => ({
                      nome: g.chave === 'sem' ? 'Sem pilar' : PILARES[g.chave as Pilar],
                      valor: g.alcanceMedio,
                      detalhe: `${g.posts} ${g.posts === 1 ? 'post' : 'posts'} · salvamento ${pct(g.salvamento)}`,
                    }))}
                  />
                  {semPilar > 0 && (
                    <p className="text-[12px] text-muted mt-4">
                      {semPilar} {semPilar === 1 ? 'post sem pilar' : 'posts sem pilar'}. Os importados do Instagram chegam sem pilar: abra cada um no <Link href="/marketing" className="text-charcoal underline underline-offset-2">calendário</Link> e marque. O estudo fica mais preciso a cada post classificado.
                    </p>
                  )}
                </div>
                <div className={`${cartao} p-5`}>
                  <div className="text-[14px] font-medium text-charcoal">Alcance médio por formato</div>
                  <p className="text-[12px] text-muted mb-4">Passe o mouse para ver posts e salvamento.</p>
                  <BarrasH
                    formatar={temAlcance ? compacto : () => 'sem alcance'}
                    linhas={porTipo.map((g) => ({
                      nome: TIPOS[g.chave as Tipo],
                      valor: g.alcanceMedio,
                      detalhe: `${g.posts} ${g.posts === 1 ? 'post' : 'posts'} · salvamento ${pct(g.salvamento)}`,
                    }))}
                  />
                </div>
              </section>

              <section className={`${cartao} p-5 mb-5`}>
                <div className="text-[14px] font-medium text-charcoal mb-4">Os 5 mais fortes do mês</div>
                <div className="grid grid-cols-5 gap-3">
                  {top.map((p, i) => (
                    <a key={p.id} href={p.permalink ?? '#'} target="_blank" rel="noreferrer" className="group">
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-cream">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {p.capa && <img src={p.capa} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
                        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium flex items-center justify-center">{i + 1}</span>
                      </div>
                      <div className="mt-2 text-[12.5px] font-medium text-charcoal truncate">{p.titulo || 'Sem título'}</div>
                      <div className="text-[11.5px] text-muted tabular-nums">
                        {p.alcance != null ? `${compacto(p.alcance)} alcance · ` : ''}{compacto(p.curtidas)} curtidas{p.salvos ? ` · ${p.salvos} salvos` : ''}
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              <section className={`${cartao} overflow-hidden`}>
                <div className="px-5 pt-5 pb-3 text-[14px] font-medium text-charcoal">Todos os posts do mês</div>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] text-muted border-y border-linha">
                      <th className="font-medium px-5 py-2">Post</th>
                      <th className="font-medium py-2 w-[120px]">Pilar</th>
                      {['Alcance', 'Curtidas', 'Coment.', 'Salvos', 'Compart.', 'Visualiz.'].map((c) => <th key={c} className="font-medium py-2 pr-4 text-right w-[80px]">{c}</th>)}
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => {
                      const Icone = iconeTipo[p.tipo]
                      const q = quadroPorId(p.quadro)
                      return (
                        <tr key={p.id} className="border-b border-linha last:border-0 hover:bg-black/[0.02]">
                          <td className="px-5 py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-11 rounded-md bg-cream overflow-hidden shrink-0 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {p.capa ? <img src={p.capa} alt="" className="w-full h-full object-cover" /> : <Icone size={12} className="text-muted" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-charcoal truncate max-w-[360px]">{p.titulo || p.legenda?.slice(0, 50) || 'Sem título'}</div>
                                <div className="text-[11px] text-muted flex items-center gap-1.5"><Icone size={11} />{TIPOS[p.tipo]} · {partesBR(p.data_hora).data.split('-').reverse().slice(0, 2).join('/')}{q && <> · {q.nome}</>}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 text-charcoal/80">{p.pilar ? PILARES[p.pilar] : <span className="text-muted">—</span>}</td>
                          {[p.alcance, p.curtidas, p.comentarios, p.salvos, p.compartilhamentos, p.visualizacoes].map((v, i) => (
                            <td key={i} className="py-2 pr-4 text-right tabular-nums text-charcoal">{v == null ? <span className="text-muted">—</span> : v.toLocaleString('pt-BR')}</td>
                          ))}
                          <td className="py-2 pr-4">
                            {p.permalink && <a href={p.permalink} target="_blank" rel="noreferrer" aria-label="Abrir no Instagram" className="text-muted hover:text-charcoal"><ExternalLink size={13} /></a>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>

        <p className="text-[12px] text-muted mt-6">
          Alcance, salvos, compartilhamentos e visualizações vêm da Meta para posts de conta profissional; posts muito antigos podem vir só com curtidas e comentários. A Casa Nogs fica em <Link href="/newsletter" className="text-charcoal underline underline-offset-2">Newsletter</Link>.
        </p>
      </main>
    </div>
  )
}

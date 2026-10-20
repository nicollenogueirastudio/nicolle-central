'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, Check, Film, Layers, Image as ImageIcon, Circle } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import PalavraDoAno from '@/components/PalavraDoAno'
import { versiculoDoDia } from '@/lib/versiculos'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { hojeISO, instanteDeBR, inicioDaSemana, somarDias, partesBR, dataBR, diaCurto } from '@/lib/datas'
import { listarPosts } from '@/lib/posts/dados'
import { apareceNaGrade } from '@/lib/posts/regras'
import { RITMO_SEMANA } from '@/lib/posts/estrategia'
import { STATUS, type Post } from '@/lib/posts/tipos'
import { estiloStatus, corPilar } from '@/components/posts/estilos'
import { postsMedidos, resumoDoGrupo, forca, compacto, pct, type PostMedido } from '@/lib/performance/dados'
import { listarLancamentos, type Lancamento } from '@/lib/lancamentos/dados'
import { movimento } from '@/lib/lancamentos/estrategia'
import { listarMetas, type Meta } from '@/lib/planejamento/dados'
import { REDES, ORDEM_REDES, type Conexao, type Rede } from '@/lib/redes/tipos'
import { LinhaTarefa, NovaTarefa } from '@/components/tarefas/ListaTarefas'
import { useTarefas } from '@/components/tarefas/useTarefas'
import { faixa } from '@/lib/tarefas/dados'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const iconeTipo = { feed: ImageIcon, carrossel: Layers, reels: Film, story: Circle }
const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

type Publico = { rede: Rede; seguidores: number; delta7: number | null; manual: boolean }

function Titulo({ children, href, acao }: { children: React.ReactNode; href?: string; acao?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <span className="text-[14px] font-medium text-charcoal">{children}</span>
      {href && <Link href={href} className="text-[12px] text-muted hover:text-charcoal flex items-center gap-1">{acao ?? 'Abrir'} <ArrowRight size={12} /></Link>}
    </div>
  )
}

export default function DashboardPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const hoje = hojeISO()
  const semana = inicioDaSemana(hoje)

  const [posts, setPosts] = useState<Post[]>([])
  const [medidos, setMedidos] = useState<{ atual: PostMedido[]; antes: PostMedido[] }>({ atual: [], antes: [] })
  const [publico, setPublico] = useState<Publico[]>([])
  const [conexoes, setConexoes] = useState<Conexao[]>([])
  const [ultimaEdicao, setUltimaEdicao] = useState<{ titulo: string; publicado_em: string } | null>(null)
  const [lancamento, setLancamento] = useState<Lancamento | null>(null)
  const [metas, setMetas] = useState<Meta[]>([])
  const [carregando, setCarregando] = useState(true)
  const tarefas = useTarefas(supabase, { abertas: true })
  const [saudacao, setSaudacao] = useState('Olá')
  const [verso, setVerso] = useState<{ texto: string; referencia: string } | null>(null)

  // Saudação pela hora de Brasília (calculada no navegador, para não divergir do HTML pré-gerado).
  useEffect(() => {
    const h = Number(partesBR(new Date()).hora.slice(0, 2))
    setSaudacao(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')
    setVerso(versiculoDoDia(hojeISO()))
  }, [])

  useEffect(() => {
    const ate30 = instanteDeBR(somarDias(hoje, 1), '00:00')
    const de30 = instanteDeBR(somarDias(hoje, -30), '00:00')
    const de60 = instanteDeBR(somarDias(hoje, -60), '00:00')

    Promise.all([
      listarPosts(supabase, { de: instanteDeBR(semana, '00:00'), ate: instanteDeBR(somarDias(semana, 14), '00:00') }),
      postsMedidos(supabase, de30, ate30),
      postsMedidos(supabase, de60, de30),
      supabase.from('metricas_conta').select('rede, dia, seguidores, origem').not('seguidores', 'is', null).gte('dia', somarDias(hoje, -40)).order('dia'),
      supabase.from('conexoes').select('*'),
      supabase.from('substack_edicoes').select('titulo, publicado_em').order('publicado_em', { ascending: false }).limit(1).maybeSingle(),
      listarLancamentos(supabase),
      listarMetas(supabase),
    ]).then(([p, atual, antes, m, c, e, l, mt]) => {
      setPosts(p)
      setMedidos({ atual, antes })
      const linhas = (m.data ?? []) as { rede: Rede; dia: string; seguidores: number; origem: string }[]
      setPublico(ORDEM_REDES.map((rede) => {
        const daRede = linhas.filter((x) => x.rede === rede)
        const ultimo = daRede[daRede.length - 1]
        if (!ultimo) return null
        const base = [...daRede].reverse().find((x) => x.dia <= somarDias(ultimo.dia, -7))
        return { rede, seguidores: ultimo.seguidores, delta7: base ? ultimo.seguidores - base.seguidores : null, manual: ultimo.origem === 'manual' }
      }).filter(Boolean) as Publico[])
      setConexoes((c.data ?? []) as Conexao[])
      setUltimaEdicao(e.data as { titulo: string; publicado_em: string } | null)
      setLancamento(l.find((x) => x.status === 'em_andamento') ?? l.find((x) => x.status === 'planejando') ?? null)
      setMetas(mt)
    }).finally(() => setCarregando(false))
  }, [supabase, hoje, semana])

  // Esta semana
  const daSemana = posts.filter((p) => p.data_hora && partesBR(p.data_hora).data >= semana && partesBR(p.data_hora).data < somarDias(semana, 7))
  const feedSemana = daSemana.filter((p) => apareceNaGrade(p.tipo))
  const proxSemana = posts.filter((p) => p.data_hora && partesBR(p.data_hora).data >= somarDias(semana, 7))
  const ritmoOk = feedSemana.length >= RITMO_SEMANA.minimo && feedSemana.length <= RITMO_SEMANA.maximo

  // Precisa de você
  const emAprovacao = posts.filter((p) => p.status === 'aprovacao')
  const emAjuste = posts.filter((p) => p.status === 'ajuste')
  const atrasados = posts.filter((p) => p.data_hora && p.data_hora < new Date().toISOString() && ['rascunho', 'aprovacao', 'ajuste', 'agendado'].includes(p.status))
  const diasSemEdicao = ultimaEdicao ? Math.round((Date.parse(hoje) - Date.parse(partesBR(ultimaEdicao.publicado_em).data)) / 86400000) : null
  const comErro = conexoes.filter((c) => c.status === 'erro')
  const pendencias = [
    ...emAprovacao.map((p) => ({ chave: p.id, texto: p.titulo || 'Post sem título', nota: 'esperando sua aprovação', href: '/marketing' })),
    ...emAjuste.map((p) => ({ chave: p.id, texto: p.titulo || 'Post sem título', nota: p.nota_aprovacao ? `ajuste: ${p.nota_aprovacao}` : 'em ajuste', href: '/marketing' })),
    ...atrasados.filter((p) => !emAprovacao.includes(p) && !emAjuste.includes(p)).map((p) => ({ chave: 'a' + p.id, texto: p.titulo || 'Post sem título', nota: `passou da data (${dataBR(p.data_hora!).slice(0, 5)}) e não está postado`, href: '/marketing' })),
    ...(diasSemEdicao != null && diasSemEdicao > 7 ? [{ chave: 'casa', texto: 'Casa Nogs', nota: `${diasSemEdicao} dias sem edição: a promessa é semanal`, href: '/newsletter' }] : []),
    ...comErro.map((c) => ({ chave: 'c' + c.rede, texto: REDES[c.rede], nota: `conexão com erro: ${c.ultimo_erro ?? ''}`, href: '/configuracoes' })),
  ]

  // Desempenho 30 dias
  const r30 = resumoDoGrupo(medidos.atual)
  const r60 = resumoDoGrupo(medidos.antes)
  const melhor = [...medidos.atual].sort((a, b) => forca(b) - forca(a))[0]
  const variacao = (a: number | null, b: number | null) => (a == null || !b ? null : ((a - b) / b) * 100)

  // Lançamento em curso
  const proxMov = lancamento?.movimentos.filter((m) => !m.feito && m.data_prevista).sort((a, b) => (a.data_prevista! < b.data_prevista! ? -1 : 1))[0]
  const feitosArco = lancamento?.movimentos.filter((m) => m.feito).length ?? 0
  const diasRev = lancamento?.revelacao_em ? Math.round((Date.parse(lancamento.revelacao_em) - Date.parse(hoje)) / 86400000) : null

  // Ano
  const ano = Number(hoje.slice(0, 4))
  const doAno = metas.filter((m) => m.ano === ano)
  const concluidasAno = doAno.filter((m) => m.status === 'concluida').length
  const tri = Math.floor((Number(hoje.slice(5, 7)) - 1) / 3) + 1
  const proximas = doAno.filter((m) => m.status !== 'concluida' && (m.trimestre == null || m.trimestre <= tri))
    .sort((a, b) => (a.status === 'em_andamento' ? -1 : 0) - (b.status === 'em_andamento' ? -1 : 0)).slice(0, 4)

  const publicoTotal = publico.reduce((s, p) => s + p.seguidores, 0)

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className={`ml-64 px-10 py-8 max-w-[1400px] transition-opacity ${carregando ? 'opacity-60' : ''}`}>
        <Header
          title={`${saudacao}, Nicolle`}
          subtitle={
            <p className="text-[15px] text-charcoal/70 leading-relaxed max-w-[760px] min-h-[24px]">
              {verso && <>“{verso.texto}”<span className="text-[13px] text-muted whitespace-nowrap"> · {verso.referencia} (NVI)</span></>}
            </p>
          }
        />

        <div className="grid grid-cols-[1fr_360px] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            {/* Esta semana */}
            <section className={`${cartao} p-5`}>
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-[14px] font-medium text-charcoal">Esta semana no feed</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${ritmoOk ? 'bg-olive/[0.12] text-olive' : 'bg-black/[0.05] text-muted'}`}>
                  {feedSemana.length} {feedSemana.length === 1 ? 'post' : 'posts'} · ritmo do manual {RITMO_SEMANA.minimo} a {RITMO_SEMANA.maximo}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {DIAS.map((nome, i) => {
                  const dia = somarDias(semana, i)
                  const doDia = daSemana.filter((p) => partesBR(p.data_hora!).data === dia)
                  const ehHoje = dia === hoje
                  return (
                    <div key={dia} className={`rounded-xl p-2 min-h-[150px] ${ehHoje ? 'bg-black/[0.04] ring-1 ring-black/[0.08]' : 'bg-black/[0.015]'}`}>
                      <div className={`text-[11px] mb-1.5 ${ehHoje ? 'text-charcoal font-semibold' : 'text-muted'}`}>{nome} {dia.slice(8)}</div>
                      <div className="space-y-1.5">
                        {doDia.map((p) => {
                          const capa = p.midias[0]
                          const Icone = iconeTipo[p.tipo]
                          return (
                            <Link key={p.id} href="/marketing" title={p.titulo ?? ''} className="block">
                              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-cream flex items-center justify-center">
                                {capa?.url
                                  ? (capa.tipo === 'video' ? <video src={capa.url} className="w-full h-full object-cover" muted /> : <img src={capa.url} alt="" className="w-full h-full object-cover" />)
                                  : <Icone size={14} className="text-muted/60" />}
                                {p.pilar && <span className={`absolute top-1.5 left-1.5 w-2 h-2 rounded-full ring-1 ring-white ${corPilar[p.pilar]}`} />}
                              </div>
                              <span className={`mt-1 inline-block px-1.5 py-px rounded-full text-[9.5px] font-medium ${estiloStatus[p.status]}`}>{STATUS[p.status]}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between mt-3 text-[12px] text-muted">
                <span>{proxSemana.length ? `Semana que vem: ${proxSemana.filter((p) => apareceNaGrade(p.tipo)).length} no feed já planejados` : 'Nada planejado para a semana que vem ainda'}</span>
                <Link href="/marketing" className="hover:text-charcoal flex items-center gap-1">Calendário <ArrowRight size={12} /></Link>
              </div>
            </section>

            {/* Tarefas */}
            <section className={`${cartao} overflow-hidden`}>
              <div className="px-5 pt-5">
                <Titulo href="/marketing/tarefas" acao="Todas as tarefas">Tarefas</Titulo>
              </div>
              {(() => {
                const atrasadas = tarefas.tarefas.filter((t) => faixa(t) === 'atrasada')
                const proximas = tarefas.tarefas.filter((t) => ['hoje', 'semana'].includes(faixa(t)))
                const semPrazo = tarefas.tarefas.filter((t) => faixa(t) === 'sem_prazo')
                const depois = tarefas.tarefas.filter((t) => faixa(t) === 'depois').length
                const grupos: [string, typeof atrasadas, boolean][] = [['Atrasadas', atrasadas, true], ['Hoje e próximos 7 dias', proximas, false], ['Sem prazo', semPrazo.slice(0, 4), false]]
                return (
                  <div className="-mt-2 pb-2">
                    {grupos.map(([nome, lista, alerta]) => lista.length > 0 && (
                      <div key={nome}>
                        <div className={`px-4 pt-2 pb-0.5 text-[11.5px] font-medium ${alerta ? 'text-[#8C6B3F]' : 'text-muted'}`}>{nome} · {lista.length}</div>
                        {lista.map((t) => <LinhaTarefa key={t.id} t={t} mostrarLancamento onSalvar={(d) => tarefas.salvar(t, d)} onApagar={() => tarefas.apagar(t)} />)}
                      </div>
                    ))}
                    {atrasadas.length + proximas.length + semPrazo.length === 0 && <p className="px-5 py-2 text-[13px] text-muted">Nada para os próximos 7 dias.{depois ? ` ${depois} ${depois === 1 ? 'tarefa' : 'tarefas'} mais adiante.` : ''}</p>}
                    <div className="border-t border-linha mt-1"><NovaTarefa onCriar={(titulo, prazo) => tarefas.criar(titulo, prazo)} placeholder="Anotar uma tarefa e Enter" /></div>
                  </div>
                )
              })()}
            </section>

            {/* Precisa de você */}
            <section className={`${cartao} p-5`}>
              <Titulo>Precisa de você</Titulo>
              {pendencias.length === 0 ? (
                <p className="flex items-center gap-2 text-[13.5px] text-olive"><span className="w-5 h-5 rounded-full bg-olive text-white flex items-center justify-center"><Check size={12} strokeWidth={3} /></span> Nada pendente. Tudo no ritmo.</p>
              ) : (
                <div className="divide-y divide-linha -mx-5">
                  {pendencias.slice(0, 7).map((p) => (
                    <Link key={p.chave} href={p.href} className="flex items-center gap-3 px-5 py-2.5 hover:bg-black/[0.02]">
                      <AlertTriangle size={14} className="text-[#8C6B3F] shrink-0" />
                      <span className="text-[13.5px] text-charcoal truncate">{p.texto}</span>
                      <span className="text-[12px] text-muted truncate flex-1">{p.nota}</span>
                      <ArrowRight size={13} className="text-muted shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Desempenho */}
            <section className={`${cartao} p-5`}>
              <Titulo href="/performance" acao="Performance">Instagram · últimos 30 dias</Titulo>
              <div className="grid grid-cols-[1fr_1fr_1fr_190px] gap-5 items-stretch">
                {[
                  { rotulo: 'Posts publicados', valor: String(r30.posts), v: variacao(r30.posts, r60.posts) },
                  { rotulo: 'Alcance médio', valor: compacto(r30.alcanceMedio), v: variacao(r30.alcanceMedio, r60.alcanceMedio) },
                  { rotulo: 'Taxa de salvamento', valor: pct(r30.salvamento), v: r30.salvamento != null && r60.salvamento != null ? (r30.salvamento - r60.salvamento) * 100 : null, pp: true },
                ].map((t) => (
                  <div key={t.rotulo}>
                    <div className="text-[12px] text-muted">{t.rotulo}</div>
                    <div className="font-display text-[30px] leading-tight text-charcoal tabular-nums mt-1">{t.valor}</div>
                    <div className="text-[12px] text-muted mt-0.5">
                      {t.v == null ? 'sem base para comparar' : <><span className={t.v >= 0 ? 'text-olive font-medium' : 'text-[#8C6B3F] font-medium'}>{t.v > 0 ? '+' : ''}{t.v.toFixed(0)}{t.pp ? ' p.p.' : '%'}</span> vs 30 dias antes</>}
                    </div>
                  </div>
                ))}
                {melhor ? (
                  <a href={melhor.permalink ?? '#'} target="_blank" rel="noreferrer" className="flex gap-3 rounded-xl bg-black/[0.02] p-2.5 hover:bg-black/[0.04]">
                    <div className="w-14 h-[70px] rounded-lg overflow-hidden bg-cream shrink-0">{melhor.capa && <img src={melhor.capa} alt="" className="w-full h-full object-cover" />}</div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted">Mais forte</div>
                      <div className="text-[12.5px] font-medium text-charcoal line-clamp-2 leading-snug">{melhor.titulo || 'Sem título'}</div>
                      <div className="text-[11px] text-muted mt-0.5 tabular-nums">{melhor.alcance != null ? `${compacto(melhor.alcance)} alcance` : `${compacto(melhor.curtidas)} curtidas`}</div>
                    </div>
                  </a>
                ) : <div className="text-[12px] text-muted">Nenhum post nos últimos 30 dias.</div>}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            {/* Palavra do ano */}
            <section className="rounded-2xl bg-[#1D1D1F] p-5">
              <PalavraDoAno supabase={supabase} ano={Number(hoje.slice(0, 4))} escuro />
            </section>

            {/* Público */}
            <section className={`${cartao} p-5`}>
              <Titulo href="/performance" acao="Detalhes">Público</Titulo>
              <div className="font-display text-[34px] text-charcoal tabular-nums leading-none">{publicoTotal ? publicoTotal.toLocaleString('pt-BR') : '—'}</div>
              <div className="text-[12px] text-muted mt-1 mb-4">somando todas as redes com número</div>
              <div className="space-y-2.5">
                {publico.map((p) => (
                  <div key={p.rede} className="flex items-baseline gap-2 text-[13px]">
                    <span className="text-charcoal flex-1">{p.rede === 'substack' ? 'Casa Nogs' : REDES[p.rede]}{p.manual && <span className="text-[11px] text-muted"> · anotado</span>}</span>
                    {p.delta7 != null && p.delta7 !== 0 && <span className={`text-[11.5px] tabular-nums ${p.delta7 > 0 ? 'text-olive' : 'text-[#8C6B3F]'}`}>{p.delta7 > 0 ? '+' : ''}{p.delta7} em 7d</span>}
                    <span className="text-charcoal font-medium tabular-nums">{p.seguidores.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
                {publico.length === 0 && <p className="text-[12.5px] text-muted">Conecte as redes em Conexões.</p>}
              </div>
              {ultimaEdicao && (
                <div className="mt-4 pt-3 border-t border-linha text-[12px] text-muted">
                  Última Casa Nogs: <span className="text-charcoal">{ultimaEdicao.titulo}</span> · {diasSemEdicao === 0 ? 'hoje' : `há ${diasSemEdicao} ${diasSemEdicao === 1 ? 'dia' : 'dias'}`}
                </div>
              )}
            </section>

            {/* Lançamento */}
            <section className={`${cartao} p-5`}>
              <Titulo href="/marketing/lancamentos" acao="Ficha">Lançamento em curso</Titulo>
              {lancamento ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[17px] font-medium text-charcoal tracking-tight">{lancamento.projeto}</span>
                    <span className="text-[12px] text-muted">{diasRev == null ? 'sem revelação' : diasRev > 0 ? `revela em ${diasRev} dias` : diasRev === 0 ? 'revela hoje' : `revelado há ${-diasRev} dias`}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-black/[0.06] overflow-hidden"><div className="h-full rounded-full bg-olive" style={{ width: `${(feitosArco / 16) * 100}%` }} /></div>
                  <div className="text-[11.5px] text-muted mt-1 tabular-nums">{feitosArco} de 16 movimentos</div>
                  {proxMov && (
                    <div className="mt-3 rounded-xl bg-black/[0.025] px-3 py-2.5">
                      <div className="text-[11px] text-muted">Próximo movimento · {diaCurto(proxMov.data_prevista!)}</div>
                      <div className="text-[13px] text-charcoal">{String(proxMov.movimento).padStart(2, '0')} · {movimento(proxMov.movimento).nome}</div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[12.5px] text-muted">Nenhum arco aberto. Um projeto por vez: <Link href="/marketing/lancamentos" className="text-charcoal underline underline-offset-2">abra o próximo</Link>.</p>
              )}
            </section>

            {/* Ano */}
            <section className={`${cartao} p-5`}>
              <Titulo href="/planejamento" acao="Planejamento">{ano === 2026 ? '2026 · Ano da Fundação' : `Plano de ${ano}`}</Titulo>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-display text-[26px] text-charcoal tabular-nums leading-none">{doAno.length ? Math.round((concluidasAno / doAno.length) * 100) : 0}%</span>
                <span className="text-[12px] text-muted">{concluidasAno} de {doAno.length} metas</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden mb-4"><div className="h-full rounded-full bg-olive" style={{ width: `${doAno.length ? (concluidasAno / doAno.length) * 100 : 0}%` }} /></div>
              <div className="space-y-2">
                {proximas.map((m) => (
                  <div key={m.id} className="flex items-start gap-2.5 text-[13px]">
                    <span className={`mt-[3px] w-3.5 h-3.5 shrink-0 rounded-full border-[1.5px] ${m.status === 'em_andamento' ? 'border-accent bg-accent/20' : 'border-black/20'}`} />
                    <span className="text-charcoal/85 leading-snug">{m.titulo}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

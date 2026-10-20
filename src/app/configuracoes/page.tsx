'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, Check, ChevronDown, ExternalLink, Loader2, LogIn } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { dataBR, dataHoraBR, hojeISO } from '@/lib/datas'
import { ORDEM_REDES, REDES, REDES_OAUTH, type Conexao, type Rede } from '@/lib/redes/tipos'

type Metrica = { rede: Rede; dia: string; seguidores: number | null; publicacoes: number | null; origem?: 'api' | 'manual' }
type Edicao = { id: string; titulo: string; link: string; publicado_em: string | null }

// Monogramas neutros no lugar das cores das marcas (paleta interna sem vermelho/rosa).
const MONOGRAMA: Record<Rede, string> = { instagram: 'Ig', substack: 'S', pinterest: 'P', tiktok: 'Tt', youtube: 'Yt', linkedin: 'in' }

// Redes com leitura automática (as outras só aceitam números anotados à mão).
const AUTOMATICAS: Rede[] = ['instagram', 'substack', 'pinterest', 'tiktok', 'youtube']

const ERROS: Record<string, string> = {
  'sem-app': 'O app desta rede ainda não foi configurado na Vercel.',
  state: 'O login expirou ou veio de outra aba. Tente conectar de novo.',
  token: 'A rede recusou a troca do código pelo acesso.',
  access_denied: 'O acesso não foi autorizado na tela da rede.',
}

// O que cada rede entrega e o que falta para ligar.
const SOBRE: Record<Rede, { entrega: string; passos?: string[]; aviso?: string }> = {
  instagram: {
    entrega: 'Seguidores todo dia, posts antigos com métricas e, no futuro, publicação automática.',
    passos: [
      'Criar um app do tipo "Empresa" em developers.facebook.com.',
      'No Gerenciador de Negócios, criar um usuário do sistema (token que não expira).',
      'Dar a ele acesso à sua página do Facebook e à conta do Instagram.',
      'Gerar o token com as permissões de leitura do Instagram e de anúncios.',
      'Colar o token na Vercel como META_TOKEN (a Claudinha faz essa parte).',
    ],
  },
  substack: {
    entrega: 'Lista das edições da Casa Nogs com título, data e link, lida do feed público.',
    aviso: 'O Substack não libera assinantes nem aberturas. Esses números entram à mão ou pela planilha que ele exporta.',
  },
  pinterest: {
    entrega: 'Seguidores, pins e, por dia, impressões, salvos e cliques (com até 30 dias para trás).',
    passos: [
      'Ter conta comercial no Pinterest (Configurações → Conta → converter para conta comercial).',
      'Em developers.pinterest.com, criar um app e pedir o acesso "Trial".',
      'No app, cadastrar o endereço de retorno: https://nicolle-central.vercel.app/api/conectar/pinterest/callback',
      'Colocar o App ID e o App secret na Vercel (PINTEREST_APP_ID e PINTEREST_APP_SECRET).',
      'Voltar aqui e clicar em Conectar.',
    ],
  },
  tiktok: {
    entrega: 'Seguidores, curtidas totais e os números dos 20 vídeos mais recentes.',
    passos: [
      'Em developers.tiktok.com, criar um app com Login Kit e os escopos user.info.basic, user.info.stats e video.list.',
      'Cadastrar o endereço de retorno: https://nicolle-central.vercel.app/api/conectar/tiktok/callback',
      'Enviar o app para análise (o TikTok aprova em alguns dias).',
      'Colocar o Client key e o Client secret na Vercel (TIKTOK_CLIENT_KEY e TIKTOK_CLIENT_SECRET).',
      'Voltar aqui e clicar em Conectar.',
    ],
  },
  youtube: {
    entrega: 'Inscritos, visualizações totais e número de vídeos do canal, todo dia.',
    passos: [
      'Em console.cloud.google.com, criar um projeto e ativar a "YouTube Data API v3".',
      'Em Credenciais, criar uma chave de API.',
      'Colocar a chave na Vercel como YOUTUBE_API_KEY.',
      'Informar aqui embaixo o @ do canal.',
    ],
  },
  linkedin: {
    entrega: 'O LinkedIn só libera números de páginas de empresa, e com aprovação demorada.',
    aviso: 'Para o perfil pessoal, anote os seguidores de vez em quando aqui embaixo: a curva se forma do mesmo jeito.',
  },
}

export default function ConexoesPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [conexoes, setConexoes] = useState<Conexao[]>([])
  const [metricas, setMetricas] = useState<Metrica[]>([])
  const [edicoes, setEdicoes] = useState<Edicao[]>([])
  const [rodando, setRodando] = useState<Rede | null>(null)
  const [aberta, setAberta] = useState<Rede | null>(null)
  const [aviso, setAviso] = useState<{ rede: Rede; texto: string; ok: boolean } | null>(null)
  const [manual, setManual] = useState<Partial<Record<Rede, string>>>({})
  const [canal, setCanal] = useState('')

  // Volta do login de uma rede (?conectado=pinterest ou ?erro=tiktok-state).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const conectado = q.get('conectado') as Rede | null
    const erro = q.get('erro')
    if (conectado) { setAviso({ rede: conectado, ok: true, texto: 'Conectado. A primeira leitura já foi feita.' }); setAberta(conectado) }
    if (erro) {
      const [rede, ...motivo] = erro.split('-')
      const chave = motivo.join('-')
      setAviso({ rede: rede as Rede, ok: false, texto: `${ERROS[chave] ?? 'Não foi possível conectar.'}${q.get('detalhe') ? ` (${q.get('detalhe')})` : ''}` })
      setAberta(rede as Rede)
    }
    if (conectado || erro) window.history.replaceState(null, '', '/configuracoes')
  }, [])

  const carregar = useCallback(async () => {
    const [c, m, e] = await Promise.all([
      supabase.from('conexoes').select('*'),
      supabase.from('metricas_conta').select('rede, dia, seguidores, publicacoes, origem').order('dia', { ascending: false }).limit(200),
      supabase.from('substack_edicoes').select('id, titulo, link, publicado_em').order('publicado_em', { ascending: false }).limit(3),
    ])
    setConexoes((c.data ?? []) as Conexao[])
    setCanal(((c.data ?? []) as Conexao[]).find((x) => x.rede === 'youtube')?.conta ?? '')
    setMetricas((m.data ?? []) as Metrica[])
    setEdicoes((e.data ?? []) as Edicao[])
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  async function sincronizar(rede: Rede) {
    setRodando(rede)
    setAviso(null)
    try {
      const resposta = await fetch('/api/sincronizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rede }),
      })
      const r = await resposta.json()
      setAviso({ rede, ok: r.ok, texto: r.ok ? `Atualizado: ${r.resumo}` : r.motivo })
      await carregar()
    } catch {
      setAviso({ rede, ok: false, texto: 'Não foi possível falar com o servidor.' })
    } finally {
      setRodando(null)
    }
  }

  async function anotar(rede: Rede) {
    const valor = Number((manual[rede] ?? '').replace(/\D/g, ''))
    if (!valor) return
    const { error } = await supabase.from('metricas_conta').upsert(
      { rede, dia: hojeISO(), seguidores: valor, origem: 'manual', coletado_em: new Date().toISOString() },
      { onConflict: 'rede,dia' }
    )
    setAviso({ rede, ok: !error, texto: error ? error.message : `Anotado: ${valor.toLocaleString('pt-BR')} seguidores em ${dataBR(new Date())}.` })
    setManual((m) => ({ ...m, [rede]: '' }))
    carregar()
  }

  async function salvarCanal() {
    const conta = canal.trim()
    await supabase.from('conexoes').update({ conta: conta || null }).eq('rede', 'youtube')
    await carregar()
    if (conta) sincronizar('youtube')
  }

  const ultima = (rede: Rede) => metricas.find((m) => m.rede === rede && (m.seguidores != null || m.publicacoes != null))
  const conectadas = conexoes.filter((c) => c.status === 'conectada').length

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1100px]">
        <Header title="Conexões" subtitle="As redes que a Central lê sozinha, todos os dias às 7h" />

        <p className="text-[13px] text-muted mb-5">
          {conectadas} de {ORDEM_REDES.length} conectadas · as senhas e tokens ficam guardados só no servidor, nunca nesta tela.
        </p>

        <div className="bg-white rounded-2xl border border-linha shadow-card divide-y divide-linha overflow-hidden">
          {ORDEM_REDES.map((rede) => {
            const c = conexoes.find((x) => x.rede === rede)
            const m = ultima(rede)
            const sobre = SOBRE[rede]
            const status = c?.status ?? 'desconectada'
            const expandida = aberta === rede
            const disponivel = AUTOMATICAS.includes(rede) && (status !== 'desconectada' || rede === 'youtube')
            const oauth = (REDES_OAUTH as readonly string[]).includes(rede)

            return (
              <section key={rede}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-11 h-11 rounded-[12px] bg-cream border border-linha flex items-center justify-center text-[15px] font-semibold text-charcoal tracking-tight">
                    {MONOGRAMA[rede]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium text-charcoal">{REDES[rede]}</span>
                      {c?.conta && <span className="text-[13px] text-muted truncate">{rede === 'substack' || rede === 'tiktok' || c.conta.startsWith('@') ? c.conta : `@${c.conta}`}</span>}
                    </div>
                    <div className="text-[12px] text-muted mt-0.5">
                      {status === 'conectada' && c?.ultima_sincronizacao && <>Atualizado {dataHoraBR(c.ultima_sincronizacao)}</>}
                      {status === 'erro' && <span className="text-accent">{c?.ultimo_erro}</span>}
                      {status === 'desconectada' && sobre.entrega}
                    </div>
                  </div>

                  {m && (m.seguidores != null || m.publicacoes != null) && (
                    <div className="text-right mr-2">
                      <div className="text-[20px] font-semibold tracking-tight text-charcoal tabular-nums leading-none">
                        {(m.seguidores ?? m.publicacoes)?.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-[11px] text-muted mt-1">{m.seguidores != null ? (rede === 'youtube' ? 'inscritos' : 'seguidores') : 'edições'}{m.origem === 'manual' ? ' · anotado' : ''}</div>
                    </div>
                  )}

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap
                    ${status === 'conectada' ? 'bg-olive/[0.12] text-olive' : status === 'erro' ? 'bg-gold/20 text-charcoal' : 'bg-black/[0.05] text-muted'}`}>
                    {status === 'conectada' ? 'Conectada' : status === 'erro' ? 'Com erro' : 'Não conectada'}
                  </span>

                  {oauth && (
                    <a
                      href={`/api/conectar/${rede}`}
                      className={`flex items-center gap-1.5 px-3.5 py-[6px] rounded-full text-[12.5px] font-medium transition-colors
                        ${status === 'conectada' ? 'text-charcoal/70 hover:bg-black/[0.05]' : 'text-white bg-charcoal hover:bg-black'}`}
                    >
                      <LogIn size={13} /> {status === 'conectada' ? 'Reconectar' : 'Conectar'}
                    </a>
                  )}

                  {disponivel && (
                    <button
                      onClick={() => sincronizar(rede)}
                      disabled={rodando !== null}
                      aria-label="Sincronizar agora"
                      title="Sincronizar agora"
                      className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.09] flex items-center justify-center text-charcoal/70 transition-colors disabled:opacity-50"
                    >
                      {rodando === rede ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={14} />}
                    </button>
                  )}

                  <button
                    onClick={() => setAberta(expandida ? null : rede)}
                    aria-label="Detalhes"
                    className="w-8 h-8 rounded-full hover:bg-black/[0.05] flex items-center justify-center text-muted transition-colors"
                  >
                    <ChevronDown size={16} className={`transition-transform duration-200 ${expandida ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {aviso?.rede === rede && (
                  <div className={`mx-5 mb-4 -mt-1 rounded-xl px-4 py-2.5 text-[13px] flex items-center gap-2 ${aviso.ok ? 'bg-olive/[0.08] text-olive' : 'bg-gold/15 text-charcoal'}`}>
                    {aviso.ok && <Check size={14} />} {aviso.texto}
                  </div>
                )}

                {expandida && (
                  <div className="px-5 pb-5 pl-[80px] space-y-3 animate-fadeIn">
                    <p className="text-[13px] text-charcoal">{sobre.entrega}</p>
                    {sobre.aviso && <p className="text-[13px] text-muted">{sobre.aviso}</p>}

                    {sobre.passos && status !== 'conectada' && (
                      <ol className="space-y-1.5">
                        {sobre.passos.map((p, i) => (
                          <li key={p} className="flex gap-2.5 text-[13px] text-charcoal">
                            <span className="w-5 h-5 shrink-0 rounded-full bg-black/[0.05] text-[11px] font-medium flex items-center justify-center tabular-nums">{i + 1}</span>
                            {p}
                          </li>
                        ))}
                      </ol>
                    )}

                    {rede === 'youtube' && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          value={canal}
                          onChange={(e) => setCanal(e.target.value)}
                          placeholder="@seucanal"
                          className="w-[220px] rounded-[10px] border border-black/[0.10] bg-white px-3 py-1.5 text-[13px] text-charcoal outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/15"
                        />
                        <button onClick={salvarCanal} className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Salvar canal</button>
                      </div>
                    )}

                    {rede !== 'substack' && rede !== 'instagram' && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[12px] text-muted">Anotar {rede === 'youtube' ? 'inscritos' : 'seguidores'} de hoje:</span>
                        <input
                          inputMode="numeric"
                          value={manual[rede] ?? ''}
                          onChange={(e) => setManual((m) => ({ ...m, [rede]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') anotar(rede) }}
                          placeholder="ex.: 1250"
                          className="w-[110px] rounded-[10px] border border-black/[0.10] bg-white px-3 py-1.5 text-[13px] tabular-nums text-charcoal outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/15"
                        />
                        <button onClick={() => anotar(rede)} className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Anotar</button>
                      </div>
                    )}

                    {rede === 'substack' && edicoes.length > 0 && (
                      <div className="rounded-xl bg-cream/70 divide-y divide-linha">
                        {edicoes.map((e) => (
                          <a key={e.id} href={e.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-charcoal hover:text-accent transition-colors">
                            <span className="truncate flex-1">{e.titulo}</span>
                            {e.publicado_em && <span className="text-[12px] text-muted tabular-nums">{dataBR(e.publicado_em)}</span>}
                            <ExternalLink size={12} className="text-muted" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}

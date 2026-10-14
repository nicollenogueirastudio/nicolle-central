'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, Check, ChevronDown, ExternalLink, Loader2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { dataBR, dataHoraBR } from '@/lib/datas'
import { ORDEM_REDES, REDES, type Conexao, type Rede } from '@/lib/redes/tipos'

type Metrica = { rede: Rede; dia: string; seguidores: number | null; publicacoes: number | null }
type Edicao = { id: string; titulo: string; link: string; publicado_em: string | null }

// Monogramas neutros no lugar das cores das marcas (paleta interna sem vermelho/rosa).
const MONOGRAMA: Record<Rede, string> = { instagram: 'Ig', substack: 'S', pinterest: 'P', tiktok: 'Tt', linkedin: 'in' }

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
    entrega: 'Pins, impressões, salvos e cliques.',
    passos: ['Ter conta comercial no Pinterest.', 'Criar um app em developers.pinterest.com.', 'Autorizar a Central a ler a conta.'],
  },
  tiktok: {
    entrega: 'Vídeos com visualizações, curtidas e comentários.',
    passos: ['Criar um app em developers.tiktok.com.', 'Pedir o acesso de leitura (o TikTok analisa e aprova em alguns dias).', 'Autorizar a Central a ler a conta.'],
  },
  linkedin: {
    entrega: 'Muito pouco para perfil pessoal: o LinkedIn só libera números de páginas de empresa.',
    aviso: 'Por enquanto, o melhor caminho é anotar os números do mês à mão.',
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

  const carregar = useCallback(async () => {
    const [c, m, e] = await Promise.all([
      supabase.from('conexoes').select('*'),
      supabase.from('metricas_conta').select('rede, dia, seguidores, publicacoes').order('dia', { ascending: false }).limit(50),
      supabase.from('substack_edicoes').select('id, titulo, link, publicado_em').order('publicado_em', { ascending: false }).limit(3),
    ])
    setConexoes((c.data ?? []) as Conexao[])
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

  const ultima = (rede: Rede) => metricas.find((m) => m.rede === rede)
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
            const disponivel = rede === 'instagram' || rede === 'substack'

            return (
              <section key={rede}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-11 h-11 rounded-[12px] bg-cream border border-linha flex items-center justify-center text-[15px] font-semibold text-charcoal tracking-tight">
                    {MONOGRAMA[rede]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium text-charcoal">{REDES[rede]}</span>
                      {c?.conta && <span className="text-[13px] text-muted truncate">{rede === 'substack' ? c.conta : `@${c.conta}`}</span>}
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
                      <div className="text-[11px] text-muted mt-1">{m.seguidores != null ? 'seguidores' : 'edições'}</div>
                    </div>
                  )}

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap
                    ${status === 'conectada' ? 'bg-olive/[0.12] text-olive' : status === 'erro' ? 'bg-gold/20 text-charcoal' : 'bg-black/[0.05] text-muted'}`}>
                    {status === 'conectada' ? 'Conectada' : status === 'erro' ? 'Com erro' : 'Não conectada'}
                  </span>

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

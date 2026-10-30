'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { cartao } from '@/components/performance/ui'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { registrarAtividade } from '@/lib/atividades'
import { dataHoraBR } from '@/lib/datas'
import { reais, type Config } from '@/lib/trafego/tipos'
import type { Diagnostico } from '@/lib/trafego/meta'

// Permissões que a área precisa no token da Meta.
const PRECISA: { nome: string; para: string }[] = [
  { nome: 'ads_read', para: 'ler resultados dos anúncios' },
  { nome: 'ads_management', para: 'criar, ligar, pausar e mudar orçamento' },
  { nome: 'business_management', para: 'enxergar a conta de anúncios do portfólio' },
  { nome: 'pages_show_list', para: 'listar a página do Facebook' },
  { nome: 'instagram_basic', para: 'usar posts do Instagram como anúncio' },
]
const STATUS_CONTA: Record<number, string> = { 1: 'ativa', 2: 'desativada', 3: 'pagamento pendente', 7: 'em análise', 9: 'em período de carência', 100: 'encerrando', 101: 'encerrada' }

type Acao = { id: number; quando: string; acao: string; alvo: string | null; detalhe: Record<string, unknown> | null; ok: boolean; erro: string | null }

const campo = 'w-full px-3 py-2 rounded-lg border border-linha bg-white text-[13.5px] text-charcoal focus:outline-none focus:border-olive'
const rotulo = 'block text-[12px] text-muted mb-1'

export default function ConfigurarTrafego() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [diag, setDiag] = useState<Diagnostico | null>(null)
  const [erroDiag, setErroDiag] = useState<string | null>(null)
  const [cfg, setCfg] = useState<Config | null>(null)
  const [acoes, setAcoes] = useState<Acao[]>([])
  const [salvo, setSalvo] = useState(false)

  const carregar = useCallback(async () => {
    const [{ data: c }, { data: a }] = await Promise.all([
      supabase.from('trafego_config').select('*').eq('id', 1).maybeSingle(),
      supabase.from('trafego_acoes').select('*').order('quando', { ascending: false }).limit(30),
    ])
    setCfg(c as Config)
    setAcoes((a ?? []) as Acao[])
  }, [supabase])

  useEffect(() => {
    carregar()
    fetch('/api/trafego/diagnostico').then((r) => r.json()).then((j) => (j.ok ? setDiag(j) : setErroDiag(j.motivo))).catch((e) => setErroDiag(e.message))
  }, [carregar])

  const tem = (p: string) => diag?.permissoes.some((x) => x.permission === p && x.status === 'granted')
  const paginaEscolhida = diag?.paginas.find((p) => p.id === cfg?.pagina_id)

  const salvar = async () => {
    if (!cfg) return
    const { error } = await supabase.from('trafego_config').update({
      conta_anuncios_id: cfg.conta_anuncios_id || null, pagina_id: cfg.pagina_id || null, instagram_id: cfg.instagram_id || null,
      pixel_id: cfg.pixel_id || null, teto_diario: cfg.teto_diario, teto_mensal: cfg.teto_mensal,
    }).eq('id', 1)
    if (error) return window.alert(error.message)
    await registrarAtividade(supabase, 'editou', 'trafego_config', '1', { conta: cfg.conta_anuncios_id, teto_diario: cfg.teto_diario, teto_mensal: cfg.teto_mensal })
    setSalvo(true); setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-64 px-10 py-8 max-w-[1100px]">
        <Header title="Configurar tráfego" subtitle="Qual conta de anúncios o sistema opera, os tetos de gasto e o que o token da Meta permite." />

        <div className="space-y-6 pb-24">
          <section className={`${cartao} p-6`}>
            <div className="text-[15px] font-medium text-charcoal mb-1">Conexão com a Meta</div>
            {!diag && !erroDiag && <p className="text-[13px] text-muted flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Perguntando à Meta…</p>}
            {erroDiag && <p className="text-[13px] text-[#8C6B3F]">{erroDiag}</p>}
            {diag && (
              <>
                <p className="text-[13px] text-muted mb-4">Token de <b className="text-charcoal font-medium">{diag.usuario.name}</b></p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {PRECISA.map((p) => (
                    <div key={p.nome} className="flex items-center gap-2 text-[13px]">
                      {tem(p.nome) ? <Check size={14} className="text-olive" /> : <X size={14} className="text-[#8C6B3F]" />}
                      <span className="font-mono text-[12px] text-charcoal">{p.nome}</span>
                      <span className="text-muted">· {p.para}</span>
                    </div>
                  ))}
                </div>
                {PRECISA.some((p) => !tem(p.nome)) && (
                  <div className="mt-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal leading-relaxed">
                    Falta permissão no token. No Gerenciador de Negócios da Meta: Configurações do negócio → Usuários do sistema →
                    o usuário do sistema da Central → Gerar novo token, marcando as permissões com X acima, e dando a ele acesso à conta de anúncios
                    (Contas → Contas de anúncios → Atribuir parceiros/pessoas → controle total). Depois troque o META_TOKEN na Vercel.
                  </div>
                )}
              </>
            )}
          </section>

          {cfg && (
            <section className={`${cartao} p-6 space-y-5`}>
              <div className="text-[15px] font-medium text-charcoal">Conta que o sistema opera</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={rotulo}>Conta de anúncios</label>
                  <select className={campo} value={cfg.conta_anuncios_id ?? ''} onChange={(e) => setCfg({ ...cfg, conta_anuncios_id: e.target.value })}>
                    <option value="">Escolher…</option>
                    {diag?.contas.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} · {c.currency} · {STATUS_CONTA[c.account_status] ?? c.account_status}{c.business ? ` · ${c.business.name}` : ''}</option>
                    ))}
                    {cfg.conta_anuncios_id && !diag?.contas.some((c) => c.id === cfg.conta_anuncios_id) && <option value={cfg.conta_anuncios_id}>{cfg.conta_anuncios_id}</option>}
                  </select>
                  {diag && diag.contas.length === 0 && <p className="text-[12px] text-[#8C6B3F] mt-1">O token não enxerga nenhuma conta de anúncios.</p>}
                </div>
                <div>
                  <label className={rotulo}>Página do Facebook (identidade do anúncio)</label>
                  <select className={campo} value={cfg.pagina_id ?? ''} onChange={(e) => {
                    const p = diag?.paginas.find((x) => x.id === e.target.value)
                    setCfg({ ...cfg, pagina_id: e.target.value, instagram_id: p?.instagram_business_account?.id ?? cfg.instagram_id })
                  }}>
                    <option value="">Escolher…</option>
                    {diag?.paginas.map((p) => <option key={p.id} value={p.id}>{p.name}{p.instagram_business_account?.username ? ` · @${p.instagram_business_account.username}` : ''}</option>)}
                  </select>
                  {paginaEscolhida?.instagram_business_account && <p className="text-[12px] text-muted mt-1">Instagram: @{paginaEscolhida.instagram_business_account.username ?? paginaEscolhida.instagram_business_account.id}</p>}
                </div>
                <div>
                  <label className={rotulo}>Pixel (opcional, para medir o site)</label>
                  <input className={campo} value={cfg.pixel_id ?? ''} onChange={(e) => setCfg({ ...cfg, pixel_id: e.target.value })} placeholder="ID do pixel" />
                </div>
              </div>

              <div className="text-[15px] font-medium text-charcoal pt-2">Tetos de gasto</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={rotulo}>Orçamento diário máximo por anúncio (R$)</label>
                  <input type="number" className={campo} value={cfg.teto_diario ?? ''} onChange={(e) => setCfg({ ...cfg, teto_diario: e.target.value ? Number(e.target.value) : null })} />
                  <p className="text-[12px] text-muted mt-1">O sistema recusa publicar ou subir orçamento acima disto.</p>
                </div>
                <div>
                  <label className={rotulo}>Teto mensal (R$)</label>
                  <input type="number" className={campo} value={cfg.teto_mensal ?? ''} onChange={(e) => setCfg({ ...cfg, teto_mensal: e.target.value ? Number(e.target.value) : null })} />
                  <p className="text-[12px] text-muted mt-1">Aviso na Visão geral quando o investido do mês passar disto.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={salvar} className="px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black">Salvar</button>
                {salvo && <span className="text-[12.5px] text-olive flex items-center gap-1"><Check size={13} /> salvo</span>}
              </div>
            </section>
          )}

          <section className={`${cartao} p-6`}>
            <div className="text-[15px] font-medium text-charcoal mb-3">O que o sistema mandou para a Meta</div>
            {acoes.length === 0 && <p className="text-[13px] text-muted">Nada ainda.</p>}
            <div className="divide-y divide-linha">
              {acoes.map((a) => (
                <div key={a.id} className="py-2 grid grid-cols-[150px_110px_1fr] gap-3 text-[12.5px]">
                  <span className="text-muted tabular-nums">{dataHoraBR(a.quando)}</span>
                  <span className={a.ok ? 'text-charcoal' : 'text-[#8C6B3F]'}>{a.acao}{a.ok ? '' : ' · falhou'}</span>
                  <span className="text-muted truncate">
                    {String(a.detalhe?.nome ?? a.alvo ?? '')}
                    {a.acao === 'status' && a.detalhe?.status ? ` → ${a.detalhe.status === 'ACTIVE' ? 'ligado' : 'pausado'}` : ''}
                    {a.acao === 'orcamento' && a.detalhe?.valor ? ` → ${reais(Number(a.detalhe.valor))}/dia` : ''}
                    {a.erro ? ` · ${a.erro}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExternalLink, Check, Loader2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { LinhaTempo } from '@/components/performance/Graficos'
import Ideias from '@/components/newsletter/Ideias'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { dataBR, hojeISO, partesBR, inicioDaSemana, somarDias, diaCurto } from '@/lib/datas'
import { retratosDaConta, type Retrato } from '@/lib/performance/dados'

type Edicao = {
  id: string
  titulo: string
  subtitulo: string | null
  link: string
  imagem: string | null
  publicado_em: string | null
  aberturas_pct: number | null
  visualizacoes: number | null
  novos_assinantes: number | null
  curtidas: number | null
}

type Campo = 'aberturas_pct' | 'visualizacoes' | 'novos_assinantes' | 'curtidas'
const CAMPOS: { k: Campo; nome: string; sufixo?: string }[] = [
  { k: 'aberturas_pct', nome: 'Abertura', sufixo: '%' },
  { k: 'visualizacoes', nome: 'Visualizações' },
  { k: 'novos_assinantes', nome: 'Novos assin.' },
  { k: 'curtidas', nome: 'Curtidas' },
]

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const SEMANAS = 16

/** Número anotado à mão: grava ao sair do campo. */
function CampoNumero({ valor, sufixo, onSalvar }: { valor: number | null; sufixo?: string; onSalvar: (v: number | null) => Promise<void> }) {
  const [texto, setTexto] = useState(valor == null ? '' : String(valor).replace('.', ','))
  const [estado, setEstado] = useState<'parado' | 'salvando' | 'salvo'>('parado')
  useEffect(() => { setTexto(valor == null ? '' : String(valor).replace('.', ',')) }, [valor])

  async function salvar() {
    const limpo = texto.trim().replace(',', '.')
    const novo = limpo === '' ? null : Number(limpo)
    if (novo !== null && Number.isNaN(novo)) return setTexto(valor == null ? '' : String(valor))
    if (novo === valor) return
    setEstado('salvando')
    await onSalvar(novo)
    setEstado('salvo')
    setTimeout(() => setEstado('parado'), 1200)
  }

  return (
    <span className="relative inline-flex items-center">
      <input
        inputMode="decimal"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={salvar}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        placeholder="—"
        className="w-[72px] rounded-lg border border-transparent hover:border-black/10 focus:border-accent focus:ring-[3px] focus:ring-accent/15 bg-transparent px-2 py-1 text-right text-[13px] tabular-nums text-charcoal outline-none placeholder:text-muted/50"
      />
      {sufixo && texto && <span className="text-[12px] text-muted -ml-1">{sufixo}</span>}
      {estado === 'salvando' && <Loader2 size={11} className="absolute -right-3 animate-spin text-muted" />}
      {estado === 'salvo' && <Check size={11} className="absolute -right-3 text-olive" />}
    </span>
  )
}

export default function NewsletterPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [edicoes, setEdicoes] = useState<Edicao[]>([])
  const [retratos, setRetratos] = useState<Retrato[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('substack_edicoes').select('*').order('publicado_em', { ascending: false })
      if (error) throw error
      setEdicoes((data ?? []) as Edicao[])
      setRetratos(await retratosDaConta(supabase, 'substack'))
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  async function salvarCampo(id: string, k: Campo, v: number | null) {
    const { error } = await supabase.from('substack_edicoes').update({ [k]: v }).eq('id', id)
    if (error) setErro(error.message)
    else setEdicoes((l) => l.map((e) => (e.id === id ? { ...e, [k]: v } : e)))
  }

  async function salvarAssinantes(v: number | null) {
    const { error } = await supabase.from('metricas_conta').upsert({ rede: 'substack', dia: hojeISO(), seguidores: v, coletado_em: new Date().toISOString() }, { onConflict: 'rede,dia' })
    if (error) setErro(error.message)
    else setRetratos(await retratosDaConta(supabase, 'substack'))
  }

  const hoje = hojeISO()
  const publicadas = edicoes.filter((e) => e.publicado_em)
  const ultima = publicadas[0]
  const diasDesde = ultima ? Math.round((Date.parse(hoje) - Date.parse(partesBR(ultima.publicado_em!).data)) / 86400000) : null
  const doMes = publicadas.filter((e) => partesBR(e.publicado_em!).data.slice(0, 7) === hoje.slice(0, 7)).length
  const assinantes = [...retratos].reverse().find((r) => r.seguidores != null)
  const curvaAssinantes = retratos.filter((r) => r.seguidores != null).map((r) => ({ dia: r.dia, valor: r.seguidores! }))
  const aberturas = publicadas.map((e) => e.aberturas_pct).filter((v): v is number => v != null)
  const aberturaMedia = aberturas.length ? aberturas.reduce((s, v) => s + v, 0) / aberturas.length : null

  // Ritmo: a Casa Nogs é semanal. Uma marca por semana com edição.
  const semanaAtual = inicioDaSemana(hoje)
  const semanas = Array.from({ length: SEMANAS }, (_, i) => somarDias(semanaAtual, -7 * (SEMANAS - 1 - i)))
  const semanasComEdicao = new Set(publicadas.map((e) => inicioDaSemana(partesBR(e.publicado_em!).data)))
  const cumpridas = semanas.filter((s) => semanasComEdicao.has(s)).length

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1400px]">
        <Header title="Casa Nogs" subtitle="As edições reais do Substack, lidas do feed todos os dias" />

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        <section className="grid grid-cols-4 gap-4 mb-5">
          <div className={`${cartao} p-5`}>
            <div className="text-[12px] text-muted">Edições publicadas</div>
            <div className="font-display text-[30px] leading-tight text-charcoal tabular-nums mt-1">{carregando ? '—' : publicadas.length}</div>
            <div className="text-[12px] text-muted mt-1">{doMes} neste mês</div>
          </div>
          <div className={`${cartao} p-5`}>
            <div className="text-[12px] text-muted">Última edição</div>
            <div className="font-display text-[30px] leading-tight text-charcoal tabular-nums mt-1">{diasDesde == null ? '—' : diasDesde === 0 ? 'hoje' : `há ${diasDesde} ${diasDesde === 1 ? 'dia' : 'dias'}`}</div>
            <div className={`text-[12px] mt-1 ${diasDesde != null && diasDesde > 7 ? 'text-[#8C6B3F] font-medium' : 'text-muted'}`}>
              {diasDesde != null && diasDesde > 7 ? 'passou da semana: a promessa é semanal' : ultima ? dataBR(ultima.publicado_em!) : ''}
            </div>
          </div>
          <div className={`${cartao} p-5`}>
            <div className="text-[12px] text-muted">Assinantes</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-display text-[30px] leading-tight text-charcoal tabular-nums">{assinantes?.seguidores?.toLocaleString('pt-BR') ?? '—'}</span>
            </div>
            <div className="text-[12px] text-muted mt-1 flex items-center gap-1">
              Hoje: <CampoNumero valor={retratos.find((r) => r.dia === hoje)?.seguidores ?? null} onSalvar={salvarAssinantes} />
            </div>
          </div>
          <div className={`${cartao} p-5`}>
            <div className="text-[12px] text-muted">Abertura média</div>
            <div className="font-display text-[30px] leading-tight text-charcoal tabular-nums mt-1">{aberturaMedia == null ? '—' : `${aberturaMedia.toFixed(0)}%`}</div>
            <div className="text-[12px] text-muted mt-1">{aberturas.length ? `de ${aberturas.length} ${aberturas.length === 1 ? 'edição anotada' : 'edições anotadas'}` : 'anote nas edições abaixo'}</div>
          </div>
        </section>

        <section className="grid grid-cols-[1fr_1.3fr] gap-5 mb-5">
          <div className={`${cartao} p-5`}>
            <div className="text-[14px] font-medium text-charcoal">Ritmo semanal</div>
            <p className="text-[12px] text-muted mb-4">{cumpridas} de {SEMANAS} semanas com edição. Cada quadrado é uma semana.</p>
            <div className="grid grid-cols-8 gap-1.5">
              {semanas.map((s) => (
                <div key={s} title={`Semana de ${diaCurto(s)}${semanasComEdicao.has(s) ? ' · com edição' : ' · sem edição'}`}
                  className={`aspect-square rounded-[5px] ${semanasComEdicao.has(s) ? 'bg-olive' : 'bg-black/[0.06]'} ${s === semanaAtual ? 'ring-2 ring-offset-2 ring-black/15' : ''}`} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-olive" /> com edição</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-black/[0.06]" /> sem edição</span>
            </div>
          </div>

          <div className={`${cartao} p-5`}>
            <div className="text-[14px] font-medium text-charcoal mb-2">Assinantes ao longo do tempo</div>
            {curvaAssinantes.length >= 2
              ? <LinhaTempo pontos={curvaAssinantes} rotulo="Assinantes" />
              : (
                <p className="text-[13px] text-muted py-10 text-center max-w-[460px] mx-auto">
                  O Substack não tem API e o feed não traz assinantes. Anote o número do painel do Substack (Estatísticas → Assinantes) no cartão acima, de vez em quando, e a curva se forma aqui.
                </p>
              )}
          </div>
        </section>

        <Ideias supabase={supabase} />

        <section className={`${cartao} overflow-hidden`}>
          <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
            <span className="text-[14px] font-medium text-charcoal">Edições</span>
            <span className="text-[12px] text-muted">Abertura, visualizações e assinantes: copie do Substack (Estatísticas → Posts). Grava ao sair do campo.</span>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-y border-linha">
                <th className="font-medium px-5 py-2">Edição</th>
                <th className="font-medium py-2 w-[100px]">Data</th>
                {CAMPOS.map((c) => <th key={c.k} className="font-medium py-2 pr-5 text-right w-[100px]">{c.nome}</th>)}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {edicoes.map((e) => (
                <tr key={e.id} className="border-b border-linha last:border-0 hover:bg-black/[0.02]">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-md bg-cream overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {e.imagem && <img src={e.imagem} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-charcoal font-medium truncate max-w-[420px]">{e.titulo}</div>
                        {e.subtitulo && <div className="text-[12px] text-muted truncate max-w-[420px]">{e.subtitulo}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-charcoal/80 tabular-nums">{e.publicado_em ? dataBR(e.publicado_em) : '—'}</td>
                  {CAMPOS.map((c) => (
                    <td key={c.k} className="py-2.5 pr-5 text-right">
                      <CampoNumero valor={e[c.k]} sufixo={c.sufixo} onSalvar={(v) => salvarCampo(e.id, c.k, v)} />
                    </td>
                  ))}
                  <td className="py-2.5 pr-4">
                    <a href={e.link} target="_blank" rel="noreferrer" aria-label="Abrir no Substack" className="text-muted hover:text-charcoal"><ExternalLink size={13} /></a>
                  </td>
                </tr>
              ))}
              {!carregando && edicoes.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-muted">Nenhuma edição lida ainda. Confira a conexão do Substack em Conexões.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

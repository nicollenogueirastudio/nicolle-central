'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Ficha from '@/components/lancamentos/Ficha'
import Estrategia from '@/components/lancamentos/Estrategia'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { dataBR } from '@/lib/datas'
import { listarLancamentos, criarLancamento, STATUS_LANCAMENTO, type Lancamento } from '@/lib/lancamentos/dados'

type Vista = 'ficha' | 'estrategia'

export default function LancamentosPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [vista, setVista] = useState<Vista>('ficha')
  const [carregando, setCarregando] = useState(true)
  const [novo, setNovo] = useState<{ projeto: string; cliente: string; revelacao_em: string } | null>(null)
  const [criando, setCriando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    try {
      const lista = await listarLancamentos(supabase)
      setLancamentos(lista)
      setSelecionado((s) => s ?? lista.find((l) => l.status === 'em_andamento' || l.status === 'planejando')?.id ?? lista[0]?.id ?? null)
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  async function criar() {
    if (!novo?.projeto.trim()) return
    setCriando(true)
    try {
      const id = await criarLancamento(supabase, { projeto: novo.projeto.trim(), cliente: novo.cliente.trim() || null, revelacao_em: novo.revelacao_em || null })
      setNovo(null)
      setSelecionado(id)
      setVista('ficha')
      await carregar()
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCriando(false)
    }
  }

  const atual = lancamentos.find((l) => l.id === selecionado) ?? null
  const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-3 py-1.5 text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1500px]">
        <Header title="Lançamentos" subtitle="Cada projeto contado como um arco: do canteiro ao arquivo" />

        <div className="flex items-center gap-3 mb-6">
          <div className="flex p-[3px] rounded-[10px] bg-black/[0.06]">
            {([['ficha', 'Lançamentos'], ['estrategia', 'A estratégia']] as [Vista, string][]).map(([id, nome]) => (
              <button key={id} onClick={() => setVista(id)}
                className={`px-4 py-[5px] rounded-[7px] text-[13px] transition-all duration-200 ${vista === id ? 'bg-white text-charcoal font-medium shadow-controle' : 'text-charcoal/70 hover:text-charcoal'}`}>
                {nome}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setNovo({ projeto: '', cliente: '', revelacao_em: '' }); setVista('ficha') }}
            className="ml-auto flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black active:scale-[0.98] transition-all"
          >
            <Plus size={15} /> Novo lançamento
          </button>
        </div>

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        {vista === 'estrategia' ? <Estrategia /> : (
          <div className="grid grid-cols-[250px_1fr] gap-6 items-start">
            <aside className="space-y-2 sticky top-6">
              {novo && (
                <div className="bg-white rounded-2xl border border-accent/40 shadow-card p-4 space-y-2.5">
                  <div className="text-[13px] font-medium text-charcoal">Novo lançamento</div>
                  <input autoFocus className={campo} placeholder="Projeto (ex.: Casa H)" value={novo.projeto} onChange={(e) => setNovo({ ...novo, projeto: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') criar() }} />
                  <input className={campo} placeholder="Cliente" value={novo.cliente} onChange={(e) => setNovo({ ...novo, cliente: e.target.value })} />
                  <label className="block">
                    <span className="block text-[11.5px] text-muted mb-1">Revelação combinada em</span>
                    <input type="date" className={campo} value={novo.revelacao_em} onChange={(e) => setNovo({ ...novo, revelacao_em: e.target.value })} />
                  </label>
                  <p className="text-[11.5px] text-muted">Com a data da revelação, as datas dos 16 movimentos já vêm sugeridas.</p>
                  <div className="flex gap-2 pt-1">
                    <button onClick={criar} disabled={!novo.projeto.trim() || criando} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium text-white bg-charcoal hover:bg-black disabled:opacity-40">
                      {criando && <Loader2 size={12} className="animate-spin" />} Criar
                    </button>
                    <button onClick={() => setNovo(null)} className="px-3 py-1.5 rounded-full text-[12.5px] text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Cancelar</button>
                  </div>
                </div>
              )}

              {!carregando && lancamentos.length === 0 && !novo && (
                <div className="rounded-2xl border-[1.5px] border-dashed border-black/10 p-5 text-center">
                  <p className="text-[13px] text-charcoal font-medium">Nenhum lançamento ainda</p>
                  <p className="text-[12px] text-muted mt-1">Crie o primeiro arco: o projeto, a cliente e a data da revelação.</p>
                </div>
              )}

              {lancamentos.map((l) => {
                const feitos = l.movimentos.filter((m) => m.feito).length
                const ativo = l.id === selecionado
                return (
                  <button key={l.id} onClick={() => setSelecionado(l.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${ativo ? 'bg-white border-black/[0.12] shadow-card' : 'bg-white/50 border-linha hover:bg-white'}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[14px] font-medium text-charcoal truncate">{l.projeto}</span>
                      <span className="text-[11px] text-muted shrink-0">{STATUS_LANCAMENTO[l.status]}</span>
                    </div>
                    <div className="text-[12px] text-muted mt-0.5">{l.revelacao_em ? `Revelação ${dataBR(l.revelacao_em + 'T12:00:00Z')}` : 'Sem data de revelação'}</div>
                    <div className="mt-2.5 h-1 rounded-full bg-black/[0.06] overflow-hidden"><div className="h-full rounded-full bg-olive" style={{ width: `${(feitos / 16) * 100}%` }} /></div>
                    <div className="text-[11px] text-muted mt-1 tabular-nums">{feitos}/16 movimentos</div>
                  </button>
                )
              })}
            </aside>

            <div className="min-w-0">
              {atual
                ? <Ficha key={atual.id} supabase={supabase} l={atual} outros={lancamentos} onMudou={carregar} onApagou={() => { setSelecionado(null); carregar() }} />
                : !carregando && (
                  <div className="bg-white rounded-2xl border border-linha shadow-card p-14 text-center">
                    <p className="text-[15px] text-charcoal font-medium">Um projeto nunca estreia em um post só.</p>
                    <p className="text-[13px] text-muted mt-1 max-w-[480px] mx-auto">Cada lançamento vira uma ficha com os 16 movimentos do arco, as datas a partir da revelação e um botão para levar cada peça ao calendário.</p>
                    <button onClick={() => setVista('estrategia')} className="mt-4 px-4 py-[7px] rounded-full text-[13px] font-medium text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Ler a estratégia</button>
                  </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

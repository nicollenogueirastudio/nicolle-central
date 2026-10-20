'use client'

import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ListaTarefas from '@/components/tarefas/ListaTarefas'
import { useTarefas } from '@/components/tarefas/useTarefas'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { listarLancamentos, type Lancamento } from '@/lib/lancamentos/dados'
import { faixa } from '@/lib/tarefas/dados'

export default function TarefasPage() {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const { tarefas, erro, salvar, apagar, criar } = useTarefas(supabase)
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'avulsas' | string>('todas')
  const [verFeitas, setVerFeitas] = useState(false)

  useEffect(() => { listarLancamentos(supabase).then(setLancamentos).catch(() => {}) }, [supabase])

  const visiveis = tarefas.filter((t) => filtro === 'todas' || (filtro === 'avulsas' ? !t.lancamento_id : t.lancamento_id === filtro))
  const abertas = tarefas.filter((t) => !t.feita)
  const atrasadas = abertas.filter((t) => faixa(t) === 'atrasada').length
  const semana = abertas.filter((t) => ['hoje', 'semana'].includes(faixa(t))).length
  const comTarefas = lancamentos.filter((l) => tarefas.some((t) => t.lancamento_id === l.id))

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-64 px-10 py-8 max-w-[1100px]">
        <Header title="Tarefas" subtitle="O que precisa acontecer para o conteúdo sair: agendar, produzir, imprimir, combinar" />

        <section className="grid grid-cols-3 gap-4 mb-6">
          {[
            { rotulo: 'Abertas', valor: abertas.length, nota: 'no total' },
            { rotulo: 'Atrasadas', valor: atrasadas, nota: atrasadas ? 'passaram do prazo' : 'nada atrasado', alerta: atrasadas > 0 },
            { rotulo: 'Até 7 dias', valor: semana, nota: 'hoje e na próxima semana' },
          ].map((t) => (
            <div key={t.rotulo} className="bg-white rounded-2xl border border-linha shadow-card p-5">
              <div className="text-[12px] text-muted">{t.rotulo}</div>
              <div className={`font-display text-[30px] leading-tight tabular-nums mt-1 ${t.alerta ? 'text-[#8C6B3F]' : 'text-charcoal'}`}>{t.valor}</div>
              <div className="text-[12px] text-muted mt-0.5">{t.nota}</div>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[{ id: 'todas', nome: 'Todas' }, { id: 'avulsas', nome: 'Avulsas' }, ...comTarefas.map((l) => ({ id: l.id, nome: l.projeto }))].map((f) => (
            <button key={f.id} onClick={() => setFiltro(f.id)}
              className={`px-3 py-1 rounded-full text-[12.5px] border transition-all ${filtro === f.id ? 'border-charcoal bg-charcoal text-white' : 'border-black/[0.10] bg-white text-charcoal hover:border-black/25'}`}>
              {f.nome}
            </button>
          ))}
          <button onClick={() => setVerFeitas(!verFeitas)} className={`ml-auto px-3 py-1 rounded-full text-[12.5px] transition-colors ${verFeitas ? 'bg-black/[0.07] text-charcoal font-medium' : 'text-muted hover:text-charcoal hover:bg-black/[0.04]'}`}>
            {verFeitas ? 'Esconder feitas' : 'Mostrar feitas'}
          </button>
        </div>

        {erro && <div className="mb-4 rounded-xl bg-gold/15 px-4 py-3 text-[13px] text-charcoal">{erro}</div>}

        <div className="bg-white rounded-2xl border border-linha shadow-card overflow-hidden pb-2">
          <ListaTarefas
            tarefas={visiveis}
            mostrarLancamento
            mostrarFeitas={verFeitas}
            onSalvar={salvar}
            onApagar={apagar}
            onCriar={(titulo, prazo) => criar(titulo, prazo, { lancamento_id: filtro !== 'todas' && filtro !== 'avulsas' ? filtro : null })}
          />
        </div>
        <p className="text-[12px] text-muted mt-3">As tarefas de cada lançamento também aparecem dentro da ficha dele, e as atrasadas e dos próximos 7 dias ficam no Dashboard.</p>
      </main>
    </div>
  )
}

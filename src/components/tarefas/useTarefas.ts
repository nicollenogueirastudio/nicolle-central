'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { listarTarefas, criarTarefa, salvarTarefa, apagarTarefa, type Tarefa, type TarefaEditavel } from '@/lib/tarefas/dados'

/** Lista de tarefas com gravação imediata na tela (e desfaz se o banco recusar). */
export function useTarefas(supabase: SupabaseClient, filtro: { lancamentoId?: string; abertas?: boolean } = {}) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const { lancamentoId, abertas } = filtro

  const recarregar = useCallback(async () => {
    try { setTarefas(await listarTarefas(supabase, { lancamentoId, abertas })); setErro(null) } catch (e) { setErro((e as Error).message) }
  }, [supabase, lancamentoId, abertas])

  useEffect(() => { recarregar() }, [recarregar])

  async function salvar(t: Tarefa, d: TarefaEditavel) {
    setTarefas((l) => l.map((x) => (x.id === t.id ? { ...x, ...d } : x)))
    try { await salvarTarefa(supabase, t.id, d) } catch (e) { setErro((e as Error).message); recarregar() }
  }
  async function apagar(t: Tarefa) {
    if (!confirm(`Apagar a tarefa "${t.titulo}"?`)) return
    setTarefas((l) => l.filter((x) => x.id !== t.id))
    try { await apagarTarefa(supabase, t.id) } catch (e) { setErro((e as Error).message); recarregar() }
  }
  async function criar(titulo: string, prazo: string | null, extra: TarefaEditavel = {}) {
    try {
      const nova = await criarTarefa(supabase, { titulo, prazo, lancamento_id: lancamentoId ?? null, ...extra })
      setTarefas((l) => [...l, nova])
    } catch (e) { setErro((e as Error).message) }
  }

  return { tarefas, erro, salvar, apagar, criar, recarregar }
}

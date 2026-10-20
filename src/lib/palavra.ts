// Palavra do ano: uma por ano, escrita pela Nicolle (2026: Fundação).

import type { SupabaseClient } from '@supabase/supabase-js'
import { registrarAtividade } from '@/lib/atividades'

export type PalavraDoAno = { ano: number; palavra: string; significado: string | null }

export async function lerPalavra(supabase: SupabaseClient, ano: number): Promise<PalavraDoAno | null> {
  const { data } = await supabase.from('palavras_do_ano').select('ano, palavra, significado').eq('ano', ano).maybeSingle()
  return (data as PalavraDoAno | null) ?? null
}

export async function salvarPalavra(supabase: SupabaseClient, p: PalavraDoAno) {
  const { error } = await supabase.from('palavras_do_ano').upsert({ ...p, palavra: p.palavra.trim(), significado: p.significado?.trim() || null })
  if (error) throw error
  await registrarAtividade(supabase, 'editou', 'palavra_do_ano', String(p.ano), { palavra: p.palavra })
}

import type { SupabaseClient } from '@supabase/supabase-js'

// Histórico de atividades: toda ação importante (criar, editar, mudar status, arquivar)
// grava uma linha em `atividades`. Toda tela nova já nasce chamando esta função.

export type Acao = 'criou' | 'editou' | 'mudou_status' | 'arquivou' | 'restaurou' | 'entrou' | 'saiu'

export async function registrarAtividade(
  supabase: SupabaseClient,
  acao: Acao,
  entidade: string,
  entidadeId?: string | null,
  detalhe?: Record<string, unknown> | null
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('atividades').insert({
    usuario_id: user.id,
    acao,
    entidade,
    entidade_id: entidadeId ?? null,
    detalhe: detalhe ?? null,
  })
  if (error) console.error('Falha ao registrar atividade:', error.message)
}

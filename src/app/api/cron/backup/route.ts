import { NextResponse } from 'next/server'
import { criarClienteAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Backup do banco, lido pela tarefa diária do Windows (scripts/backup-windows.ps1), que salva no Google Drive.
// Sem ?tabela: a lista de tabelas com o total de linhas. Com ?tabela=x&de=0: até LOTE linhas da tabela.
// Fica de fora conexoes_tokens (tokens de acesso às redes: não devem ir para arquivo).
// Tabela nova no banco entra aqui também.

const TABELAS = [
  'atividades', 'conexoes', 'configuracoes', 'edicoes', 'estrategia_formatos', 'eventos',
  'lancamento_movimentos', 'lancamentos', 'magazine_manual', 'marca_manual', 'metas', 'metricas_conta', 'metricas_historicas',
  'newsletter_ideias', 'newsletter_leituras', 'newsletter_rascunhos', 'palavras_do_ano', 'perfis', 'planejamento_metas', 'posts', 'posts_metricas', 'posts_midia',
  'referencias', 'sincronizacao_estado', 'sonhos', 'stories_publicados', 'stories_roteiros', 'style_removidas',
  'substack_edicoes', 'substack_notes', 'tarefas',
]
const LOTE = 5000

export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET
  if (!segredo || request.headers.get('authorization') !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const supabase = criarClienteAdmin()
  const url = new URL(request.url)
  const tabela = url.searchParams.get('tabela')

  if (!tabela) {
    const totais: Record<string, number | null> = {}
    for (const t of TABELAS) {
      const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
      totais[t] = error ? null : count ?? 0
    }
    return NextResponse.json({ ok: true, gerado_em: new Date().toISOString(), lote: LOTE, tabelas: totais })
  }

  if (!TABELAS.includes(tabela)) return NextResponse.json({ ok: false, motivo: 'Tabela fora do backup' }, { status: 400 })
  const de = Math.max(0, Number(url.searchParams.get('de') ?? 0) || 0)

  // O PostgREST entrega no máximo 1000 linhas por vez: junta os pedaços até o tamanho do lote.
  const linhas: unknown[] = []
  for (let i = de; i < de + LOTE; i += 1000) {
    const { data, error } = await supabase.from(tabela).select('*').range(i, Math.min(i + 999, de + LOTE - 1))
    if (error) return NextResponse.json({ ok: false, motivo: error.message }, { status: 500 })
    linhas.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  return NextResponse.json({ ok: true, tabela, de, linhas })
}

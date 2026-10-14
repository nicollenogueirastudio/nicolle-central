import type { SupabaseClient } from '@supabase/supabase-js'
import { sincronizarInstagram } from './instagram'
import { sincronizarSubstack } from './substack'
import type { Conexao, Rede, ResultadoSincronizacao } from './tipos'

/** Sincroniza uma rede e grava o resultado (status, horário, erro) em `conexoes`. */
export async function sincronizarRede(supabase: SupabaseClient, rede: Rede): Promise<ResultadoSincronizacao> {
  const { data: conexao } = await supabase.from('conexoes').select('*').eq('rede', rede).single<Conexao>()
  if (!conexao) return { ok: false, motivo: 'Rede desconhecida' }

  let resultado: ResultadoSincronizacao
  try {
    if (rede === 'substack') resultado = await sincronizarSubstack(supabase, conexao.conta ?? 'casanogs.substack.com')
    else if (rede === 'instagram') resultado = await sincronizarInstagram(supabase)
    else resultado = { ok: false, motivo: 'Conexão ainda não disponível', semConfiguracao: true }
  } catch (e) {
    resultado = { ok: false, motivo: (e as Error).message }
  }

  // Sem configuração: não mexe no status.
  if (!resultado.ok && resultado.semConfiguracao) return resultado

  await supabase
    .from('conexoes')
    .update(resultado.ok
      ? { status: 'conectada', ultima_sincronizacao: new Date().toISOString(), ultimo_erro: null }
      : { status: 'erro', ultimo_erro: resultado.motivo })
    .eq('rede', rede)

  return resultado
}

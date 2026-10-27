// Leitura e gravação de posts no Supabase. Toda escrita registra no histórico de atividades.

import type { SupabaseClient } from '@supabase/supabase-js'
import { registrarAtividade } from '@/lib/atividades'
import type { Midia, Post, PostEditavel, Status } from './tipos'

const BUCKET = 'posts-midia'
const VALIDADE_LINK = 60 * 60 // 1 hora

/** Posts não arquivados entre dois instantes, + ideias sem data, com links das mídias. */
export async function listarPosts(
  supabase: SupabaseClient,
  { de, ate, arquivados = false }: { de: string; ate: string; arquivados?: boolean }
): Promise<Post[]> {
  let consulta = supabase
    .from('posts')
    .select('*, midias:posts_midia(*)')
    .order('data_hora', { ascending: true, nullsFirst: true })
    .order('ordem', { referencedTable: 'posts_midia', ascending: true })

  consulta = arquivados
    ? consulta.not('arquivado_em', 'is', null)
    : consulta.is('arquivado_em', null).or(`data_hora.is.null,and(data_hora.gte.${de},data_hora.lt.${ate})`)

  const { data, error } = await consulta
  if (error) throw error
  const posts = (data ?? []) as Post[]
  await assinarMidias(supabase, posts.flatMap((p) => p.midias))
  return posts
}

/** Posts não arquivados em certos status (a fila de aprovação), por data, com links das mídias. */
export async function listarPorStatus(supabase: SupabaseClient, status: Status[]): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, midias:posts_midia(*)')
    .is('arquivado_em', null)
    .in('status', status)
    .order('data_hora', { ascending: true, nullsFirst: false })
    .order('ordem', { referencedTable: 'posts_midia', ascending: true })
  if (error) throw error
  const posts = (data ?? []) as Post[]
  await assinarMidias(supabase, posts.flatMap((p) => p.midias))
  return posts
}

/** Preenche `url` de cada mídia com um link assinado temporário (bucket é privado). */
async function assinarMidias(supabase: SupabaseClient, midias: Midia[]) {
  if (midias.length === 0) return
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(midias.map((m) => m.caminho), VALIDADE_LINK)
  const porCaminho = new Map((data ?? []).map((d) => [d.path, d.signedUrl]))
  midias.forEach((m) => { m.url = porCaminho.get(m.caminho) ?? undefined })
}

export async function criarPost(supabase: SupabaseClient, dados: Partial<PostEditavel>): Promise<string> {
  const { data, error } = await supabase.from('posts').insert(dados).select('id').single()
  if (error) throw error
  await registrarAtividade(supabase, 'criou', 'post', data.id, { status: dados.status ?? 'ideia' })
  return data.id
}

export async function salvarPost(supabase: SupabaseClient, id: string, dados: Partial<PostEditavel>, antes?: Status) {
  const extra: Record<string, unknown> = {}
  if (dados.status === 'postado' && antes !== 'postado') extra.publicado_em = new Date().toISOString()
  if (dados.status && dados.status !== 'postado' && antes === 'postado') extra.publicado_em = null

  const { error } = await supabase.from('posts').update({ ...dados, ...extra }).eq('id', id)
  if (error) throw error

  if (dados.status && antes && dados.status !== antes) {
    await registrarAtividade(supabase, 'mudou_status', 'post', id, { de: antes, para: dados.status })
  } else {
    await registrarAtividade(supabase, 'editou', 'post', id)
  }
}

/** Arrastar no calendário: muda só a data_hora. */
export async function moverPost(supabase: SupabaseClient, id: string, dataHora: string) {
  const { error } = await supabase.from('posts').update({ data_hora: dataHora }).eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'editou', 'post', id, { moveu_para: dataHora })
}

/** Grade do feed: um post toma o lugar (a data) do outro. Se um deles era ideia sem data, o outro vira ideia. */
export async function trocarLugares(supabase: SupabaseClient, a: Pick<Post, 'id' | 'data_hora'>, b: Pick<Post, 'id' | 'data_hora'>) {
  const { error: e1 } = await supabase.from('posts').update({ data_hora: b.data_hora }).eq('id', a.id)
  if (e1) throw e1
  const { error: e2 } = await supabase.from('posts').update({ data_hora: a.data_hora }).eq('id', b.id)
  if (e2) throw e2
  await registrarAtividade(supabase, 'editou', 'post', a.id, { trocou_com: b.id })
}

export async function arquivarPost(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('posts').update({ arquivado_em: new Date().toISOString() }).eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'arquivou', 'post', id)
}

export async function restaurarPost(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('posts').update({ arquivado_em: null }).eq('id', id)
  if (error) throw error
  await registrarAtividade(supabase, 'restaurou', 'post', id)
}

export async function enviarMidias(supabase: SupabaseClient, postId: string, arquivos: File[], ordemInicial: number) {
  for (let i = 0; i < arquivos.length; i++) {
    const arquivo = arquivos[i]
    const ext = arquivo.name.split('.').pop()?.toLowerCase() || 'bin'
    const caminho = `${postId}/${crypto.randomUUID()}.${ext}`
    const { error: erroUpload } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, { contentType: arquivo.type })
    if (erroUpload) throw erroUpload
    const { error } = await supabase.from('posts_midia').insert({
      post_id: postId,
      ordem: ordemInicial + i,
      caminho,
      tipo: arquivo.type.startsWith('video') ? 'video' : 'imagem',
    })
    if (error) throw error
  }
  await registrarAtividade(supabase, 'editou', 'post', postId, { midias_adicionadas: arquivos.length })
}

/** Grava a nova ordem do carrossel (lista de ids na ordem desejada). */
export async function reordenarMidias(supabase: SupabaseClient, postId: string, ids: string[]) {
  for (let ordem = 0; ordem < ids.length; ordem++) {
    const id = ids[ordem]
    const { error } = await supabase.from('posts_midia').update({ ordem }).eq('id', id)
    if (error) throw error
  }
  await registrarAtividade(supabase, 'editou', 'post', postId, { midias_reordenadas: true })
}

export async function removerMidia(supabase: SupabaseClient, midia: Midia) {
  const { error } = await supabase.from('posts_midia').delete().eq('id', midia.id)
  if (error) throw error
  await supabase.storage.from(BUCKET).remove([midia.caminho])
  await registrarAtividade(supabase, 'editou', 'post', midia.post_id, { midia_removida: midia.caminho })
}

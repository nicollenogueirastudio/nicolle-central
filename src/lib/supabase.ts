import { createClient } from '@supabase/supabase-js'

// Estas variáveis serão configuradas no Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type Meta = {
  id: string
  texto: string
  pilar: 'autoridade' | 'visibilidade' | 'diversificacao' | 'estrutura'
  trimestre: string
  ano: number
  concluida: boolean
  categoria: string
  created_at?: string
  updated_at?: string
}

export type Post = {
  id: string
  rede: 'instagram' | 'youtube' | 'pinterest' | 'tiktok' | 'newsletter'
  tipo: 'imagem' | 'video' | 'carrossel' | 'texto'
  titulo: string
  legenda?: string
  data: string
  horario: string
  status: 'rascunho' | 'agendado' | 'publicado'
  pilar?: string
  created_at?: string
  updated_at?: string
}

export type Referencia = {
  id: string
  titulo: string
  url?: string
  categoria: 'produtos' | 'arquitetura' | 'podcasts' | 'livros' | 'filmes' | 'outros'
  notas?: string
  usada_em?: string[]
  created_at?: string
}

export type Edicao = {
  id: string
  titulo: string
  descricao: string
  conteudo?: string
  status: 'rascunho' | 'agendada' | 'publicada'
  data_publicacao?: string
  taxa_abertura?: number
  taxa_cliques?: number
  created_at?: string
  updated_at?: string
}

export type Configuracao = {
  id: string
  chave: string
  valor: string
  created_at?: string
  updated_at?: string
}

// Funções helper para o banco de dados

// METAS
export async function getMetas() {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .order('ano', { ascending: true })
    .order('trimestre', { ascending: true })
  
  if (error) throw error
  return data as Meta[]
}

export async function toggleMeta(id: string, concluida: boolean) {
  const { error } = await supabase
    .from('metas')
    .update({ concluida, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) throw error
}

export async function criarMeta(meta: Omit<Meta, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('metas')
    .insert(meta)
    .select()
    .single()
  
  if (error) throw error
  return data as Meta
}

// POSTS
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('data', { ascending: true })
  
  if (error) throw error
  return data as Post[]
}

export async function criarPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()
  
  if (error) throw error
  return data as Post
}

export async function atualizarPost(id: string, updates: Partial<Post>) {
  const { error } = await supabase
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) throw error
}

// REFERÊNCIAS
export async function getReferencias() {
  const { data, error } = await supabase
    .from('referencias')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Referencia[]
}

export async function criarReferencia(ref: Omit<Referencia, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('referencias')
    .insert(ref)
    .select()
    .single()
  
  if (error) throw error
  return data as Referencia
}

export async function deletarReferencia(id: string) {
  const { error } = await supabase
    .from('referencias')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// EDIÇÕES DA NEWSLETTER
export async function getEdicoes() {
  const { data, error } = await supabase
    .from('edicoes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Edicao[]
}

export async function criarEdicao(edicao: Omit<Edicao, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('edicoes')
    .insert(edicao)
    .select()
    .single()
  
  if (error) throw error
  return data as Edicao
}

export async function atualizarEdicao(id: string, updates: Partial<Edicao>) {
  const { error } = await supabase
    .from('edicoes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) throw error
}

// CONFIGURAÇÕES (chaves de API)
export async function getConfiguracao(chave: string) {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('valor')
    .eq('chave', chave)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data?.valor || null
}

export async function setConfiguracao(chave: string, valor: string) {
  const { error } = await supabase
    .from('configuracoes')
    .upsert({ chave, valor, updated_at: new Date().toISOString() })
  
  if (error) throw error
}

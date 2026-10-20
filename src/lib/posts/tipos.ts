// Vocabulário único dos posts: os mesmos nomes no banco, nas telas, nas metas e nas campanhas.

export const TIPOS = {
  feed: 'Feed',
  carrossel: 'Carrossel',
  reels: 'Reels',
  story: 'Story',
} as const
export type Tipo = keyof typeof TIPOS

// Pilares da Estratégia de Conteúdo 2026.
export const PILARES = {
  autoridade: 'Autoridade',
  conexao: 'Conexão',
  curadoria: 'Curadoria',
} as const
export type Pilar = keyof typeof PILARES

export const STATUS = {
  ideia: 'Ideia',
  rascunho: 'Em criação',
  aprovacao: 'Em aprovação',
  ajuste: 'Ajuste',
  agendado: 'Agendado',
  publicando: 'Publicando',
  postado: 'Postado',
  erro: 'Erro',
  verificar: 'Verificar',
} as const
export type Status = keyof typeof STATUS

// Status que a pessoa escolhe na mão. `publicando`, `erro` e `verificar` são da publicação automática (fase 4).
// Fluxo de produção (o mesmo da agência): pauta → criação → aprovação → ajuste → agendado → postado.
export const STATUS_MANUAIS: Status[] = ['ideia', 'rascunho', 'aprovacao', 'ajuste', 'agendado', 'postado']

export type Midia = {
  id: string
  post_id: string
  ordem: number
  caminho: string
  tipo: 'imagem' | 'video'
  url?: string // link assinado, preenchido na leitura
}

export type Post = {
  id: string
  tipo: Tipo
  pilar: Pilar | null
  titulo: string | null
  legenda: string | null
  hashtags: string | null
  primeiro_comentario: string | null
  data_hora: string | null
  status: Status
  ig_media_id: string | null
  permalink: string | null
  publicado_em: string | null
  arquivado_em: string | null
  quadro: string | null
  fase: 'conexao' | 'cultura' | 'troca' | 'presenca' | null
  territorio: 'materia' | 'silencio' | 'ritual' | 'curadoria' | 'refugio' | null
  briefing: string | null
  fonte: string | null
  nota_aprovacao: string | null
  responsavel: string | null
  origem: 'manual' | 'agencia' | 'instagram'
  criado_em: string
  atualizado_em: string
  midias: Midia[]
}

export type PostEditavel = Pick<Post,
  | 'tipo' | 'pilar' | 'titulo' | 'legenda' | 'hashtags' | 'primeiro_comentario' | 'data_hora' | 'status'
  | 'quadro' | 'fase' | 'territorio' | 'briefing' | 'fonte' | 'nota_aprovacao' | 'responsavel'>

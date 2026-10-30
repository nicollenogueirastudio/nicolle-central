// Tipos e textos da área de Tráfego pago (sem nada de servidor: serve às telas e às rotas).

export type Objetivo = 'alcance' | 'engajamento' | 'trafego'
export type StatusAnuncio = 'rascunho' | 'aprovacao' | 'ajuste' | 'aprovado' | 'publicado' | 'erro' | 'arquivado'

export type Publico = {
  idade_min?: number
  idade_max?: number
  generos?: number[]                       // 1 = homens, 2 = mulheres; vazio = todos
  paises?: string[]
  cidades?: { id: string; nome: string }[]
  raio?: number
  interesses?: { id: string; nome: string }[]
}

export type Anuncio = {
  id: string
  nome: string
  objetivo: Objetivo
  post_id: string | null
  ig_media_id: string | null
  texto: string | null
  link: string | null
  chamada: string | null
  publico: Publico
  orcamento_diario: number
  inicio: string | null
  fim: string | null
  status: StatusAnuncio
  nota_aprovacao: string | null
  meta_campanha_id: string | null
  meta_conjunto_id: string | null
  meta_anuncio_id: string | null
  erro: string | null
  criado_em: string
  atualizado_em: string
}

export type Config = {
  conta_anuncios_id: string | null
  pagina_id: string | null
  instagram_id: string | null
  pixel_id: string | null
  teto_diario: number | null
  teto_mensal: number | null
}

export const OBJETIVOS: Record<Objetivo, { nome: string; explica: string; resultado: string; acao: string }> = {
  alcance: { nome: 'Alcance', explica: 'Mostrar o post para o maior número de pessoas do público.', resultado: 'pessoas alcançadas', acao: 'reach' },
  engajamento: { nome: 'Engajamento', explica: 'Gerar curtidas, comentários, salvamentos e compartilhamentos no post.', resultado: 'interações', acao: 'post_engagement' },
  trafego: { nome: 'Tráfego', explica: 'Levar pessoas para um link: site, portfólio, newsletter.', resultado: 'cliques no link', acao: 'link_click' },
}

export const STATUS_ANUNCIO: Record<StatusAnuncio, string> = {
  rascunho: 'Rascunho',
  aprovacao: 'Em aprovação',
  ajuste: 'Em ajuste',
  aprovado: 'Aprovado',
  publicado: 'Na Meta',
  erro: 'Erro ao publicar',
  arquivado: 'Arquivado',
}

// Status de entrega como a Meta devolve.
export const STATUS_META: Record<string, string> = {
  ACTIVE: 'Veiculando',
  PAUSED: 'Pausado',
  CAMPAIGN_PAUSED: 'Campanha pausada',
  ADSET_PAUSED: 'Conjunto pausado',
  IN_PROCESS: 'Processando',
  WITH_ISSUES: 'Com problema',
  PENDING_REVIEW: 'Em análise na Meta',
  DISAPPROVED: 'Reprovado pela Meta',
  COMPLETED: 'Concluído',
  ARCHIVED: 'Arquivado',
  DELETED: 'Apagado',
}

export const CHAMADAS: Record<string, string> = {
  LEARN_MORE: 'Saiba mais',
  CONTACT_US: 'Fale conosco',
  SUBSCRIBE: 'Assinar',
  SIGN_UP: 'Cadastre-se',
  SEND_MESSAGE: 'Enviar mensagem',
  BOOK_TRAVEL: 'Reservar',
}

export const reais = (n: number | null | undefined) =>
  n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

/** Gasto máximo de um anúncio: diário × dias (sem data de fim, considera 30 dias). */
export function gastoMaximo(a: Pick<Anuncio, 'orcamento_diario' | 'inicio' | 'fim'>) {
  if (!a.inicio || !a.fim) return { valor: a.orcamento_diario * 30, dias: 30, aberto: true }
  const dias = Math.max(1, Math.round((Date.parse(a.fim) - Date.parse(a.inicio)) / 86400000) + 1)
  return { valor: a.orcamento_diario * dias, dias, aberto: false }
}

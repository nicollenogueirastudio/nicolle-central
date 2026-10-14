// Regras de negócio dos posts. Arquivo puro: sem banco, sem tela.
// A tela, o cron de publicação e as actions usam as mesmas regras.

import type { Midia, PostEditavel, Status } from './tipos'

const LIMITE_LEGENDA = 2200
const LIMITE_HASHTAGS = 30
const LIMITE_CARROSSEL = 20

export function contarHashtags(texto: string | null | undefined): number {
  return (texto?.match(/#[\p{L}\p{N}_]+/gu) ?? []).length
}

/** O que falta para o post poder ser agendado. Lista vazia = pode agendar. */
export function oQueFaltaParaAgendar(post: PostEditavel, midias: Pick<Midia, 'tipo'>[]): string[] {
  const falta: string[] = []

  if (midias.length === 0) falta.push('mídia (foto ou vídeo)')
  if (post.tipo !== 'story' && !post.legenda?.trim()) falta.push('legenda')
  if (!post.data_hora) falta.push('data e hora')
  if (!post.pilar) falta.push('pilar')

  if (post.tipo === 'carrossel' && midias.length > 0 && midias.length < 2) falta.push('pelo menos 2 mídias no carrossel')
  if (post.tipo === 'carrossel' && midias.length > LIMITE_CARROSSEL) falta.push(`no máximo ${LIMITE_CARROSSEL} mídias no carrossel`)
  if (post.tipo === 'reels' && midias.length > 0 && midias[0].tipo !== 'video') falta.push('um vídeo (reels)')
  if ((post.tipo === 'feed' || post.tipo === 'story') && midias.length > 1) falta.push('só 1 mídia (para várias, use carrossel)')

  const tamanho = (post.legenda?.length ?? 0) + (post.hashtags ? post.hashtags.length + 2 : 0)
  if (tamanho > LIMITE_LEGENDA) falta.push(`legenda + hashtags com até ${LIMITE_LEGENDA} caracteres`)
  if (contarHashtags(post.hashtags) + contarHashtags(post.legenda) > LIMITE_HASHTAGS) falta.push(`no máximo ${LIMITE_HASHTAGS} hashtags`)

  return falta
}

/** Status que o post pode receber agora, a partir de onde está. */
export function podeMudarPara(destino: Status, post: PostEditavel, midias: Pick<Midia, 'tipo'>[]): { ok: boolean; motivo?: string } {
  if (destino === 'agendado') {
    const falta = oQueFaltaParaAgendar(post, midias)
    if (falta.length) return { ok: false, motivo: `Falta: ${falta.join(', ')}.` }
  }
  if (destino === 'postado' && midias.length === 0) return { ok: false, motivo: 'Falta: mídia (foto ou vídeo).' }
  return { ok: true }
}

/** Legenda final como vai para o Instagram: texto + hashtags no fim. */
export function legendaFinal(post: Pick<PostEditavel, 'legenda' | 'hashtags'>): string {
  return [post.legenda?.trim(), post.hashtags?.trim()].filter(Boolean).join('\n\n')
}

/** Tipos que aparecem na grade do perfil (stories não). */
export function apareceNaGrade(tipo: PostEditavel['tipo']): boolean {
  return tipo !== 'story'
}

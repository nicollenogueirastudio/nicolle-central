// Calendário de feiras e prêmios (tabela eventos). O aviso de "está próximo" sai daqui
// e aparece na página Calendário e no Dashboard.

export type TipoEvento = 'feira' | 'premio'
export type Evento = {
  id: string
  tipo: TipoEvento
  nome: string
  descricao: string | null
  local: string | null
  abrangencia: 'nacional' | 'internacional'
  inicio: string | null
  fim: string | null
  inscricao_ate: string | null
  confirmado: boolean
  site: string | null
  notas: string | null
  vou: boolean
  origem: 'sugerido' | 'manual'
}

/** Quantos dias antes começa o aviso. */
export const AVISO_DIAS = { feira: 45, inscricao: 30, anuncio: 14 }

const dias = (de: string, ate: string) => Math.round((Date.parse(ate) - Date.parse(de)) / 86400000)

export type Marco = { data: string; rotulo: string; dias: number; acontecendo?: boolean }

/** O próximo marco do evento a partir de hoje: inscrição, abertura, anúncio ou "acontecendo agora". */
export function proximoMarco(e: Evento, hoje: string): Marco | null {
  if (e.tipo === 'feira' && e.inicio && e.inicio <= hoje && (e.fim ?? e.inicio) >= hoje) return { data: e.inicio, rotulo: 'acontecendo agora', dias: 0, acontecendo: true }
  const marcos: Marco[] = []
  if (e.inscricao_ate && e.inscricao_ate >= hoje) marcos.push({ data: e.inscricao_ate, rotulo: 'inscrições até', dias: dias(hoje, e.inscricao_ate) })
  if (e.inicio && e.inicio >= hoje) marcos.push({ data: e.inicio, rotulo: e.tipo === 'feira' ? 'começa' : 'resultado', dias: dias(hoje, e.inicio) })
  return marcos.sort((a, b) => a.dias - b.dias)[0] ?? null
}

/** Está perto o bastante para avisar? */
export function estaProximo(e: Evento, hoje: string): Marco | null {
  const m = proximoMarco(e, hoje)
  if (!m) return null
  if (m.acontecendo) return m
  const limite = m.rotulo === 'inscrições até' ? AVISO_DIAS.inscricao : m.rotulo === 'começa' ? AVISO_DIAS.feira : AVISO_DIAS.anuncio
  return m.dias <= limite ? m : null
}

/** A data que ordena a lista (a mais cedo entre inscrição e início ainda por vir; senão o início). */
export function dataDeOrdem(e: Evento, hoje: string): string {
  return proximoMarco(e, hoje)?.data ?? e.fim ?? e.inicio ?? e.inscricao_ate ?? '9999-12-31'
}

export const emQuantosDias = (n: number) => (n === 0 ? 'hoje' : n === 1 ? 'amanhã' : `em ${n} dias`)

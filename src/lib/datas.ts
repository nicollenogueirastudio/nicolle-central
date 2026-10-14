// Arquivo único de datas. Vercel e Supabase rodam em UTC:
// toda data mostrada na tela passa por aqui, sempre no fuso de Brasília.

const FUSO = 'America/Sao_Paulo'

type Entrada = Date | string | number

function paraData(valor: Entrada): Date {
  return valor instanceof Date ? valor : new Date(valor)
}

/** 14/10/2026 */
export function dataBR(valor: Entrada): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, day: '2-digit', month: '2-digit', year: 'numeric' }).format(paraData(valor))
}

/** 14/10/2026 16:05 */
export function dataHoraBR(valor: Entrada): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(paraData(valor))
}

/** quarta-feira, 14 de outubro de 2026 */
export function dataExtensoBR(valor: Entrada): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(paraData(valor))
}

/** Data de hoje em Brasília no formato do banco (coluna `date`): 2026-10-14 */
export function hojeISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO }).format(new Date())
}

/** Partes de um instante no fuso de Brasília: { data: '2026-10-14', hora: '18:30' } */
export function partesBR(valor: Entrada): { data: string; hora: string } {
  const d = paraData(valor)
  const data = new Intl.DateTimeFormat('en-CA', { timeZone: FUSO }).format(d)
  const hora = new Intl.DateTimeFormat('en-GB', { timeZone: FUSO, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d)
  return { data, hora }
}

/** Data + hora digitadas (horário de Brasília) → instante ISO para o banco (timestamptz).
 *  Brasília não tem horário de verão desde 2019: offset fixo -03:00. */
export function instanteDeBR(data: string, hora: string): string {
  return new Date(`${data}T${hora}:00-03:00`).toISOString()
}

/** Soma dias a uma data de calendário 'YYYY-MM-DD' (sem fuso envolvido). */
export function somarDias(dataISO: string, dias: number): string {
  const [a, m, d] = dataISO.split('-').map(Number)
  const x = new Date(Date.UTC(a, m - 1, d + dias))
  return x.toISOString().slice(0, 10)
}

/** Dia da semana de uma data 'YYYY-MM-DD': 0 = domingo … 6 = sábado. */
export function diaDaSemana(dataISO: string): number {
  const [a, m, d] = dataISO.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay()
}

/** Segunda-feira da semana de uma data 'YYYY-MM-DD'. */
export function inicioDaSemana(dataISO: string): string {
  const dia = diaDaSemana(dataISO)
  return somarDias(dataISO, dia === 0 ? -6 : 1 - dia)
}

/** 'outubro de 2026' a partir de '2026-10' */
export function mesExtenso(mes: string): string {
  const [a, m] = mes.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(Date.UTC(a, m - 1, 1)))
}

/** '14 out' a partir de '2026-10-14' */
export function diaCurto(dataISO: string): string {
  const [a, m, d] = dataISO.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(new Date(Date.UTC(a, m - 1, d))).replace('.', '')
}

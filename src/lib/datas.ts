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

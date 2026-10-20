// Períodos de análise: mês, trimestre, semestre e ano. Sempre no fuso de Brasília.

import { instanteDeBR, mesExtenso } from '@/lib/datas'

export type Escala = 'mes' | 'trimestre' | 'semestre' | 'ano'
export type Periodo = { escala: Escala; inicio: string } // inicio = 'AAAA-MM' do primeiro mês

export const ESCALAS: { id: Escala; nome: string; meses: number }[] = [
  { id: 'mes', nome: 'Mês', meses: 1 },
  { id: 'trimestre', nome: 'Trimestre', meses: 3 },
  { id: 'semestre', nome: 'Semestre', meses: 6 },
  { id: 'ano', nome: 'Ano', meses: 12 },
]

const meses = (e: Escala) => ESCALAS.find((x) => x.id === e)!.meses

export function somarMes(mes: string, d: number): string {
  const [a, m] = mes.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1 + d, 1)).toISOString().slice(0, 7)
}

/** O período da escala que contém o mês dado (ex.: out/2026 → 4º trimestre). */
export function periodoDe(escala: Escala, mes: string): Periodo {
  const [a, m] = mes.split('-').map(Number)
  const n = meses(escala)
  const primeiro = Math.floor((m - 1) / n) * n + 1
  return { escala, inicio: `${a}-${String(primeiro).padStart(2, '0')}` }
}

export const moverPeriodo = (p: Periodo, d: -1 | 1): Periodo => ({ escala: p.escala, inicio: somarMes(p.inicio, d * meses(p.escala)) })

export const mesesDoPeriodo = (p: Periodo) => Array.from({ length: meses(p.escala) }, (_, i) => somarMes(p.inicio, i))

/** Instantes (UTC) de início e fim, e os dias 'AAAA-MM-DD' para filtrar retratos diários. */
export function intervalo(p: Periodo) {
  const fim = somarMes(p.inicio, meses(p.escala))
  return { de: instanteDeBR(`${p.inicio}-01`, '00:00'), ate: instanteDeBR(`${fim}-01`, '00:00'), diaDe: `${p.inicio}-01`, diaAte: `${fim}-01` }
}

export function rotulo(p: Periodo): string {
  const [a, m] = p.inicio.split('-').map(Number)
  if (p.escala === 'mes') return mesExtenso(p.inicio)
  if (p.escala === 'trimestre') return `${Math.floor((m - 1) / 3) + 1}º trimestre de ${a}`
  if (p.escala === 'semestre') return `${m <= 6 ? '1º' : '2º'} semestre de ${a}`
  return String(a)
}

export const nomeAnterior: Record<Escala, string> = { mes: 'mês anterior', trimestre: 'trimestre anterior', semestre: 'semestre anterior', ano: 'ano anterior' }

/** O período já terminou? (para não deixar avançar para o futuro) */
export const ehAtualOuFuturo = (p: Periodo, hojeMes: string) => somarMes(p.inicio, meses(p.escala)) > hojeMes

import { lerVoz } from '@/lib/posts/estrategia'

// Estrutura fixa da Casa Nogs (memória editorial): abertura que flui sem título,
// No meu radar, Consumindo, Para levar para casa. Assina NN. 600 a 900 palavras.

export type Item = { id: string; titulo: string; texto: string; imagem: string | null; credito: string; link: string }
export type StatusRascunho = 'rascunho' | 'revisao' | 'pronta' | 'publicada'
export type Rascunho = {
  id: string
  ideia_id: string | null
  titulo: string
  subtitulo: string | null
  abertura: string | null
  radar: Item[]
  consumindo: Item[]
  levar: string | null
  fontes: string | null
  checklist: Record<string, boolean>
  status: StatusRascunho
  data_prevista: string | null
  link_substack: string | null
  criado_em: string
  atualizado_em: string
}
export type Leitura = { id: string; newsletter: string; titulo: string; link: string | null; publicado_em: string | null; nota: string | null }

export const BUCKET_NEWSLETTER = 'newsletter-imagens'
export const PALAVRAS = { minimo: 600, maximo: 900 }

export const STATUS_RASCUNHO: { id: StatusRascunho; nome: string }[] = [
  { id: 'rascunho', nome: 'Rascunho' },
  { id: 'revisao', nome: 'Em revisão' },
  { id: 'pronta', nome: 'Pronta' },
  { id: 'publicada', nome: 'Publicada' },
]

export const SECOES = {
  abertura: 'Abre pelo tema amplo e entra no caso concreto: cena, expectativa, virada. Termina com a ponte para o Radar.',
  radar: 'Referências com imagem e texto. De 3 a 5, nunca o óbvio. Material, editorial, designer emergente.',
  consumindo: 'O que estou vendo, lendo, descobrindo.',
  levar: 'Como o leitor leva isso para a casa dele. É do leitor, não meu.',
}

// O fechamento tem três elementos obrigatórios.
export const CHECKLIST_FECHAMENTO = [
  { id: 'olhar', texto: 'Menos copiar, mais ajustar o olhar' },
  { id: 'identidade', texto: 'Conecta à identidade do leitor e ao espaço dele' },
  { id: 'viver', texto: 'Mostra como a escolha molda a forma de viver' },
]
export const CHECKLIST_GERAL = [
  { id: 'imagens', texto: 'Imagens reais conferidas uma a uma (sem render 3D, sem cartaz de campanha)' },
  { id: 'creditos', texto: 'Créditos de todas as imagens' },
  { id: 'filtro', texto: 'Cria conexão, fortalece cultura, gera troca ou manifesta presença' },
]

// Edições que calibram a voz e as quatro leituras-âncora.
export const CALIBRAR = [
  { nome: 'Rio Open além do jogo', motivo: 'referência de voz' },
  { nome: 'Sua casa diz quem você é?', motivo: 'referência de estrutura' },
  { nome: 'Milão 2026', motivo: 'referência de fechamento' },
]

export const novoItem = (): Item => ({ id: crypto.randomUUID(), titulo: '', texto: '', imagem: null, credito: '', link: '' })

export function textoCorrido(r: Pick<Rascunho, 'abertura' | 'radar' | 'consumindo' | 'levar'>) {
  const itens = (l: Item[]) => l.map((i) => `${i.titulo}\n${i.texto}`).join('\n\n')
  return [r.abertura ?? '', itens(r.radar), itens(r.consumindo), r.levar ?? ''].join('\n\n')
}

export const contarPalavras = (t: string) => (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length

/** Leitura da edição pela voz Casa Nogs: as regras da marca e as correções de set/2026. */
export function lerVozEdicao(r: Pick<Rascunho, 'abertura' | 'radar' | 'consumindo' | 'levar'>) {
  const texto = textoCorrido(r)
  const base = lerVoz(texto)
  const travessoes = (texto.match(/[—–]/g) ?? []).length
  // Parágrafos de uma linha só, empilhados: o "pausado" que ela pediu para evitar.
  const paragrafos = (r.abertura ?? '').split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean)
  let empilhados = 0
  let seguidos = 0
  for (const p of paragrafos) {
    const curto = contarPalavras(p) <= 12
    seguidos = curto ? seguidos + 1 : 0
    if (seguidos === 3) empilhados++
  }
  return { ...base, travessoes, empilhados }
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const paragrafosHTML = (t: string | null) =>
  (t ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')

function itensHTML(l: Item[]) {
  return l.filter((i) => i.titulo || i.texto || i.imagem).map((i) => [
    i.imagem ? `<img src="${esc(i.imagem)}" alt="${esc(i.titulo)}">` : '',
    i.credito ? `<p><em>${esc(i.credito)}</em></p>` : '',
    i.titulo ? `<h3>${i.link ? `<a href="${esc(i.link)}">${esc(i.titulo)}</a>` : esc(i.titulo)}</h3>` : '',
    paragrafosHTML(i.texto),
  ].join('')).join('')
}

/** HTML para colar no editor do Substack. Fontes de pesquisa ficam de fora: são uso interno. */
export function montarHTML(r: Rascunho) {
  const divisor = '<p style="text-align:center">* * *</p>'
  return [
    paragrafosHTML(r.abertura),
    r.radar.length ? `${divisor}<h2>No meu radar</h2>${itensHTML(r.radar)}` : '',
    r.consumindo.length ? `${divisor}<h2>Consumindo</h2><p><em>O que estou vendo, lendo, descobrindo.</em></p>${itensHTML(r.consumindo)}` : '',
    r.levar ? `${divisor}<h2>Para levar para casa</h2>${paragrafosHTML(r.levar)}<p>NN</p>` : '',
  ].join('')
}

/** A mesma edição em texto puro, para quem cola onde HTML não entra. */
export function montarTexto(r: Rascunho) {
  const itens = (l: Item[]) => l.map((i) => [i.titulo, i.texto, i.credito].filter(Boolean).join('\n')).join('\n\n')
  return [
    r.abertura ?? '',
    r.radar.length ? `* * *\n\nNo meu radar\n\n${itens(r.radar)}` : '',
    r.consumindo.length ? `* * *\n\nConsumindo\nO que estou vendo, lendo, descobrindo.\n\n${itens(r.consumindo)}` : '',
    r.levar ? `* * *\n\nPara levar para casa\n\n${r.levar}\n\nNN` : '',
  ].filter(Boolean).join('\n\n')
}

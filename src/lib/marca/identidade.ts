// Identidade visual · transcrição do Brand Book (MANUAL_NICOLLE_NOGUEIRA, dez/2025).
// Só é lida por server components: o conteúdo não vai para os arquivos públicos do site.


export type Cor = { nome: string; hex: string; cmyk: string; pantone: string; claro?: boolean }

export const PALETA: { grupo: string; descricao: string; cores: Cor[] }[] = [
  {
    grupo: 'Paleta primária',
    descricao: 'Parte do Borgonha, em dois tons: um profundo e outro vibrante. Conduz à sensação de refinamento e presença.',
    cores: [
      { nome: 'Borgonha profundo', hex: '#350000', cmyk: 'C40 M100 Y85 K75', pantone: '4975 C' },
      { nome: 'Terracota', hex: '#683627', cmyk: 'M80 Y70 K60', pantone: '168 C' },
    ],
  },
  {
    grupo: 'Paleta de apoio',
    descricao: 'Tons frios de azuis e verdes trazem frescor e versatilidade, equilibrando a energia quente.',
    cores: [
      { nome: 'Azul noite', hex: '#002545', cmyk: 'C80 M55 K80', pantone: '655 C' },
      { nome: 'Azul ardósia', hex: '#606F81', cmyk: 'C75 M55 Y40', pantone: '5415 C' },
      { nome: 'Verde musgo', hex: '#516446', cmyk: 'C85 M60 Y90', pantone: '5615 C' },
      { nome: 'Oliva', hex: '#8E8D67', cmyk: 'C55 M40 Y75', pantone: '451 C' },
    ],
  },
  {
    grupo: 'Paleta de base',
    descricao: 'Neutros que vão do off-white ao preto e estruturam a comunicação com sofisticação.',
    cores: [
      { nome: 'Linho', hex: '#DBD7C7', cmyk: 'Y15 K20', pantone: '7527 C', claro: true },
      { nome: 'Taupe', hex: '#9F9681', cmyk: 'M10 Y27 K45', pantone: 'Warm Gray 7 C', claro: true },
      { nome: 'Grafite quente', hex: '#4E4639', cmyk: 'M15 Y30 K85', pantone: '2334 C' },
      { nome: 'Preto', hex: '#000000', cmyk: 'M50 Y50 K100', pantone: 'Black 6 C' },
    ],
  },
]

// Combinações aprovadas no manual (2, 3 e 4 cores).
export const COMBINACOES: string[][] = [
  ['#9F9681', '#350000'], ['#4E4639', '#350000'], ['#9F9681', '#000000'], ['#4E4639', '#000000'],
  ['#350000', '#000000', '#4E4639'], ['#350000', '#4E4639', '#9F9681'], ['#350000', '#000000', '#683627'], ['#350000', '#9F9681', '#683627'],
  ['#350000', '#606F81', '#4E4639', '#000000'], ['#683627', '#350000', '#002545', '#606F81'], ['#9F9681', '#350000', '#516446', '#8E8D67'], ['#350000', '#683627', '#4E4639', '#8E8D67'],
]

export const LOGOS = [
  { n: 1, nome: 'Nicolle Nogueira', uso: 'Assinatura horizontal' },
  { n: 2, nome: 'Símbolo NN', uso: 'Redução máxima, avatares, selos' },
  { n: 3, nome: 'Nicolle Nogueira', uso: 'Assinatura em duas linhas' },
  { n: 4, nome: 'Símbolo + Nicolle Nogueira', uso: 'Assinatura completa' },
  { n: 5, nome: 'Nicolle Nogueira Studio', uso: 'Studio, horizontal' },
  { n: 6, nome: 'Casa Nogs', uso: 'Newsletter e produtos' },
  { n: 7, nome: 'Nicolle Nogueira Studio', uso: 'Studio, em três linhas' },
  { n: 8, nome: 'Símbolo + Studio', uso: 'Studio, assinatura completa' },
]

// Menor tamanho de impressão de cada versão.
export const REDUCAO = [
  { logo: 1, minimo: '4 cm' },
  { logo: 2, minimo: '0,8 cm' },
  { logo: 3, minimo: '2,3 cm' },
  { logo: 4, minimo: '3,7 cm' },
  { logo: 5, minimo: '5,3 cm' },
  { logo: 6, minimo: '2,7 cm' },
  { logo: 7, minimo: '2,3 cm' },
  { logo: 8, minimo: '3,7 cm' },
]

export const TIPOGRAFIAS = [
  {
    nome: 'Inter',
    papel: 'Tipografia principal',
    uso: 'Uso geral em títulos, textos e documentos.',
    pesos: 'Thin · Light · Extra Light · Regular · Medium · Semibold · Bold · Extra Bold · Black',
    familia: 'inter',
  },
  {
    nome: 'JetBrains Mono',
    papel: 'Tipografia de apoio',
    uso: 'Uso pontual em títulos, textos e documentos. É a voz dos títulos da marca.',
    pesos: 'Light · Extra Light · Regular · Medium · Bold · Black',
    familia: 'jetbrains',
  },
]

// "Olá, sou uma marca…": a régua de personalidade do Brand Book (0 = esquerda, 2 = direita).
export const REGUA: { pergunta: string; esquerda: string; direita: string; ponto: 0 | 1 | 2 }[] = [
  { pergunta: 'sou uma marca', esquerda: 'Divertida', direita: 'Séria', ponto: 2 },
  { pergunta: 'que idade eu teria', esquerda: '−40', direita: '+40', ponto: 1 },
  { pergunta: 'me expresso de maneira', esquerda: 'Lúdica', direita: 'Objetiva', ponto: 2 },
  { pergunta: 'me acho', esquerda: 'Descolada', direita: 'Formal', ponto: 1 },
  { pergunta: 'me visto de maneira', esquerda: 'Casual', direita: 'Elegante', ponto: 2 },
  { pergunta: 'sou minimalista?', esquerda: 'Menos', direita: 'Mais', ponto: 0 },
  { pergunta: 'tenho um estilo', esquerda: 'Moderno', direita: 'Clássico', ponto: 0 },
  { pergunta: 'quero parecer', esquerda: 'Delicada', direita: 'Forte', ponto: 2 },
  { pergunta: 'minha linguagem é', esquerda: 'Popular', direita: 'Sofisticada', ponto: 2 },
  { pergunta: 'me apresento de maneira', esquerda: 'Neutra', direita: 'Disruptiva', ponto: 1 },
  { pergunta: 'meu trabalho é', esquerda: 'Popular', direita: 'Exclusivo', ponto: 2 },
  { pergunta: 'gosto de cores', esquerda: 'Frias', direita: 'Quentes', ponto: 1 },
]

export const CONCEITO = [
  'A marca Nicolle Nogueira Studio nasce de uma visão clara: transformar o cotidiano em experiência estética e de bem-estar. Em um mundo marcado pelo excesso e pelo ruído, Nicolle cria universos contemporâneos, elegantes e silenciosamente transformadores, onde arquitetura, objetos e rituais se encontram para construir um estilo de vida mais consciente e sensorial.',
  'A tipografia, minimalista e precisa, carrega personalidade nos detalhes: curvas discretas, proporções equilibradas e uma elegância sutil que reflete o olhar apurado da arquiteta. É uma assinatura que comunica contemporaneidade sem esforço.',
  'A marca convive com sua extensão natural, a Casa Nogs, dedicada a produtos de design. Juntas, criam um ecossistema completo que une espaço, objeto e experiência.',
]

export const MANIFESTO_IV = 'Nicolle Nogueira Studio é a expressão de um novo luxo: silencioso, sensorial e profundamente humano. Um espaço onde a vida cotidiana se transforma em experiência.'

// Páginas do Brand Book usadas como imagem (numeração do PDF).
export const PAGINAS_IV = 51
export const MOCKUPS = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
export const TEXTURAS = [
  { arquivo: 'p01', nome: 'Escala 1 · escura' },
  { arquivo: 'p02', nome: 'Escala 1 · clara' },
  { arquivo: 'p03', nome: 'Escala 2 · escura' },
  { arquivo: 'p04', nome: 'Escala 2 · clara' },
]

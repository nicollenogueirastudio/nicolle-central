// Os formatos de post da Estratégia de Redes Sociais (Brutte, nov/2025), lidos pelo manual da marca de hoje.
// Cada formato tem um post real do feed como exemplo (tabela estrategia_formatos, ela pode trocar).

import type { Categoria, Pilar, Tipo } from './tipos'

export type Formato = {
  id: string
  grupo: string        // o número e o nome do formato na apresentação da Brutte
  nome: string
  tipo: Tipo
  pilar: Pilar
  categoria: Categoria | null
  paraQueServe: string // a função na estratégia
  comoFazer: string[]  // o que a Brutte orientou
  filtro: string       // como o manual da marca lê o formato hoje
}

export const FORMATOS: Formato[] = [
  {
    id: 'mix', grupo: '01 · Carrossel mix', nome: 'Mix de fotos e vídeos', tipo: 'carrossel', pilar: 'conexao', categoria: 'editorial',
    paraQueServe: 'Mostrar o seu olhar em movimento: o dia, os lugares, os detalhes. Aproxima quem segue de quem você é, sem expor demais. É a porta de entrada da comunidade.',
    comoFazer: ['Mix de fotos no estilo da fotógrafa', 'Takes de detalhes, making of e ambientes', 'Pensar a profundidade da legenda no tema de lifestyle'],
    filtro: 'Conexão com discrição: o gesto e o lugar, não a vida inteira. Cabe no território "ritual" ou "refúgio".',
  },
  {
    id: 'capa', grupo: '02 · Inspiração', nome: 'Capa + lettering', tipo: 'carrossel', pilar: 'curadoria', categoria: 'curadoria',
    paraQueServe: 'Ler uma referência (revista, obra, lugar) com o seu ponto de vista. Educa o olhar sem ser didática e é o formato que mais circula: é salvo e compartilhado para fora da bolha.',
    comoFazer: ['Partir de uma matéria ou fonte real', 'Capa com lettering e desdobramento do texto nas telas', 'Sempre dar a fonte do conteúdo'],
    filtro: 'Leitura crítica, nunca "dicas" ou "tendência": a referência entra pelo porquê, não pela lista.',
  },
  {
    id: 'compilado', grupo: '02 · Inspiração', nome: 'Compilado de referências', tipo: 'carrossel', pilar: 'curadoria', categoria: 'curadoria',
    paraQueServe: 'Repertório temático (piscinas de hotel, sofás, mesas, espelhos) que vira arquivo de quem salva. Constrói a fama de "quem tem o melhor olhar".',
    comoFazer: ['Um tema por post', '4 a 6 imagens que conversam entre si', 'Créditos de cada referência'],
    filtro: 'O critério precisa estar declarado: o que une as imagens. Sem moodboard reciclado.',
  },
  {
    id: 'repost', grupo: '02 · Inspiração', nome: 'Repost', tipo: 'reels', pilar: 'curadoria', categoria: 'curadoria',
    paraQueServe: 'Manter presença com algo belo feito por outros, quando não há peça própria pronta. É respiro de calendário, não pilar.',
    comoFazer: ['Conteúdos interessantes, com alcance comprovado', 'Sempre dar a fonte'],
    filtro: 'Usar com parcimônia: o manual prefere curadoria autoral a repost. Se não tiver leitura sua, prefira o respiro.',
  },
  {
    id: 'portfolio-carrossel', grupo: '03 · Portfólio', nome: 'Carrossel de projeto', tipo: 'carrossel', pilar: 'autoridade', categoria: 'projetos',
    paraQueServe: 'O projeto como prova de autoria: é o que a cliente olha antes de chamar. Vende sem parecer venda.',
    comoFazer: ['Carrossel com as imagens do projeto', 'Uma decisão de design explicada na legenda'],
    filtro: 'Projeto entregue no máximo a cada 4 a 6 semanas, sempre dentro de um arco de lançamento.',
  },
  {
    id: 'portfolio-video', grupo: '03 · Portfólio', nome: 'Vídeo de projeto', tipo: 'reels', pilar: 'autoridade', categoria: 'projetos',
    paraQueServe: 'O mesmo projeto em movimento: luz, escala e percurso que a foto não mostra.',
    comoFazer: ['Vídeo ou animação do projeto', 'Entender se precisa de lettering'],
    filtro: 'Planos fixos e corte seco: precisão e modernidade, não o vídeo institucional fluido.',
  },
  {
    id: 'reel-lettering', grupo: '04 · Vídeo reel', nome: 'Reel com lettering', tipo: 'reels', pilar: 'autoridade', categoria: 'editorial',
    paraQueServe: 'Contar o porquê de uma escolha concreta (a madeira, a pedra) em ritmo nativo da rede. É o formato que alcança quem ainda não segue.',
    comoFazer: ['Lettering e estética nativa de rede social', 'Ex.: "A madeira que eu quero usar em um projeto"', 'Cortes de perto, manuseio e comparação dos materiais'],
    filtro: 'O porquê, nunca o passo a passo. Sem pergunta-gancho na abertura.',
  },
  {
    id: 'videomaker', grupo: '05 · Videomaker', nome: 'Vídeo com videomaker', tipo: 'reels', pilar: 'autoridade', categoria: 'editorial',
    paraQueServe: 'A sua voz de fundadora: entrevistas, collabs, finalização de projeto, curadoria em loja. Constrói a marca pessoal com produção à altura.',
    comoFazer: ['Para narrar algo pontual: entrevista, projeto, collab', 'Lettering padrão para capa, meio e final', 'Mistura de câmeras, cortes de alta qualidade'],
    filtro: 'Voz clara e frases curtas. Sem excesso de vulnerabilidade.',
  },
  {
    id: 'newsletter', grupo: '06 · Newsletter', nome: 'Divulgação da Casa Nogs', tipo: 'reels', pilar: 'conexao', categoria: null,
    paraQueServe: 'Levar a seguidora para a Casa Nogs, onde ela vira assinante: a base mais qualificada da marca.',
    comoFazer: ['Animação ou carrossel com compilado de fotos e lettering', 'Mostrar o tema e uma citação da edição', 'No Substack: temas pessoais, renders, ideias'],
    filtro: 'Chamada discreta. A edição é outra camada do assunto, nunca resumo do Instagram.',
  },
  {
    id: 'apresentacao', grupo: 'Conteúdo 13', nome: 'Apresentação da empresa', tipo: 'carrossel', pilar: 'autoridade', categoria: null,
    paraQueServe: 'Marco da marca: anunciar o studio, uma nova fase ou uma collab, em formato de carta.',
    comoFazer: ['Logo, foto oficial e contato comercial', 'Making of, se houver', 'Legenda em formato de carta: pessoal, acolhedor e profissional'],
    filtro: 'Raro por princípio: só em mudança real de fase.',
  },
]

// Worldbuilding da marca NN: o mundo onde todo conteúdo acontece.
// Arquivo puro: só conteúdo, sem banco. Os territórios vêm da estratégia, para não divergir do editor de posts.

import { TERRITORIOS, type Territorio } from '@/lib/posts/estrategia'

export const CONCEITO = {
  definicao:
    'Worldbuilding vem da literatura e do cinema: antes de contar a história, o autor constrói o mundo onde ela acontece. Lugares, regras, personagens, objetos, linguagem e um tempo próprio. Em marca, é parar de pensar em peças isoladas e construir um universo coerente. Cada post, story, edição ou entrega de projeto passa a ser uma janela para o mesmo mundo.',
  diferenca: [
    { nome: 'Identidade visual', txt: 'Como a marca se veste: cores, letras, logo.' },
    { nome: 'Posicionamento', txt: 'O que a marca defende e para quem.' },
    { nome: 'Worldbuilding', txt: 'Onde a marca mora: os lugares, as horas, as coisas e as pessoas que existem ali.' },
  ],
  seusMoods:
    'É o que você já fazia com os moods e as pastas do Pinterest (Sombra, Ivory, Reflexos, Solo, Amarelo, NN PB): fragmentos de um mundo, mas sem o mapa. O worldbuilding é o mapa. Toda imagem salva precisa caber num lugar, numa hora ou num ritual deste mundo. O que não cabe fica de fora, por mais bonito que seja.',
}

export const EXEMPLOS = [
  { marca: 'Aman', txt: 'O silêncio como lugar. Em qualquer país, a mesma sensação de tempo parado, e a comunicação mostra o lugar antes do quarto.' },
  { marca: 'Aesop', txt: 'Cada loja é projetada para a sua rua, como uma pequena biblioteca. Os textos têm voz literária.' },
  { marca: 'Loewe', txt: 'O artesanato como origem do mundo, sustentado pelo Craft Prize da fundação da marca.' },
  { marca: 'Jacquemus', txt: 'O sul da França inteiro: campos, sol, a infância do criador. As campanhas acontecem lá.' },
]

/** A premissa: a frase que explica o mundo inteiro. */
export const PREMISSA = 'Uma casa onde o tempo passa devagar e tudo o que fica foi escolhido.'

export type Bloco = { titulo: string; intro: string; itens: { nome: string; txt: string }[] }

// A "bíblia do mundo": o que existe dentro dele.
export const MUNDO: Bloco[] = [
  {
    titulo: 'Lugares',
    intro: 'A geografia do mundo NN. Todo conteúdo acontece em um destes lugares.',
    itens: [
      { nome: 'A casa', txt: 'O centro do mundo. Os projetos entregues, contados ambiente por ambiente.' },
      { nome: 'O studio', txt: 'A mesa de amostras, a parede de referências. Onde a matéria é escolhida pelo toque.' },
      { nome: 'A mesa', txt: 'Receber, o jantar, o objeto herdado. É o lugar da Casa Nogs.' },
      { nome: 'O jardim', txt: 'A mata, a flor, a luz que entra. De onde vêm as estações.' },
      { nome: 'Os lugares que ensinam', txt: 'A arquitetura, os museus e as viagens que formam o olhar. Lina, Burle Marx, Paulo Mendes da Rocha.' },
    ],
  },
  {
    titulo: 'Tempo',
    intro: 'O mundo tem relógio próprio. Ele é marcado pela luz, não pelo calendário de datas comerciais.',
    itens: [
      { nome: 'A luz das cinco', txt: 'A hora em que a casa fica mais bonita. É para ela que se desenha.' },
      { nome: 'As estações', txt: 'Cada ciclo de 12 posts é uma estação, com um tema: novembro devagar, dezembro receber.' },
      { nome: 'O terceiro dia', txt: 'A flor que murcha bonita, a madeira que escurece. O tempo é bem-vindo.' },
    ],
  },
  {
    titulo: 'Matérias',
    intro: 'O que se toca dentro do mundo. A câmera chega perto delas.',
    itens: [
      { nome: 'Madeira', txt: 'Ripada, em tom de mel, que esquenta à tarde.' },
      { nome: 'Pedra crua', txt: 'Fria na palma, sem polimento.' },
      { nome: 'Linho', txt: 'Que amassa e não pede desculpa.' },
      { nome: 'Cerâmica e vidro', txt: 'Feitos à mão, com o vidro âmbar como luz.' },
      { nome: 'Concreto vazado', txt: 'O cobogó que desenha a luz em pedaços.' },
    ],
  },
  {
    titulo: 'Objetos-símbolo',
    intro: 'Coisas que reaparecem e que, com o tempo, viram a assinatura do mundo.',
    itens: [
      { nome: 'A flor sozinha', txt: 'Num vaso estreito, nunca um buquê.' },
      { nome: 'A poltrona de couro', txt: 'O lugar preferido da casa.' },
      { nome: 'O objeto herdado', txt: 'O castiçal, a louça, a peça com história.' },
      { nome: 'A escada branca', txt: 'A arquitetura vista como desenho.' },
      { nome: 'O livro aberto', txt: 'O repertório que vem antes do projeto.' },
    ],
  },
  {
    titulo: 'Rituais',
    intro: 'O que se faz dentro do mundo, sempre do mesmo jeito.',
    itens: [
      { nome: 'Escolher pelo toque', txt: 'A matéria antes da foto.' },
      { nome: 'A mesa de domingo', txt: 'Posta em casa, sem produção.' },
      { nome: 'Receber', txt: 'A porta aberta, quem chega de longe.' },
      { nome: 'Trocar a flor', txt: 'No terceiro dia, não antes.' },
    ],
  },
  {
    titulo: 'Personagens',
    intro: 'Quem vive no mundo. Nem todos aparecem, mas todos estão presentes.',
    itens: [
      { nome: 'A anfitriã', txt: 'Você. Aparece trabalhando, em movimento ou dentro da arquitetura, nunca só posando.' },
      { nome: 'Os moradores', txt: 'As famílias dos projetos. Presença sugerida: a poltrona usada, a mesa posta. Rosto só com consentimento.' },
      { nome: 'Os artesãos', txt: 'Marceneiro, marmorista, ceramista. O mundo é feito à mão.' },
      { nome: 'Os antepassados', txt: 'Lina, Burle Marx, Paulo Mendes da Rocha. A família de que o mundo descende.' },
    ],
  },
  {
    titulo: 'Sentidos',
    intro: 'Toda peça precisa fazer sentir pelo menos um destes.',
    itens: [
      { nome: 'Luz', txt: 'Baixa, quente, lateral.' },
      { nome: 'Som', txt: 'Casa silenciosa, uma porta, uma xícara.' },
      { nome: 'Cheiro', txt: 'Madeira, café, flor.' },
      { nome: 'Toque', txt: 'Pedra fria, linho, couro gasto.' },
    ],
  },
]

/** Os cinco territórios da estratégia, lidos como as regiões do mundo. */
export const REGIOES: Record<Territorio, { lugar: string; txt: string }> = {
  materia: { lugar: 'O studio', txt: 'A pedra, a madeira, a amostra na mão.' },
  silencio: { lugar: 'A casa de manhã', txt: 'O ambiente vazio, a luz entrando, nada acontecendo.' },
  ritual: { lugar: 'A mesa', txt: 'Receber, o café, a flor trocada.' },
  curadoria: { lugar: 'Os lugares que ensinam', txt: 'O que admiramos e de onde viemos.' },
  refugio: { lugar: 'A casa à tarde', txt: 'A poltrona, o livro, o fim do dia.' },
}
export const nomeRegiao = (t: Territorio) => TERRITORIOS[t]

export const PALETA = [
  { nome: 'Off-white', hex: '#F8F6F2', uso: 'A parede da casa. Fundo dos textos.' },
  { nome: 'Linho', hex: '#DBD7C7', uso: 'O tecido. Linhas e texto sobre escuro.' },
  { nome: 'Taupe', hex: '#9F9681', uso: 'A pedra. O que é secundário.' },
  { nome: 'Grafite', hex: '#4E4639', uso: 'A sombra. Frases, uma vez por mês.' },
  { nome: 'Terracota', hex: '#683627', uso: 'A cerâmica. Rótulos.' },
  { nome: 'Borgonha', hex: '#350000', uso: 'O vinho da mesa. Cartas e Casa Nogs.' },
]

/** O que não existe neste mundo. */
export const FORA = [
  'Pressa, contagem regressiva, promoção.',
  'Tendência da estação e "dicas".',
  'Casa de revista sem sinal de quem mora.',
  'Cor saturada sem motivo.',
  'Rosto de cliente sem consentimento.',
  'Humor de meme e áudio em alta.',
]

export const CANAIS = [
  { canal: 'Feed', txt: 'Cada ciclo de 12 posts é um capítulo do mundo: uma estação, um projeto, as mesmas matérias. O grid inteiro precisa parecer o mesmo lugar.' },
  { canal: 'Stories', txt: 'O cotidiano dentro do mundo, sem produção: a flor da semana, a mesa de amostras, a luz das cinco no studio.' },
  { canal: 'Casa Nogs', txt: 'A voz literária do mundo. Cada edição é uma carta escrita de dentro da casa, na mesa.' },
  { canal: 'Site e portfólio', txt: 'Os projetos como casas do mundo: a ficha fala de matéria, luz e hora, não só de metragem.' },
  { canal: 'Experiência do cliente', txt: 'O mundo continua fora da tela. A caixa de amostras, a apresentação do projeto, o presente de entrega (a flor, o livro), o cheiro do studio.' },
  { canal: 'Eventos e parcerias', txt: 'O Salão, marcas e artesãos entram só se já pertencem ao mundo. A pergunta é "isso mora aqui?".' },
  { canal: 'Moods e Pinterest', txt: 'As pastas passam a ser organizadas por lugar do mundo (a casa, o studio, a mesa, o jardim, os lugares que ensinam), não por tema solto.' },
]

/** O teste do mundo: cinco perguntas antes de publicar. */
export const TESTE = [
  'Em que lugar do mundo isso acontece?',
  'Que hora do dia, ou que estação, é?',
  'Que matéria dá para sentir?',
  'Que personagem está presente, mesmo fora do quadro?',
  'Alguém que conhece a marca reconheceria sem o logo?',
]

export const PROXIMOS = [
  'Reorganizar as pastas de mood e do Pinterest pelos cinco lugares do mundo.',
  'Escrever a bíblia do mundo em uma página, para fotógrafo, agência e equipe.',
  'Definir a estação de dezembro: receber.',
  'Usar o campo território do editor de posts como a região do mundo em que cada post acontece.',
]

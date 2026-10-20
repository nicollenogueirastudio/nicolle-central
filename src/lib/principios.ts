// Princípios Bíblicos do studio: transcritos da nota "Princípios Bíblicos" (Evernote, abr/2026).
// Versículos na NVI, tirados do mesmo texto usado no versículo do dia (src/lib/versiculos.ts).
// A "pergunta" de cada valor é o lembrete aplicado ao trabalho, mostrado no dashboard.

export type Valor = { nome: string; referencia: string; texto: string; pergunta: string }
export type PrincipioFinanceiro = { nome: string; referencia: string | null; texto: string | null; praticas: string[] }

export const PROPOSITO = {
  pergunta: 'Como minha empresa pode glorificar a Deus e servir às pessoas com excelência?',
  declaracao: 'Servimos com excelência, criatividade e integridade, levando beleza e bem-estar às pessoas, e glorificando a Deus em cada detalhe.',
}

/** Os valores inegociáveis: alicerce para decisões, parcerias e cultura interna e externa. */
export const VALORES: Valor[] = [
  {
    nome: 'Integridade', referencia: 'Provérbios 10:9',
    texto: 'Quem anda com integridade anda com segurança, mas quem segue veredas tortuosas será descoberto.',
    pergunta: 'O que eu prometo à cliente é exatamente o que vou entregar, no prazo e no orçamento que disse?',
  },
  {
    nome: 'Generosidade', referencia: '2 Coríntios 9:6-8',
    texto: 'Aquele que semeia pouco, também colherá pouco, e aquele que semeia com fartura, também colherá fartamente. Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.',
    pergunta: 'Onde posso dar mais do que o combinado hoje: um tempo, um reconhecimento, uma porta aberta?',
  },
  {
    nome: 'Excelência como forma de adoração', referencia: 'Colossenses 3:23',
    texto: 'Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens.',
    pergunta: 'Essa entrega está sendo feita como se fosse para Deus?',
  },
  {
    nome: 'Serviço', referencia: 'Marcos 10:45',
    texto: 'Pois nem mesmo o Filho do homem veio para ser servido, mas para servir e dar a sua vida em resgate por muitos.',
    pergunta: 'Neste projeto, estou servindo a vida de quem vai morar ali ou o meu portfólio?',
  },
  {
    nome: 'Mordomia', referencia: 'Lucas 16:10',
    texto: 'Quem é fiel no pouco, também é fiel no muito, e quem é desonesto no pouco, também é desonesto no muito.',
    pergunta: 'Estou cuidando do tempo, do dinheiro e dos materiais confiados a mim como quem vai prestar contas?',
  },
  {
    nome: 'Amor ao próximo', referencia: 'João 13:34-35',
    texto: 'Um novo mandamento lhes dou: Amem-se uns aos outros. Como eu os amei, vocês devem amar-se uns aos outros. Com isso todos saberão que vocês são meus discípulos, se vocês se amarem uns aos outros.',
    pergunta: 'Como trato hoje a equipe, os fornecedores e a obra, não só a cliente?',
  },
  {
    nome: 'Humildade', referencia: 'Filipenses 2:3',
    texto: 'Nada façam por ambição egoísta ou por vaidade, mas humildemente considerem os outros superiores a si mesmos.',
    pergunta: 'Esta decisão nasce de servir ou de ser vista?',
  },
]

export const CULTURA = [
  'Orar juntos seja natural.',
  'A gratidão seja cultivada.',
  'A equipe cresça espiritualmente e pessoalmente.',
  'A generosidade seja ativa: doações, apoio a causas, bonificações justas.',
]

export const CLIENTES = [
  'Atenda com empatia e serviço.',
  'Use a criatividade como um presente de Deus para tocar vidas.',
  'Pergunte sempre: essa entrega está sendo feita como se fosse para Deus?',
]

export const FINANCAS: PrincipioFinanceiro[] = [
  {
    nome: 'Tudo pertence a Deus', referencia: 'Salmos 24:1',
    texto: 'Do Senhor é a terra e tudo o que nela existe, o mundo e os que nele vivem.',
    praticas: ['Reconheça que você é apenas mordoma dos recursos.', 'Antes de qualquer decisão financeira, ore: “Senhor, isso é Seu. O que o Senhor quer que eu faça com isso?”'],
  },
  {
    nome: 'Planejamento e orçamento', referencia: 'Provérbios 21:5',
    texto: 'Os planos bem elaborados levam à fartura; mas o apressado sempre acaba na miséria.',
    praticas: ['Orçamento mensal', 'Projeções anuais', 'Separação de recursos para emergências, expansão e generosidade', 'Revisão mensal de gastos e decisões em oração'],
  },
  {
    nome: 'Fidelidade no pouco', referencia: 'Lucas 16:10',
    texto: 'Quem é fiel no pouco, também é fiel no muito.',
    praticas: ['Comece com o que tem. Organize cada real com excelência.', 'Seja fiel em cada gasto, investimento e fornecedor escolhido.'],
  },
  {
    nome: 'Evite desperdício e dívidas desnecessárias', referencia: 'Romanos 13:8',
    texto: 'Não devam nada a ninguém, a não ser o amor de uns pelos outros, pois aquele que ama seu próximo tem cumprido a lei.',
    praticas: ['Escolha simplicidade, eficiência e clareza.', 'Não invista por impulso, mas com propósito e sabedoria.'],
  },
  {
    nome: 'Use o dinheiro para relacionamentos eternos', referencia: 'Lucas 16:9',
    texto: 'Usem a riqueza deste mundo ímpio para ganhar amigos, de forma que, quando ela acabar, estes os recebam nas moradas eternas.',
    praticas: ['Apoie projetos, pessoas, missões ou colaboradores com generosidade.', 'Crie impacto eterno com seus recursos.'],
  },
  {
    nome: 'Avaliação regular com Deus', referencia: null, texto: null,
    praticas: ['Uma prestação de contas espiritual por mês.'],
  },
]

/** A prestação de contas mensal: aparece no dashboard nos primeiros dias do mês. */
export const PRESTACAO = [
  'Senhor, o que estou fazendo com os recursos que o Senhor me confiou?',
  'Estou priorizando o Reino?',
  'Posso ser confiável com mais?',
]
export const DIAS_DA_PRESTACAO = 3

export const ORACAO = 'Senhor, consagro essa empresa a Ti. Que ela seja uma ferramenta para espalhar a Tua luz, servir com excelência e transformar vidas. Que cada recurso, cliente, projeto e decisão seja para a Tua glória. Dá-me sabedoria, humildade e ousadia para fazer o Teu querer. Que eu seja fiel no pouco, generosa no muito, e guiada pela Tua voz. Amém.'

export const PASSOS = [
  { acao: 'Escrever propósito e valores', quando: 'Esta semana', obs: 'Coloque em local visível' },
  { acao: 'Criar plano financeiro com Deus', quando: 'Até o fim do mês', obs: 'Revisão mensal' },
  { acao: 'Planejar 1 gesto de generosidade', quando: 'Esta semana', obs: 'Um ato que reflita Lucas 16:9' },
  { acao: 'Orar sobre cada decisão financeira', quando: 'Diariamente', obs: 'Até se tornar hábito' },
  { acao: 'Criar um caderno de “Prestação de contas com Deus”', quando: 'Esta semana', obs: 'Evernote, Notion ou físico' },
]

/** Um valor por dia da semana: segunda é Integridade, domingo é Humildade. */
export function valorDoDia(diaISO: string): Valor {
  const dow = new Date(diaISO + 'T12:00:00Z').getUTCDay() // 0 = domingo
  return VALORES[(dow + 6) % 7]
}

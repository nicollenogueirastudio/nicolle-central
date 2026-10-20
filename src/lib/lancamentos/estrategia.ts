// Estratégia de Lançamento de Projeto (manual interno 2026, base Playbook de Projetos Brutte).
// Dezesseis movimentos em cinco fases: do canteiro de obras ao arquivo permanente do perfil.

import type { Pilar, Tipo } from '@/lib/posts/tipos'

export type Fase = 1 | 2 | 3 | 4 | 5

export const FASES: Record<Fase, { numero: string; nome: string; quando: string; resumo: string }> = {
  1: { numero: 'I', nome: 'Antes, a obra', quando: '4 a 6 semanas antes', resumo: 'Processo antes do resultado. Constrói expectativa sem revelar nada.' },
  2: { numero: 'II', nome: 'O clima', quando: '1 a 2 semanas antes', resumo: 'Estabelece o clima emocional antes de qualquer legenda explicar o projeto.' },
  3: { numero: 'III', nome: 'A gramática', quando: 'Recurso contínuo', resumo: 'Os elementos que fazem a conta ser reconhecível à distância.' },
  4: { numero: 'IV', nome: 'A revelação', quando: 'Ao longo de 4 meses', resumo: 'O projeto aparece. Nunca em um post só, sempre em camadas.' },
  5: { numero: 'V', nome: 'O desdobramento', quando: 'Após a revelação', resumo: 'O que sobrevive ao arco: prova social, arquivo e aprofundamento.' },
}

export type Movimento = {
  n: number
  nome: string
  fase: Fase
  oQueE: string
  porQue: string
  formato: string
  canal: string
  quando: string
  comoExecutar: string[]
  // Para planejar: dias em relação à revelação (null = contínuo ou livre) e o post que vira no calendário.
  dias: number | null
  post: { tipo: Tipo; pilar: Pilar } | null
}

export const MOVIMENTOS: Movimento[] = [
  {
    n: 1, nome: 'Fotos de obra', fase: 1, dias: -42, post: { tipo: 'carrossel', pilar: 'autoridade' },
    oQueE: 'Feed com dump de fotos; story com uma sequência desdobrando um pouco mais o que cada imagem significa. Um storytelling para humanizar o processo e aproximar do público.',
    porQue: 'Abre o arco de pré-lançamento: mostra processo antes do resultado, sem revelar nada, construindo expectativa.',
    formato: 'Carrossel + story', canal: 'Instagram', quando: '4 a 6 semanas antes',
    comoExecutar: ['Story com começo e fim, de três a seis telas', 'Desdobrar o que cada imagem significa, sem repetir a legenda', 'Nenhum ângulo que entregue o resultado final', 'Tratamento de cor já no preset do arco (mov. 07)'],
  },
  {
    n: 2, nome: 'Vídeo de obra', fase: 1, dias: -35, post: { tipo: 'reels', pilar: 'autoridade' },
    oQueE: 'Versão em movimento do mesmo storytelling: poema visual, sem narração, cortes do concreto bruto, granulação fílmica leve.',
    porQue: 'É o "antes" da virada antes/agora/depois sem precisar de uma palavra. Reforça o movimento 01.',
    formato: 'Reel 1080 × 1920', canal: 'Instagram', quando: 'Junto do mov. 01',
    comoExecutar: ['Sem narração e sem trilha comercial', 'Corte seco, plano fixo, granulação leve', 'Nenhum reel começa com pergunta-gancho', 'Lettering como pontuação, nunca como legenda'],
  },
  {
    n: 3, nome: 'Finalização de obra', fase: 1, dias: -17, post: { tipo: 'carrossel', pilar: 'autoridade' },
    oQueE: 'Feed com dump de fotos; story com uma sequência mostrando um pouco dos detalhes, um pouco mais desdobrado que no feed.',
    porQue: 'Sinaliza que a revelação está próxima, sem entregar o resultado tratado ainda.',
    formato: 'Carrossel + story', canal: 'Instagram', quando: '2 a 3 semanas antes',
    comoExecutar: ['Detalhe, matéria e mão, não o ambiente inteiro', 'Story mais desdobrado que o feed', 'Nenhuma imagem tratada do projeto pronto', 'Revelação já combinada com a cliente'],
  },
  {
    n: 4, nome: 'Look and feel · foto', fase: 2, dias: -7, post: { tipo: 'carrossel', pilar: 'curadoria' },
    oQueE: 'Composição de imagens que traduz o clima do projeto: cor, textura, temperatura, mundo de referência.',
    porQue: 'Estabelece o clima emocional antes de qualquer legenda explicar o projeto. É abertura e capa do arco, não conteúdo central.',
    formato: 'Carrossel 1080 × 1350', canal: 'Instagram e Casa Nogs', quando: '1 semana antes',
    comoExecutar: ['Referências reais, sempre creditadas', 'Sem imagem gerada por IA e sem banco genérico', 'Critério declarado: o que une as imagens', 'A última tela devolve ao mundo da marca'],
  },
  {
    n: 5, nome: 'Look and feel · animação', fase: 2, dias: -10, post: { tipo: 'reels', pilar: 'curadoria' },
    oQueE: 'Pegar um item do projeto, um objeto ou um móvel, e colocá-lo junto de outras coisas de semiótica parecida, em animação.',
    porQue: 'Reconhece a peça do projeto dentro de um mundo de gosto maior: o território "curadoria" do manual.',
    formato: 'Animação vertical', canal: 'Instagram', quando: 'Alterna com o mov. 04',
    comoExecutar: ['Uma peça-âncora do projeto por animação', 'Pares de mesma semiótica: forma, cor, matéria', 'Créditos de cada referência na legenda', 'Ritmo lento; a peça é a protagonista'],
  },
  {
    n: 6, nome: 'Inserção sutil de lettering', fase: 3, dias: null, post: null,
    oQueE: 'Lettering inserido com sutileza, mesmo sem um padrão fixo de desenho. O que se mantém fixo é a intenção.',
    porQue: 'Pontuação editorial, não decoração. Se também marca o início de projeto (mov. 08), precisa de consistência mínima.',
    formato: 'Foto, vídeo e capa', canal: 'Todos', quando: 'Contínuo',
    comoExecutar: ['Lettering pontua; nunca explica a imagem', 'Mesmo lettering nas capas de destaque', 'Nenhuma palavra da lista banida', 'Decidir antes: pontuação ou marcação de início?'],
  },
  {
    n: 7, nome: 'Cor e respiro', fase: 3, dias: null, post: null,
    oQueE: 'Cor: edição das fotos em tons quentes, com filtro consistente. Respiro: pausa visual atrelada aos projetos e à fotografia.',
    porQue: 'Cor é a assinatura reconhecível à distância. Respiro é o território "silêncio": pausa entre informações, não ausência de conteúdo.',
    formato: 'Preset + regra de grid', canal: 'Todos', quando: 'Contínuo',
    comoExecutar: ['Um preset único de tratamento quente por arco', 'Cor idêntica entre vídeo e foto', 'Ler cada peça no grid, junto das oito anteriores', 'Sem peça pronta, entra respiro, nunca post por obrigação'],
  },
  {
    n: 8, nome: 'Divisão aparente de projetos', fase: 3, dias: -45, post: { tipo: 'feed', pilar: 'autoridade' },
    oQueE: 'Uma marcação que determine onde começa a apresentação de um projeto: lettering, inspiração, desenho ou foto de obra.',
    porQue: 'Ótimo para a leitura dinâmica do perfil. "Categoria + barra" já funciona na conta ("Projetos /"): estender o sistema, não criar outro.',
    formato: 'Primeira tela do arco', canal: 'Instagram', quando: 'Abre o arco, antes do mov. 01',
    comoExecutar: ['Escolher uma marcação e mantê-la em todos os arcos', 'Ela abre o arco no grid, antes do mov. 01', 'Ilustração ou desenho técnico do projeto são candidatos', 'Testar a leitura no grid de nove antes de publicar'],
  },
  {
    n: 9, nome: 'Foto humanizada', fase: 4, dias: 0, post: { tipo: 'feed', pilar: 'autoridade' },
    oQueE: 'Presença humana controlada dentro do projeto: o gesto no lugar da fala.',
    porQue: 'O mesmo registro dos roteiros de vídeo da marca: a mão ajeitando o linho, alguém sentada bebendo devagar.',
    formato: 'Foto 1080 × 1350', canal: 'Instagram', quando: 'Abertura da revelação',
    comoExecutar: ['Gesto, não pose; rosto é opcional', 'Figurino neutro, que não disputa com o espaço', 'Uma pessoa por cena', 'Autorização de imagem antes da captação'],
  },
  {
    n: 10, nome: 'Vídeo de projeto', fase: 4, dias: 3, post: { tipo: 'reels', pilar: 'autoridade' },
    oQueE: 'Imagens mais "duras" dão um tom mais moderno ao projeto do que cenas mais "fluidas".',
    porQue: 'Recusa o vídeo institucional fluido e comercial: comunica precisão e modernidade pelo ritmo da edição.',
    formato: 'Reel 1080 × 1920', canal: 'Instagram', quando: 'Logo após a abertura',
    comoExecutar: ['Planos fixos, sem movimentos "de drone"', 'Granulação leve, cor do preset do arco', 'Créditos completos: fotografia e fornecedores', 'Nada publicado antes da data combinada com a cliente'],
  },
  {
    n: 11, nome: 'Mix moodboard + feed intencional', fase: 4, dias: 14, post: { tipo: 'carrossel', pilar: 'autoridade' },
    oQueE: 'Mix do projeto com o moodboard e as referências reais que o inspiraram, sem IA ou referências genéricas. Cada post carrega uma mensagem.',
    porQue: 'Divulgar um projeto ao longo de semanas, e não num post só, é o que sustenta alcance alto.',
    formato: '4 a 5 posts de feed por mês', canal: 'Instagram', quando: 'Ao longo de 4 meses',
    comoExecutar: ['Cada post com uma mensagem só', 'Alternar projeto, moodboard e referência real', 'A estratégia já se parece com o feed atual da NN', 'Sugestão Brutte: impulsionar a entrega'],
  },
  {
    n: 12, nome: 'Feedback da cliente como prova social', fase: 5, dias: 42, post: { tipo: 'story', pilar: 'conexao' },
    oQueE: 'O relato da cliente entra como registro editorial, não como peça de venda: um trecho curto, sem moldura comercial.',
    porQue: 'Só funciona no registro da marca se for dado com discrição. É a etapa de "vínculo" da jornada virando conteúdo.',
    formato: 'Story, carrossel, destaque', canal: 'Instagram', quando: '4 a 8 semanas após a entrega',
    comoExecutar: ['Trecho curto, nas palavras dela', 'Autorização da cliente antes de publicar', 'Sem estrelas, sem "recomendo", sem oferta', 'Arquivar no destaque do projeto (mov. 15)'],
  },
  {
    n: 13, nome: 'Conteúdo exclusivo de TikTok', fase: 5, dias: null, post: null,
    oQueE: 'Um lugar para ser um pouco menos editorial, com mais informação relevante, ideal para a plataforma.',
    porQue: 'A exceção deliberada ao "não somos didáticos". O TikTok está fora do mix oficial: válvula de escape controlada, não pilar.',
    formato: 'Vídeo 1080 × 1920', canal: 'TikTok', quando: 'Fora do arco',
    comoExecutar: ['Mais informação, o mesmo gosto', 'Nunca reaproveitar o reel editorial do Instagram', 'A estética da marca continua valendo', 'Cadência livre, sem meta de frequência'],
  },
  {
    n: 14, nome: 'Vídeo de TikTok', fase: 5, dias: null, post: null,
    oQueE: 'Sem ser didático demais, mostrar o diferencial.',
    porQue: 'Mostrar o porquê de uma escolha, não o passo a passo, em ritmo nativo da plataforma.',
    formato: 'Vídeo de 20 a 45 s', canal: 'TikTok', quando: 'Livre',
    comoExecutar: ['Partir de uma escolha concreta do projeto', 'O porquê, nunca o "como fazer"', 'Ritmo nativo, tom autoral', 'Sem tutorial, sem lista de dicas'],
  },
  {
    n: 15, nome: 'Destaques dos projetos', fase: 5, dias: 7, post: null,
    oQueE: 'Arquivo permanente e vitrine de entrada do perfil, organizado por projeto e por categoria.',
    porQue: 'É a primeira impressão de quem chega frio no perfil. Onde cabem Imprensa e Prêmios, ainda não ativados.',
    formato: 'Destaques', canal: 'Instagram', quando: 'A cada arco',
    comoExecutar: ['Um destaque por projeto, capa com o lettering do feed', 'Abrir Imprensa e Prêmios assim que houver material', 'Rever a cada trimestre e arquivar o que envelheceu', 'Ordem: o projeto mais recente primeiro'],
  },
  {
    n: 16, nome: 'Casa Nogs', fase: 5, dias: 2, post: null,
    oQueE: 'Replicar os carrosséis do Instagram no Substack com conteúdo mais embasado, expandindo a entrega para a base de e-mail.',
    porQue: 'A assinante do Substack é lead mais qualificada que a seguidora. É onde cabe o aprofundamento que não cabe no Instagram.',
    formato: 'Newsletter editorial', canal: 'Casa Nogs · Substack', quando: 'Semana da revelação',
    comoExecutar: ['Nunca resumo do Instagram: outra camada do assunto', 'Renders, ideias não executadas, o porquê das escolhas', 'Edição mais densa na semana da revelação', 'Chamada discreta ao final do carrossel do Instagram'],
  },
]

export const movimento = (n: number) => MOVIMENTOS.find((m) => m.n === n)!

export const REGRAS_DO_ARCO = [
  'Um projeto por vez. Nunca dois arcos simultâneos.',
  'Nenhuma imagem do projeto pronto antes da revelação combinada com a cliente.',
  'Toda peça responde ao próprio "por quê" em uma frase.',
  'Sem peça pronta, entra respiro, nunca post por obrigação de calendário.',
  'A Casa Nogs acompanha o arco inteiro; o TikTok corre fora dele.',
  'Cada aparição errada custa um ano da certa.',
]

export const LEGENDA = {
  estrutura: [
    { parte: 'Primeira linha', texto: 'Uma afirmação, uma imagem ou uma data. Nunca uma pergunta.' },
    { parte: 'Corpo', texto: 'O porquê de uma escolha, em duas ou três frases.' },
    { parte: 'Créditos', texto: 'Fotografia, produção, fornecedores, fonte da referência.' },
    { parte: 'Fim', texto: 'Silêncio. Quando houver chamada, ela é discreta e leva à Casa Nogs.' },
  ],
  nunca: [
    'Pergunta-gancho, promessa de resposta ou contagem regressiva',
    'Emoji como pontuação e hashtag em bloco no fim do texto',
    'Passo a passo, lista de dicas, "salve para depois"',
    'Metragem, tabela técnica e jargão sem narrativa',
    'Qualquer frase que soe como oferta',
  ],
}

export const CHECKLIST = [
  'A peça responde ao próprio "por quê" em uma frase?',
  'Pertence a um pilar só: autoridade, curadoria ou conexão?',
  'A legenda não caberia em qualquer conta de arquitetura do país?',
  'Nenhuma palavra da lista banida no texto, na capa ou no lettering?',
  'O tratamento de cor está igual ao das últimas peças?',
  'Foi lida no grid, junto das oito peças anteriores?',
  'Créditos completos: fotografia, produção, fornecedores, fonte?',
]

export const O_QUE_SE_MEDE = {
  medir: [
    { o: 'Assinantes novas · Casa Nogs', porque: 'o ativo mais durável' },
    { o: 'Abertura e clique da newsletter', porque: 'qualidade da base' },
    { o: 'Salvamentos e compartilhamentos', porque: 'o conteúdo foi guardado' },
    { o: 'Alcance de não seguidoras', porque: 'o arco saiu da bolha' },
    { o: 'Conversas por indicação privada', porque: 'a porta certa' },
    { o: 'Menções e pedidos de imprensa', porque: 'camada de autoridade' },
  ],
  ignorar: [
    'Número absoluto de seguidores',
    'Curtidas como termômetro de qualidade',
    'Retenção segundo a segundo em vídeo',
    'Frequência como meta em si',
    'Comparação com contas de outro registro',
    'Qualquer métrica que empurre para volume',
  ],
}

export const PROXIMOS = [
  { nome: 'Referência de vídeo', texto: 'Banco de referências de vídeo antes da captação: o mesmo critério que o mov. 04 aplica à foto.' },
  { nome: 'Ilustração', texto: 'Candidata à marcação de início de projeto (mov. 08) e à pontuação editorial (mov. 06).' },
  { nome: 'PR · Prêmio', texto: 'Alimenta os destaques Imprensa e Prêmios (mov. 15), ainda não ativados.' },
  { nome: 'Entrega do projeto · caixa', texto: 'O projeto entregue em caixa, com QR code do projeto digital, virando conteúdo.' },
  { nome: 'Experiência da cliente', texto: 'Comunicar a imersão do início e o vínculo do fim, com a discrição do mov. 12.' },
  { nome: 'Vídeo de escolha de materiais', texto: 'iPad e amostras na mesa: o reel autoral que parte de uma escolha concreta.' },
]

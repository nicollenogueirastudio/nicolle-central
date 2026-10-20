// Manual da Marca · transcrição do "MANUAL DE MARCA NICOLLE NOGUEIRA STUDIO R01" (2026).
// Só é lido por server components: estratégia, público e preços não vão para os arquivos públicos do site.
// `pagina` = página do PDF, para abrir a página original no leitor.

export type Bloco =
  | { tipo: 'paragrafos'; itens: string[] }
  | { tipo: 'destaque'; texto: string }
  | { tipo: 'cartoes'; colunas?: 2 | 3 | 4; itens: { rotulo?: string; titulo: string; texto?: string }[] }
  | { tipo: 'numerada'; itens: { titulo?: string; texto: string }[] }
  | { tipo: 'palavras'; titulo?: string; itens: string[]; banidas?: boolean }
  | { tipo: 'imagens'; paginas: number[] }
  | { tipo: 'contraste'; esquerda: string; direita: string; linhas: [string, string][] }

export type Secao = { id: string; titulo: string; pagina: number; blocos: Bloco[] }
export type Parte = { id: string; titulo: string; subtitulo: string; secoes: Secao[] }

export const PAGINAS_MANUAL = 66

export const ASSINATURA = 'Transformar o cotidiano em extraordinário.'
export const MANTRA = 'Se a Loewe e a rede de hotéis Aman tivessem uma filha, seríamos nós.'

export const MANUAL: Parte[] = [
  {
    id: 'volume-1',
    titulo: 'Volume I',
    subtitulo: 'Manual da Marca',
    secoes: [
      {
        id: 'fundamentos', titulo: 'Fundamentos', pagina: 3,
        blocos: [
          { tipo: 'destaque', texto: 'Nossa marca é uma experiência de lifestyle criada para tornar a vida mais bela.' },
          {
            tipo: 'cartoes', colunas: 3, itens: [
              { rotulo: '01', titulo: 'Missão', texto: 'Embelezar a vida das pessoas.' },
              { rotulo: '02', titulo: 'Visão', texto: 'Construir um universo de lifestyle que transforma o viver em arte.' },
              { rotulo: '03', titulo: 'Foco', texto: 'Conteúdos belos com narrativas elegantes, artísticas e inspiradoras: refinamento e autoria em tudo que criamos.' },
            ],
          },
        ],
      },
      {
        id: 'historia', titulo: 'A história', pagina: 4,
        blocos: [
          { tipo: 'paragrafos', itens: [
            'Nossa marca é uma experiência de lifestyle criada para tornar a vida mais bela e cheia de bem-estar.',
            'Num cenário de excesso e ruído, criamos um universo onde o cotidiano se torna experiência estética. Tudo é para servir pessoas que buscam essa qualidade de vida e beleza nos detalhes.',
          ] },
        ],
      },
      {
        id: 'nota-da-fundadora', titulo: 'Nota da fundadora', pagina: 5,
        blocos: [
          { tipo: 'paragrafos', itens: [
            'Entre viagens, encontros e os dias cheios de sentido, nossa casa é nosso refúgio. Acredito que quando pensamos a casa de forma bela, ela se torna fonte de paz, conforto e também de inspiração artística: um espaço que nos acolhe e nos impacta.',
            'Mas a casa é apenas uma parte da nossa vida. O bem-estar verdadeiro vem também dos rituais que nutrem a alma: uma mesa posta com intenção, um aroma que acalma, um gesto de cuidado, uma pausa para respirar.',
          ] },
          { tipo: 'imagens', paginas: [5, 6] },
        ],
      },
      {
        id: 'mensagens', titulo: 'Três mensagens', pagina: 7,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'A beleza tem um poder transformador.' },
            { texto: 'O lar é refúgio e expressão pessoal.' },
            { texto: 'Criamos universos de lifestyle que unem arquitetura, produtos e experiências.' },
          ] },
          { tipo: 'palavras', titulo: 'Palavras-chave', itens: ['Elegante', 'Contemporâneo', 'Editorial'] },
          { tipo: 'destaque', texto: ASSINATURA },
        ],
      },
      {
        id: 'valores', titulo: 'Valores inegociáveis', pagina: 9,
        blocos: [
          { tipo: 'cartoes', colunas: 4, itens: [
            { titulo: 'Qualidade', texto: 'Padrão elevado, atemporal, feito para durar.' },
            { titulo: 'Bem-estar', texto: 'Criar refúgios com personalidade e equilíbrio. A casa eleva o cotidiano.' },
            { titulo: 'Beleza', texto: 'Ver e revelar o belo em tudo, com intenção.' },
            { titulo: 'Originalidade', texto: 'Identidade própria, autoral, única. Recusa a imitação como princípio.' },
            { titulo: 'Comunidade', texto: 'Construir pertencimento e conexão. Cliente vira membro, não consumidor.' },
            { titulo: 'Bom gosto', texto: 'Cultivar elegância, educar o olhar, refinar escolhas. A marca como mestra discreta.' },
            { titulo: 'Legado', texto: 'Marcas que transformam vidas e atravessam gerações. Nenhuma decisão é só de hoje.' },
            { titulo: 'Criatividade', texto: 'Alimentar visão, imaginação e desejo de um futuro mais belo.' },
          ] },
        ],
      },
      {
        id: 'mandamentos', titulo: '10 mandamentos', pagina: 10,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'Singularidade', texto: 'Somos únicos, seguimos nosso próprio caminho.' },
            { titulo: 'Storytelling', texto: 'Histórias que inspiram, emocionam e permanecem.' },
            { titulo: 'Olhar artístico', texto: 'Cada detalhe é expressão criativa.' },
            { titulo: 'Detalhes impecáveis', texto: 'A precisão se vê no menor gesto.' },
            { titulo: 'Voz clara', texto: 'Comunicação direta, refinada e com impacto.' },
            { titulo: 'Experiência elevada', texto: 'Surpreendemos e encantamos em cada encontro.' },
            { titulo: 'Design impecável', texto: 'Criamos com rigor, sofisticação e atemporalidade.' },
            { titulo: 'Encantamento', texto: 'Momentos que se tornam memória.' },
            { titulo: 'Cenários memoráveis', texto: 'Que despertam desejo e pertencimento.' },
            { titulo: 'Eternidade', texto: 'Tudo o que criamos atravessa o tempo.' },
          ] },
        ],
      },
      {
        id: 'tom-de-voz', titulo: 'Tom de voz', pagina: 11,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'Usamos frases curtas. Cada palavra importa. Cinco palavras dizem mais do que vinte.' },
            { texto: 'Criatividade não é excesso. Recurso retórico raro vale mais que adjetivo abundante.' },
            { texto: 'Faça coisas belas. Faça menos. Toda comunicação é chance de subtrair.' },
            { texto: 'A casa é mais do que paredes. É um refúgio. A marca fala disso, não de metragem.' },
            { texto: 'Escolhas bem feitas. Qualidade acima de quantidade. A frequência é parte da promessa.' },
            { texto: 'Transformar o cotidiano é arte. A marca fala de mesa posta, ritual de chá, luz tarde.' },
            { texto: 'Busque leveza. Cultive rituais. Valorize os detalhes.' },
          ] },
        ],
      },
      {
        id: 'nao-somos', titulo: 'Não somos', pagina: 12,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Autoajuda / motivacional', texto: 'Falar como coach, usando chavões sobre felicidade ou merecimento.' },
            { titulo: 'Didática demais', texto: 'Ensinar "como fazer" em vez de curar, inspirar e mostrar referências.' },
            { titulo: 'Vendedora / comercial', texto: 'Tom apelativo, forçando produto ou serviço.' },
            { titulo: 'Excesso de vulnerabilidade', texto: 'Contar burnout em detalhes pode diminuir autoridade diante de clientes ultra high-end.' },
            { titulo: 'Mass market', texto: 'Expressões de popularização: "para todos", "simples e fácil".' },
            { titulo: 'Técnico demais', texto: 'Jargão arquitetônico sem poesia ou narrativa.' },
          ] },
        ],
      },
      {
        id: 'vocabulario', titulo: 'Vocabulário', pagina: 13,
        blocos: [
          { tipo: 'palavras', titulo: 'Assinatura · refúgio', itens: ['refúgio', 'ritual', 'silêncio', 'curadoria', 'matéria', 'pausa'] },
          { tipo: 'palavras', titulo: 'Assinatura · obra', itens: ['obra', 'íntimo', 'atemporal', 'gesto', 'cuidado', 'luz tarde'] },
          { tipo: 'palavras', titulo: 'Assinatura · permanência', itens: ['permanência', 'escolha', 'lar', 'hóspede'] },
          { tipo: 'palavras', titulo: 'Banido · populista', banidas: true, itens: ['para todos', 'simples e fácil', 'você merece', 'rotina estressante'] },
          { tipo: 'palavras', titulo: 'Banido · vendedor', banidas: true, itens: ['ative agora', 'invista hoje', 'sua casa dos sonhos'] },
          { tipo: 'palavras', titulo: 'Banido · mass-market', banidas: true, itens: ['dicas', 'passo a passo', 'tendência', 'solução', 'luxo acessível'] },
        ],
      },
      {
        id: 'personalidade', titulo: 'Personalidade', pagina: 14,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Como a cliente quer estar ao entrar em contato com a marca', titulo: 'Confiante · Inspirada · Atual · Elegante' },
            { rotulo: 'Como a marca quer ser percebida', titulo: 'Elegante · Força estética · Artística · Contemporânea' },
          ] },
        ],
      },
      {
        id: 'mercado-alvo', titulo: 'Mercado-alvo', pagina: 15,
        blocos: [
          { tipo: 'destaque', texto: 'Dois públicos. Uma marca. O conteúdo fala com a Comunidade. A venda acontece com a Cliente.' },
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'A cliente · quem paga', titulo: 'Mulher de 38 a 55 anos', texto: 'Consultora de gosto, empresária, herdeira ativa, esposa de empresário. Vive em Curitiba, São Paulo, Florianópolis, Balneário. Investe alto em interior porque a casa é obra de uma vida. Honorário NN de R$ 150 mil a R$ 500 mil+ por projeto; investimento em decoração de R$ 1 a 5 milhões+. Educação internacional, vida cultural ativa, coleciona arte e mobiliário autoral. Decide entre pares, busca permanência. Quer assinatura, não decoração.' },
            { rotulo: 'A comunidade · quem dá peso', titulo: 'Mulher de 25 a 40 anos', texto: 'Profissional criativa: designer, jornalista, arquiteta, diretora, empresária em ascensão. Constrói patrimônio e gosto. Lê a Casa Nogs e salva no Pinterest, frequenta jantares, abre exposições, compra arte e design autoral em escala. Dá peso simbólico ao trabalho. Em 10 a 15 anos, parte vira cliente.' },
          ] },
        ],
      },
      {
        id: 'referencias', titulo: 'Referências', pagina: 16,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Athena Calderone', texto: 'Estética editorial, blog, studio.' },
            { titulo: 'Kelly Wearstler', texto: 'Branding pessoal, força na estética gráfica.' },
            { titulo: 'Arthur Casas', texto: 'Estilo de projetos e produtos.' },
            { titulo: 'MK27 / Marcio Kogan', texto: 'Estilo de projetos e comunicação.' },
            { titulo: 'Alex Riviere', texto: 'Branding pessoal, estética.' },
            { titulo: 'Studio McGee', texto: 'Modelo de negócio: produtos, curso, projetos.' },
            { titulo: 'Architecture Hunter', texto: 'Comunicação em vídeos de projetos no YouTube.' },
          ] },
          { tipo: 'destaque', texto: MANTRA },
        ],
      },
      {
        id: 'personal-branding', titulo: 'Personal branding', pagina: 17,
        blocos: [
          { tipo: 'paragrafos', itens: [
            'Minha marca pessoal é guiada por beleza nos detalhes e intenção.',
            'De maneira discreta e atemporal, traduzo cada projeto com personalidade, curadoria em arte e design, exclusividade e singularidade.',
          ] },
          { tipo: 'imagens', paginas: [17, 18, 20] },
        ],
      },
    ],
  },
  {
    id: 'volume-2',
    titulo: 'Volume II',
    subtitulo: 'The Luxury Strategy · análise do livro',
    secoes: [
      {
        id: 'tres-logicas', titulo: 'Três lógicas', pagina: 22,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Assinatura', texto: 'Autoria, permanência, atemporalidade. O cliente busca ser parte.' },
            { titulo: 'Premium', texto: 'Excelência funcional, status moderado, trade up de qualidade.' },
            { titulo: 'Moda', texto: 'Novidade, pertencimento à temporada. O cliente compra estar atualizado.' },
          ] },
          { tipo: 'destaque', texto: 'O Studio opera por assinatura, alta curadoria e permanência. Recusa lógica de volume e novidade sazonal. Toda decisão parte daí.' },
        ],
      },
      {
        id: 'quatro-fundamentos', titulo: 'Quatro fundamentos', pagina: 23,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { titulo: 'Reconhecimento entre pares', texto: 'Marcas de alta percepção operam como sinal entre pares. A obra precisa ser reconhecida pelos olhos certos.' },
            { titulo: 'Dualidade', texto: 'Há o íntimo, o que se vive em casa, em silêncio. E o público, o que se vê e se reconhece. Marca duradoura cobre os dois.' },
            { titulo: 'Multissensorial', texto: 'A experiência nasce da atenção simultânea a matéria, textura, aroma, som, serviço e atmosfera. Camada perdida não volta.' },
            { titulo: 'Conteúdo humano', texto: 'Feito à mão. Servido por humano. O que é industrializado perde autoria e perde o registro.' },
          ] },
          { tipo: 'destaque', texto: 'A marca precisa, simultaneamente, vender e construir o desejo de quem ainda não comprou.' },
        ],
      },
      {
        id: 'anti-leis', titulo: 'Oito anti-leis', pagina: 25,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'Identidade no lugar de posicionamento.' },
            { texto: 'A imperfeição é a assinatura. Pátina, gesto manual. O perfeito é industrial.' },
            { texto: 'Não atendemos a todos. Recusar é estratégico.' },
            { texto: 'Não seguimos tendências e modismos passageiros.' },
            { texto: 'Não fazemos igual a todo mundo.' },
            { texto: 'O preço sobe com o tempo. Subir preço eleva desejo.' },
            { texto: 'Comunicamos para quem pode e para quem não pode comprar.' },
            { texto: 'Não terceirizamos a estética. Cada material passa por um único par de olhos.' },
          ] },
        ],
      },
      {
        id: 'vicios', titulo: 'Riscos e vícios', pagina: 26,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Vício 01', titulo: 'Comparação de preço', texto: 'Orçamento vira tópico principal. A marca perde a posição de autoria e entra em comparação.' },
            { rotulo: 'Vício 02', titulo: 'Comunicação em volume', texto: 'Mais posts, mais frequência. Pânico estratégico. Discrição é registro: mais é menos.' },
            { rotulo: 'Vício 03', titulo: 'Pauta errada', texto: '"10 dicas", listas genéricas. Cada aparição errada custa um ano da certa.' },
            { rotulo: 'Vício 04', titulo: 'Estética terceirizada', texto: 'Fotos sem revisão, parcerias sem aprovação.' },
          ] },
        ],
      },
    ],
  },
  {
    id: 'volume-3',
    titulo: 'Volume III',
    subtitulo: 'Estratégia de Marketing & Experiências',
    secoes: [
      {
        id: 'diagnostico', titulo: 'Diagnóstico', pagina: 28,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: '01', titulo: 'Forças', texto: 'Manifesto, valores, referências e manual de marca prontos. Mercado-alvo definido. Doze anos de prática.' },
            { rotulo: '02', titulo: 'Lacunas', texto: 'Poucos clientes e contatos dentro desse padrão. Baixo networking.' },
            { rotulo: '03', titulo: 'Síntese', texto: 'Conceitualmente rara, operacionalmente subutilizada.' },
          ] },
        ],
      },
      {
        id: 'contexto', titulo: 'O lugar em branco', pagina: 29,
        blocos: [
          { tipo: 'paragrafos', itens: [
            'Grande parte dos escritórios de arquitetura no Brasil ainda se posiciona apenas como prestadores de serviço, com alguma extensão para design. Poucos constroem uma marca de lifestyle completa, com linguagem, produtos, conteúdo e experiência. Há um espaço relevante para ir além dos projetos e ampliar a marca de forma estratégica, sem depender de uma presença massiva nas redes sociais.',
          ] },
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: 'Eixo', titulo: 'Autoridade técnica', texto: 'MK27, Arthur Casas, Isay Weinfeld.' },
            { rotulo: 'Eixo', titulo: 'Decorativa', texto: 'Mauricio Arruda, Sig Bergamin.' },
            { rotulo: 'Eixo', titulo: 'Lifestyle', texto: 'Athena Calderone, Kelly Wearstler, Priscila Muller. O Brasil ainda não tem esta categoria.' },
          ] },
          { tipo: 'destaque', texto: 'Estilo de vida contemporâneo. Construímos uma categoria, não uma posição.' },
        ],
      },
      {
        id: 'personas', titulo: 'As cinco mulheres do universo NN', pagina: 30,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: 'P01 · Cliente', titulo: 'A profissional de gosto refinado', texto: '35 a 50 anos. Diretora, consultora, dona de marca própria. Apto de R$ 2 a 4 milhões em Curitiba, SP, Floripa. Decide sozinha: Casa Nogs, Pinterest, amiga indicando. Inimigo: decoração genérica, marca que vende demais. Função: cliente real de hoje, volume principal.' },
            { rotulo: 'P02 · Cliente', titulo: 'A herdeira', texto: '38 a 55 anos. Família com fortuna, faz algo por escolha (galeria, fundação, marca própria). Vive entre SP, Lisboa, Miami. Decide rápido quando reconhece o repertório: Cabana, Wallpaper, AD. Inimigo: estética fabricada, gosto previsível. Função: ponte para o internacional.' },
            { rotulo: 'P03 · Cliente', titulo: 'A esposa que decide a casa', texto: '40 a 55 anos. Esposa de empresário de Curitiba, Joinville, Floripa. Decide a estética da casa, mesmo quando o capital não é dela. Lenta na estética, rápida no orçamento. Inimigo: casa que parece de outra pessoa. Função: maior cliente real do Sul.' },
            { rotulo: 'P04 · Comunidade', titulo: 'A profissional criativa em ascensão', texto: '28 a 40 anos. Designer, jornalista, arquiteta jovem, fotógrafa, dona de marca de moda independente. Decide por afinidade estética; compra livro, produto, imersão. Inimigo: massificado, conteúdo raso. Função: motor de receita escalável.' },
            { rotulo: 'P05 · Canal', titulo: 'A multiplicadora cultural', texto: '35 a 55 anos. Editora, jornalista de arquitetura, curadora, livreira, diretora criativa. Decide o que vira referência; cultivar com tempo. Inimigo: marca que se vende demais, estética copiada. Função: porteira da imprensa.' },
          ] },
        ],
      },
      {
        id: 'jornada-comportamento', titulo: 'Jornada de comportamento', pagina: 31,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'Desejo', texto: 'Encontra a marca por imagem editorial. Salva. Não age.' },
            { titulo: 'Reconhecimento', texto: 'Volta. Lê a Casa Nogs. Confia antes de saber por quê.' },
            { titulo: 'Conexão', texto: 'Compartilha com parceiro, amiga, curadora. Procura o site.' },
            { titulo: 'Aproximação', texto: 'Vai a evento, recebe newsletter, segue o studio.' },
            { titulo: 'Contrato', texto: 'Briefing é uma conversa. O contrato é assinado entre pares.' },
            { titulo: 'Entrega', texto: 'O projeto se torna parte da identidade dela.' },
            { titulo: 'Comunidade', texto: 'Apresenta a marca para outras três. O ciclo recomeça.' },
          ] },
        ],
      },
      {
        id: 'produtos', titulo: 'Produtos', pagina: 32,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Tronco', titulo: 'Estúdio de arquitetura', texto: 'Residências autorais e direção criativa de empreendimentos. Nome próprio. Faixa única, alta. Tudo o mais começa daqui.' },
            { rotulo: 'Canal', titulo: 'Casa Nogs', texto: 'Newsletter editorial semanal. Capital cultural gratuito. Constrói autoridade e prepara terreno.' },
            { rotulo: 'Extensão', titulo: 'Peças de edição limitada', texto: 'Uma a duas peças por ano, nascendo de projetos reais.' },
            { rotulo: 'Gota', titulo: 'Experiências e colaborações', texto: 'Jantares, pop-ups, viagens curadas, collabs com marcas de matéria. Aparições raras e desejadas.' },
          ] },
          { tipo: 'destaque', texto: 'Meu núcleo: Beleza + Bem-estar + Arquitetura + Produtos.' },
        ],
      },
      {
        id: 'estrategias', titulo: 'Estratégias', pagina: 34,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'Peça autoral como porta de entrada', texto: 'Desenvolver uma peça de design autoral e lançá-la em colaboração com outro universo, como arte, gastronomia ou moda. A peça funciona como cartão de visita cultural.' },
            { titulo: 'Produto em collab com marcas estratégicas', texto: 'Linha de tapetes com Botteh, mesa posta com Theodora Home, home spray com Trousseau.' },
            { titulo: 'Casa Nogs como capital cultural', texto: 'Plataforma de encontros, conteúdo e experiências. Influência cultural vale mais do que audiência dispersa.' },
            { titulo: 'Associação com hotelaria', texto: 'Projeto ou experiência com hotelaria de alta hospitalidade para associar o nome do studio a marcas consolidadas.' },
            { titulo: 'Plataformas de visibilidade curada', texto: 'Mostras como Artefacto, vitrines assinadas para lojas, espaços com alta percepção de marca.' },
            { titulo: 'Experiências em collab', texto: 'Junto a marcas de casa, moda, arte e wellness, conectando arquitetura a estilo de vida de forma natural.' },
          ] },
        ],
      },
      {
        id: 'territorios', titulo: 'Território de marca', pagina: 36,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Matéria', texto: 'Travertino, mármore verde, linho. Textura como narrativa. Materiais reconhecidos.' },
            { titulo: 'Silêncio', texto: 'Espaços que respiram. Comunicação que não grita. Pausa como linguagem.' },
            { titulo: 'Ritual', texto: 'Mesa posta, aroma escolhido, gesto repetido. Cotidiano elevado a cerimônia.' },
            { titulo: 'Curadoria', texto: 'Olhar que escolhe arte, design, livro, fragrância. Autoria do gosto.' },
            { titulo: 'Refúgio', texto: 'A casa como abrigo do excesso. O ateliê como contraponto à pressa.' },
          ] },
          { tipo: 'destaque', texto: 'O filtro: cada peça do estúdio precisa caber em pelo menos um destes territórios. Se não cabe, não é da marca.' },
        ],
      },
      {
        id: 'proposito', titulo: 'Propósito', pagina: 38,
        blocos: [
          { tipo: 'destaque', texto: 'Projetamos refúgios contemporâneos onde o cotidiano se torna ritual e a casa, obra.' },
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Antes', titulo: 'O excesso ganhou', texto: 'Mundo acelerado em que a casa virou cenário funcional, a vida virou agenda, o belo virou tendência. O essencial se perdeu no ruído.' },
            { rotulo: 'Agora & depois', titulo: 'Recusamos o excesso', texto: 'Cada projeto é uma decisão de subtrair. A marca não é resposta ao mercado: é alternativa a ele. Cada objeto tem propósito, cada textura convida ao toque. A luz, o silêncio e a matéria compõem um refúgio contemporâneo.' },
          ] },
        ],
      },
      {
        id: 'pilares', titulo: 'Pilares de diferenciação', pagina: 39,
        blocos: [
          { tipo: 'contraste', esquerda: 'O que somos', direita: 'O que recusamos ser', linhas: [
            ['Curadoria · autoria do gosto', 'Soma de referências, moodboard reciclado'],
            ['Materialidade · matéria-bruta com história', 'Acabamento de catálogo, imitação de natural'],
            ['Silêncio · comunicação rara, intencional', 'Postagem diária, conteúdo de volume'],
            ['Atemporalidade · décadas, não temporada', 'Tendência, coleção sazonal, renovação'],
            ['Refúgio', 'Showroom'],
          ] },
        ],
      },
      {
        id: 'comunidade', titulo: 'Comunidade', pagina: 41,
        blocos: [
          { tipo: 'cartoes', colunas: 4, itens: [
            { titulo: 'Conexão entre si', texto: 'Pessoas conectadas por um interesse comum e um modo de comunicar-se.' },
            { titulo: 'Conexão ao líder', texto: 'Não há tribo sem líder. Liderança é serviço.' },
            { titulo: 'Conexão a uma ideia', texto: 'O movimento existe em torno de algo maior do que a marca.' },
            { titulo: 'Tribo não é audiência', texto: 'Audiência consome. Tribo age junto.' },
          ] },
          { tipo: 'numerada', itens: [
            { texto: 'Toda história precisa de tensão, transformação e recompensa. Storytelling não é campanha: é sistema de transformação.' },
            { texto: 'Mito da marca. Por que ela existe, contra o que se posiciona, o que defende. Antes, agora, depois.' },
            { texto: 'Vilão nomeado. O cliente reconhece o inimigo e te escolhe por causa disso.' },
            { texto: 'Trabalho emocional. O sentimento que a marca entrega de forma consistente.' },
            { texto: 'Micro-momentos repetíveis: rituais que viram conteúdo-assinatura. As pessoas confiam no que parece vivido, não fabricado.' },
            { texto: 'Mundo de marca habitável. Códigos, paleta, frases recorrentes. Familiaridade gera memória.' },
            { texto: 'Pilares como pontos de entrada: 3 a 5 pilares que reflitam o que a marca representa e o que o público busca.' },
          ] },
        ],
      },
      {
        id: 'quatro-fases', titulo: 'As quatro fases da comunidade', pagina: 43,
        blocos: [
          { tipo: 'cartoes', colunas: 4, itens: [
            { rotulo: '01', titulo: 'Conexão', texto: 'Atração inicial por visão e estética. "Eu me identifico com isso."' },
            { rotulo: '02', titulo: 'Cultura', texto: 'Códigos, valores e linguagem comum. Nasce a identidade coletiva.' },
            { rotulo: '03', titulo: 'Troca', texto: 'Rede viva de valor, acesso e relacionamento. Networking qualificado, repertório curado.' },
            { rotulo: '04', titulo: 'Presença', texto: 'Experiências, produtos e encontros. Eventos, jantares, viagens, mentorias.' },
          ] },
          { tipo: 'destaque', texto: 'A regra: toda comunicação passa pelo filtro. Ela cria conexão, fortalece cultura, gera troca ou manifesta presença? Se nenhuma das quatro, não entra.' },
        ],
      },
    ],
  },
  {
    id: 'volume-4',
    titulo: 'Parte 04',
    subtitulo: 'Materialização',
    secoes: [
      {
        id: 'canais', titulo: 'Mix de canais', pagina: 45,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Camada I', titulo: 'Autoridade', texto: 'Site, newsletter Casa Nogs, imprensa nacional e internacional, livro. O que dura, voz editorial.' },
            { rotulo: 'Camada II', titulo: 'Presença', texto: 'Instagram (grid intencional, 2 a 3 posts por semana) e Pinterest (boards curatoriais). O que se vê alimenta desejo.' },
            { rotulo: 'Camada III', titulo: 'Intimidade', texto: 'Jantares e encontros físicos. Eventos intimistas.' },
            { rotulo: 'Fora do mix hoje', titulo: 'TikTok, YouTube, LinkedIn', texto: 'Não são canal primário.' },
          ] },
        ],
      },
      {
        id: 'ofertas', titulo: 'Arquitetura de ofertas e receita', pagina: 46,
        blocos: [
          { tipo: 'cartoes', colunas: 4, itens: [
            { titulo: 'Studio', texto: 'Projeto autoral residencial completo.' },
            { titulo: 'Direção criativa', texto: 'Mesa + gastronomia + arte.' },
            { titulo: 'Coleção', texto: '1 a 2 peças por ano em edição limitada.' },
            { titulo: 'Experiências', texto: 'Eventos em colaboração com outras marcas e pessoas.' },
          ] },
          { tipo: 'palavras', titulo: 'Oito frentes, um tronco', itens: ['Projetos de interiores', 'Produtos', 'Produtos em colaboração', 'Newsletter', 'Parceria com marcas', 'Direção criativa', 'Livros', 'Cursos'] },
          { tipo: 'cartoes', colunas: 2, itens: [
            { titulo: 'O foco', texto: 'Não é diversificar receita: é proteger o tronco enquanto a marca consolida autoridade cultural.' },
            { titulo: 'O salto', texto: 'Maximizar receita por unidade de presença pública. Preço médio sobe 3× em cinco anos.' },
          ] },
        ],
      },
      {
        id: 'plano-comunidade', titulo: 'Plano de comunidade', pagina: 49,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'Conexão', texto: 'Casa Nogs semanal: capital cultural gratuito. Mil leitoras certas valem cem mil seguidores errados.' },
            { titulo: 'Conexão', texto: 'Pinterest e Instagram em registro editorial. Não é rede social: é entrada do mundo da marca.' },
            { titulo: 'Cultura', texto: 'Vocabulário-assinatura ativo em toda comunicação: refúgio, ritual, silêncio, curadoria, matéria.' },
            { titulo: 'Cultura', texto: 'Conexões culturais.' },
            { titulo: 'Troca', texto: 'Collabs.' },
            { titulo: 'Troca', texto: 'Talks trimestral: 12 lugares, por indicação. Arquitetos, colecionadores, editores e clientes-amigos.' },
            { titulo: 'Presença', texto: 'Imersão anual em residência autoral. Três dias, seis convidadas.' },
          ] },
          { tipo: 'imagens', paginas: [50] },
        ],
      },
      {
        id: 'colaboracoes', titulo: 'Repertório de colaborações', pagina: 52,
        blocos: [
          { tipo: 'destaque', texto: 'Cada parceria é teste de postura. Só entra quem comparece no nosso registro, não no dele.' },
          { tipo: 'imagens', paginas: [52, 53] },
        ],
      },
      {
        id: 'plano-fundacao', titulo: 'Plano da fundação · 4 frentes', pagina: 55,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Frente 01', titulo: 'Curadoria editorial', texto: 'Autoridade antes de obra. Casa Nogs vira referência editorial brasileira sobre morar bem com gosto. Modelo Athena: 8 anos de blog antes da casa-flagship.' },
            { rotulo: 'Frente 02', titulo: 'Construtoras premium', texto: 'Apartamento decorado com San Remo, Laguna, Bidese: unidade-conceito coassinada. Vitrines assinadas para Botteh, Momentum.' },
            { rotulo: 'Frente 03', titulo: 'Imprensa', texto: 'Casa Vogue, Casa & Jardim, AD US, Cabana, Wallpaper, T Magazine, World of Interiors, AD France, Apartamento. 8 a 12 jornalistas cultivadas com tempo. Cliente UHNW chega via revista, não via prospecção.' },
            { rotulo: 'Frente 04', titulo: 'IP & receita escalável', texto: 'Receita por autoria, não por hora. Livro autoral, linha cápsula com marca brasileira, imersão paga anual.' },
          ] },
        ],
      },
      {
        id: 'jornada-cliente', titulo: 'Jornada do cliente de projetos', pagina: 57,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'A descoberta', texto: 'Cada post, parceria e legenda ensina o vocabulário NN. Quando ela chega, já fala nossa língua. Sem CTA agressivo. "Eu pertenceria a esse mundo."' },
            { titulo: 'A recepção', texto: 'WhatsApp respondido por pessoa treinada, em 24h, sem pressa de vender. "Estou em mãos curadas."' },
            { titulo: 'O convite', texto: 'A proposta não é PDF: é uma experiência completa. "Já foi pensada antes de eu entender."' },
            { titulo: 'O pacto', texto: 'Reunião presencial. Recebe algo do universo NN, vê materiais em mão. "Estou entrando em algo."' },
            { titulo: 'A imersão', texto: '3 horas na casa da cliente. Questionário sensorial. Moodboard físico. "Esta casa vai me parecer."' },
            { titulo: 'A curadoria contínua', texto: 'Update mensal em aplicativo, não em planilha. "Estou sendo cuidada."' },
            { titulo: 'A inauguração', texto: 'Casa entregue impecável, projeto em caixa com QR code do projeto digital. "Cheguei em casa pela primeira vez."' },
            { titulo: 'O vínculo', texto: 'Cliente vira membro do círculo NN: presentes, convites para eventos exclusivos. "Pertenço."' },
          ] },
        ],
      },
      {
        id: 'formatos', titulo: 'Formatos de conteúdo', pagina: 60,
        blocos: [
          { tipo: 'paragrafos', itens: ['Os formatos NN são curados como obra. Cada um tem função específica na economia simbólica da marca.'] },
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: '01', titulo: 'Vídeos Reels', texto: 'Profissionais e de celular.' },
            { rotulo: '02', titulo: 'Carrossel inspiração', texto: 'Capa com lettering, curadoria de referências.' },
            { rotulo: '03', titulo: 'Carrossel mix', texto: 'Vídeos e fotos juntos.' },
            { rotulo: '04', titulo: 'Projetos', texto: 'Vídeos e carrossel de portfólio.' },
            { rotulo: '05', titulo: 'Newsletter', texto: 'Curadoria Casa Nogs.' },
          ] },
          { tipo: 'imagens', paginas: [60, 61, 62, 63, 64] },
        ],
      },
      {
        id: 'o-que-postar', titulo: 'O que postar', pagina: 65,
        blocos: [
          { tipo: 'paragrafos', itens: ['Três pilares de conteúdo, com os quadros de cada um. Estes quadros estão no editor de posts: ao escolher um, o pilar e o formato vêm junto.'] },
        ],
      },
    ],
  },
]

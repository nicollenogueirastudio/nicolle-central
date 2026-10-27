// Magazine · manual da marca da revista (rascunho, out/2026). Ainda sem nome.
// Mesma estrutura do Manual da Marca NN (lib/marca/manual.ts), para a revista nascer com o mesmo rigor.
// Ela edita pela tela: as edições ficam em `magazine_manual`, por seção. `pagina: 0` = não há PDF original.

import type { Parte } from '@/lib/marca/manual'

export const NOME_PROVISORIO = 'Magazine'
export const ASSINATURA_MAGAZINE = 'O Brasil que se vive por dentro, contado com rigor.'

export const MANUAL_MAGAZINE: Parte[] = [
  {
    id: 'volume-1',
    titulo: 'Volume I',
    subtitulo: 'Manual da marca',
    secoes: [
      {
        id: 'fundamentos', titulo: 'Fundamentos', pagina: 0,
        blocos: [
          { tipo: 'destaque', texto: 'Uma plataforma editorial sobre como se vive bem: casa, mesa, matéria, lugar e objeto, a partir do Brasil e da América Latina, para quem lê o mundo.' },
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: '01', titulo: 'Missão', texto: 'Ensinar a ver. Formar o olhar de quem quer viver com mais beleza e intenção.' },
            { rotulo: '02', titulo: 'Visão', texto: 'Ser a referência editorial do viver bem latino-americano, lida dentro e fora do Brasil.' },
            { rotulo: '03', titulo: 'Foco', texto: 'Curadoria com tese, fotografia própria e texto que explica o porquê. Menos peças, cada uma definitiva.' },
          ] },
        ],
      },
      {
        id: 'a-ideia', titulo: 'A ideia', pagina: 0,
        blocos: [
          { tipo: 'paragrafos', itens: [
            'As grandes publicações de design falam do Brasil como destino, nunca de dentro. As brasileiras que chegaram longe falam de arquitetura para arquitetos, em volume. Entre as duas há um lugar vazio: a casa vivida, a mesa posta, a matéria e os objetos de uma cultura que o mundo ainda não leu com cuidado.',
            'A revista nasce para ocupar esse lugar. Não repete o que todos repostam. Escolhe pouco, fotografa bem, explica o porquê. E leva o leitor do olhar ao objeto: o que ele aprende a ver, um dia ele traz para casa.',
          ] },
        ],
      },
      {
        id: 'mensagens', titulo: 'Três mensagens', pagina: 0,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'Viver bem é uma forma de cultura.' },
            { texto: 'O olhar se educa: beleza não é sorte, é escolha.' },
            { texto: 'O Brasil tem um jeito próprio de morar, receber e fazer, e ele merece ser contado com rigor.' },
          ] },
          { tipo: 'palavras', titulo: 'Palavras-chave', itens: ['Editorial', 'Autoral', 'Latino-americano', 'Atemporal'] },
          { tipo: 'destaque', texto: ASSINATURA_MAGAZINE },
        ],
      },
      {
        id: 'valores', titulo: 'Valores inegociáveis', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 4, itens: [
            { titulo: 'Critério', texto: 'Tudo o que entra tem um porquê escrito. Sem porquê, não entra.' },
            { titulo: 'Independência', texto: 'O editorial não se vende. O que é pago aparece identificado.' },
            { titulo: 'Profundidade', texto: 'Uma matéria definitiva vale mais do que dez posts.' },
            { titulo: 'Origem', texto: 'Falamos de dentro. Brasil e América Latina como ponto de vista, não como exotismo.' },
            { titulo: 'Fotografia', texto: 'A imagem é o primeiro texto. Própria sempre que possível, creditada sempre.' },
            { titulo: 'Permanência', texto: 'Nada de tendência da semana. O que publicamos tem que valer daqui a dez anos.' },
            { titulo: 'Generosidade', texto: 'Crédito completo a quem fez: arquiteto, artesão, fotógrafo, cozinheiro.' },
            { titulo: 'Beleza', texto: 'Ver e revelar o belo com intenção, na casa, na mesa e no gesto.' },
          ] },
        ],
      },
      {
        id: 'mandamentos', titulo: '10 mandamentos editoriais', pagina: 0,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'Tese antes de imagem', texto: 'Cada matéria responde a uma pergunta. Se não há pergunta, é repost.' },
            { titulo: 'Pouco e definitivo', texto: 'Menos peças, cada uma completa.' },
            { titulo: 'Fotografia com autoria', texto: 'Luz natural, matéria visível, gente quando faz sentido.' },
            { titulo: 'Crédito completo', texto: 'Quem projetou, quem fez, quem fotografou, onde fica.' },
            { titulo: 'De dentro', texto: 'Contamos o lugar como quem mora nele.' },
            { titulo: 'Explicar o porquê', texto: 'O leitor sai sabendo ver, não só tendo visto.' },
            { titulo: 'Pago separado', texto: 'Colaboração com marca tem formato e selo próprios.' },
            { titulo: 'Sem pressa', texto: 'A frequência é parte da promessa.' },
            { titulo: 'Do olhar ao objeto', texto: 'O que a revista ensina a ver pode, um dia, ser levado para casa.' },
            { titulo: 'Atemporal', texto: 'Publicamos para o arquivo, não para o feed.' },
          ] },
        ],
      },
      {
        id: 'tom-de-voz', titulo: 'Tom de voz', pagina: 0,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'A marca fala na primeira pessoa do plural: "nós". É uma redação, não uma pessoa.' },
            { texto: 'Frases curtas, mas texto corrido. Nada de parágrafos de uma linha empilhados.' },
            { texto: 'Descrever com precisão: o nome do material, a origem da peça, a hora da luz.' },
            { texto: 'Storytelling: cena, expectativa, virada. O leitor entra pelo concreto.' },
            { texto: 'Explicar sem ensinar de cima. Mostrar o critério, nunca dar "dicas".' },
            { texto: 'Sem travessão, sem adjetivo em cascata, sem exclamação.' },
            { texto: 'Bilíngue quando a matéria for para fora: o português não se traduz literalmente, se reescreve.' },
          ] },
        ],
      },
      {
        id: 'nao-somos', titulo: 'Não somos', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Agregador', texto: 'Repostar o que todo mundo já postou, com crédito e sem ponto de vista.' },
            { titulo: 'Guia de compras', texto: 'Listas de produto, "achados", links de afiliado no lugar do texto.' },
            { titulo: 'Revista de tendência', texto: '"O que está em alta", cores do ano, a moda da estação.' },
            { titulo: 'Exótico', texto: 'O Brasil como cenário tropical para olhar estrangeiro.' },
            { titulo: 'Perfil de pessoa', texto: 'A marca não depende de um rosto. Quem aparece é o critério.' },
            { titulo: 'Técnica demais', texto: 'Ficha de arquiteto sem narrativa: área, sistema construtivo, prazo.' },
          ] },
        ],
      },
      {
        id: 'vocabulario', titulo: 'Vocabulário', pagina: 0,
        blocos: [
          { tipo: 'palavras', titulo: 'Assinatura · olhar', itens: ['critério', 'ver', 'escolha', 'tese', 'permanência'] },
          { tipo: 'palavras', titulo: 'Assinatura · viver', itens: ['casa', 'mesa', 'ritual', 'receber', 'matéria', 'luz'] },
          { tipo: 'palavras', titulo: 'Assinatura · origem', itens: ['de dentro', 'feito à mão', 'ofício', 'lugar', 'herança'] },
          { tipo: 'palavras', titulo: 'Banido · massa', banidas: true, itens: ['dicas', 'achados', 'tendência', 'must-have', 'inspo'] },
          { tipo: 'palavras', titulo: 'Banido · vendedor', banidas: true, itens: ['imperdível', 'corre', 'link na bio', 'cupom'] },
          { tipo: 'palavras', titulo: 'Banido · exótico', banidas: true, itens: ['tropical chic', 'paraíso', 'vibe brasileira'] },
        ],
      },
      {
        id: 'personalidade', titulo: 'Personalidade', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Como o leitor quer se sentir ao ler', titulo: 'Culto · Curioso · Acolhido · Com o olhar mais afiado' },
            { rotulo: 'Como a revista quer ser percebida', titulo: 'Rigorosa · Calorosa · Independente · Latino-americana' },
          ] },
        ],
      },
      {
        id: 'leitor', titulo: 'Para quem', pagina: 0,
        blocos: [
          { tipo: 'destaque', texto: 'Três públicos. O leitor dá a audiência, as marcas dão a receita, os criadores dão a matéria-prima.' },
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: 'O leitor', titulo: 'Quem vive bem e quer viver melhor', texto: '28 a 55 anos, Brasil e exterior. Profissional criativo, colecionador em formação, viajante de cultura. Lê Cereal, Cabana e Wallpaper*, salva no Pinterest, compra livro e objeto autoral.' },
            { rotulo: 'As marcas', titulo: 'Luxo e matéria', texto: 'Marcas de casa, mesa, hotelaria, moda e bebida que precisam de contexto cultural e não de alcance bruto. Pagam por colaboração editorial, não por banner.' },
            { rotulo: 'Os criadores', titulo: 'Quem faz', texto: 'Arquitetos, designers, artesãos, chefs e fotógrafos da América Latina. Ganham crédito completo e leitura internacional, sem pagar para aparecer.' },
          ] },
        ],
      },
      {
        id: 'referencias', titulo: 'Referências', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Cereal', texto: 'Fotografia própria como identidade. Anúncio feito pela casa.' },
            { titulo: 'Yatzer', texto: 'Seções com nome de capítulo. Colaboração com marcas de luxo.' },
            { titulo: 'Softer Volumes', texto: 'Livros por tipologia. Instagram como catálogo do livro.' },
            { titulo: 'The Orb', texto: 'Editorial a serviço do objeto. Casa física como experiência.' },
            { titulo: 'Architecture Hunter', texto: 'Mídia global a partir de São Paulo. Vídeo e prêmio.' },
            { titulo: 'Wallpaper*', texto: 'Prêmio e mostra anuais como calendário da indústria.' },
          ] },
          { tipo: 'destaque', texto: 'Se a Cereal tivesse nascido no Brasil e a The Orb tivesse uma redação, seríamos nós.' },
        ],
      },
    ],
  },
  {
    id: 'volume-2',
    titulo: 'Volume II',
    subtitulo: 'Estratégia editorial',
    secoes: [
      {
        id: 'territorio', titulo: 'Território', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 3, itens: [
            { titulo: 'Casa', texto: 'A casa habitada: quem mora, como usa, o que guarda.' },
            { titulo: 'Mesa', texto: 'Receber, cozinhar, a louça, o gesto de servir.' },
            { titulo: 'Matéria', texto: 'Madeira, pedra, fibra, barro. De onde vem e quem trabalha.' },
            { titulo: 'Lugar', texto: 'Cidades, hotéis, restaurantes e paisagens, contados por quem é de lá.' },
            { titulo: 'Objeto', texto: 'Peças com autoria: colecionável, artesanal, de edição.' },
          ] },
          { tipo: 'destaque', texto: 'O filtro: cada pauta cabe em pelo menos um território e responde a uma pergunta. Se não cabe, não é da revista.' },
        ],
      },
      {
        id: 'secoes', titulo: 'Seções da revista', pagina: 0,
        blocos: [
          { tipo: 'paragrafos', itens: ['Nomes de capítulo, não de categoria, como faz a Yatzer. Nomes provisórios, para decidir junto com o nome da revista.'] },
          { tipo: 'cartoes', colunas: 3, itens: [
            { rotulo: 'Casa', titulo: 'Casas habitadas', texto: 'Uma casa por edição, com quem mora nela. Fotografia própria.' },
            { rotulo: 'Mesa', titulo: 'À mesa', texto: 'Um jantar, uma cozinha, uma louça. A mesa como cultura.' },
            { rotulo: 'Matéria', titulo: 'Origem', texto: 'Um material ou ofício, do lugar de onde vem até a casa.' },
            { rotulo: 'Lugar', titulo: 'Por dentro', texto: 'Uma cidade contada por quem mora nela. Vira guia.' },
            { rotulo: 'Objeto', titulo: 'Peça com tese', texto: 'Um objeto, por que ele importa e quem o fez.' },
            { rotulo: 'Todas', titulo: 'Conversas', texto: 'Entrevista longa com quem faz: arquiteto, artesão, chef.' },
          ] },
        ],
      },
      {
        id: 'diferenciacao', titulo: 'Pilares de diferenciação', pagina: 0,
        blocos: [
          { tipo: 'contraste', esquerda: 'O que somos', direita: 'O que recusamos ser', linhas: [
            ['Curadoria com tese', 'Repost com crédito'],
            ['Fotografia própria', 'Banco de imagem de terceiros'],
            ['De dentro do Brasil', 'O Brasil como cenário exótico'],
            ['Pouco e definitivo', 'Volume diário'],
            ['Pago identificado', 'Publi disfarçada de editorial'],
            ['A marca como voz', 'A fundadora como persona'],
          ] },
        ],
      },
      {
        id: 'independencia', titulo: 'Regras de independência', pagina: 0,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'Nunca cobramos de quem é publicado.' },
            { texto: 'Colaboração com marca tem formato e selo próprios e nunca imita matéria.' },
            { texto: 'Anúncio, quando houver, é fotografado e desenhado pela casa.' },
            { texto: 'Não usamos link de afiliado dentro do texto editorial.' },
            { texto: 'A regra fica escrita no site, para o leitor e para as marcas.' },
          ] },
        ],
      },
      {
        id: 'sem-rosto', titulo: 'A marca roda sozinha', pagina: 0,
        blocos: [
          { tipo: 'destaque', texto: 'A revista não depende de um rosto. Quem aparece é o critério.' },
          { tipo: 'numerada', itens: [
            { titulo: 'Voz institucional', texto: 'A revista fala como redação, nunca como uma pessoa.' },
            { titulo: 'Critério em manual', texto: 'Este manual é o que permite outra pessoa escolher, fotografar e escrever como a casa.' },
            { titulo: 'Equipe fixa', texto: 'Editor, fotógrafo e redator com o manual na mão desde a fase 1.' },
            { titulo: 'A fundadora como empresária', texto: 'Aparece quando quiser: entrevistas, júris, palestras, livro. Como Rosa Park e Amanda Ferber.' },
          ] },
        ],
      },
      {
        id: 'canais', titulo: 'Formatos e canais', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Camada I · arquivo', titulo: 'Site e newsletter', texto: 'Onde a matéria vive inteira. A newsletter leva o leitor até ela.' },
            { rotulo: 'Camada II · vitrine', titulo: 'Instagram e Pinterest', texto: 'Grid intencional, poucos posts por semana, cada um um capítulo. Carrossel com tese, Reels de casa e de ofício.' },
            { rotulo: 'Camada III · objeto', titulo: 'Guias e livros', texto: 'PDF primeiro, impresso depois. A tipologia vira série.' },
            { rotulo: 'Camada IV · presença', titulo: 'Encontros', texto: 'Jantares, lançamentos, uma mostra ou prêmio anual quando houver nome para isso.' },
          ] },
        ],
      },
    ],
  },
  {
    id: 'volume-3',
    titulo: 'Volume III',
    subtitulo: 'Negócio',
    secoes: [
      {
        id: 'receita', titulo: 'Modelo de receita', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 4, itens: [
            { rotulo: 'Fase 1', titulo: 'Audiência e voz', texto: 'Instagram, newsletter e site. Receita pequena; o foco é critério e arquivo.' },
            { rotulo: 'Fase 2', titulo: 'O primeiro impresso', texto: 'Guia ou livro por tipologia, PDF e depois impresso.' },
            { rotulo: 'Fase 3', titulo: 'Marcas certas', texto: 'Colaborações editoriais com luxo, conteúdo produzido pela casa.' },
            { rotulo: 'Fase 4', titulo: 'Objeto e casa', texto: 'Edições de peças com designers, eventos, mostra anual.' },
          ] },
          { tipo: 'destaque', texto: 'Ninguém entre as nove referências vive de anúncio. A receita vem de colaboração, livro e objeto.' },
        ],
      },
    ],
  },
  {
    id: 'volume-4',
    titulo: 'Parte 04',
    subtitulo: 'Identidade · a definir',
    secoes: [
      {
        id: 'nome', titulo: 'O nome', pagina: 0,
        blocos: [
          { tipo: 'numerada', itens: [
            { texto: 'Funciona em português e em inglês, sem tradução.' },
            { texto: 'Curto, fácil de dizer em voz alta, de escrever e de achar no Instagram.' },
            { texto: 'Sugere olhar, casa ou origem, sem ser literal.' },
            { texto: 'Não usa o nome da fundadora: a marca roda sozinha.' },
            { texto: 'Domínio e @ disponíveis antes de qualquer decisão.' },
          ] },
        ],
      },
      {
        id: 'direcao-visual', titulo: 'Direção visual inicial', pagina: 0,
        blocos: [
          { tipo: 'cartoes', colunas: 2, itens: [
            { rotulo: 'Tipografia', titulo: 'Editorial', texto: 'Um título com presença e um corpo de leitura longa. Decidir se conversa com a JetBrains Mono do NN ou se separa as marcas.' },
            { rotulo: 'Paleta', titulo: 'Matéria brasileira', texto: 'Tons de terra, madeira, pedra e papel. Cor vem da fotografia, não do layout.' },
            { rotulo: 'Fotografia', titulo: 'Luz natural, matéria visível', texto: 'Mais quente que a Cereal, mais quieta que a Wallpaper*. Gente quando faz sentido. Nunca render.' },
            { rotulo: 'Grid', titulo: 'Arquivo, não feed', texto: 'Cada post como página de revista: capa de capítulo, imagem inteira, legenda com ficha completa.' },
          ] },
        ],
      },
      {
        id: 'decisoes', titulo: 'Decisões em aberto', pagina: 0,
        blocos: [
          { tipo: 'numerada', itens: [
            { titulo: 'Marca', texto: 'Casa Nogs crescendo ou uma terceira marca ao lado de NN e Casa Nogs?' },
            { titulo: 'Língua', texto: 'Português, inglês ou bilíngue desde o primeiro dia?' },
            { titulo: 'Território', texto: 'Começar pelos cinco ou por um só, como a Softer Volumes?' },
            { titulo: 'Equipe', texto: 'Quem fotografa e quem escreve, e quando entram.' },
            { titulo: 'Nome', texto: 'Depois das quatro acima.' },
          ] },
        ],
      },
    ],
  },
]

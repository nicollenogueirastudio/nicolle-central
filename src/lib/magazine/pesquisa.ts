// Magazine · pesquisa de mercado (out/2026) e plano da revista, ainda sem nome.
// Fonte: MAGAZINE/pesquisa-mercado.html no Drive. Imagens em /public/magazine/referencias, tiradas dos sites das marcas.

export type Marca = {
  id: string
  nome: string
  tags: string[]
  destaque?: string
  oQueE: string
  instagram: string
  oferta: string[]
  monetiza: string
  voz: string
  aprender: string
  brecha: string
  imagens: number          // quantas em /magazine/referencias/<id>/01.jpg…
  credito: string
  link: string
}

export const imagensDe = (m: Marca) =>
  Array.from({ length: m.imagens }, (_, i) => `/magazine/referencias/${m.id}/${String(i + 1).padStart(2, '0')}.jpg`)

export const MARCAS: Marca[] = [
  {
    id: 'wallpaper', nome: 'Wallpaper*', tags: ['Londres · 1996', 'Future plc', '~2M no Instagram'],
    oQueE: 'A referência institucional do design contemporâneo. Revista mensal impressa e site de notícia diária: arquitetura, design e interiores, arte, relógios e joias, moda, tecnologia, transporte, viagem, "entertaining".',
    instagram: 'Ritmo de redação: vários posts por dia, carrosséis de lançamento, cobertura ao vivo de design weeks (Milão, Design Miami Paris, PAD, Dutch Design Week, Frieze). Legenda informativa, quase jornalística. Muita autoridade, pouca intimidade.',
    oferta: ['Newsletter diária', 'Revista impressa e digital por assinatura (Magazines Direct)', 'Wallpaper* City Guides (Milão a £15) e loja própria', 'Design Awards anuais e a mostra Handmade em Milão'],
    monetiza: 'Publicidade de luxo (relógios, moda, carros), afiliado declarado no rodapé, assinaturas, guias, projetos patrocinados como o Handmade e conteúdo feito para marcas. Modelo de grupo de mídia, com escala de grupo de mídia.',
    voz: 'Travel with us to design weeks and experience refined interior design from across the globe.',
    aprender: 'Prêmio e mostra próprios como eventos que a indústria espera todo ano: um calendário que vende patrocínio sozinho.',
    brecha: 'Fala de cima, sem casa. Cobre tudo e por isso não tem intimidade. Fala do Sul global como destino, nunca de dentro.',
    imagens: 8, credito: 'wallpaper.com, matérias de design, arquitetura, arte e viagem', link: 'https://www.wallpaper.com',
  },
  {
    id: 'ah', nome: 'Architecture Hunter', tags: ['São Paulo · 2013', 'Amanda Ferber', '~3M no Instagram'], destaque: 'a mais próxima de você',
    oQueE: 'Nasceu em 2013 como o perfil pessoal de Amanda Ferber com as referências que ela guardava no celular. Em 2022 virou "a live magazine". Hoje é empresa de mídia com cerca de 15 pessoas, direção de filme própria e núcleo comercial.',
    instagram: 'Projetos com crédito completo, todo dia, em inglês, para audiência global. O forte é vídeo: tours e entrevistas com arquitetos ("Inspire through infotainment"). 30% da audiência do Instagram não é de arquitetura; no YouTube, 50%.',
    oferta: ['Prêmio próprio, com pré-inscrição com desconto', '"Get published": envio de projetos, sem custo', 'Webinars, city guide, newsletter semanal', 'Hunter International Forum e eventos', 'Pacote "How to get filmed" para escritórios'],
    monetiza: 'Branded content (o primeiro cliente foi a LG), inscrições do prêmio, eventos e produção de vídeo para marcas. Não cobra de arquitetos para publicar: "isso colocaria a credibilidade em jogo".',
    voz: 'We hunt for what needs to be seen.',
    aprender: 'A prova de que dá para construir mídia global de arquitetura a partir de São Paulo. Vídeo como motor, prêmio como produto. A fundadora aparece como empresária, não como persona do feed.',
    brecha: 'É arquitetura para arquitetos, em volume. Não fala de mesa, objeto, viver. Sotaque global, sem brasilidade nem luxo de vida.',
    imagens: 8, credito: 'architecturehunter.com, projetos publicados', link: 'https://architecturehunter.com',
  },
  {
    id: 'cereal', nome: 'Cereal', tags: ['Bath, Reino Unido · 2013', 'Rosa Park e Rich Stapleton', '~1M no Instagram'],
    oQueE: 'Revista independente de viagem e estilo feita por um casal, editora e diretor de criação. Começou trimestral e passou a semestral. A ideia original: dar "30 ou 40 páginas a um único lugar". Cerca de 27 mil exemplares em 2015, edições em coreano e chinês, mais de 40 países.',
    instagram: 'O grid mais controlado da lista: fotografia própria, paleta neutra, muito vazio, legenda curta. Posta pouco. A identidade inteira é a fotografia. Nada é repost.',
    oferta: ['Revista impressa (Cos, WHSmith de estações e aeroportos, livrarias de museu)', 'Guias de cidade: digitais em 2013, impressos depois, hoje pela Abrams (Londres, Paris, Nova York)', 'Loja com produtos e colaborações próprias', 'Newsletter'],
    monetiza: 'Venda da revista e dos guias, anúncios a partir do segundo ano (fotografados e desenhados pela própria equipe, para não quebrar o visual) e consultoria e conteúdo para marcas, a parte que mais sustenta.',
    voz: 'We\'re not just throwing ads in there and we haven\'t sold our soul to the devil… yet!',
    aprender: 'Estética reconhecível sem uma palavra, só fotografia. Anúncio feito pela casa protege a revista. O guia nasceu de pedido de leitor.',
    brecha: 'O minimalismo nórdico-britânico virou clichê; a frieza é a marca. Sem calor, mesa, cor. O site atual é fraco.',
    imagens: 8, credito: 'readcereal.com, imagens das matérias', link: 'https://readcereal.com',
  },
  {
    id: 'ignant', nome: 'Ignant', tags: ['Berlim · 2007', '~915K no Instagram', '10 mil posts'],
    oQueE: 'Revista online premiada de arte, design, fotografia, arquitetura e viagem. Seleção diária de trabalhos de terceiros, com conversas, studio visits e editor\'s picks.',
    instagram: 'Curadoria visual pura: 10 mil posts, 2 perfis seguidos. Imagem forte, crédito do autor, pouca legenda. Feed de galeria, sem rosto nem opinião.',
    oferta: ['Seções Design, Architecture, Photography, Art e Travel (Sleep, Eat, Art, Culture, Shop)', 'Newsletter', 'Ignant Production: sites e conteúdo para marcas', 'Objetos próprios pontuais (pallet MAR, aroma com AOIRO)'],
    monetiza: 'Matérias "Sponsored" com marcas (Ruinart, Futurium) e o braço de produção para marcas. Objetos próprios esporádicos. Sem media kit público.',
    voz: 'We are passionate about bringing you a curated selection of the most captivating work.',
    aprender: 'Taxonomia de seções que deixa navegar 18 anos de arquivo. O estúdio de produção monetiza o olho do editor. Roda sem rosto.',
    brecha: 'Agregador elegante. Sem tese e sem produto, qualquer perfil novo de curadoria disputa o mesmo espaço.',
    imagens: 8, credito: 'ignant.com, home e arquitetura', link: 'https://www.ignant.com',
  },
  {
    id: 'yatzer', nome: 'Yatzer', tags: ['Atenas · 2006', 'Costas Voyatzis'], destaque: 'modelo de luxo mais próximo',
    oQueE: 'Publicação de design e estilo de vida fundada por um designer de interiores. "Live Beautifully. Explore Endlessly." Seções com nome de capítulo: Soulful Dwellings, Memorable Stays, Culinary Chronicles, Beautiful Things, Bar Aesthetics, Page-turners, Travel Guides.',
    instagram: 'Casas, hotéis e restaurantes de luz quente, muito Mediterrâneo. Mais acolhedor que a Wallpaper*. Seguidores não confirmados.',
    oferta: ['Editorial longo e guias de cidade', 'Newsletter', 'Yatzerlab (2020): estúdio de design, identidade e storytelling', 'Eventos coassinados com marcas'],
    monetiza: '"Editorial Collaboration" com BMW, Bulgari, Dom Pérignon, Louis Vuitton, Mercedes-Benz, Panerai, Van Cleef & Arpels, Loro Piana: conteúdo sob medida, edições limitadas, eventos. Diz ter crescido "sem publicidade, sem investimento externo, sem palavra-chave paga".',
    voz: 'Yatzer continues to explore the many ways design shapes our lives.',
    aprender: 'Seções com nome de capítulo, não de categoria. Um designer de interiores vendendo o próprio gosto a marcas de luxo, com o estúdio como segunda receita. A marca fala, não o fundador.',
    brecha: 'Tom um tanto publicitário, elogia tudo, sem tese. Sem produto físico.',
    imagens: 6, credito: 'yatzer.com, home', link: 'https://www.yatzer.com',
  },
  {
    id: 'softer', nome: 'Softer Volumes', tags: ['Sydney', 'Joe Vuong', '~311K no Instagram'],
    oQueE: '"Purposeful contemporary design and travel publication." Curadoria de espaços (cafés, bares, hotéis) e objetos, com galerias de hotéis e de objetos no site. Um critério: o lugar tem que fazer parar.',
    instagram: 'Cada post é um espaço, com estúdio, cidade e fotógrafo creditados. Muito volume, mas coerente. O feed é também vitrine dos livros: restock, nova capa, novo volume. Cerca de 10 milhões de pessoas veem o trabalho por mês.',
    oferta: ['Livros: Cafes Vol. 01 e 02, Bars Vol. 01, Hotels Vol. 01 a AUD 130 (~R$ 450)', 'Versão PDF a AUD 49', 'Guias de cidade em PDF a AUD 29 (Bangkok, Tóquio, Madri, Seul, Copenhague, Bali, Berlim)', 'Caderno nōto'],
    monetiza: 'Livros e guias, mais conteúdo nativo para marcas (media kit sob pedido). Não aceita editorial pago e já recusou várias propostas.',
    voz: 'Our curation is our endorsement.',
    aprender: 'Um critério e uma série de livros por tipologia. O Instagram vira catálogo do livro. Guia em PDF: baixo custo, boa margem.',
    brecha: 'Só espaço comercial. Não entra na casa, na mesa, na rotina. Texto quase inexistente.',
    imagens: 8, credito: 'softervolumes.com e loja: livros, guias e espaços', link: 'https://softervolumes.com',
  },
  {
    id: 'vestigare', nome: 'Vestigare Architecture', tags: ['Barueri, SP', 'Luiza Garcia Giurni', '~220K no Instagram'],
    oQueE: 'Perfil de curadoria de arquitetura que é também agência de comunicação para arquitetos (Vestigare Agency). Diz ter passado de 50 mil seguidores em cinco meses e alcançado mais de 3,5 milhões de contas.',
    instagram: 'Repost com ficha fixa na legenda: "_designed by: _project: _local: _photograph:". Limpo, reconhecível, escalável e impessoal.',
    oferta: ['Assessoria de mídia e PR para escritórios', 'Comunicação estratégica e redes', 'Coletivo de arquitetas jovens (ArchDaily, 2025)'],
    monetiza: 'Serviço B2B para arquitetos. O perfil é a vitrine que prova o alcance; a agência fatura. Sem preços públicos.',
    voz: 'We are not merely publicists; we are digital architects for design professionals.',
    aprender: 'Audiência como prova de serviço. A ficha técnica fixa vira assinatura visual.',
    brecha: 'Quem publica também vende serviço ao publicado: conflito de interesse. Sem voz própria. O site encontrado fala em hospedagem e telecom, o que confunde.',
    imagens: 0, credito: 'sem imagens: só existe no Instagram, que bloqueia o download', link: 'https://www.instagram.com/vestigare_/',
  },
  {
    id: 'orb', nome: 'The Orb', tags: ['Lisboa', 'Alejandra Albarrán'], destaque: 'modelo de casa + objeto',
    oQueE: '"A design house where new work begins." Casa de design colecionável, online e física, em Santos, Lisboa. A casa abre no outono de 2026 com galeria, salão de chá OGATA, sala de escuta In Orbit e SABO Room.',
    instagram: '"Objects. People. Stories." Cada post é uma peça ou um designer, fotografados como editorial. O objeto é personagem, com a história de quem fez. Volume baixo, cuidado alto.',
    oferta: ['Loja: objetos, luminárias, louça e livros', 'Original Works e Orb Editions, com os designers representados, em pequena tiragem', 'Projetos de interiores e direção criativa', 'Programa trade para arquitetos', 'Journal: entrevistas, studio visits, guias'],
    monetiza: 'Venda de peças, edições próprias, trade e projetos. O journal não vende anúncio: existe para dar contexto e valor ao objeto.',
    voz: 'Pieces made by The Orb × the designers we represent, in small numbers.',
    aprender: 'O editorial a serviço do objeto. Edição própria com designers. A casa física como experiência: chá, música, galeria.',
    brecha: 'Alcance pequeno, texto contido. Depende de quem já entende o colecionável; não forma leitor novo.',
    imagens: 8, credito: 'the-orb.com: peças, Orb Editions e designers representados', link: 'https://the-orb.com',
  },
  {
    id: 'oblist', nome: 'The Oblist', tags: ['Paris · 2023', 'Leia e Gary Sfez', '350+ marcas · 80+ países'],
    oQueE: 'Marketplace de mobiliário, luz, arte, louça e colecionáveis, contemporâneos e vintage, a maioria sob encomenda, com app. Leia Sfez é figura da moda parisiense (~1M de seguidores próprios); Gary cuida do marketing.',
    instagram: 'Peça em ambiente, Reels de produto, campanha ("Excess Baggage", nos EUA) e a fundadora como rosto. O mais comercial da lista: cada post leva à compra.',
    oferta: ['Peças de US$ 450 a US$ 66 mil+ (mesa SOLUM, lustre HALO)', 'Private Preview, Gift Edit, curadoria mensal', 'Serviço de interiores, trade, afiliados', 'Editorial de guias e entrevistas com artistas'],
    monetiza: 'Margem e comissão sobre a venda, trade e serviço de curadoria. O editorial tem cara de SEO.',
    voz: 'Surround yourself with pieces that inspire you.',
    aprender: 'Encomenda em vez de estoque; app como canal próprio. Ao contrário: a confiança depende do rosto da fundadora, e isso é o que a sua marca evita.',
    brecha: 'Editorial raso, feito para Google. Curadoria larga demais para ter tese. Nenhum design brasileiro ou latino.',
    imagens: 8, credito: 'oblist.com, peças à venda', link: 'https://oblist.com',
  },
]

export const SINTESE = [
  { titulo: 'Ninguém vive de anúncio', texto: 'Banner é residual. As de mídia pura vivem de branded content (Architecture Hunter, Yatzer, Ignant, Softer Volumes). As que têm margem vendem objeto ou livro (The Orb, Oblist, Cereal, Softer Volumes).' },
  { titulo: 'Curadoria virou commodity', texto: 'Ignant, Vestigare e Architecture Hunter repostam projetos de terceiros com crédito: qualquer um faz. O que não se copia é fotografia própria (Cereal) e ponto de vista com tese.' },
  { titulo: 'O impresso dá autoridade', texto: 'Livros da Softer Volumes a AUD 130, guias da Cereal e da Wallpaper*. O objeto físico transforma um perfil de Instagram em editora.' },
  { titulo: 'A mídia está virando casa', texto: 'The Orb abre casa em Lisboa com galeria, chá e sala de escuta. Yatzer criou o Yatzerlab. Oblist tem app e serviço de interiores. O editorial virou porta de entrada de uma marca de vida.' },
  { titulo: 'Credibilidade é o ativo', texto: 'Architecture Hunter não cobra de arquitetos. Softer Volumes recusa editorial pago. Yatzer se diz construída sem publicidade. No topo, pago e editorial ficam separados, e isso é dito em voz alta.' },
  { titulo: 'A marca é a protagonista', texto: 'Cereal, Ignant, Wallpaper*, Softer Volumes e Vestigare rodam sem rosto: quem aparece é o critério. Fundadores surgem em entrevistas, podcasts e júris, como empresários. Só a Oblist depende da fundadora. É o modelo que você quer.' },
]

export const FONTES_RECEITA = ['Branded content', 'Publicidade · afiliado', 'Revista impressa', 'Livros · guias', 'Loja · peças', 'Estúdio · agência', 'Eventos · prêmios', 'Trade · interiores'] as const
// 2 = fonte central, 1 = secundária ou pontual, 0 = não encontrado. Mesma ordem de FONTES_RECEITA.
export const RECEITA: Record<string, number[]> = {
  wallpaper: [2, 2, 2, 2, 1, 2, 2, 0],
  ah: [2, 1, 0, 1, 0, 2, 2, 0],
  cereal: [2, 2, 2, 2, 1, 2, 0, 0],
  ignant: [2, 1, 0, 0, 1, 2, 0, 0],
  yatzer: [2, 0, 0, 1, 0, 2, 2, 0],
  softer: [2, 0, 0, 2, 1, 0, 0, 0],
  vestigare: [1, 0, 0, 0, 0, 2, 0, 0],
  orb: [0, 0, 0, 1, 2, 2, 1, 2],
  oblist: [0, 1, 0, 0, 2, 0, 0, 2],
}

// O que cada uma publica, por canal. Leitura dos sites (seções, menus) e dos feeds, out/2026.
export const TIPOS_CONTEUDO = [
  { id: 'arquitetura', nome: 'Arquitetura' },
  { id: 'interiores', nome: 'Casas e interiores' },
  { id: 'objetos', nome: 'Objetos e design' },
  { id: 'arte', nome: 'Arte' },
  { id: 'fotografia', nome: 'Fotografia autoral' },
  { id: 'viagem', nome: 'Viagem e city guides' },
  { id: 'hotelaria', nome: 'Hotéis e hospitalidade' },
  { id: 'mesa', nome: 'Gastronomia e mesa' },
  { id: 'moda', nome: 'Moda, joias e estilo' },
  { id: 'conversas', nome: 'Entrevistas e perfis' },
  { id: 'bastidores', nome: 'Studio visits e bastidores' },
  { id: 'agenda', nome: 'Notícias, feiras e lançamentos' },
  { id: 'eventos', nome: 'Prêmios e eventos próprios' },
  { id: 'video', nome: 'Vídeo (tours, Reels)' },
  { id: 'loja', nome: 'Produto à venda' },
  { id: 'proprios', nome: 'Livros e publicações próprias' },
] as const
export type TipoConteudo = (typeof TIPOS_CONTEUDO)[number]['id']
export type Canal = 'ig' | 'site' | 'ambos'

export const CONTEUDO: Record<string, Partial<Record<TipoConteudo, Canal>>> = {
  wallpaper: { arquitetura: 'ambos', interiores: 'ambos', objetos: 'ambos', arte: 'ambos', viagem: 'ambos', hotelaria: 'ambos', mesa: 'site', moda: 'ambos', conversas: 'site', agenda: 'ambos', eventos: 'ambos', video: 'ig', loja: 'site', proprios: 'site' },
  ah: { arquitetura: 'ambos', interiores: 'ambos', viagem: 'site', conversas: 'ambos', bastidores: 'ig', agenda: 'ambos', eventos: 'ambos', video: 'ambos' },
  cereal: { arquitetura: 'ambos', interiores: 'ambos', objetos: 'ambos', arte: 'site', fotografia: 'ambos', viagem: 'ambos', hotelaria: 'ambos', mesa: 'ambos', moda: 'site', conversas: 'site', loja: 'site', proprios: 'ambos' },
  ignant: { arquitetura: 'ambos', interiores: 'ambos', objetos: 'ambos', arte: 'ambos', fotografia: 'ambos', viagem: 'site', hotelaria: 'site', mesa: 'site', conversas: 'site', bastidores: 'site' },
  yatzer: { arquitetura: 'ambos', interiores: 'ambos', objetos: 'site', arte: 'site', viagem: 'site', hotelaria: 'ambos', mesa: 'ambos', moda: 'site', conversas: 'site', eventos: 'site' },
  softer: { arquitetura: 'ambos', interiores: 'ambos', objetos: 'ambos', viagem: 'ambos', hotelaria: 'ambos', mesa: 'ambos', loja: 'ambos', proprios: 'ambos' },
  vestigare: { arquitetura: 'ig', interiores: 'ig' },
  orb: { arquitetura: 'site', interiores: 'ambos', objetos: 'ambos', arte: 'ig', viagem: 'site', mesa: 'site', conversas: 'ambos', bastidores: 'ambos', agenda: 'ambos', loja: 'ambos', proprios: 'site' },
  oblist: { interiores: 'ambos', objetos: 'ambos', arte: 'ambos', mesa: 'site', conversas: 'site', video: 'ig', loja: 'ambos' },
}

// A revista, como proposta: onde entra desde o início e o que vem nas fases seguintes.
export const CONTEUDO_PROPOSTA: Partial<Record<TipoConteudo, Canal | 'depois'>> = {
  arquitetura: 'ambos', interiores: 'ambos', objetos: 'ambos', arte: 'site', fotografia: 'ambos', viagem: 'ambos', hotelaria: 'ambos',
  mesa: 'ambos', conversas: 'ambos', bastidores: 'ambos', video: 'ig', eventos: 'depois', loja: 'depois', proprios: 'depois',
}

// Mapa: x de 0 (mídia) a 100 (comércio); y de 0 (lifestyle) a 100 (arquitetura profissional).
export const MAPA: Record<string, { x: number; y: number }> = {
  ah: { x: 16, y: 82 }, vestigare: { x: 28, y: 90 }, wallpaper: { x: 22, y: 58 }, ignant: { x: 14, y: 38 },
  yatzer: { x: 24, y: 24 }, cereal: { x: 42, y: 15 }, softer: { x: 40, y: 30 }, orb: { x: 84, y: 58 }, oblist: { x: 86, y: 22 },
}

export const BRECHAS = [
  { titulo: 'Uma voz de marca com ofício por trás', texto: 'Cereal mostra, Ignant seleciona, Wallpaper* noticia: nenhuma explica o porquê das coisas. A marca pode falar com o critério de quem projeta casas há 12 anos, sem que você precise aparecer, e ensinar a ver. Para rodar sozinha, esse critério vira manual. Você aparece quando quiser, como empresária.' },
  { titulo: 'O Brasil e a América Latina vistos de dentro, em chave de luxo', texto: 'Architecture Hunter e Vestigare são brasileiras, mas falam de arquitetura para profissionais, com sotaque global. Ninguém leva casa, mesa, objeto, artesania e hospitalidade brasileiras ao leitor internacional com o rigor de Cereal ou Yatzer. Território livre.' },
  { titulo: 'A casa vivida, não só o espaço fotografado', texto: 'Softer Volumes fica em cafés e hotéis; a Wallpaper*, no lançamento. Quase ninguém entra na rotina: a mesa posta, o objeto herdado, como a escolha muda a forma de viver.' },
  { titulo: 'Do editorial ao objeto, com tese', texto: 'The Orb e Oblist vendem objeto: uma tem pouco alcance, a outra não tem tese. Formar o olhar primeiro e depois editar peças (de designers brasileiros, colecionáveis, suas) une o melhor dos dois.' },
  { titulo: 'Separar o pago do editorial, publicamente', texto: 'As melhores dizem isso em voz alta. Começar com essa regra escrita no site. Coerente com o filtro de luxo e protege o valor do que a revista recomenda.' },
  { titulo: 'Profundidade em vez de volume', texto: 'Architecture Hunter, Ignant e Softer Volumes ganharam no volume, o que exige equipe e não diferencia. O caminho que combina com frequência baixa é o da Cereal: menos posts, cada um definitivo.' },
]

export const CAMINHO = [
  { fase: 'Fase 1 · audiência e voz', texto: 'Instagram com linha editorial fechada e fotografia própria, mais newsletter e site enxuto. Receita pequena: projetos que a vitrine atrai, como na Vestigare, mas sem conflito.' },
  { fase: 'Fase 2 · o primeiro impresso', texto: 'Um guia ou livro por tipologia, no modelo Softer Volumes (casas brasileiras, mesas brasileiras). Primeiro PDF, depois impresso. É o produto que dá autoridade.' },
  { fase: 'Fase 3 · marcas, poucas e certas', texto: 'Colaborações editoriais com marcas de luxo, como a Yatzer, com anúncios produzidos pela casa, como a Cereal. O pago aparece identificado.' },
  { fase: 'Fase 4 · objeto e casa', texto: 'Edições de peças com designers, como as Orb Editions, depois eventos ou espaço físico. Um prêmio ou mostra anual vira calendário fixo.' },
]

export const DECIDIR = [
  { titulo: 'Casa Nogs crescendo ou marca nova?', texto: 'A estratégia de outubro trata a Casa Nogs como guarda-chuva do lifestyle. A revista pode ser essa marca em escala, ou uma terceira marca ao lado de NN e Casa Nogs.' },
  { titulo: 'Em que língua?', texto: 'Só português limita o alcance; só inglês apaga a brasilidade, que é a brecha principal. Bilíngue custa mais, mas é o que a posição pede.' },
  { titulo: 'Qual é o território?', texto: 'Arquitetura, casa vivida, mesa, viagem, objeto. Quanto mais estreito, mais rápido vira referência: a Softer Volumes cresceu com uma tipologia.' },
  { titulo: 'Quem fotografa e quem escreve?', texto: 'Se o negócio roda sem você, fotografia e texto precisam de gente fixa e de um manual de critério desde o início. Decidir entre fotógrafo próprio e imagem cedida com crédito.' },
]

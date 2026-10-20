// Estratégia de conteúdo do Manual da Marca, em forma de regras que o editor usa.
// Arquivo puro: sem banco, sem tela.

import type { Pilar, Tipo } from './tipos'

// "O que postar": os quadros (séries editoriais) de cada pilar.
export type Quadro = { id: string; nome: string; pilar: Pilar; tipo: Tipo; formato: string; descricao: string }

export const QUADROS: Quadro[] = [
  // Conexão & comunidade
  { id: 'mesa-de-domingo', nome: 'Mesa de domingo', pilar: 'conexao', tipo: 'carrossel', formato: 'Carrossel mix', descricao: 'Mesa posta em casa, na sua mesa. Ritual recorrente, sempre seu.' },
  { id: 'carta-da-nicolle', nome: 'Carta da Nicolle', pilar: 'conexao', tipo: 'carrossel', formato: 'Carrossel texto', descricao: 'Texto curto e autoral sobre algo que viu, leu ou pensou. Voz de fundadora.' },
  { id: 'convidada-do-mes', nome: 'Convidada do mês', pilar: 'conexao', tipo: 'carrossel', formato: 'Carrossel mix', descricao: 'Retrato editorial de uma mulher do universo NN: artista, editora, cliente. Curadoria, não repost.' },
  { id: 'o-salao', nome: 'O Salão', pilar: 'conexao', tipo: 'carrossel', formato: 'Carrossel mix + reel', descricao: 'Registro editorial dos encontros NN. Mesa, conversa, atmosfera. Sem rosto de quem não consentiu.' },
  { id: 'a-casa-por-dentro', nome: 'A casa por dentro', pilar: 'conexao', tipo: 'reels', formato: 'Reel autoral', descricao: 'Tour autoral por um cômodo de projeto entregue, com sua leitura sobre as escolhas.' },
  { id: 'diario-de-viagem', nome: 'Diário de viagem', pilar: 'conexao', tipo: 'reels', formato: 'Reel / vídeo', descricao: 'Hotel em que ficou, museu visitado, ateliê descoberto. Olhar treinado em movimento.' },
  { id: 'chamada-casa-nogs', nome: 'Chamada Casa Nogs', pilar: 'conexao', tipo: 'feed', formato: 'Frase editorial + foto calma', descricao: 'Convite para a edição da semana. Uma frase, nenhum apelo.' },
  // Autoridade
  { id: 'projeto-entregue', nome: 'Projeto entregue', pilar: 'autoridade', tipo: 'carrossel', formato: 'Portfólio carrossel', descricao: 'Ensaio fotográfico sério do projeto novo. No máximo 1 a cada 4 a 6 semanas.' },
  { id: 'video-de-processo', nome: 'Vídeo de processo', pilar: 'autoridade', tipo: 'reels', formato: 'Portfólio vídeo', descricao: 'Sequência da obra: do canteiro ao detalhe final.' },
  { id: 'materia-em-revista', nome: 'Matéria em revista', pilar: 'autoridade', tipo: 'carrossel', formato: 'Carrossel mix', descricao: 'Capa, página ou citação em veículo sério. Repost com cuidado.' },
  { id: 'antes-e-depois', nome: 'Antes & depois', pilar: 'autoridade', tipo: 'carrossel', formato: 'Portfólio carrossel + vídeo', descricao: 'Transformação de ambiente em registro editorial sério.' },
  { id: 'detalhe-assinatura', nome: 'Detalhe assinatura', pilar: 'autoridade', tipo: 'carrossel', formato: 'Portfólio carrossel', descricao: 'Solução autoral repetida em projetos, que vira marca-d’água.' },
  { id: 'parceria-flagship', nome: 'Parceria-flagship', pilar: 'autoridade', tipo: 'reels', formato: 'Portfólio + reel', descricao: 'Branded apartment, vitrine, cápsula. Anuncia categoria.' },
  // Curadoria & cultura
  { id: 'referencia-internacional', nome: 'Referência internacional', pilar: 'curadoria', tipo: 'carrossel', formato: 'Inspiração capa + lettering', descricao: 'Cabana, Apartamento, Yovanovitch: capa, lettering, leitura crítica.' },
  { id: 'compilado-tematico', nome: 'Compilado temático', pilar: 'curadoria', tipo: 'carrossel', formato: 'Inspiração compilado', descricao: '4 a 6 imagens com tema: mármore raro, palha brasileira, sofás autorais.' },
  { id: 'casa-que-admiramos', nome: 'Casa que admiramos', pilar: 'curadoria', tipo: 'carrossel', formato: 'Carrossel mix', descricao: 'Visita autoral a projeto de outro escritório brasileiro, com generosidade.' },
  { id: 'livro-do-mes', nome: 'Livro do mês', pilar: 'curadoria', tipo: 'carrossel', formato: 'Inspiração capa + lettering', descricao: 'Bachelard, Wharton, Lina, Cabana: foto, citação e leitura curta.' },
  { id: 'viagem-como-repertorio', nome: 'Viagem como repertório', pilar: 'curadoria', tipo: 'carrossel', formato: 'Carrossel mix + reel', descricao: 'Hotel, museu, ateliê visitado: ensaio editado por gosto.' },
  { id: 'materia-prima-rara', nome: 'Matéria-prima rara', pilar: 'curadoria', tipo: 'reels', formato: 'Reel / vídeo', descricao: 'Visita ao marmorista, alfaiate, ceramista. Bastidor cultural.' },
]

export const quadroPorId = (id: string | null | undefined) => QUADROS.find((q) => q.id === id) ?? null

// Filtro das 4 fases: se a peça não faz nenhuma das quatro, não entra.
export const FASES = {
  conexao: { nome: 'Conexão', pergunta: 'Cria conexão?' },
  cultura: { nome: 'Cultura', pergunta: 'Fortalece cultura?' },
  troca: { nome: 'Troca', pergunta: 'Gera troca?' },
  presenca: { nome: 'Presença', pergunta: 'Manifesta presença?' },
} as const
export type Fase = keyof typeof FASES

// Cinco territórios: cada peça precisa caber em pelo menos um.
export const TERRITORIOS = {
  materia: 'Matéria',
  silencio: 'Silêncio',
  ritual: 'Ritual',
  curadoria: 'Curadoria',
  refugio: 'Refúgio',
} as const
export type Territorio = keyof typeof TERRITORIOS

// Ritmo do mix de canais: Instagram com grid intencional, 2 a 3 posts por semana.
export const RITMO_SEMANA = { minimo: 2, maximo: 3 }

const BANIDAS = [
  'para todos', 'simples e fácil', 'você merece', 'rotina estressante',
  'ative agora', 'invista hoje', 'sua casa dos sonhos', 'casa dos sonhos',
  'dicas', 'dica', 'passo a passo', 'tendência', 'tendências', 'solução', 'soluções', 'luxo acessível',
  'imperdível', 'corre', 'promoção', 'link na bio',
]
const ASSINATURA = [
  'refúgio', 'ritual', 'silêncio', 'curadoria', 'matéria', 'pausa', 'obra', 'íntimo', 'atemporal',
  'gesto', 'cuidado', 'luz', 'permanência', 'escolha', 'lar', 'hóspede',
]

const normalizar = (t: string) => t.toLowerCase().normalize('NFC')
const contem = (texto: string, termo: string) =>
  new RegExp(`(^|[^\\p{L}])${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u').test(texto)

/** Leitura da legenda pela voz da marca: palavras banidas, vocabulário-assinatura e tamanho das frases. */
export function lerVoz(legenda: string | null | undefined) {
  const texto = normalizar(legenda ?? '')
  const banidas = BANIDAS.filter((b) => contem(texto, b))
  const assinatura = ASSINATURA.filter((a) => contem(texto, a))
  const frases = texto.split(/[.!?…]+/).map((f) => f.trim()).filter(Boolean)
  const longas = frases.filter((f) => f.split(/\s+/).length > 28).length
  const exclamacoes = (legenda?.match(/!/g) ?? []).length
  return { banidas, assinatura, frases: frases.length, longas, exclamacoes }
}

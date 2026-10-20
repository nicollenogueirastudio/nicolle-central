// Estratégia de Stories, segunda a domingo: um tema por dia (texto da Nicolle, out/2026).
// O roteiro de cada dia (tabela stories_roteiros) parte das ideias do tema do dia.

export type DiaStories = {
  dow: number          // 1 = segunda ... 7 = domingo
  dia: string
  tema: string
  objetivo: string
  ideias: string[]
  frases?: string[]
  quadros?: string[]
  mostrar?: string[]
  evitar?: string[]
  sensacao?: string
}

export const SEMANA_STORIES: DiaStories[] = [
  {
    dow: 1, dia: 'Segunda', tema: 'Visão criativa', objetivo: 'Liderança estética e direção',
    ideias: ['Referência arquitetônica', 'Moodboard', 'Livro ou revista', 'Pesquisa de materiais', 'Render parcial', 'Frase sobre morar, estética ou proporção', 'Detalhe elegante de projeto'],
    frases: ['Tenho pensado muito em espaços mais silenciosos visualmente.', 'Boa arquitetura muda a forma como a casa é sentida.', 'Proporção quase sempre importa mais que excesso.'],
  },
  {
    dow: 2, dia: 'Terça', tema: 'Processo', objetivo: 'Profundidade e sofisticação técnica',
    ideias: ['Planta aberta na mesa', 'Compatibilização', 'Amostras de tecidos, pedras e madeira', 'Reunião técnica', 'Detalhes construtivos', 'Croquis', 'Escolhas de acabamento'],
    mostrar: ['Precisão', 'Cuidado', 'Intenção'],
    evitar: ['Excesso de explicação', 'Reclamações', 'Caos'],
  },
  {
    dow: 3, dia: 'Quarta', tema: 'Repertório', objetivo: 'Mostrar visão cultural e estética',
    ideias: ['Arquitetura internacional', 'Hotel interessante', 'Design brasileiro', 'Obras de arte', 'Mobiliário', 'Fotografia', 'Livro da semana', 'Referência histórica'],
    quadros: ['Referência da semana', 'Detalhe perfeito', 'Casa que fiquei pensando'],
  },
  {
    dow: 4, dia: 'Quinta', tema: 'Obra', objetivo: 'Segurança e autoridade',
    ideias: ['Visita em obra', 'Marcenaria', 'Escolha de pedras', 'Iluminação', 'Fornecedores', 'Detalhes executivos', 'Acompanhamento técnico'],
    mostrar: ['Controle', 'Clareza', 'Direção'],
    evitar: ['“Correria”', 'Estresse', 'Desorganização'],
  },
  {
    dow: 5, dia: 'Sexta', tema: 'Lifestyle', objetivo: 'Atmosfera sofisticada sem exposição pessoal',
    ideias: ['Mesa de reunião', 'Café em ambiente elegante', 'Flores', 'Livros', 'Texturas', 'Música ambiente', 'Objetos', 'Bastidores discretos', 'Hotel ou restaurante pela estética'],
    sensacao: 'Vida cercada de beleza. Não transformar em “minha rotina pessoal”.',
  },
  {
    dow: 6, dia: 'Sábado', tema: 'Curadoria', objetivo: 'Posicionamento de gosto',
    ideias: ['Lugares bonitos', 'Restaurantes pela arquitetura', 'Hotéis', 'Objetos', 'Peças de design', 'Materiais', 'Destinos', 'Arquitetos', 'Paisagismo', 'Detalhes interessantes'],
    frases: ['Uma iluminação que me chamou atenção.', 'Textura natural muito bem usada.', 'Um espaço que entende escala.'],
  },
  {
    dow: 7, dia: 'Domingo', tema: 'Respiro', objetivo: 'Sofisticação calma',
    ideias: ['Luz natural', 'Paisagem', 'Leitura', 'Ambiente silencioso', 'Arquitetura minimal', 'Detalhes de casa', 'Reflexão curta'],
    frases: ['Casas também precisam de pausa.', 'Sofisticação quase sempre está no equilíbrio.', 'Espaços bons desaceleram o olhar.'],
  },
]

export const FREQUENCIA = { minimo: 5, maximo: 12 }

export const REGRAS = {
  visual: ['Pouco texto', 'Vídeos lentos', 'Sem poluição visual', 'Boa iluminação', 'Tipografia limpa'],
  sensacao: ['Curadoria', 'Discrição', 'Repertório', 'Elegância natural', 'Segurança silenciosa'],
  evitar: ['Excesso de selfie', 'Reclamações', 'Mostrar cansaço', 'Ostentação explícita', 'Falar demais', 'Muitos stories seguidos falando', 'Vida íntima excessiva', 'Tentar provar status'],
  luxo: ['Consistência', 'Edição', 'Repertório', 'Calma', 'Bom gosto', 'Precisão', 'Atmosfera', 'Intenção estética'],
}

/** Como uma agência monta a sequência do dia: começo, meio e fim, nunca stories soltos. */
export const SEQUENCIA = [
  { nome: 'Abertura', texto: 'Uma imagem forte do tema do dia, sem texto ou com uma linha só.' },
  { nome: 'Desenvolvimento', texto: '3 a 8 frames: o detalhe, o material, o processo. Vídeo lento, som ambiente.' },
  { nome: 'Fechamento', texto: 'Uma frase sua, ou o caminho para o post do feed ou a Casa Nogs.' },
]

/** O tema de um dia (data ISO). */
export function temaDoDia(diaISO: string): DiaStories {
  const dow = new Date(diaISO + 'T12:00:00Z').getUTCDay() // 0 = domingo
  return SEMANA_STORIES[(dow + 6) % 7]
}

export type Frame = { id: string; texto: string; feito: boolean }
export type Roteiro = { dia: string; frames: Frame[]; notas: string | null }

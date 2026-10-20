import type { Pilar, Status } from '@/lib/posts/tipos'

// Paleta das ferramentas internas: taupe + oliva, sem vermelho.
export const corPilar: Record<Pilar, string> = {
  autoridade: 'bg-charcoal',
  conexao: 'bg-accent',
  curadoria: 'bg-olive',
}

// Selos de status em forma de pílula, tons suaves.
export const estiloStatus: Record<Status, string> = {
  ideia: 'bg-black/[0.05] text-muted',
  rascunho: 'bg-accent/10 text-accent',
  aprovacao: 'bg-gold/20 text-accent',
  ajuste: 'bg-[#8C6B3F]/15 text-[#8C6B3F]',
  agendado: 'bg-olive/[0.12] text-olive',
  publicando: 'bg-gold/15 text-accent',
  postado: 'bg-charcoal text-white',
  erro: 'bg-gold/20 text-charcoal',
  verificar: 'bg-gold/20 text-charcoal',
}

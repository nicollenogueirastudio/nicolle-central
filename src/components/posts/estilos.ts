import type { Pilar, Status } from '@/lib/posts/tipos'

// Paleta das ferramentas internas: taupe + oliva, sem vermelho.
export const corPilar: Record<Pilar, string> = {
  autoridade: 'bg-charcoal',
  conexao: 'bg-accent',
  curadoria: 'bg-olive',
}

export const estiloStatus: Record<Status, string> = {
  ideia: 'border border-dashed border-muted/50 text-muted',
  rascunho: 'bg-warm-beige text-charcoal',
  agendado: 'bg-olive text-cream',
  publicando: 'bg-gold/30 text-charcoal',
  postado: 'bg-dark text-cream',
  erro: 'border border-gold text-charcoal bg-gold/10',
  verificar: 'border border-gold text-charcoal bg-gold/10',
}

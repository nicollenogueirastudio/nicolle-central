'use client'

import { Bell, Search, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-4xl text-charcoal">{title}</h1>
        {subtitle && (
          <p className="text-muted mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <span className="font-mono text-xs text-muted capitalize">{today}</span>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted hover:text-charcoal transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-muted hover:text-charcoal transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></span>
          </button>
          <button className="w-10 h-10 bg-dark text-cream rounded-full flex items-center justify-center font-display text-lg">
            N
          </button>
        </div>
      </div>
    </header>
  )
}

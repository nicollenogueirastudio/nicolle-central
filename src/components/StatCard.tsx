import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: LucideIcon
  highlight?: boolean
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  highlight = false 
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-500',
    neutral: 'text-muted'
  }

  return (
    <div 
      className={`
        p-6 border transition-all card-hover
        ${highlight 
          ? 'bg-dark text-cream border-dark' 
          : 'bg-soft-white border-black/5'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <span 
          className={`
            font-mono text-[10px] tracking-[0.15em] uppercase
            ${highlight ? 'text-gold' : 'text-accent'}
          `}
        >
          {title}
        </span>
        {Icon && (
          <Icon 
            size={20} 
            className={highlight ? 'text-gold/50' : 'text-warm-beige'} 
          />
        )}
      </div>
      
      <div 
        className={`
          font-display text-4xl mb-2
          ${highlight ? 'text-gold' : 'text-charcoal'}
        `}
      >
        {value}
      </div>
      
      {change && (
        <span className={`text-xs ${changeColors[changeType]}`}>
          {change}
        </span>
      )}
    </div>
  )
}

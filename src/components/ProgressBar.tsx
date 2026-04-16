interface ProgressBarProps {
  label: string
  value: number
  max?: number
  showPercent?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ProgressBar({ 
  label, 
  value, 
  max = 100, 
  showPercent = true,
  size = 'md'
}: ProgressBarProps) {
  const percent = Math.round((value / max) * 100)
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-charcoal">{label}</span>
        {showPercent && (
          <span className="font-mono text-xs text-gold">{percent}%</span>
        )}
      </div>
      <div className={`w-full bg-warm-beige rounded-full overflow-hidden ${heights[size]}`}>
        <div 
          className={`bg-gold rounded-full progress-bar ${heights[size]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

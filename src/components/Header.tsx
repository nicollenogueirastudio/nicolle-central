'use client'

import { dataExtensoBR } from '@/lib/datas'

interface HeaderProps {
  title: string
  subtitle?: React.ReactNode
}

export default function Header({ title, subtitle }: HeaderProps) {
  const today = dataExtensoBR(new Date())

  return (
    <header className="flex items-end justify-between mb-8">
      <div>
        <p className="text-[13px] text-muted mb-1 first-letter:uppercase" suppressHydrationWarning>{today}</p>
        <h1 className="font-display text-[34px] leading-tight text-charcoal">{title}</h1>
        {subtitle && (typeof subtitle === 'string' ? <p className="text-[15px] text-muted mt-0.5">{subtitle}</p> : <div className="mt-1">{subtitle}</div>)}
      </div>
    </header>
  )
}

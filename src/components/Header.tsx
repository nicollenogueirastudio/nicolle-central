'use client'

import { dataExtensoBR } from '@/lib/datas'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const today = dataExtensoBR(new Date())

  return (
    <header className="flex items-end justify-between mb-8">
      <div>
        <p className="text-[13px] text-muted mb-1 first-letter:uppercase" suppressHydrationWarning>{today}</p>
        <h1 className="font-display text-[34px] leading-tight text-charcoal">{title}</h1>
        {subtitle && <p className="text-[15px] text-muted mt-0.5">{subtitle}</p>}
      </div>
    </header>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Central Estratégica | Nicolle Nogueira Studio',
  description: 'Planejamento, Marketing e Performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

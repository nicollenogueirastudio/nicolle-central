'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Target,
  CalendarDays,
  BarChart3,
  Mail,
  Link2,
  Gem,
  LogOut,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutGrid,
  },
  {
    name: 'Planejamento',
    href: '/planejamento',
    icon: Target,
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: CalendarDays,
    submenu: [
      { name: 'Calendário de posts', href: '/marketing' },
      { name: 'Lançamentos', href: '/marketing/lancamentos' },
    ]
  },
  {
    name: 'Marca',
    href: '/marca',
    icon: Gem,
    submenu: [
      { name: 'Identidade visual', href: '/marca' },
      { name: 'Manual da marca', href: '/marca/manual' },
    ]
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: BarChart3,
  },
  {
    name: 'Newsletter',
    href: '/newsletter',
    icon: Mail,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const ativo = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'))

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 flex flex-col border-r border-linha bg-[#F0EFEC]/80 backdrop-blur-2xl backdrop-saturate-150">
      {/* Marca */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-dark text-white flex items-center justify-center text-[15px] font-semibold tracking-tight shadow-controle">
            N
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-charcoal tracking-tight">Central</div>
            <div className="text-[11px] text-muted">Nicolle Nogueira Studio</div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive = ativo(item.href)
          const Icon = item.icon

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors duration-150
                  ${isActive ? 'bg-black/[0.07] text-charcoal font-medium' : 'text-charcoal/80 hover:bg-black/[0.04]'}`}
              >
                <Icon size={16} strokeWidth={1.8} className={isActive ? 'text-accent' : 'text-muted'} />
                <span>{item.name}</span>
              </Link>

              {item.submenu && isActive && item.submenu.length > 1 && (
                <div className="mt-0.5 mb-1.5 space-y-0.5">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.name}
                      href={subitem.href}
                      className={`block pl-[38px] pr-2.5 py-[5px] rounded-lg text-[12.5px] transition-colors
                        ${pathname === subitem.href ? 'text-charcoal font-medium' : 'text-muted hover:text-charcoal'}`}
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-4 border-t border-linha space-y-0.5">
        <Link
          href="/configuracoes"
          className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors
            ${ativo('/configuracoes') ? 'bg-black/[0.07] text-charcoal font-medium' : 'text-charcoal/80 hover:bg-black/[0.04]'}`}
        >
          <Link2 size={16} strokeWidth={1.8} className="text-muted" />
          <span>Conexões</span>
        </Link>
        <form action="/auth/sair" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-charcoal/80 hover:bg-black/[0.04] transition-colors"
          >
            <LogOut size={16} strokeWidth={1.8} className="text-muted" />
            <span>Sair</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

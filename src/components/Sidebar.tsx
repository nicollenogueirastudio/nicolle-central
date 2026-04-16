'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Target, 
  Megaphone, 
  BarChart3, 
  Mail,
  Settings,
  ChevronRight
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Planejamento Estratégico',
    href: '/planejamento',
    icon: Target,
    submenu: [
      { name: 'Visão 3 Anos', href: '/planejamento/visao' },
      { name: 'Metas', href: '/planejamento/metas' },
      { name: 'Revisão', href: '/planejamento/revisao' },
    ]
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
    submenu: [
      { name: 'Calendário Editorial', href: '/marketing/calendario' },
      { name: 'Pilares de Conteúdo', href: '/marketing/pilares' },
      { name: 'Campanhas', href: '/marketing/campanhas' },
      { name: 'Banco de Ideias', href: '/marketing/ideias' },
    ]
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: BarChart3,
    submenu: [
      { name: 'Visão Geral', href: '/performance' },
      { name: 'Instagram', href: '/performance/instagram' },
      { name: 'YouTube', href: '/performance/youtube' },
      { name: 'Pinterest', href: '/performance/pinterest' },
      { name: 'TikTok', href: '/performance/tiktok' },
    ]
  },
  {
    name: 'Newsletter',
    href: '/newsletter',
    icon: Mail,
    submenu: [
      { name: 'Edições', href: '/newsletter/edicoes' },
      { name: 'Referências', href: '/newsletter/referencias' },
      { name: 'Curadoria', href: '/newsletter/curadoria' },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark text-cream flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
          Nicolle Nogueira Studio
        </div>
        <h1 className="font-display text-xl">Central Estratégica</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <div key={item.name} className="mb-2">
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-6 py-3 text-sm transition-all
                  ${isActive 
                    ? 'bg-white/10 text-gold border-r-2 border-gold' 
                    : 'text-warm-beige hover:bg-white/5 hover:text-cream'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
                {item.submenu && (
                  <ChevronRight 
                    size={14} 
                    className={`ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`}
                  />
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && isActive && (
                <div className="ml-9 mt-1 border-l border-white/10">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.name}
                      href={subitem.href}
                      className={`
                        block px-4 py-2 text-xs transition-all
                        ${pathname === subitem.href 
                          ? 'text-gold' 
                          : 'text-muted hover:text-cream'
                        }
                      `}
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

      {/* Settings */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 px-2 py-2 text-sm text-muted hover:text-cream transition-all"
        >
          <Settings size={18} />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  )
}

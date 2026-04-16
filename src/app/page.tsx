'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StatCard from '@/components/StatCard'
import ProgressBar from '@/components/ProgressBar'
import { 
  Target, 
  Users, 
  Eye, 
  TrendingUp,
  Instagram,
  Youtube,
  Mail,
  ArrowUpRight,
  CheckCircle2,
  Circle
} from 'lucide-react'

// Dados mockados - depois vêm do Supabase
const stats = {
  metasConcluidas: 12,
  metasTotal: 40,
  seguidoresTotal: '45.2K',
  alcanceMes: '320K',
  crescimento: '+12.4%'
}

const proximasMetas = [
  { id: 1, texto: 'Finalizar manual de marca', prazo: 'Esta semana', concluida: false },
  { id: 2, texto: 'Lançar newsletter #1', prazo: 'Jun 2025', concluida: false },
  { id: 3, texto: 'Submeter Concurso Deca', prazo: 'Jun 2025', concluida: false },
  { id: 4, texto: 'Criar banco de 20 posts', prazo: 'Jul 2025', concluida: false },
]

const redesSociais = [
  { nome: 'Instagram', seguidores: '42.1K', crescimento: '+2.3%', icon: Instagram, cor: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { nome: 'YouTube', seguidores: '1.2K', crescimento: '+15.7%', icon: Youtube, cor: 'bg-red-600' },
  { nome: 'Newsletter', seguidores: '890', crescimento: '+8.2%', icon: Mail, cor: 'bg-amber-600' },
]

export default function Dashboard() {
  const progressoGeral = Math.round((stats.metasConcluidas / stats.metasTotal) * 100)

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Dashboard" 
          subtitle="Visão geral do seu progresso e performance"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Progresso Geral"
            value={`${progressoGeral}%`}
            change={`${stats.metasConcluidas} de ${stats.metasTotal} metas`}
            icon={Target}
            highlight
          />
          <StatCard
            title="Seguidores Total"
            value={stats.seguidoresTotal}
            change={stats.crescimento}
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Alcance do Mês"
            value={stats.alcanceMes}
            change="+18% vs mês anterior"
            changeType="positive"
            icon={Eye}
          />
          <StatCard
            title="Engajamento"
            value="4.8%"
            change="Acima da média"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Coluna 1: Progresso Estratégico */}
          <div className="col-span-2">
            <div className="bg-soft-white border border-black/5 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">Progresso por Pilar</h2>
                <a href="/planejamento/metas" className="text-xs text-accent hover:text-gold flex items-center gap-1">
                  Ver todas <ArrowUpRight size={14} />
                </a>
              </div>
              
              <ProgressBar label="Autoridade" value={35} />
              <ProgressBar label="Visibilidade" value={20} />
              <ProgressBar label="Diversificação" value={15} />
              <ProgressBar label="Estrutura" value={45} />
            </div>

            {/* Próximas Metas */}
            <div className="bg-soft-white border border-black/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">Próximas Metas</h2>
                <a href="/planejamento/metas" className="text-xs text-accent hover:text-gold flex items-center gap-1">
                  Ver todas <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="space-y-4">
                {proximasMetas.map((meta) => (
                  <div 
                    key={meta.id}
                    className="flex items-center gap-4 p-4 bg-cream/50 hover:bg-cream transition-colors cursor-pointer"
                  >
                    {meta.concluida ? (
                      <CheckCircle2 size={20} className="text-gold" />
                    ) : (
                      <Circle size={20} className="text-warm-beige" />
                    )}
                    <span className="flex-1 text-sm">{meta.texto}</span>
                    <span className="font-mono text-xs text-muted">{meta.prazo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 2: Redes Sociais */}
          <div>
            <div className="bg-dark text-cream p-6 mb-6">
              <h2 className="font-display text-2xl mb-6">Performance das Redes</h2>
              
              <div className="space-y-4">
                {redesSociais.map((rede) => {
                  const Icon = rede.icon
                  return (
                    <div 
                      key={rede.nome}
                      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className={`w-10 h-10 ${rede.cor} flex items-center justify-center rounded`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{rede.nome}</div>
                        <div className="font-display text-xl text-gold">{rede.seguidores}</div>
                      </div>
                      <span className="text-xs text-green-400">{rede.crescimento}</span>
                    </div>
                  )
                })}
              </div>

              <a 
                href="/performance" 
                className="block mt-6 text-center text-xs text-gold hover:text-warm-beige transition-colors"
              >
                Ver análise completa →
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-soft-white border border-black/5 p-6">
              <h2 className="font-display text-2xl mb-4">Casa NOGS</h2>
              <p className="text-sm text-muted mb-4">Última edição publicada há 5 dias</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-cream">
                  <div className="font-display text-2xl text-charcoal">68%</div>
                  <div className="text-xs text-muted">Taxa de abertura</div>
                </div>
                <div className="text-center p-3 bg-cream">
                  <div className="font-display text-2xl text-charcoal">12%</div>
                  <div className="text-xs text-muted">Taxa de cliques</div>
                </div>
              </div>

              <a 
                href="/newsletter" 
                className="block text-center text-xs text-accent hover:text-gold transition-colors"
              >
                Gerenciar newsletter →
              </a>
            </div>
          </div>
        </div>

        {/* Calendário resumido */}
        <div className="mt-8 bg-soft-white border border-black/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">Próximos Posts</h2>
            <a href="/marketing/calendario" className="text-xs text-accent hover:text-gold flex items-center gap-1">
              Abrir calendário <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, i) => (
              <div key={dia} className="text-center">
                <div className="font-mono text-xs text-muted mb-2">{dia}</div>
                <div className={`
                  h-24 border border-dashed 
                  ${i === 0 ? 'border-gold bg-gold/5' : 'border-warm-beige'}
                  flex items-center justify-center
                `}>
                  {i === 0 && (
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded mx-auto mb-1"></div>
                      <span className="text-[10px] text-muted">Instagram</span>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-600 rounded mx-auto mb-1"></div>
                      <span className="text-[10px] text-muted">YouTube</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

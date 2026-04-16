'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StatCard from '@/components/StatCard'
import { 
  Instagram, 
  Youtube, 
  Mail,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Clock,
  MousePointer,
  ArrowUpRight
} from 'lucide-react'

// Dados mockados - depois virão das APIs
const metricas = {
  instagram: {
    seguidores: 42100,
    crescimento: 2.3,
    alcance: 156000,
    impressoes: 245000,
    engajamento: 4.8,
    curtidas: 12500,
    comentarios: 890,
    compartilhamentos: 456,
    salvamentos: 2100,
    melhorPost: {
      tipo: 'Carrossel',
      titulo: 'Tour projeto Jardins',
      alcance: 45000,
      engajamento: 8.2
    },
    melhorHorario: '18:00 - 20:00',
    melhorDia: 'Terça-feira'
  },
  youtube: {
    inscritos: 1240,
    crescimento: 15.7,
    visualizacoes: 28000,
    horasAssistidas: 1200,
    ctr: 5.2,
    retencao: 45,
    melhorVideo: {
      titulo: 'Como criar ambientes acolhedores',
      views: 8500,
      retencao: 52
    }
  },
  pinterest: {
    seguidores: 3200,
    crescimento: 8.4,
    impressoes: 89000,
    cliques: 4500,
    salvamentos: 2300,
    melhorPin: {
      titulo: 'Paleta de cores neutras',
      impressoes: 12000,
      salvamentos: 450
    }
  },
  newsletter: {
    assinantes: 890,
    crescimento: 12.1,
    taxaAbertura: 68,
    taxaCliques: 12,
    ultimaEdicao: {
      titulo: 'Casa NOGS #3',
      abertura: 72,
      cliques: 15
    }
  }
}

type Rede = 'geral' | 'instagram' | 'youtube' | 'pinterest' | 'newsletter'

const redesConfig = {
  instagram: { icon: Instagram, cor: 'from-purple-500 to-pink-500', nome: 'Instagram' },
  youtube: { icon: Youtube, cor: 'from-red-600 to-red-500', nome: 'YouTube' },
  pinterest: { icon: () => <span>📌</span>, cor: 'from-red-700 to-red-600', nome: 'Pinterest' },
  newsletter: { icon: Mail, cor: 'from-amber-600 to-amber-500', nome: 'Newsletter' },
}

export default function PerformancePage() {
  const [redeAtiva, setRedeAtiva] = useState<Rede>('geral')

  const totalSeguidores = 
    metricas.instagram.seguidores + 
    metricas.youtube.inscritos + 
    metricas.pinterest.seguidores + 
    metricas.newsletter.assinantes

  const crescimentoMedio = (
    metricas.instagram.crescimento + 
    metricas.youtube.crescimento + 
    metricas.pinterest.crescimento + 
    metricas.newsletter.crescimento
  ) / 4

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Performance" 
          subtitle="Análise completa das suas redes sociais"
        />

        {/* Tabs de Redes */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setRedeAtiva('geral')}
            className={`
              px-6 py-3 text-sm font-medium transition-all
              ${redeAtiva === 'geral' 
                ? 'bg-dark text-cream' 
                : 'bg-soft-white border border-black/5 hover:bg-warm-beige/50'
              }
            `}
          >
            Visão Geral
          </button>
          {Object.entries(redesConfig).map(([key, config]) => {
            const Icon = config.icon
            return (
              <button
                key={key}
                onClick={() => setRedeAtiva(key as Rede)}
                className={`
                  px-6 py-3 text-sm font-medium transition-all flex items-center gap-2
                  ${redeAtiva === key 
                    ? `bg-gradient-to-r ${config.cor} text-white` 
                    : 'bg-soft-white border border-black/5 hover:bg-warm-beige/50'
                  }
                `}
              >
                {typeof Icon === 'function' && Icon.toString().includes('span') ? (
                  <Icon />
                ) : (
                  <Icon size={16} />
                )}
                {config.nome}
              </button>
            )
          })}
        </div>

        {/* Visão Geral */}
        {redeAtiva === 'geral' && (
          <>
            {/* Stats principais */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Audiência Total"
                value={`${(totalSeguidores / 1000).toFixed(1)}K`}
                change={`+${crescimentoMedio.toFixed(1)}% este mês`}
                changeType="positive"
                icon={Users}
                highlight
              />
              <StatCard
                title="Alcance Mensal"
                value="320K"
                change="+18% vs mês anterior"
                changeType="positive"
                icon={Eye}
              />
              <StatCard
                title="Engajamento Médio"
                value="4.8%"
                change="Acima da média do setor"
                changeType="positive"
                icon={Heart}
              />
              <StatCard
                title="Taxa de Crescimento"
                value={`${crescimentoMedio.toFixed(1)}%`}
                change="Média mensal"
                changeType="positive"
                icon={TrendingUp}
              />
            </div>

            {/* Cards por rede */}
            <div className="grid grid-cols-2 gap-6">
              {/* Instagram */}
              <div className="bg-soft-white border border-black/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Instagram size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl">Instagram</h3>
                      <p className="text-xs text-muted">@nicollenogueiraestudio</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRedeAtiva('instagram')}
                    className="text-xs text-accent hover:text-gold flex items-center gap-1"
                  >
                    Ver detalhes <ArrowUpRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{(metricas.instagram.seguidores / 1000).toFixed(1)}K</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Seguidores</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{metricas.instagram.engajamento}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Engajamento</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl text-green-600">+{metricas.instagram.crescimento}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Crescimento</div>
                  </div>
                </div>

                <div className="text-xs text-muted">
                  Melhor horário: <span className="text-charcoal">{metricas.instagram.melhorHorario}</span> · 
                  Melhor dia: <span className="text-charcoal">{metricas.instagram.melhorDia}</span>
                </div>
              </div>

              {/* YouTube */}
              <div className="bg-soft-white border border-black/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <Youtube size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl">YouTube</h3>
                      <p className="text-xs text-muted">Nicolle Nogueira</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRedeAtiva('youtube')}
                    className="text-xs text-accent hover:text-gold flex items-center gap-1"
                  >
                    Ver detalhes <ArrowUpRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{(metricas.youtube.inscritos / 1000).toFixed(1)}K</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Inscritos</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{metricas.youtube.retencao}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Retenção</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl text-green-600">+{metricas.youtube.crescimento}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Crescimento</div>
                  </div>
                </div>

                <div className="text-xs text-muted">
                  {metricas.youtube.horasAssistidas.toLocaleString()} horas assistidas este mês
                </div>
              </div>

              {/* Pinterest */}
              <div className="bg-soft-white border border-black/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center text-2xl">
                      📌
                    </div>
                    <div>
                      <h3 className="font-display text-xl">Pinterest</h3>
                      <p className="text-xs text-muted">nicollenogueiraestudio</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRedeAtiva('pinterest')}
                    className="text-xs text-accent hover:text-gold flex items-center gap-1"
                  >
                    Ver detalhes <ArrowUpRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{(metricas.pinterest.seguidores / 1000).toFixed(1)}K</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Seguidores</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{(metricas.pinterest.impressoes / 1000).toFixed(0)}K</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Impressões</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl text-green-600">+{metricas.pinterest.crescimento}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Crescimento</div>
                  </div>
                </div>

                <div className="text-xs text-muted">
                  {metricas.pinterest.salvamentos.toLocaleString()} salvamentos este mês
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-soft-white border border-black/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                      <Mail size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl">Casa NOGS</h3>
                      <p className="text-xs text-muted">Newsletter no Substack</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRedeAtiva('newsletter')}
                    className="text-xs text-accent hover:text-gold flex items-center gap-1"
                  >
                    Ver detalhes <ArrowUpRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{metricas.newsletter.assinantes}</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Assinantes</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl">{metricas.newsletter.taxaAbertura}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Abertura</div>
                  </div>
                  <div className="text-center p-3 bg-cream rounded">
                    <div className="font-display text-2xl text-green-600">+{metricas.newsletter.crescimento}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">Crescimento</div>
                  </div>
                </div>

                <div className="text-xs text-muted">
                  Taxa de cliques: <span className="text-charcoal">{metricas.newsletter.taxaCliques}%</span> (acima da média)
                </div>
              </div>
            </div>
          </>
        )}

        {/* Instagram Detalhado */}
        {redeAtiva === 'instagram' && (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Instagram size={40} />
                <div>
                  <h2 className="font-display text-3xl">Instagram</h2>
                  <p className="opacity-80">@nicollenogueiraestudio</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-6">
                <div>
                  <div className="font-display text-4xl">{(metricas.instagram.seguidores / 1000).toFixed(1)}K</div>
                  <div className="text-sm opacity-80">Seguidores</div>
                </div>
                <div>
                  <div className="font-display text-4xl">{metricas.instagram.engajamento}%</div>
                  <div className="text-sm opacity-80">Engajamento</div>
                </div>
                <div>
                  <div className="font-display text-4xl">{(metricas.instagram.alcance / 1000).toFixed(0)}K</div>
                  <div className="text-sm opacity-80">Alcance</div>
                </div>
                <div>
                  <div className="font-display text-4xl">{(metricas.instagram.impressoes / 1000).toFixed(0)}K</div>
                  <div className="text-sm opacity-80">Impressões</div>
                </div>
                <div>
                  <div className="font-display text-4xl text-green-300">+{metricas.instagram.crescimento}%</div>
                  <div className="text-sm opacity-80">Crescimento</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <Heart size={24} className="mx-auto mb-3 text-pink-500" />
                <div className="font-display text-3xl">{(metricas.instagram.curtidas / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted">Curtidas</div>
              </div>
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <MessageCircle size={24} className="mx-auto mb-3 text-blue-500" />
                <div className="font-display text-3xl">{metricas.instagram.comentarios}</div>
                <div className="text-xs text-muted">Comentários</div>
              </div>
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <Share2 size={24} className="mx-auto mb-3 text-green-500" />
                <div className="font-display text-3xl">{metricas.instagram.compartilhamentos}</div>
                <div className="text-xs text-muted">Compartilhamentos</div>
              </div>
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <svg className="w-6 h-6 mx-auto mb-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <div className="font-display text-3xl">{(metricas.instagram.salvamentos / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted">Salvamentos</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-soft-white border border-black/5 p-6">
                <h3 className="font-display text-xl mb-4">Melhor Post do Mês</h3>
                <div className="bg-cream p-4 rounded">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 bg-warm-beige rounded"></div>
                    <div>
                      <p className="font-medium">{metricas.instagram.melhorPost.titulo}</p>
                      <p className="text-xs text-muted">{metricas.instagram.melhorPost.tipo}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span><strong>{(metricas.instagram.melhorPost.alcance / 1000).toFixed(0)}K</strong> alcance</span>
                    <span><strong>{metricas.instagram.melhorPost.engajamento}%</strong> engajamento</span>
                  </div>
                </div>
              </div>

              <div className="bg-soft-white border border-black/5 p-6">
                <h3 className="font-display text-xl mb-4">Insights de Publicação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Melhor horário</span>
                    <span className="font-mono text-sm">{metricas.instagram.melhorHorario}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Melhor dia</span>
                    <span className="font-mono text-sm">{metricas.instagram.melhorDia}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Formato que mais engaja</span>
                    <span className="font-mono text-sm">Carrossel</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* YouTube Detalhado */}
        {redeAtiva === 'youtube' && (
          <>
            <div className="bg-red-600 text-white p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Youtube size={40} />
                <div>
                  <h2 className="font-display text-3xl">YouTube</h2>
                  <p className="opacity-80">Nicolle Nogueira</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-6">
                <div>
                  <div className="font-display text-4xl">{(metricas.youtube.inscritos / 1000).toFixed(1)}K</div>
                  <div className="text-sm opacity-80">Inscritos</div>
                </div>
                <div>
                  <div className="font-display text-4xl">{(metricas.youtube.visualizacoes / 1000).toFixed(0)}K</div>
                  <div className="text-sm opacity-80">Visualizações</div>
                </div>
                <div>
                  <div className="font-display text-4xl">{metricas.youtube.horasAssistidas}</div>
                  <div className="text-sm opacity-80">Horas assistidas</div>
                </div>
                <div>
                  <div className="font-display text-4xl">{metricas.youtube.retencao}%</div>
                  <div className="text-sm opacity-80">Retenção média</div>
                </div>
                <div>
                  <div className="font-display text-4xl text-green-300">+{metricas.youtube.crescimento}%</div>
                  <div className="text-sm opacity-80">Crescimento</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <Play size={24} className="mx-auto mb-3 text-red-500" />
                <div className="font-display text-3xl">{(metricas.youtube.visualizacoes / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted">Visualizações</div>
              </div>
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <Clock size={24} className="mx-auto mb-3 text-blue-500" />
                <div className="font-display text-3xl">{metricas.youtube.horasAssistidas}h</div>
                <div className="text-xs text-muted">Tempo de exibição</div>
              </div>
              <div className="bg-soft-white border border-black/5 p-6 text-center">
                <MousePointer size={24} className="mx-auto mb-3 text-green-500" />
                <div className="font-display text-3xl">{metricas.youtube.ctr}%</div>
                <div className="text-xs text-muted">CTR médio</div>
              </div>
            </div>
          </>
        )}

        {/* Pinterest e Newsletter seguem o mesmo padrão */}
        {(redeAtiva === 'pinterest' || redeAtiva === 'newsletter') && (
          <div className="bg-soft-white border border-black/5 p-8 text-center">
            <p className="text-muted">Detalhes de {redeAtiva === 'pinterest' ? 'Pinterest' : 'Newsletter'} em desenvolvimento...</p>
          </div>
        )}
      </main>
    </div>
  )
}

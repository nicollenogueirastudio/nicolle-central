'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { 
  Instagram, 
  Youtube, 
  Mail,
  Plus,
  ChevronLeft,
  ChevronRight,
  Image,
  Video,
  FileText,
  MoreVertical
} from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Ícones das redes
const redesIcons = {
  instagram: Instagram,
  youtube: Youtube,
  pinterest: () => <span className="text-lg">📌</span>,
  tiktok: () => <span className="text-lg">🎵</span>,
  newsletter: Mail,
}

const redesCores = {
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
  youtube: 'bg-red-600',
  pinterest: 'bg-red-700',
  tiktok: 'bg-black',
  newsletter: 'bg-amber-600',
}

type Post = {
  id: string
  rede: keyof typeof redesIcons
  tipo: 'imagem' | 'video' | 'carrossel' | 'texto'
  titulo: string
  legenda?: string
  data: Date
  horario: string
  status: 'rascunho' | 'agendado' | 'publicado'
}

const postsIniciais: Post[] = [
  {
    id: '1',
    rede: 'instagram',
    tipo: 'carrossel',
    titulo: 'Tour pelo projeto Jardins',
    legenda: 'Um espaço onde cada detalhe foi pensado para criar sensação de acolhimento...',
    data: new Date(),
    horario: '18:00',
    status: 'agendado'
  },
  {
    id: '2',
    rede: 'youtube',
    tipo: 'video',
    titulo: 'Como escolher o piso ideal',
    data: addDays(new Date(), 2),
    horario: '10:00',
    status: 'rascunho'
  },
  {
    id: '3',
    rede: 'newsletter',
    tipo: 'texto',
    titulo: 'Casa NOGS #4 - O poder do silêncio',
    data: addDays(new Date(), 4),
    horario: '08:00',
    status: 'agendado'
  },
]

const pilares = [
  { id: 'bastidores', nome: 'Bastidores', cor: 'bg-blue-100 text-blue-800' },
  { id: 'educacao', nome: 'Educação', cor: 'bg-green-100 text-green-800' },
  { id: 'inspiracao', nome: 'Inspiração', cor: 'bg-purple-100 text-purple-800' },
  { id: 'lifestyle', nome: 'Lifestyle', cor: 'bg-amber-100 text-amber-800' },
  { id: 'portfolio', nome: 'Portfólio', cor: 'bg-pink-100 text-pink-800' },
]

export default function MarketingPage() {
  const [posts] = useState<Post[]>(postsIniciais)
  const [semanaAtual, setSemanaAtual] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [redeAtiva, setRedeAtiva] = useState<string | null>(null)

  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(semanaAtual, i))

  const getPostsDia = (data: Date) => {
    return posts.filter(p => 
      format(p.data, 'yyyy-MM-dd') === format(data, 'yyyy-MM-dd') &&
      (!redeAtiva || p.rede === redeAtiva)
    )
  }

  const tipoIcons = {
    imagem: Image,
    video: Video,
    carrossel: Image,
    texto: FileText,
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Marketing" 
          subtitle="Calendário editorial e planejamento de conteúdo"
        />

        {/* Pilares de Conteúdo */}
        <div className="bg-soft-white border border-black/5 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Pilares de Conteúdo</h2>
            <button className="text-xs text-accent hover:text-gold">Editar pilares</button>
          </div>
          <div className="flex gap-3">
            {pilares.map(pilar => (
              <div 
                key={pilar.id}
                className={`px-4 py-2 text-xs font-medium rounded ${pilar.cor}`}
              >
                {pilar.nome}
              </div>
            ))}
          </div>
        </div>

        {/* Filtro de Redes */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-muted">Filtrar por rede:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setRedeAtiva(null)}
              className={`
                px-4 py-2 text-xs font-medium transition-all
                ${!redeAtiva ? 'bg-dark text-cream' : 'bg-warm-beige/50 hover:bg-warm-beige'}
              `}
            >
              Todas
            </button>
            {Object.entries(redesIcons).map(([key, Icon]) => (
              <button
                key={key}
                onClick={() => setRedeAtiva(redeAtiva === key ? null : key)}
                className={`
                  w-10 h-10 flex items-center justify-center transition-all rounded
                  ${redeAtiva === key 
                    ? redesCores[key as keyof typeof redesCores] + ' text-white' 
                    : 'bg-warm-beige/50 hover:bg-warm-beige'
                  }
                `}
              >
                {typeof Icon === 'function' && Icon.toString().includes('span') ? (
                  <Icon />
                ) : (
                  <Icon size={18} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Calendário Semanal */}
        <div className="bg-soft-white border border-black/5">
          {/* Header do Calendário */}
          <div className="flex items-center justify-between p-4 border-b border-warm-beige/30">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSemanaAtual(subWeeks(semanaAtual, 1))}
                className="p-2 hover:bg-warm-beige/50 rounded transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-display text-xl">
                {format(semanaAtual, "MMMM 'de' yyyy", { locale: ptBR })}
              </h2>
              <button 
                onClick={() => setSemanaAtual(addWeeks(semanaAtual, 1))}
                className="p-2 hover:bg-warm-beige/50 rounded transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={16} />
              Novo Post
            </button>
          </div>

          {/* Grid dos Dias */}
          <div className="grid grid-cols-7">
            {diasSemana.map((dia, index) => {
              const postsDia = getPostsDia(dia)
              const isHoje = format(dia, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              
              return (
                <div 
                  key={index}
                  className={`
                    min-h-[200px] border-r border-b border-warm-beige/30 last:border-r-0
                    ${isHoje ? 'bg-gold/5' : ''}
                  `}
                >
                  {/* Cabeçalho do dia */}
                  <div className={`
                    p-3 text-center border-b border-warm-beige/30
                    ${isHoje ? 'bg-gold text-white' : 'bg-cream/50'}
                  `}>
                    <div className="font-mono text-[10px] uppercase tracking-wider">
                      {format(dia, 'EEE', { locale: ptBR })}
                    </div>
                    <div className="font-display text-2xl">
                      {format(dia, 'd')}
                    </div>
                  </div>

                  {/* Posts do dia */}
                  <div className="p-2 space-y-2">
                    {postsDia.map(post => {
                      const RedeIcon = redesIcons[post.rede]
                      const TipoIcon = tipoIcons[post.tipo]
                      
                      return (
                        <div
                          key={post.id}
                          className="p-2 bg-white border border-black/5 hover:border-gold/50 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 ${redesCores[post.rede]} rounded flex items-center justify-center`}>
                              {typeof RedeIcon === 'function' && RedeIcon.toString().includes('span') ? (
                                <span className="text-[10px]">📌</span>
                              ) : (
                                <RedeIcon size={12} className="text-white" />
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-muted">{post.horario}</span>
                            <MoreVertical size={12} className="ml-auto text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-xs text-charcoal line-clamp-2">{post.titulo}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <TipoIcon size={10} className="text-muted" />
                            <span className={`
                              text-[9px] px-1.5 py-0.5 rounded
                              ${post.status === 'publicado' ? 'bg-green-100 text-green-700' : 
                                post.status === 'agendado' ? 'bg-blue-100 text-blue-700' : 
                                'bg-warm-beige text-charcoal'}
                            `}>
                              {post.status}
                            </span>
                          </div>
                        </div>
                      )
                    })}

                    {/* Botão adicionar */}
                    <button className="w-full p-2 border border-dashed border-warm-beige hover:border-gold hover:bg-gold/5 transition-all flex items-center justify-center gap-1 text-muted hover:text-gold">
                      <Plus size={14} />
                      <span className="text-[10px]">Adicionar</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resumo por Rede */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          {Object.entries(redesIcons).map(([key, Icon]) => {
            const postsRede = posts.filter(p => p.rede === key)
            const agendados = postsRede.filter(p => p.status === 'agendado').length
            
            return (
              <div 
                key={key}
                className="bg-soft-white border border-black/5 p-4 card-hover cursor-pointer"
                onClick={() => setRedeAtiva(redeAtiva === key ? null : key)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${redesCores[key as keyof typeof redesCores]} rounded flex items-center justify-center`}>
                    {typeof Icon === 'function' && Icon.toString().includes('span') ? (
                      <Icon />
                    ) : (
                      <Icon size={20} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium capitalize">{key}</span>
                </div>
                <div className="text-xs text-muted">
                  <span className="text-gold font-mono">{agendados}</span> agendados
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

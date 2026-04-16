'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { 
  Plus,
  Search,
  Filter,
  ExternalLink,
  Bookmark,
  Tag,
  Calendar,
  Edit3,
  Trash2,
  Eye,
  Send,
  FileText,
  Image,
  Link,
  MoreVertical
} from 'lucide-react'

type Edicao = {
  id: string
  titulo: string
  descricao: string
  status: 'rascunho' | 'agendada' | 'publicada'
  dataPublicacao?: Date
  taxaAbertura?: number
  taxaCliques?: number
}

type Referencia = {
  id: string
  titulo: string
  url?: string
  categoria: 'produtos' | 'arquitetura' | 'podcasts' | 'livros' | 'filmes' | 'outros'
  notas?: string
  dataSalva: Date
  usadaEm?: string[]
}

const edicoesIniciais: Edicao[] = [
  {
    id: '1',
    titulo: 'Casa NOGS #4 - O poder do silêncio nos ambientes',
    descricao: 'Como o vazio e a ausência de ruído visual transformam a experiência de um espaço',
    status: 'rascunho',
  },
  {
    id: '2',
    titulo: 'Casa NOGS #3 - Materiais que contam histórias',
    descricao: 'A beleza do imperfeito: madeira de demolição, pedras naturais e tecidos artesanais',
    status: 'publicada',
    dataPublicacao: new Date('2025-04-01'),
    taxaAbertura: 72,
    taxaCliques: 15,
  },
  {
    id: '3',
    titulo: 'Casa NOGS #2 - Luz natural como protagonista',
    descricao: 'Projetar com a luz do sol: orientação, aberturas e o ritmo do dia',
    status: 'publicada',
    dataPublicacao: new Date('2025-03-15'),
    taxaAbertura: 68,
    taxaCliques: 12,
  },
]

const referenciasIniciais: Referencia[] = [
  {
    id: '1',
    titulo: 'Vaso cerâmica artesanal - Tania Bulhões',
    url: 'https://taniabulhoes.com.br',
    categoria: 'produtos',
    notas: 'Perfeito para editorial de mesa posta',
    dataSalva: new Date('2025-04-10'),
  },
  {
    id: '2',
    titulo: 'Casa Wabi - Tadao Ando',
    categoria: 'arquitetura',
    notas: 'Referência máxima de integração com natureza e materialidade',
    dataSalva: new Date('2025-04-08'),
  },
  {
    id: '3',
    titulo: 'The Tim Ferriss Show - Kelly Wearstler',
    url: 'https://tim.blog/kelly-wearstler',
    categoria: 'podcasts',
    notas: 'Ela fala sobre processo criativo e construção de marca',
    dataSalva: new Date('2025-04-05'),
  },
  {
    id: '4',
    titulo: 'A Poética do Espaço - Gaston Bachelard',
    categoria: 'livros',
    notas: 'Filosofia sobre como habitamos os espaços',
    dataSalva: new Date('2025-04-01'),
  },
  {
    id: '5',
    titulo: 'Past Lives',
    categoria: 'filmes',
    notas: 'Estética visual minimalista, silêncios significativos',
    dataSalva: new Date('2025-03-28'),
  },
]

const categorias = [
  { id: 'produtos', nome: 'Produtos', emoji: '🛍️', cor: 'bg-pink-100 text-pink-800' },
  { id: 'arquitetura', nome: 'Arquitetura', emoji: '🏛️', cor: 'bg-blue-100 text-blue-800' },
  { id: 'podcasts', nome: 'Podcasts', emoji: '🎙️', cor: 'bg-purple-100 text-purple-800' },
  { id: 'livros', nome: 'Livros', emoji: '📚', cor: 'bg-amber-100 text-amber-800' },
  { id: 'filmes', nome: 'Filmes', emoji: '🎬', cor: 'bg-red-100 text-red-800' },
  { id: 'outros', nome: 'Outros', emoji: '✨', cor: 'bg-gray-100 text-gray-800' },
]

export default function NewsletterPage() {
  const [edicoes] = useState<Edicao[]>(edicoesIniciais)
  const [referencias, setReferencias] = useState<Referencia[]>(referenciasIniciais)
  const [abaAtiva, setAbaAtiva] = useState<'edicoes' | 'referencias'>('edicoes')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  const referenciasFiltradas = referencias.filter(ref => {
    if (categoriaFiltro && ref.categoria !== categoriaFiltro) return false
    if (busca && !ref.titulo.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  const refsPorCategoria = categorias.map(cat => ({
    ...cat,
    count: referencias.filter(r => r.categoria === cat.id).length
  }))

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Newsletter" 
          subtitle="Casa NOGS · Curadoria de lifestyle e design"
        />

        {/* Stats da Newsletter */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-dark text-cream p-6">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-gold mb-2">Assinantes</div>
            <div className="font-display text-4xl text-gold">890</div>
            <div className="text-xs text-warm-beige mt-1">+12% este mês</div>
          </div>
          <div className="bg-soft-white border border-black/5 p-6">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-2">Taxa de Abertura</div>
            <div className="font-display text-4xl">68%</div>
            <div className="text-xs text-muted mt-1">Média da indústria: 42%</div>
          </div>
          <div className="bg-soft-white border border-black/5 p-6">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-2">Taxa de Cliques</div>
            <div className="font-display text-4xl">12%</div>
            <div className="text-xs text-muted mt-1">Média da indústria: 4%</div>
          </div>
          <div className="bg-soft-white border border-black/5 p-6">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-2">Edições</div>
            <div className="font-display text-4xl">3</div>
            <div className="text-xs text-muted mt-1">1 rascunho pendente</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAbaAtiva('edicoes')}
            className={`
              px-6 py-3 text-sm font-medium transition-all flex items-center gap-2
              ${abaAtiva === 'edicoes' 
                ? 'bg-dark text-cream' 
                : 'bg-soft-white border border-black/5 hover:bg-warm-beige/50'
              }
            `}
          >
            <FileText size={16} />
            Edições
          </button>
          <button
            onClick={() => setAbaAtiva('referencias')}
            className={`
              px-6 py-3 text-sm font-medium transition-all flex items-center gap-2
              ${abaAtiva === 'referencias' 
                ? 'bg-dark text-cream' 
                : 'bg-soft-white border border-black/5 hover:bg-warm-beige/50'
              }
            `}
          >
            <Bookmark size={16} />
            Banco de Referências
          </button>
        </div>

        {/* Edições */}
        {abaAtiva === 'edicoes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">Edições</h2>
              <button className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Nova Edição
              </button>
            </div>

            <div className="space-y-4">
              {edicoes.map(edicao => (
                <div 
                  key={edicao.id}
                  className="bg-soft-white border border-black/5 p-6 card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`
                          text-[10px] px-2 py-1 rounded uppercase tracking-wider font-medium
                          ${edicao.status === 'publicada' ? 'bg-green-100 text-green-700' : 
                            edicao.status === 'agendada' ? 'bg-blue-100 text-blue-700' : 
                            'bg-warm-beige text-charcoal'}
                        `}>
                          {edicao.status}
                        </span>
                        {edicao.dataPublicacao && (
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Calendar size={12} />
                            {edicao.dataPublicacao.toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl mb-2">{edicao.titulo}</h3>
                      <p className="text-sm text-muted">{edicao.descricao}</p>
                      
                      {edicao.status === 'publicada' && (
                        <div className="flex gap-6 mt-4 pt-4 border-t border-warm-beige/30">
                          <div>
                            <span className="text-xs text-muted">Abertura</span>
                            <div className="font-display text-lg text-gold">{edicao.taxaAbertura}%</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted">Cliques</span>
                            <div className="font-display text-lg text-gold">{edicao.taxaCliques}%</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {edicao.status === 'rascunho' && (
                        <>
                          <button className="p-2 text-muted hover:text-charcoal transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button className="p-2 text-muted hover:text-charcoal transition-colors">
                            <Eye size={18} />
                          </button>
                          <button className="btn-primary flex items-center gap-2">
                            <Send size={14} />
                            Publicar
                          </button>
                        </>
                      )}
                      {edicao.status === 'publicada' && (
                        <button className="p-2 text-muted hover:text-charcoal transition-colors">
                          <ExternalLink size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banco de Referências */}
        {abaAtiva === 'referencias' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">Banco de Referências</h2>
              <button className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Salvar Referência
              </button>
            </div>

            {/* Filtros por categoria */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setCategoriaFiltro(null)}
                className={`
                  px-4 py-2 text-xs font-medium transition-all
                  ${!categoriaFiltro 
                    ? 'bg-dark text-cream' 
                    : 'bg-warm-beige/50 hover:bg-warm-beige'
                  }
                `}
              >
                Todas ({referencias.length})
              </button>
              {refsPorCategoria.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaFiltro(categoriaFiltro === cat.id ? null : cat.id)}
                  className={`
                    px-4 py-2 text-xs font-medium transition-all flex items-center gap-2
                    ${categoriaFiltro === cat.id 
                      ? cat.cor 
                      : 'bg-warm-beige/50 hover:bg-warm-beige'
                    }
                  `}
                >
                  <span>{cat.emoji}</span>
                  {cat.nome} ({cat.count})
                </button>
              ))}
            </div>

            {/* Busca */}
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Buscar referências..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-soft-white border border-black/5"
              />
            </div>

            {/* Grid de Referências */}
            <div className="grid grid-cols-3 gap-4">
              {referenciasFiltradas.map(ref => {
                const categoria = categorias.find(c => c.id === ref.categoria)
                
                return (
                  <div 
                    key={ref.id}
                    className="bg-soft-white border border-black/5 p-5 card-hover group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`
                        text-[10px] px-2 py-1 rounded font-medium
                        ${categoria?.cor}
                      `}>
                        {categoria?.emoji} {categoria?.nome}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted hover:text-charcoal">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{ref.titulo}</h3>
                    
                    {ref.notas && (
                      <p className="text-xs text-muted mb-3 line-clamp-2">{ref.notas}</p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-muted">
                      <span>{ref.dataSalva.toLocaleDateString('pt-BR')}</span>
                      {ref.url && (
                        <a 
                          href={ref.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-accent hover:text-gold"
                        >
                          <Link size={10} />
                          Ver link
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Card para adicionar */}
              <button className="border-2 border-dashed border-warm-beige hover:border-gold hover:bg-gold/5 transition-all p-5 flex flex-col items-center justify-center min-h-[150px] text-muted hover:text-gold">
                <Plus size={24} className="mb-2" />
                <span className="text-xs">Adicionar referência</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

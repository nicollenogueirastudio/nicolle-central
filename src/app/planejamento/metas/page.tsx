'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { CheckCircle2, Circle, Filter } from 'lucide-react'

type Meta = {
  id: string
  texto: string
  pilar: 'autoridade' | 'visibilidade' | 'diversificacao' | 'estrutura'
  trimestre: string
  ano: number
  concluida: boolean
  categoria: string
}

const metasIniciais: Meta[] = [
  // Ano 1 - Q1
  { id: 'y1q1-1', texto: 'Finalizar manual de marca do Studio', pilar: 'autoridade', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Marca' },
  { id: 'y1q1-2', texto: 'Criar banco de imagens de referência do seu estilo', pilar: 'autoridade', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Marca' },
  { id: 'y1q1-3', texto: 'Definir 5-7 características do "projeto Nicolle Nogueira"', pilar: 'autoridade', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Marca' },
  { id: 'y1q1-4', texto: 'Atualizar site com novo posicionamento', pilar: 'visibilidade', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Digital' },
  { id: 'y1q1-5', texto: 'Criar apresentação institucional premium', pilar: 'visibilidade', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Marca' },
  { id: 'y1q1-6', texto: 'Documentar fluxo completo de projeto', pilar: 'estrutura', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Processo' },
  { id: 'y1q1-7', texto: 'Criar templates de contrato, proposta, briefing', pilar: 'estrutura', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Processo' },
  { id: 'y1q1-8', texto: 'Estruturar Braxio para os 3 projetos atuais', pilar: 'estrutura', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Tech' },
  { id: 'y1q1-9', texto: 'Organizar Google Drive com estrutura definitiva', pilar: 'estrutura', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Processo' },
  { id: 'y1q1-10', texto: 'Definir rituais semanais/mensais de revisão', pilar: 'estrutura', trimestre: 'Q1', ano: 2025, concluida: false, categoria: 'Processo' },
  
  // Ano 1 - Q2
  { id: 'y1q2-1', texto: 'Submeter projeto para Concurso Deca', pilar: 'visibilidade', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Vitrine' },
  { id: 'y1q2-2', texto: 'Decidir sobre Casacor 2026', pilar: 'visibilidade', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Vitrine' },
  { id: 'y1q2-3', texto: 'Mapear vitrines alternativas: Reveev, Momentum', pilar: 'visibilidade', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Vitrine' },
  { id: 'y1q2-4', texto: 'Criar kit de imprensa profissional', pilar: 'visibilidade', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'PR' },
  { id: 'y1q2-5', texto: 'Iniciar relacionamento com editores', pilar: 'visibilidade', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'PR' },
  { id: 'y1q2-6', texto: 'Lançar newsletter no Substack', pilar: 'diversificacao', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Conteúdo' },
  { id: 'y1q2-7', texto: 'Definir pilares de conteúdo para Instagram', pilar: 'diversificacao', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Conteúdo' },
  { id: 'y1q2-8', texto: 'Criar banco de 20+ posts prontos', pilar: 'diversificacao', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Conteúdo' },
  { id: 'y1q2-9', texto: 'Testar formatos: carrossel, reels, bastidores', pilar: 'diversificacao', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Conteúdo' },
  { id: 'y1q2-10', texto: 'Documentar projeto em andamento para conteúdo', pilar: 'autoridade', trimestre: 'Q2', ano: 2025, concluida: false, categoria: 'Projeto' },

  // Ano 1 - Q3
  { id: 'y1q3-1', texto: 'Identificar 10 pessoas-chave para conhecer', pilar: 'visibilidade', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Rede' },
  { id: 'y1q3-2', texto: 'Participar de 2-3 eventos relevantes', pilar: 'visibilidade', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Rede' },
  { id: 'y1q3-3', texto: 'Iniciar conexões com mundo da moda/arte', pilar: 'visibilidade', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Rede' },
  { id: 'y1q3-4', texto: 'Desenvolver 1-2 protótipos de produto autoral', pilar: 'diversificacao', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Produto' },
  { id: 'y1q3-5', texto: 'Testar produção com fornecedores locais', pilar: 'diversificacao', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Produto' },
  { id: 'y1q3-6', texto: 'Criar narrativa de produto', pilar: 'autoridade', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Produto' },
  { id: 'y1q3-7', texto: 'Avaliar collab com artesãos ou marcas menores', pilar: 'diversificacao', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'Produto' },
  { id: 'y1q3-8', texto: 'Avaliar assessoria de imprensa nacional', pilar: 'visibilidade', trimestre: 'Q3', ano: 2025, concluida: false, categoria: 'PR' },

  // Ano 1 - Q4
  { id: 'y1q4-1', texto: 'Revisar metas do ano: o que funcionou', pilar: 'estrutura', trimestre: 'Q4', ano: 2025, concluida: false, categoria: 'Revisão' },
  { id: 'y1q4-2', texto: 'Prestação de contas espiritual', pilar: 'estrutura', trimestre: 'Q4', ano: 2025, concluida: false, categoria: 'Fé' },
  { id: 'y1q4-3', texto: 'Organizar fotos profissionais dos projetos', pilar: 'autoridade', trimestre: 'Q4', ano: 2025, concluida: false, categoria: 'Projeto' },
  { id: 'y1q4-4', texto: 'Atualizar portfólio com novos projetos', pilar: 'autoridade', trimestre: 'Q4', ano: 2025, concluida: false, categoria: 'Marca' },
  { id: 'y1q4-5', texto: 'Planejar Ano 2 com metas específicas', pilar: 'estrutura', trimestre: 'Q4', ano: 2025, concluida: false, categoria: 'Planej.' },

  // Ano 2 - Q1
  { id: 'y2q1-1', texto: 'Executar Casacor 2026 ou vitrine equivalente', pilar: 'visibilidade', trimestre: 'Q1', ano: 2026, concluida: false, categoria: 'Vitrine' },
  { id: 'y2q1-2', texto: 'Contratar fotógrafo de arquitetura premium', pilar: 'autoridade', trimestre: 'Q1', ano: 2026, concluida: false, categoria: 'Mídia' },
  { id: 'y2q1-3', texto: 'Produzir vídeo de projeto (YouTube ready)', pilar: 'diversificacao', trimestre: 'Q1', ano: 2026, concluida: false, categoria: 'Conteúdo' },
  { id: 'y2q1-4', texto: 'Contratar assessoria de imprensa nacional', pilar: 'visibilidade', trimestre: 'Q1', ano: 2026, concluida: false, categoria: 'PR' },
  { id: 'y2q1-5', texto: 'Submeter projeto para Casa Vogue, AD Brasil', pilar: 'visibilidade', trimestre: 'Q1', ano: 2026, concluida: false, categoria: 'PR' },
  { id: 'y2q1-6', texto: 'Traduzir portfólio para inglês', pilar: 'visibilidade', trimestre: 'Q1', ano: 2026, concluida: false, categoria: 'Intern.' },

  // Ano 2 - Q2
  { id: 'y2q2-1', texto: 'Lançar primeira linha de produtos', pilar: 'diversificacao', trimestre: 'Q2', ano: 2026, concluida: false, categoria: 'Produto' },
  { id: 'y2q2-2', texto: 'Criar campanha de lançamento', pilar: 'diversificacao', trimestre: 'Q2', ano: 2026, concluida: false, categoria: 'Produto' },
  { id: 'y2q2-3', texto: 'Buscar primeira collab com marca', pilar: 'diversificacao', trimestre: 'Q2', ano: 2026, concluida: false, categoria: 'Produto' },
  { id: 'y2q2-4', texto: 'Submeter para publicação internacional', pilar: 'visibilidade', trimestre: 'Q2', ano: 2026, concluida: false, categoria: 'Intern.' },
  { id: 'y2q2-5', texto: 'Criar versão do site em inglês', pilar: 'visibilidade', trimestre: 'Q2', ano: 2026, concluida: false, categoria: 'Digital' },

  // Ano 2 - Q3
  { id: 'y2q3-1', texto: 'Desenvolver primeiro curso/mentoria', pilar: 'diversificacao', trimestre: 'Q3', ano: 2026, concluida: false, categoria: 'Educação' },
  { id: 'y2q3-2', texto: 'Contratar primeira pessoa fixa', pilar: 'estrutura', trimestre: 'Q3', ano: 2026, concluida: false, categoria: 'Equipe' },
  { id: 'y2q3-3', texto: 'Criar manuais de processos internos', pilar: 'estrutura', trimestre: 'Q3', ano: 2026, concluida: false, categoria: 'Processo' },

  // Ano 2 - Q4
  { id: 'y2q4-1', texto: 'Mapear hotéis boutique e pousadas de luxo', pilar: 'diversificacao', trimestre: 'Q4', ano: 2026, concluida: false, categoria: 'Hotelaria' },
  { id: 'y2q4-2', texto: 'Criar apresentação específica para hotelaria', pilar: 'diversificacao', trimestre: 'Q4', ano: 2026, concluida: false, categoria: 'Hotelaria' },
  { id: 'y2q4-3', texto: 'Avaliar primeiro projeto piloto de hotelaria', pilar: 'diversificacao', trimestre: 'Q4', ano: 2026, concluida: false, categoria: 'Hotelaria' },

  // Ano 3 - Q1
  { id: 'y3q1-1', texto: 'Contratar assessoria de imprensa internacional', pilar: 'visibilidade', trimestre: 'Q1', ano: 2027, concluida: false, categoria: 'Intern.' },
  { id: 'y3q1-2', texto: 'Submeter para AD, Elle Decor, Vogue Living', pilar: 'visibilidade', trimestre: 'Q1', ano: 2027, concluida: false, categoria: 'Intern.' },
  { id: 'y3q1-3', texto: 'Participar de feira internacional (Salone)', pilar: 'visibilidade', trimestre: 'Q1', ano: 2027, concluida: false, categoria: 'Intern.' },
  { id: 'y3q1-4', texto: 'Preparar candidatura AD100, Elle Decor A-List', pilar: 'visibilidade', trimestre: 'Q1', ano: 2027, concluida: false, categoria: 'Listas' },

  // Ano 3 - Q2
  { id: 'y3q2-1', texto: 'Executar primeiro projeto de hotelaria boutique', pilar: 'diversificacao', trimestre: 'Q2', ano: 2027, concluida: false, categoria: 'Hotelaria' },
  { id: 'y3q2-2', texto: 'Expandir linha de produtos', pilar: 'diversificacao', trimestre: 'Q2', ano: 2027, concluida: false, categoria: 'Produto' },
  { id: 'y3q2-3', texto: 'Buscar collab com marca internacional', pilar: 'diversificacao', trimestre: 'Q2', ano: 2027, concluida: false, categoria: 'Produto' },

  // Ano 3 - Q3/Q4
  { id: 'y3q3-1', texto: 'Criar programa completo para arquitetas', pilar: 'diversificacao', trimestre: 'Q3', ano: 2027, concluida: false, categoria: 'Educação' },
  { id: 'y3q3-2', texto: 'Avaliar viabilidade de Braxio como SaaS', pilar: 'diversificacao', trimestre: 'Q3', ano: 2027, concluida: false, categoria: 'Tech' },
  { id: 'y3q4-1', texto: 'Estruturar braço filantrópico', pilar: 'estrutura', trimestre: 'Q4', ano: 2027, concluida: false, categoria: 'Legado' },
  { id: 'y3q4-2', texto: 'Revisar os 3 anos: o que foi construído', pilar: 'estrutura', trimestre: 'Q4', ano: 2027, concluida: false, categoria: 'Revisão' },
]

const pilarNomes = {
  autoridade: 'Autoridade',
  visibilidade: 'Visibilidade',
  diversificacao: 'Diversificação',
  estrutura: 'Estrutura'
}

const pilarCores = {
  autoridade: 'bg-amber-100 text-amber-800',
  visibilidade: 'bg-blue-100 text-blue-800',
  diversificacao: 'bg-green-100 text-green-800',
  estrutura: 'bg-purple-100 text-purple-800'
}

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>(metasIniciais)
  const [filtroAno, setFiltroAno] = useState<number | null>(2025)
  const [filtroPilar, setFiltroPilar] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'pendentes' | 'concluidas'>('todas')

  const toggleMeta = (id: string) => {
    setMetas(metas.map(m => 
      m.id === id ? { ...m, concluida: !m.concluida } : m
    ))
  }

  const metasFiltradas = metas.filter(m => {
    if (filtroAno && m.ano !== filtroAno) return false
    if (filtroPilar && m.pilar !== filtroPilar) return false
    if (filtroStatus === 'pendentes' && m.concluida) return false
    if (filtroStatus === 'concluidas' && !m.concluida) return false
    return true
  })

  const metasPorTrimestre = metasFiltradas.reduce((acc, meta) => {
    const key = `${meta.ano}-${meta.trimestre}`
    if (!acc[key]) acc[key] = []
    acc[key].push(meta)
    return acc
  }, {} as Record<string, Meta[]>)

  const totalFiltradas = metasFiltradas.length
  const concluidasFiltradas = metasFiltradas.filter(m => m.concluida).length

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Metas" 
          subtitle="Acompanhe e marque suas conquistas"
        />

        {/* Filtros */}
        <div className="bg-soft-white border border-black/5 p-4 mb-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted" />
            <span className="text-sm text-muted">Filtros:</span>
          </div>

          <div className="flex gap-2">
            {[2025, 2026, 2027].map(ano => (
              <button
                key={ano}
                onClick={() => setFiltroAno(filtroAno === ano ? null : ano)}
                className={`
                  px-4 py-2 text-xs font-medium transition-all
                  ${filtroAno === ano 
                    ? 'bg-dark text-cream' 
                    : 'bg-warm-beige/50 text-charcoal hover:bg-warm-beige'
                  }
                `}
              >
                {ano}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-warm-beige"></div>

          <div className="flex gap-2">
            {Object.entries(pilarNomes).map(([key, nome]) => (
              <button
                key={key}
                onClick={() => setFiltroPilar(filtroPilar === key ? null : key)}
                className={`
                  px-4 py-2 text-xs font-medium transition-all
                  ${filtroPilar === key 
                    ? 'bg-gold text-white' 
                    : 'bg-warm-beige/50 text-charcoal hover:bg-warm-beige'
                  }
                `}
              >
                {nome}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-warm-beige"></div>

          <div className="flex gap-2">
            {(['todas', 'pendentes', 'concluidas'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`
                  px-4 py-2 text-xs font-medium capitalize transition-all
                  ${filtroStatus === status 
                    ? 'bg-dark text-cream' 
                    : 'bg-warm-beige/50 text-charcoal hover:bg-warm-beige'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="ml-auto font-mono text-sm">
            <span className="text-gold">{concluidasFiltradas}</span>
            <span className="text-muted">/{totalFiltradas}</span>
          </div>
        </div>

        {/* Metas por Trimestre */}
        <div className="space-y-6">
          {Object.entries(metasPorTrimestre)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, metasTrimestre]) => {
              const [ano, trimestre] = key.split('-')
              const concluidas = metasTrimestre.filter(m => m.concluida).length
              
              return (
                <div key={key} className="bg-soft-white border border-black/5">
                  <div className="bg-dark text-cream p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl">{trimestre}</span>
                      <span className="text-warm-beige">·</span>
                      <span className="text-warm-beige">{ano}</span>
                    </div>
                    <span className="font-mono text-sm">
                      <span className="text-gold">{concluidas}</span>
                      <span className="text-muted">/{metasTrimestre.length}</span>
                    </span>
                  </div>
                  
                  <div className="divide-y divide-warm-beige/30">
                    {metasTrimestre.map(meta => (
                      <div
                        key={meta.id}
                        onClick={() => toggleMeta(meta.id)}
                        className={`
                          flex items-center gap-4 p-4 cursor-pointer transition-all
                          ${meta.concluida ? 'bg-cream/50' : 'hover:bg-cream/30'}
                        `}
                      >
                        {meta.concluida ? (
                          <CheckCircle2 size={22} className="text-gold flex-shrink-0" />
                        ) : (
                          <Circle size={22} className="text-warm-beige flex-shrink-0" />
                        )}
                        
                        <span className={`
                          flex-1 text-sm
                          ${meta.concluida ? 'text-muted line-through' : 'text-charcoal'}
                        `}>
                          {meta.texto}
                        </span>

                        <span className={`
                          px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded
                          ${pilarCores[meta.pilar]}
                        `}>
                          {pilarNomes[meta.pilar]}
                        </span>

                        <span className="font-mono text-[10px] text-muted bg-warm-beige/50 px-2 py-1 rounded">
                          {meta.categoria}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </main>
    </div>
  )
}

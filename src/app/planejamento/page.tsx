'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ProgressBar from '@/components/ProgressBar'
import { 
  Target, 
  Eye, 
  Layers, 
  Settings2,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react'

const pilares = [
  { 
    id: 'autoridade',
    nome: 'Autoridade', 
    descricao: 'Consolidar estilo próprio e publicar em veículos de prestígio',
    icon: Target,
    progresso: 35,
    metas: 12,
    concluidas: 4
  },
  { 
    id: 'visibilidade',
    nome: 'Visibilidade', 
    descricao: 'Vitrines estratégicas, imprensa e presença digital',
    icon: Eye,
    progresso: 20,
    metas: 15,
    concluidas: 3
  },
  { 
    id: 'diversificacao',
    nome: 'Diversificação', 
    descricao: 'Múltiplas fontes de receita: produtos, conteúdo, cursos',
    icon: Layers,
    progresso: 15,
    metas: 18,
    concluidas: 3
  },
  { 
    id: 'estrutura',
    nome: 'Estrutura', 
    descricao: 'Processos, equipe e sistemas que funcionam',
    icon: Settings2,
    progresso: 45,
    metas: 10,
    concluidas: 5
  },
]

const anos = [
  { ano: 2025, tema: 'Fundação & Identidade', progresso: 30 },
  { ano: 2026, tema: 'Visibilidade & Expansão', progresso: 0 },
  { ano: 2027, tema: 'Reconhecimento Internacional', progresso: 0 },
]

export default function PlanejamentoPage() {
  const totalMetas = pilares.reduce((acc, p) => acc + p.metas, 0)
  const totalConcluidas = pilares.reduce((acc, p) => acc + p.concluidas, 0)
  const progressoGeral = Math.round((totalConcluidas / totalMetas) * 100)

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Planejamento Estratégico" 
          subtitle="Visão 2025-2028 · Da arquiteta à marca global"
        />

        {/* Visão Geral */}
        <div className="bg-dark text-cream p-8 mb-8">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">Progresso Geral</span>
              <div className="font-display text-6xl text-gold mt-2">{progressoGeral}%</div>
              <p className="text-warm-beige text-sm mt-2">{totalConcluidas} de {totalMetas} metas concluídas</p>
            </div>
            <div className="col-span-2">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">Visão</span>
              <p className="font-display text-2xl mt-2 leading-relaxed">
                Consolidar o Nicolle Nogueira Studio como referência internacional em arquitetura, 
                design e lifestyle — com propósito, excelência e princípios que atravessam gerações.
              </p>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="mb-8">
          <h2 className="font-display text-2xl mb-6">Pilares Estratégicos</h2>
          <div className="grid grid-cols-4 gap-6">
            {pilares.map((pilar) => {
              const Icon = pilar.icon
              return (
                <a
                  key={pilar.id}
                  href={`/planejamento/metas?pilar=${pilar.id}`}
                  className="bg-soft-white border border-black/5 p-6 card-hover group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-dark text-gold flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <ChevronRight size={20} className="text-warm-beige group-hover:text-gold transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-xl mb-2">{pilar.nome}</h3>
                  <p className="text-xs text-muted mb-4 line-clamp-2">{pilar.descricao}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted">{pilar.concluidas}/{pilar.metas} metas</span>
                    <span className="font-mono text-xs text-gold">{pilar.progresso}%</span>
                  </div>
                  <div className="h-1 bg-warm-beige rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold rounded-full progress-bar"
                      style={{ width: `${pilar.progresso}%` }}
                    />
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Timeline Anos */}
        <div className="mb-8">
          <h2 className="font-display text-2xl mb-6">Jornada de 3 Anos</h2>
          <div className="grid grid-cols-3 gap-6">
            {anos.map((item, index) => (
              <a
                key={item.ano}
                href={`/planejamento/metas?ano=${item.ano}`}
                className={`
                  p-6 card-hover border
                  ${index === 0 
                    ? 'bg-dark text-cream border-dark' 
                    : 'bg-soft-white border-black/5'
                  }
                `}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`
                    w-16 h-16 flex items-center justify-center font-display text-2xl
                    ${index === 0 ? 'bg-gold text-dark' : 'bg-warm-beige text-charcoal'}
                  `}>
                    {item.ano}
                  </div>
                  <div>
                    <div className={`font-mono text-[10px] tracking-[0.15em] uppercase ${index === 0 ? 'text-gold' : 'text-accent'}`}>
                      Ano {index + 1}
                    </div>
                    <div className={`font-display text-lg ${index === 0 ? 'text-cream' : 'text-charcoal'}`}>
                      {item.tema}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs ${index === 0 ? 'text-warm-beige' : 'text-muted'}`}>
                    Progresso
                  </span>
                  <span className={`font-mono text-xs ${index === 0 ? 'text-gold' : 'text-gold'}`}>
                    {item.progresso}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${index === 0 ? 'bg-white/20' : 'bg-warm-beige'}`}>
                  <div 
                    className="h-full bg-gold rounded-full progress-bar"
                    style={{ width: `${item.progresso}%` }}
                  />
                </div>

                {index === 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-xs text-gold">Ano atual →</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Citação */}
        <div className="bg-dark text-cream p-8 text-center">
          <p className="font-display text-2xl italic mb-4">
            "Tudo quanto fizerdes, fazei-o de todo o coração, como para o Senhor e não para homens."
          </p>
          <span className="font-mono text-xs text-gold tracking-[0.2em]">COLOSSENSES 3:23</span>
        </div>
      </main>
    </div>
  )
}

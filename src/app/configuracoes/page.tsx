'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { 
  Instagram, 
  Youtube, 
  Mail,
  Database,
  Key,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

type IntegracaoStatus = 'conectado' | 'desconectado' | 'erro'

type Integracao = {
  id: string
  nome: string
  descricao: string
  icon: any
  cor: string
  status: IntegracaoStatus
  campos: {
    id: string
    label: string
    tipo: 'text' | 'password'
    placeholder: string
    valor: string
    ajuda?: string
  }[]
  docUrl: string
}

const integracoesIniciais: Integracao[] = [
  {
    id: 'supabase',
    nome: 'Supabase',
    descricao: 'Banco de dados para armazenar suas metas, posts e referências',
    icon: Database,
    cor: 'bg-emerald-600',
    status: 'desconectado',
    campos: [
      {
        id: 'supabase_url',
        label: 'Project URL',
        tipo: 'text',
        placeholder: 'https://xxxxx.supabase.co',
        valor: '',
        ajuda: 'Encontre em: Settings > API > Project URL'
      },
      {
        id: 'supabase_anon_key',
        label: 'Anon Key',
        tipo: 'password',
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        valor: '',
        ajuda: 'Encontre em: Settings > API > anon public'
      }
    ],
    docUrl: 'https://supabase.com/docs'
  },
  {
    id: 'instagram',
    nome: 'Instagram',
    descricao: 'Métricas de seguidores, engajamento e alcance',
    icon: Instagram,
    cor: 'bg-gradient-to-br from-purple-500 to-pink-500',
    status: 'desconectado',
    campos: [
      {
        id: 'meta_app_id',
        label: 'App ID',
        tipo: 'text',
        placeholder: '123456789...',
        valor: '',
        ajuda: 'Crie um app em developers.facebook.com'
      },
      {
        id: 'meta_app_secret',
        label: 'App Secret',
        tipo: 'password',
        placeholder: 'abc123...',
        valor: '',
      },
      {
        id: 'instagram_access_token',
        label: 'Access Token',
        tipo: 'password',
        placeholder: 'IGQVJ...',
        valor: '',
        ajuda: 'Token de longa duração do Instagram Graph API'
      },
      {
        id: 'instagram_business_id',
        label: 'Business Account ID',
        tipo: 'text',
        placeholder: '17841400...',
        valor: '',
      }
    ],
    docUrl: 'https://developers.facebook.com/docs/instagram-api'
  },
  {
    id: 'youtube',
    nome: 'YouTube',
    descricao: 'Inscritos, visualizações e analytics do canal',
    icon: Youtube,
    cor: 'bg-red-600',
    status: 'desconectado',
    campos: [
      {
        id: 'youtube_api_key',
        label: 'API Key',
        tipo: 'password',
        placeholder: 'AIzaSy...',
        valor: '',
        ajuda: 'Crie em console.cloud.google.com > APIs & Services'
      },
      {
        id: 'youtube_channel_id',
        label: 'Channel ID',
        tipo: 'text',
        placeholder: 'UC...',
        valor: '',
        ajuda: 'Encontre em: YouTube Studio > Configurações > Canal'
      }
    ],
    docUrl: 'https://developers.google.com/youtube/v3'
  },
  {
    id: 'pinterest',
    nome: 'Pinterest',
    descricao: 'Impressões, salvamentos e cliques',
    icon: () => <span className="text-xl">📌</span>,
    cor: 'bg-red-700',
    status: 'desconectado',
    campos: [
      {
        id: 'pinterest_app_id',
        label: 'App ID',
        tipo: 'text',
        placeholder: '123456...',
        valor: '',
        ajuda: 'Crie em developers.pinterest.com'
      },
      {
        id: 'pinterest_access_token',
        label: 'Access Token',
        tipo: 'password',
        placeholder: 'pina_...',
        valor: '',
      }
    ],
    docUrl: 'https://developers.pinterest.com/docs/api/v5/'
  },
  {
    id: 'tiktok',
    nome: 'TikTok',
    descricao: 'Seguidores, visualizações e engajamento',
    icon: () => <span className="text-xl">🎵</span>,
    cor: 'bg-black',
    status: 'desconectado',
    campos: [
      {
        id: 'tiktok_client_key',
        label: 'Client Key',
        tipo: 'text',
        placeholder: 'aw...',
        valor: '',
        ajuda: 'Crie em developers.tiktok.com (requer conta Business)'
      },
      {
        id: 'tiktok_client_secret',
        label: 'Client Secret',
        tipo: 'password',
        placeholder: '...',
        valor: '',
      },
      {
        id: 'tiktok_access_token',
        label: 'Access Token',
        tipo: 'password',
        placeholder: 'act...',
        valor: '',
      }
    ],
    docUrl: 'https://developers.tiktok.com/doc/'
  },
  {
    id: 'substack',
    nome: 'Substack (Casa NOGS)',
    descricao: 'Métricas da newsletter via RSS',
    icon: Mail,
    cor: 'bg-amber-600',
    status: 'desconectado',
    campos: [
      {
        id: 'substack_url',
        label: 'URL do Substack',
        tipo: 'text',
        placeholder: 'https://casanogs.substack.com',
        valor: '',
        ajuda: 'O feed RSS será: /feed'
      }
    ],
    docUrl: 'https://support.substack.com/'
  },
]

export default function ConfiguracoesPage() {
  const [integracoes, setIntegracoes] = useState<Integracao[]>(integracoesIniciais)
  const [camposVisiveis, setCamposVisiveis] = useState<Record<string, boolean>>({})
  const [salvando, setSalvando] = useState<string | null>(null)
  const [testando, setTestando] = useState<string | null>(null)

  const toggleVisibilidade = (campoId: string) => {
    setCamposVisiveis(prev => ({
      ...prev,
      [campoId]: !prev[campoId]
    }))
  }

  const atualizarCampo = (integracaoId: string, campoId: string, valor: string) => {
    setIntegracoes(prev => prev.map(int => {
      if (int.id === integracaoId) {
        return {
          ...int,
          campos: int.campos.map(c => 
            c.id === campoId ? { ...c, valor } : c
          )
        }
      }
      return int
    }))
  }

  const salvarIntegracao = async (integracaoId: string) => {
    setSalvando(integracaoId)
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSalvando(null)
    
    // Atualiza status (em produção, verificaria se realmente conectou)
    setIntegracoes(prev => prev.map(int => 
      int.id === integracaoId 
        ? { ...int, status: 'conectado' as IntegracaoStatus } 
        : int
    ))
  }

  const testarConexao = async (integracaoId: string) => {
    setTestando(integracaoId)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTestando(null)
  }

  const getStatusIcon = (status: IntegracaoStatus) => {
    switch (status) {
      case 'conectado':
        return <Check size={16} className="text-green-600" />
      case 'erro':
        return <X size={16} className="text-red-500" />
      default:
        return <AlertCircle size={16} className="text-amber-500" />
    }
  }

  const getStatusText = (status: IntegracaoStatus) => {
    switch (status) {
      case 'conectado':
        return 'Conectado'
      case 'erro':
        return 'Erro na conexão'
      default:
        return 'Não configurado'
    }
  }

  const getStatusColor = (status: IntegracaoStatus) => {
    switch (status) {
      case 'conectado':
        return 'bg-green-100 text-green-700'
      case 'erro':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header 
          title="Configurações" 
          subtitle="Conecte suas redes sociais e configure integrações"
        />

        {/* Aviso importante */}
        <div className="bg-dark text-cream p-6 mb-8">
          <div className="flex items-start gap-4">
            <Key size={24} className="text-gold flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-xl mb-2">Segurança das suas credenciais</h3>
              <p className="text-warm-beige text-sm leading-relaxed">
                Suas chaves de API são armazenadas de forma segura no Supabase e nunca são expostas publicamente. 
                Configure primeiro o Supabase para que as outras integrações funcionem corretamente.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Integrações */}
        <div className="space-y-6">
          {integracoes.map(integracao => {
            const Icon = integracao.icon
            const todosPreenchidos = integracao.campos.every(c => c.valor.length > 0)
            
            return (
              <div 
                key={integracao.id}
                className="bg-soft-white border border-black/5"
              >
                {/* Header da integração */}
                <div className="p-6 border-b border-warm-beige/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${integracao.cor} rounded-lg flex items-center justify-center`}>
                        {typeof Icon === 'function' && Icon.toString().includes('span') ? (
                          <Icon />
                        ) : (
                          <Icon size={24} className="text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-xl">{integracao.nome}</h3>
                        <p className="text-sm text-muted">{integracao.descricao}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`
                        flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium
                        ${getStatusColor(integracao.status)}
                      `}>
                        {getStatusIcon(integracao.status)}
                        {getStatusText(integracao.status)}
                      </span>
                      
                      <a 
                        href={integracao.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:text-gold flex items-center gap-1"
                      >
                        Documentação <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Campos */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {integracao.campos.map(campo => (
                      <div key={campo.id}>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          {campo.label}
                        </label>
                        <div className="relative">
                          <input
                            type={campo.tipo === 'password' && !camposVisiveis[campo.id] ? 'password' : 'text'}
                            placeholder={campo.placeholder}
                            value={campo.valor}
                            onChange={(e) => atualizarCampo(integracao.id, campo.id, e.target.value)}
                            className="w-full pr-10"
                          />
                          {campo.tipo === 'password' && (
                            <button
                              type="button"
                              onClick={() => toggleVisibilidade(campo.id)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                            >
                              {camposVisiveis[campo.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          )}
                        </div>
                        {campo.ajuda && (
                          <p className="text-xs text-muted mt-1">{campo.ajuda}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Botões de ação */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-warm-beige/30">
                    <button
                      onClick={() => salvarIntegracao(integracao.id)}
                      disabled={!todosPreenchidos || salvando === integracao.id}
                      className={`
                        btn-primary flex items-center gap-2
                        ${!todosPreenchidos ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {salvando === integracao.id ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Salvar
                        </>
                      )}
                    </button>

                    {integracao.status === 'conectado' && (
                      <button
                        onClick={() => testarConexao(integracao.id)}
                        disabled={testando === integracao.id}
                        className="btn-secondary flex items-center gap-2"
                      >
                        {testando === integracao.id ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Testando...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} />
                            Testar Conexão
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dica final */}
        <div className="mt-8 p-6 bg-cream border border-gold/30">
          <h3 className="font-display text-lg mb-2">💡 Próximos passos</h3>
          <ol className="text-sm text-muted space-y-2 list-decimal list-inside">
            <li>Configure primeiro o <strong>Supabase</strong> (banco de dados)</li>
            <li>Depois conecte o <strong>Instagram</strong> (requer app no Meta Business)</li>
            <li>Configure <strong>YouTube</strong> (requer projeto no Google Cloud)</li>
            <li><strong>Pinterest</strong> e <strong>TikTok</strong> são opcionais</li>
            <li>O <strong>Substack</strong> funciona apenas com a URL (sem autenticação)</li>
          </ol>
        </div>
      </main>
    </div>
  )
}

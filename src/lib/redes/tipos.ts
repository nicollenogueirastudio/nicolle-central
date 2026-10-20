export type Rede = 'instagram' | 'substack' | 'pinterest' | 'tiktok' | 'youtube' | 'linkedin'

export type StatusConexao = 'desconectada' | 'conectada' | 'erro'

export type Conexao = {
  rede: Rede
  conta: string | null
  status: StatusConexao
  ultima_sincronizacao: string | null
  ultimo_erro: string | null
  token_expira_em: string | null
}

export type ResultadoSincronizacao =
  | { ok: true; resumo: string }
  | { ok: false; motivo: string; semConfiguracao?: boolean }

export const REDES: Record<Rede, string> = {
  instagram: 'Instagram',
  substack: 'Substack',
  pinterest: 'Pinterest',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
}

// Ordem de exibição na tela de Conexões.
export const ORDEM_REDES: Rede[] = ['instagram', 'substack', 'pinterest', 'tiktok', 'youtube', 'linkedin']

// Redes que se conectam pelo botão "Conectar" (login na própria rede).
export const REDES_OAUTH = ['pinterest', 'tiktok'] as const
export type RedeOAuth = (typeof REDES_OAUTH)[number]

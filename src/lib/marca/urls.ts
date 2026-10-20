// Endereços dos arquivos da marca (servidos por /api/marca, só para quem está logado).

export type Colecao = 'manual' | 'identidade'

const num = (n: number) => `p${String(n).padStart(2, '0')}`

export const urlPagina = (c: Colecao, n: number) => `/api/marca/${c}/${num(n)}`
export const urlMiniatura = (c: Colecao, n: number) => `/api/marca/${c}/t/${num(n)}`
export const urlArquivo = (caminho: string, baixarComo?: string) =>
  `/api/marca/${caminho}${baixarComo ? `?baixar=${encodeURIComponent(baixarComo)}` : ''}`

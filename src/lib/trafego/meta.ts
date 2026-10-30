// Marketing API da Meta (anúncios). Só servidor: usa o token de usuário do sistema em META_TOKEN.
// Tudo o que gasta dinheiro nasce PAUSADO; ligar é sempre uma ação separada, confirmada na tela.

import type { Anuncio, Config, Objetivo } from './tipos'

const API = 'https://graph.facebook.com/v21.0'

export class ErroMeta extends Error {}

function token() {
  const t = process.env.META_TOKEN
  if (!t) throw new ErroMeta('Token da Meta não configurado na Vercel (META_TOKEN)')
  return t
}

async function ler<T>(caminho: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({ ...params, access_token: token() })
  const r = await fetch(`${API}${caminho}?${qs}`, { cache: 'no-store' })
  const j = await r.json()
  if (!r.ok || j.error) throw new ErroMeta(j.error?.error_user_msg ?? j.error?.message ?? `A Meta respondeu ${r.status}`)
  return j as T
}

async function escrever<T>(caminho: string, corpo: Record<string, unknown>): Promise<T> {
  const form = new URLSearchParams({ access_token: token() })
  for (const [k, v] of Object.entries(corpo)) if (v !== undefined && v !== null) form.set(k, typeof v === 'string' ? v : JSON.stringify(v))
  const r = await fetch(`${API}${caminho}`, { method: 'POST', body: form, cache: 'no-store' })
  const j = await r.json()
  if (!r.ok || j.error) throw new ErroMeta(j.error?.error_user_msg ?? j.error?.message ?? `A Meta respondeu ${r.status}`)
  return j as T
}

/** Lê todas as páginas de uma lista da Meta (até `max` itens). */
async function lerTudo<T>(caminho: string, params: Record<string, string>, max = 500): Promise<T[]> {
  const itens: T[] = []
  let j = await ler<{ data: T[]; paging?: { next?: string } }>(caminho, { limit: '100', ...params })
  itens.push(...j.data)
  while (j.paging?.next && itens.length < max) {
    const r = await fetch(j.paging.next, { cache: 'no-store' })
    j = await r.json()
    if (!j.data) break
    itens.push(...j.data)
  }
  return itens
}

// ---------- diagnóstico ----------

export type Diagnostico = {
  usuario: { id: string; name: string }
  permissoes: { permission: string; status: string }[]
  contas: { id: string; name: string; account_status: number; currency: string; timezone_name: string; amount_spent: string; business?: { name: string } }[]
  paginas: { id: string; name: string; instagram_business_account?: { id: string; username?: string } }[]
}

export async function diagnostico(): Promise<Diagnostico> {
  const usuario = await ler<{ id: string; name: string }>('/me', { fields: 'id,name' })
  const permissoes = await ler<{ data: Diagnostico['permissoes'] }>('/me/permissions').then((r) => r.data).catch(() => [])
  const contas = await lerTudo<Diagnostico['contas'][number]>('/me/adaccounts', { fields: 'id,name,account_status,currency,timezone_name,amount_spent,business{name}' }).catch(() => [])
  const paginas = await lerTudo<Diagnostico['paginas'][number]>('/me/accounts', { fields: 'id,name,instagram_business_account{id,username}' }).catch(() => [])
  return { usuario, permissoes, contas, paginas }
}

// ---------- leitura de resultados ----------

export type Numeros = {
  spend: number; impressions: number; reach: number; clicks: number; inline_link_clicks: number
  ctr: number; cpc: number; cpm: number; frequency: number
  resultados: Record<string, number>   // ações por tipo (link_click, post_engagement, video_view, lead...)
}
type Bruto = Partial<Record<keyof Omit<Numeros, 'resultados'>, string>> & { actions?: { action_type: string; value: string }[]; date_start?: string }

const CAMPOS = 'spend,impressions,reach,clicks,inline_link_clicks,ctr,cpc,cpm,frequency,actions'
const num = (v?: string) => (v ? Number(v) : 0)
function numeros(b: Bruto | undefined): Numeros {
  const resultados: Record<string, number> = {}
  for (const a of b?.actions ?? []) resultados[a.action_type] = Number(a.value)
  return {
    spend: num(b?.spend), impressions: num(b?.impressions), reach: num(b?.reach), clicks: num(b?.clicks),
    inline_link_clicks: num(b?.inline_link_clicks), ctr: num(b?.ctr), cpc: num(b?.cpc), cpm: num(b?.cpm), frequency: num(b?.frequency), resultados,
  }
}
const intervalo = (de: string, ate: string) => JSON.stringify({ since: de, until: ate })

/** Totais do período e a série por dia da conta inteira. */
export async function resultadosConta(conta: string, de: string, ate: string) {
  const [total] = await ler<{ data: Bruto[] }>(`/${conta}/insights`, { fields: CAMPOS, time_range: intervalo(de, ate) }).then((r) => r.data)
  const dias = await lerTudo<Bruto>(`/${conta}/insights`, { fields: CAMPOS, time_range: intervalo(de, ate), time_increment: '1' })
  return { total: numeros(total), dias: dias.map((d) => ({ dia: d.date_start!, ...numeros(d) })) }
}

export type Campanha = {
  id: string; name: string; objective: string; status: string; effective_status: string
  daily_budget?: string; lifetime_budget?: string; start_time?: string; stop_time?: string
  numeros: Numeros
}

export async function campanhas(conta: string, de: string, ate: string): Promise<Campanha[]> {
  const lista = await lerTudo<Omit<Campanha, 'numeros'> & { insights?: { data: Bruto[] } }>(`/${conta}/campaigns`, {
    fields: `id,name,objective,status,effective_status,daily_budget,lifetime_budget,start_time,stop_time,insights.time_range(${intervalo(de, ate)}){${CAMPOS}}`,
    filtering: JSON.stringify([{ field: 'effective_status', operator: 'IN', value: ['ACTIVE', 'PAUSED', 'CAMPAIGN_PAUSED', 'ADSET_PAUSED', 'IN_PROCESS', 'WITH_ISSUES', 'PENDING_REVIEW', 'DISAPPROVED', 'COMPLETED'] }]),
  })
  return lista.map(({ insights, ...c }) => ({ ...c, numeros: numeros(insights?.data[0]) }))
}

export type Conjunto = { id: string; name: string; status: string; effective_status: string; daily_budget?: string; lifetime_budget?: string; numeros: Numeros }
export type AnuncioMeta = {
  id: string; name: string; status: string; effective_status: string
  creative?: { thumbnail_url?: string; image_url?: string; instagram_permalink_url?: string; body?: string }
  numeros: Numeros
}

/** Conjuntos e anúncios de uma campanha, com resultados do período. */
export async function detalheCampanha(id: string, de: string, ate: string) {
  const ins = `insights.time_range(${intervalo(de, ate)}){${CAMPOS}}`
  const conjuntos = await lerTudo<Omit<Conjunto, 'numeros'> & { insights?: { data: Bruto[] } }>(`/${id}/adsets`, { fields: `id,name,status,effective_status,daily_budget,lifetime_budget,${ins}` })
  const anuncios = await lerTudo<Omit<AnuncioMeta, 'numeros'> & { insights?: { data: Bruto[] } }>(`/${id}/ads`, { fields: `id,name,status,effective_status,creative{thumbnail_url,image_url,instagram_permalink_url,body},${ins}` })
  return {
    conjuntos: conjuntos.map(({ insights, ...c }) => ({ ...c, numeros: numeros(insights?.data[0]) })),
    anuncios: anuncios.map(({ insights, ...a }) => ({ ...a, numeros: numeros(insights?.data[0]) })),
  }
}

// ---------- ações que mexem na conta ----------

export async function mudarStatus(id: string, status: 'ACTIVE' | 'PAUSED') {
  return escrever<{ success: boolean }>(`/${id}`, { status })
}

/** Orçamento diário em reais (a Meta guarda em centavos). Vale para campanha (CBO) ou conjunto. */
export async function mudarOrcamentoDiario(id: string, reais: number) {
  return escrever<{ success: boolean }>(`/${id}`, { daily_budget: String(Math.round(reais * 100)) })
}

/** Busca de cidades e interesses para o público. */
export async function buscar(tipo: 'cidade' | 'interesse', q: string) {
  if (tipo === 'cidade') {
    const r = await ler<{ data: { key: string; name: string; region?: string; country_code: string }[] }>('/search', { type: 'adgeolocation', location_types: '["city"]', q, limit: '10' })
    return r.data.map((c) => ({ id: c.key, nome: `${c.name}${c.region ? `, ${c.region}` : ''}` }))
  }
  const r = await ler<{ data: { id: string; name: string; audience_size_lower_bound?: number; audience_size_upper_bound?: number }[] }>('/search', { type: 'adinterest', q, limit: '10' })
  return r.data.map((i) => ({ id: i.id, nome: i.name, tamanho: i.audience_size_upper_bound }))
}

// ---------- publicar um anúncio montado no sistema ----------

const OBJETIVO: Record<Objetivo, { campanha: string; otimizacao: string }> = {
  alcance: { campanha: 'OUTCOME_AWARENESS', otimizacao: 'REACH' },
  engajamento: { campanha: 'OUTCOME_ENGAGEMENT', otimizacao: 'POST_ENGAGEMENT' },
  trafego: { campanha: 'OUTCOME_TRAFFIC', otimizacao: 'LINK_CLICKS' },
}

function publicoMeta(a: Anuncio) {
  const p = a.publico
  const t: Record<string, unknown> = {
    age_min: p.idade_min ?? 18,
    age_max: p.idade_max ?? 65,
    geo_locations: p.cidades?.length
      ? { cities: p.cidades.map((c) => ({ key: c.id, radius: p.raio ?? 25, distance_unit: 'kilometer' })) }
      : { countries: p.paises?.length ? p.paises : ['BR'] },
    publisher_platforms: ['instagram', 'facebook'],
    instagram_positions: ['stream', 'story', 'explore', 'reels'],
    facebook_positions: ['feed', 'story'],
  }
  if (p.generos?.length) t.genders = p.generos
  if (p.interesses?.length) t.flexible_spec = [{ interests: p.interesses.map((i) => ({ id: i.id, name: i.nome })) }]
  return t
}

/**
 * Cria campanha + conjunto + criativo + anúncio, tudo PAUSADO.
 * O criativo é o post do Instagram impulsionado; no objetivo tráfego vira um anúncio com link usando a imagem do post.
 */
export async function publicar(a: Anuncio, cfg: Config, imagemDoPost?: ArrayBuffer) {
  if (!cfg.conta_anuncios_id || !cfg.pagina_id || !cfg.instagram_id) throw new ErroMeta('Configure a conta de anúncios, a página e o Instagram antes de publicar')
  if (!a.ig_media_id) throw new ErroMeta('Escolha o post do Instagram que vai virar anúncio')
  const conta = cfg.conta_anuncios_id
  const o = OBJETIVO[a.objetivo]
  const ids: { campanha?: string; conjunto?: string; criativo?: string; anuncio?: string } = {}

  ids.campanha = (await escrever<{ id: string }>(`/${conta}/campaigns`, {
    name: a.nome, objective: o.campanha, status: 'PAUSED', special_ad_categories: [],
    is_adset_budget_sharing_enabled: false,
  })).id

  ids.conjunto = (await escrever<{ id: string }>(`/${conta}/adsets`, {
    name: `${a.nome} · público`, campaign_id: ids.campanha, status: 'PAUSED',
    daily_budget: String(Math.round(a.orcamento_diario * 100)),
    billing_event: 'IMPRESSIONS', optimization_goal: o.otimizacao, bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    destination_type: a.objetivo === 'engajamento' ? 'ON_POST' : undefined,
    start_time: a.inicio ? `${a.inicio}T00:00:00-0300` : undefined,
    end_time: a.fim ? `${a.fim}T23:59:00-0300` : undefined,
    targeting: publicoMeta(a),
  })).id

  // Criativo: o próprio post do Instagram; no tráfego, imagem do post + texto + link.
  const identidade = { object_id: cfg.pagina_id }
  let criativo: Record<string, unknown>
  if (a.objetivo === 'trafego') {
    if (!a.link) throw new ErroMeta('Anúncio de tráfego precisa de um link')
    if (!imagemDoPost) throw new ErroMeta('Não consegui baixar a imagem do post para o anúncio com link')
    const up = await escrever<{ images: Record<string, { hash: string }> }>(`/${conta}/adimages`, { bytes: Buffer.from(imagemDoPost).toString('base64') })
    const hash = Object.values(up.images)[0].hash
    criativo = {
      name: `${a.nome} · criativo`,
      object_story_spec: {
        page_id: cfg.pagina_id, instagram_user_id: cfg.instagram_id,
        link_data: { image_hash: hash, link: a.link, message: a.texto ?? '', call_to_action: { type: a.chamada ?? 'LEARN_MORE', value: { link: a.link } } },
      },
    }
  } else {
    criativo = { name: `${a.nome} · criativo`, ...identidade, instagram_user_id: cfg.instagram_id, source_instagram_media_id: a.ig_media_id }
  }
  try {
    ids.criativo = (await escrever<{ id: string }>(`/${conta}/adcreatives`, criativo)).id
  } catch (e) {
    // contas mais antigas ainda pedem o nome antigo do campo
    const antigo = JSON.parse(JSON.stringify(criativo).replace(/instagram_user_id/g, 'instagram_actor_id'))
    ids.criativo = (await escrever<{ id: string }>(`/${conta}/adcreatives`, antigo).catch(() => { throw e })).id
  }

  ids.anuncio = (await escrever<{ id: string }>(`/${conta}/ads`, {
    name: a.nome, adset_id: ids.conjunto, creative: { creative_id: ids.criativo }, status: 'PAUSED',
  })).id

  return ids
}

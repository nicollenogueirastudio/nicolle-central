import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResultadoSincronizacao } from './tipos'

// O Substack não tem API oficial. O feed RSS público traz as edições
// (título, subtítulo, link, data e capa). Assinantes e aberturas não vêm por aqui.
// A API pública do site (a mesma que o próprio Substack usa) completa com curtidas, comentários
// e palavras de cada edição, e com os Notes do perfil. Se ela mudar, o feed continua funcionando.

export type EdicaoFeed = {
  id: string
  titulo: string
  subtitulo: string | null
  link: string
  imagem: string | null
  publicado_em: string | null
}

function decodificar(texto: string): string {
  return texto
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

function campo(item: string, nome: string): string | null {
  const achado = item.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`))
  if (!achado) return null
  const bruto = achado[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')
  return decodificar(bruto) || null
}

/** Função pura: transforma o XML do feed em edições. */
export function lerFeed(xml: string): EdicaoFeed[] {
  const itens = xml.split('<item>').slice(1).map((t) => t.split('</item>')[0])
  const edicoes: EdicaoFeed[] = []
  for (let i = 0; i < itens.length; i++) {
    const item = itens[i]
    const link = campo(item, 'link')
    const titulo = campo(item, 'title')
    if (!link || !titulo) continue
    const data = campo(item, 'pubDate')
    edicoes.push({
      id: campo(item, 'guid') ?? link,
      titulo,
      subtitulo: campo(item, 'description'),
      link,
      imagem: item.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ?? null,
      publicado_em: data ? new Date(data).toISOString() : null,
    })
  }
  return edicoes
}

export async function sincronizarSubstack(supabase: SupabaseClient, endereco: string): Promise<ResultadoSincronizacao> {
  const resposta = await fetch(`https://${endereco}/feed`, { cache: 'no-store' })
  if (!resposta.ok) return { ok: false, motivo: `O feed respondeu ${resposta.status}` }

  const edicoes = lerFeed(await resposta.text())
  if (edicoes.length === 0) return { ok: false, motivo: 'O feed veio sem edições' }

  const agora = new Date().toISOString()
  const { error } = await supabase
    .from('substack_edicoes')
    .upsert(edicoes.map((e) => ({ ...e, sincronizado_em: agora })), { onConflict: 'id' })
  if (error) return { ok: false, motivo: error.message }

  const extras = await completarComApi(supabase, endereco).catch((e) => ` · API: ${(e as Error).message}`)

  const hoje = agora.slice(0, 10)
  await supabase.from('metricas_conta').upsert(
    { rede: 'substack', dia: hoje, publicacoes: edicoes.length, coletado_em: agora },
    { onConflict: 'rede,dia' }
  )

  return { ok: true, resumo: `${edicoes.length} edições${extras}` }
}

type PostApi = { canonical_url: string; reaction_count?: number; comment_count?: number; wordcount?: number; restacks?: number; publishedBylines?: { id: number }[] }
type NoteApi = { id: number; date: string; body?: string; reaction_count?: number; restacks?: number; children_count?: number; attachments?: { type: string; imageUrl?: string }[] }
const NAVEGADOR = { 'User-Agent': 'Mozilla/5.0 (Nicolle Central)' }

/** Curtidas, comentários e palavras das edições + os Notes do perfil da autora. */
async function completarComApi(supabase: SupabaseClient, endereco: string): Promise<string> {
  const posts: PostApi[] = []
  for (let offset = 0; offset < 500; offset += 50) {
    const r = await fetch(`https://${endereco}/api/v1/archive?sort=new&limit=50&offset=${offset}`, { cache: 'no-store', headers: NAVEGADOR })
    if (!r.ok) throw new Error(`arquivo respondeu ${r.status}`)
    const lote = (await r.json()) as PostApi[]
    posts.push(...lote)
    if (lote.length < 50) break
  }
  for (const p of posts) {
    await supabase.from('substack_edicoes')
      .update({ curtidas: p.reaction_count ?? null, comentarios: p.comment_count ?? null, palavras: p.wordcount ?? null, restacks: p.restacks ?? null })
      .eq('link', p.canonical_url)
  }

  const autora = posts.find((p) => p.publishedBylines?.length)?.publishedBylines![0].id
  if (!autora) return ''
  const notes: NoteApi[] = []
  let cursor: string | null = null
  for (let pagina = 0; pagina < 20; pagina++) {
    const url: string = `https://substack.com/api/v1/reader/feed/profile/${autora}?types%5B%5D=note${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
    const r = await fetch(url, { cache: 'no-store', headers: NAVEGADOR })
    if (!r.ok) break
    const d = (await r.json()) as { items?: { type: string; comment?: NoteApi }[]; nextCursor?: string | null }
    for (const it of d.items ?? []) if (it.type === 'comment' && it.comment) notes.push(it.comment)
    cursor = d.nextCursor ?? null
    if (!cursor) break
  }
  if (notes.length) {
    const agora = new Date().toISOString()
    const { error } = await supabase.from('substack_notes').upsert(notes.map((n) => ({
      id: n.id,
      publicado_em: n.date,
      texto: n.body ?? null,
      imagens: (n.attachments ?? []).filter((a) => a.type === 'image' && a.imageUrl).map((a) => a.imageUrl),
      curtidas: n.reaction_count ?? null,
      restacks: n.restacks ?? null,
      respostas: n.children_count ?? null,
      sincronizado_em: agora,
    })), { onConflict: 'id' })
    if (error) throw new Error(error.message)
  }
  return ` · ${notes.length} notes`
}

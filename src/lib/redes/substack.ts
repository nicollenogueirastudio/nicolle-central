import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResultadoSincronizacao } from './tipos'

// O Substack não tem API oficial. O feed RSS público traz as edições
// (título, subtítulo, link, data e capa). Assinantes e aberturas não vêm por aqui.

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

  const hoje = agora.slice(0, 10)
  await supabase.from('metricas_conta').upsert(
    { rede: 'substack', dia: hoje, publicacoes: edicoes.length, coletado_em: agora },
    { onConflict: 'rede,dia' }
  )

  return { ok: true, resumo: `${edicoes.length} edições` }
}

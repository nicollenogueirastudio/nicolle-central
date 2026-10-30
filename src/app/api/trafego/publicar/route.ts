import { NextResponse } from 'next/server'
import { publicar } from '@/lib/trafego/meta'
import { sessao, naoLogado, falha, lerConfig, registrar } from '@/lib/trafego/servidor'
import { reais, type Anuncio } from '@/lib/trafego/tipos'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Leva um anúncio APROVADO para a Meta. Tudo nasce pausado: ligar é outro clique, com confirmação.
export async function POST(request: Request) {
  const { supabase, user } = await sessao()
  if (!user) return naoLogado()
  const { id } = (await request.json().catch(() => ({}))) as { id?: string }
  if (!id) return falha(new Error('Anúncio não informado'))

  const { data: a, error } = await supabase.from('anuncios').select('*').eq('id', id).maybeSingle<Anuncio>()
  if (error || !a) return falha(error ?? new Error('Anúncio não encontrado'), 404)
  if (a.status !== 'aprovado' && a.status !== 'erro') return falha(new Error('Só anúncio aprovado vai para a Meta'))

  try {
    const cfg = await lerConfig(supabase)
    if (cfg.teto_diario != null && a.orcamento_diario > cfg.teto_diario) throw new Error(`Orçamento diário acima do teto de ${reais(cfg.teto_diario)}`)

    // No objetivo tráfego o criativo usa a imagem do post (a primeira mídia guardada no sistema).
    let imagem: ArrayBuffer | undefined
    if (a.objetivo === 'trafego' && a.post_id) {
      const { data: m } = await supabase.from('posts_midia').select('caminho').eq('post_id', a.post_id).order('ordem').limit(1).maybeSingle()
      if (m?.caminho) imagem = await (await supabase.storage.from('posts-midia').download(m.caminho)).data?.arrayBuffer()
    }

    const ids = await publicar(a, cfg, imagem)
    await supabase.from('anuncios').update({
      status: 'publicado', erro: null,
      meta_campanha_id: ids.campanha, meta_conjunto_id: ids.conjunto, meta_anuncio_id: ids.anuncio,
    }).eq('id', id)
    await registrar(supabase, user.id, 'publicar', id, { nome: a.nome, ...ids }, true)
    return NextResponse.json({ ok: true, ...ids })
  } catch (e) {
    const motivo = (e as Error).message
    await supabase.from('anuncios').update({ status: 'erro', erro: motivo }).eq('id', id)
    await registrar(supabase, user.id, 'publicar', id, { nome: a.nome }, false, motivo)
    return falha(e)
  }
}

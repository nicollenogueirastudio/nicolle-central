// Pacote do mês: o que a agência entregava no Drive (pastas com imagens + legenda + planilha),
// gerado a partir do calendário. Serve para passar o mês para quem for produzir ou postar.

import JSZip from 'jszip'
import { partesBR } from '@/lib/datas'
import { legendaFinal } from './regras'
import { quadroPorId, FASES, TERRITORIOS } from './estrategia'
import { CATEGORIAS, PILARES, STATUS, TIPOS, type Post } from './tipos'

const limparNome = (t: string) => t.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60)

const celula = (v: string | null | undefined) => `"${(v ?? '').replace(/"/g, '""')}"`

export function nomePasta(post: Post, i: number) {
  const data = post.data_hora ? partesBR(post.data_hora).data : 'sem-data'
  return `${String(i + 1).padStart(2, '0')} · ${data} · ${limparNome(post.titulo || post.legenda?.slice(0, 40) || 'Sem título')}`
}

/** Planilha (CSV que abre no Excel e no Google Sheets) com uma linha por post, na ordem do mês. */
export function planilhaCSV(posts: Post[]): string {
  const cabecalho = ['Nº', 'Data', 'Hora', 'Formato', 'Categoria', 'Pilar', 'Quadro', 'Fase', 'Território', 'Título', 'Legenda', 'Hashtags', 'Primeiro comentário', 'Briefing', 'Fonte e créditos', 'Responsável', 'Status', 'Comentário da aprovação', 'Arquivos', 'Pasta']
  const linhas = posts.map((p, i) => {
    const partes = p.data_hora ? partesBR(p.data_hora) : null
    return [
      String(i + 1), partes?.data ?? '', partes?.hora ?? '', TIPOS[p.tipo], p.categoria ? CATEGORIAS[p.categoria] : '', p.pilar ? PILARES[p.pilar] : '',
      quadroPorId(p.quadro)?.nome ?? '', p.fase ? FASES[p.fase].nome : '', p.territorio ? TERRITORIOS[p.territorio] : '',
      p.titulo ?? '', p.legenda ?? '', p.hashtags ?? '', p.primeiro_comentario ?? '', p.briefing ?? '', p.fonte ?? '',
      p.responsavel ?? '', STATUS[p.status], p.nota_aprovacao ?? '', String(p.midias.length), nomePasta(p, i),
    ].map(celula).join(';')
  })
  return '﻿' + [cabecalho.map(celula).join(';'), ...linhas].join('\r\n')
}

function textoDoPost(p: Post) {
  const q = quadroPorId(p.quadro)
  const partes = p.data_hora ? partesBR(p.data_hora) : null
  return [
    p.titulo || 'Sem título',
    '',
    `Data: ${partes ? `${partes.data} às ${partes.hora} (Brasília)` : 'sem data'}`,
    `Formato: ${TIPOS[p.tipo]}${q ? ` · ${q.formato}` : ''}`,
    p.pilar ? `Pilar: ${PILARES[p.pilar]}${q ? ` · Quadro: ${q.nome}` : ''}` : '',
    p.briefing ? `\nBriefing:\n${p.briefing}` : '',
    p.fonte ? `\nFonte e créditos: ${p.fonte}` : '',
    '\n──── Legenda (copiar e colar) ────\n',
    legendaFinal(p),
    p.primeiro_comentario ? `\n──── Primeiro comentário ────\n\n${p.primeiro_comentario}` : '',
    '',
  ].filter((l) => l !== '').join('\n')
}

/** Monta o .zip: planilha + uma pasta por post com as mídias numeradas na ordem do carrossel e a legenda. */
export async function montarPacote(posts: Post[], nomeMes: string, aoAvancar?: (feito: number, total: number) => void): Promise<Blob> {
  const zip = new JSZip()
  const raiz = zip.folder(limparNome(`Pacote ${nomeMes}`))!
  raiz.file('Planilha do mês.csv', planilhaCSV(posts))

  const total = posts.reduce((s, p) => s + p.midias.length, 0)
  let feito = 0
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i]
    const pasta = raiz.folder(nomePasta(p, i))!
    pasta.file('Legenda.txt', textoDoPost(p))
    for (let j = 0; j < p.midias.length; j++) {
      const m = p.midias[j]
      if (!m.url) continue
      const ext = m.caminho.split('.').pop() || (m.tipo === 'video' ? 'mp4' : 'jpg')
      const resposta = await fetch(m.url)
      if (resposta.ok) pasta.file(`${String(j + 1).padStart(2, '0')}.${ext}`, await resposta.blob())
      aoAvancar?.(++feito, total)
    }
  }
  return zip.generateAsync({ type: 'blob' })
}

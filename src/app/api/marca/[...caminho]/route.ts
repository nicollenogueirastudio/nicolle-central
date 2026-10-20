// Arquivos da marca (páginas dos manuais, logos, avatares, textura, fontes).
// Ficam em /conteudo/marca, fora do /public: só saem para quem está logado.
// O endereço não tem extensão de propósito, assim o middleware de login também passa por aqui.

import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { criarClienteServidor } from '@/lib/supabase/server'

const RAIZ = path.join(process.cwd(), 'conteudo', 'marca')
const TIPOS: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.html': 'text/html; charset=utf-8',
  '.rar': 'application/vnd.rar',
}

export async function GET(request: Request, { params }: { params: { caminho: string[] } }) {
  const supabase = criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Não autorizado', { status: 401 })

  const partes = params.caminho
  if (partes.some((p) => !/^[a-z0-9_-]+$/i.test(p))) return new NextResponse('Caminho inválido', { status: 400 })

  const base = path.join(RAIZ, ...partes)
  for (const [ext, tipo] of Object.entries(TIPOS)) {
    try {
      const arquivo = await fs.readFile(base + ext)
      const baixar = new URL(request.url).searchParams.get('baixar')
      return new NextResponse(arquivo, {
        headers: {
          'Content-Type': tipo,
          'Cache-Control': 'private, max-age=86400',
          ...(baixar ? { 'Content-Disposition': `attachment; filename="${baixar.replace(/[^\w.-]/g, '_')}"` } : {}),
        },
      })
    } catch {
      // tenta a próxima extensão
    }
  }
  return new NextResponse('Não encontrado', { status: 404 })
}

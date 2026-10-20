'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Pencil, Plus, X, RotateCcw, Loader2 } from 'lucide-react'
import { AbrirPagina } from './Leitor'
import { urlMiniatura } from '@/lib/marca/urls'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { registrarAtividade } from '@/lib/atividades'
import type { Bloco, Secao } from '@/lib/marca/manual'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const colunas = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }
const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-3 py-1.5 text-[13.5px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'

export function BlocoManual({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case 'paragrafos':
      return <div className="space-y-3 max-w-[760px]">{bloco.itens.map((p, i) => <p key={i} className="text-[15px] leading-relaxed text-charcoal/85 whitespace-pre-line">{p}</p>)}</div>
    case 'destaque':
      return <p className="text-[19px] leading-snug text-charcoal font-medium tracking-tight max-w-[760px] border-l-2 border-olive pl-4 whitespace-pre-line">{bloco.texto}</p>
    case 'cartoes':
      return (
        <div className={`grid ${colunas[bloco.colunas ?? 3]} gap-3`}>
          {bloco.itens.map((c, i) => (
            <div key={i} className={`${cartao} p-4`}>
              {c.rotulo && <div className="text-[11px] font-medium text-muted mb-1">{c.rotulo}</div>}
              <div className="text-[14px] font-medium text-charcoal leading-snug">{c.titulo}</div>
              {c.texto && <p className="text-[13px] text-charcoal/75 leading-relaxed mt-1.5 whitespace-pre-line">{c.texto}</p>}
            </div>
          ))}
        </div>
      )
    case 'numerada':
      return (
        <ol className={`${cartao} divide-y divide-linha`}>
          {bloco.itens.map((it, i) => (
            <li key={i} className="flex gap-4 px-5 py-3">
              <span className="text-[13px] text-muted tabular-nums w-5 shrink-0 pt-px">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[14px] text-charcoal/85 leading-relaxed">
                {it.titulo && <span className="font-medium text-charcoal">{it.titulo}. </span>}
                {it.texto}
              </span>
            </li>
          ))}
        </ol>
      )
    case 'palavras':
      return (
        <div className="flex items-baseline gap-3 flex-wrap">
          {bloco.titulo && <span className="text-[12px] font-medium text-muted w-[170px] shrink-0">{bloco.titulo}</span>}
          <div className="flex flex-wrap gap-1.5">
            {bloco.itens.map((p) => (
              <span key={p} className={`px-3 py-1 rounded-full text-[13px] ${bloco.banidas ? 'bg-[#8C6B3F]/10 text-[#8C6B3F] line-through decoration-[#8C6B3F]/50' : 'bg-white border border-linha text-charcoal'}`}>{p}</span>
            ))}
          </div>
        </div>
      )
    case 'contraste':
      return (
        <div className={`${cartao} overflow-hidden`}>
          <div className="grid grid-cols-2 text-[12px] font-medium text-muted border-b border-linha">
            <div className="px-5 py-2.5">{bloco.esquerda}</div>
            <div className="px-5 py-2.5 border-l border-linha">{bloco.direita}</div>
          </div>
          {bloco.linhas.map(([a, b], i) => (
            <div key={i} className="grid grid-cols-2 text-[14px] border-b border-linha last:border-0">
              <div className="px-5 py-3 text-charcoal">{a}</div>
              <div className="px-5 py-3 border-l border-linha text-muted line-through decoration-black/20">{b}</div>
            </div>
          ))}
        </div>
      )
    case 'imagens':
      return (
        <div className="grid grid-cols-3 gap-3">
          {bloco.paginas.map((p) => (
            <AbrirPagina key={p} colecao="manual" pagina={p} className="rounded-xl overflow-hidden border border-linha hover:shadow-card transition-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlMiniatura('manual', p)} alt={`Página ${p}`} loading="lazy" className="w-full aspect-video object-cover" />
            </AbrirPagina>
          ))}
        </div>
      )
  }
}

// ---- edição ----

function Remover({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label="Remover" className="w-7 h-7 shrink-0 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-muted"><X size={13} /></button>
}
function Adicionar({ onClick, texto = 'Adicionar' }: { onClick: () => void; texto?: string }) {
  return <button type="button" onClick={onClick} className="flex items-center gap-1 text-[12.5px] text-accent hover:text-charcoal"><Plus size={13} /> {texto}</button>
}

function EditarBloco({ bloco, onMudar }: { bloco: Bloco; onMudar: (b: Bloco) => void }) {
  switch (bloco.tipo) {
    case 'paragrafos':
      return (
        <div className="space-y-2">
          {bloco.itens.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea className={`${campo} min-h-[70px] resize-y leading-relaxed`} value={p} onChange={(e) => onMudar({ ...bloco, itens: bloco.itens.map((x, j) => (j === i ? e.target.value : x)) })} />
              <Remover onClick={() => onMudar({ ...bloco, itens: bloco.itens.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <Adicionar texto="Parágrafo" onClick={() => onMudar({ ...bloco, itens: [...bloco.itens, ''] })} />
        </div>
      )
    case 'destaque':
      return <textarea className={`${campo} min-h-[60px] resize-y font-medium`} value={bloco.texto} onChange={(e) => onMudar({ ...bloco, texto: e.target.value })} />
    case 'cartoes':
      return (
        <div className="space-y-2">
          {bloco.itens.map((c, i) => {
            const mudar = (d: Partial<typeof c>) => onMudar({ ...bloco, itens: bloco.itens.map((x, j) => (j === i ? { ...x, ...d } : x)) })
            return (
              <div key={i} className="flex gap-2 items-start rounded-xl bg-black/[0.02] p-2.5">
                <div className="flex-1 grid grid-cols-[160px_1fr] gap-2">
                  <input className={campo} placeholder="rótulo (opcional)" value={c.rotulo ?? ''} onChange={(e) => mudar({ rotulo: e.target.value || undefined })} />
                  <input className={`${campo} font-medium`} placeholder="título" value={c.titulo} onChange={(e) => mudar({ titulo: e.target.value })} />
                  <textarea className={`${campo} col-span-2 min-h-[56px] resize-y`} placeholder="texto" value={c.texto ?? ''} onChange={(e) => mudar({ texto: e.target.value || undefined })} />
                </div>
                <Remover onClick={() => onMudar({ ...bloco, itens: bloco.itens.filter((_, j) => j !== i) })} />
              </div>
            )
          })}
          <Adicionar texto="Cartão" onClick={() => onMudar({ ...bloco, itens: [...bloco.itens, { titulo: '' }] })} />
        </div>
      )
    case 'numerada':
      return (
        <div className="space-y-2">
          {bloco.itens.map((it, i) => {
            const mudar = (d: Partial<typeof it>) => onMudar({ ...bloco, itens: bloco.itens.map((x, j) => (j === i ? { ...x, ...d } : x)) })
            return (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[12px] text-muted tabular-nums w-5 pt-2">{String(i + 1).padStart(2, '0')}</span>
                <input className={`${campo} w-[200px] shrink-0 font-medium`} placeholder="título (opcional)" value={it.titulo ?? ''} onChange={(e) => mudar({ titulo: e.target.value || undefined })} />
                <textarea className={`${campo} min-h-[38px] resize-y`} value={it.texto} onChange={(e) => mudar({ texto: e.target.value })} />
                <Remover onClick={() => onMudar({ ...bloco, itens: bloco.itens.filter((_, j) => j !== i) })} />
              </div>
            )
          })}
          <Adicionar texto="Item" onClick={() => onMudar({ ...bloco, itens: [...bloco.itens, { texto: '' }] })} />
        </div>
      )
    case 'palavras':
      return (
        <div className="grid grid-cols-[200px_1fr] gap-2">
          <input className={campo} placeholder="título do grupo" value={bloco.titulo ?? ''} onChange={(e) => onMudar({ ...bloco, titulo: e.target.value || undefined })} />
          <input className={campo} placeholder="palavras separadas por vírgula" value={bloco.itens.join(', ')}
            onChange={(e) => onMudar({ ...bloco, itens: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
        </div>
      )
    case 'contraste':
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 pr-9">
            <input className={`${campo} font-medium`} value={bloco.esquerda} onChange={(e) => onMudar({ ...bloco, esquerda: e.target.value })} />
            <input className={`${campo} font-medium`} value={bloco.direita} onChange={(e) => onMudar({ ...bloco, direita: e.target.value })} />
          </div>
          {bloco.linhas.map(([a, b], i) => (
            <div key={i} className="flex gap-2">
              <input className={campo} value={a} onChange={(e) => onMudar({ ...bloco, linhas: bloco.linhas.map((x, j) => (j === i ? [e.target.value, x[1]] : x)) as [string, string][] })} />
              <input className={campo} value={b} onChange={(e) => onMudar({ ...bloco, linhas: bloco.linhas.map((x, j) => (j === i ? [x[0], e.target.value] : x)) as [string, string][] })} />
              <Remover onClick={() => onMudar({ ...bloco, linhas: bloco.linhas.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <Adicionar texto="Linha" onClick={() => onMudar({ ...bloco, linhas: [...bloco.linhas, ['', '']] })} />
        </div>
      )
    case 'imagens':
      return <p className="text-[12px] text-muted">Páginas do manual original (não editáveis aqui).</p>
  }
}

/** Uma seção do manual: lê, edita e volta ao texto original. */
export default function SecaoManual({ secao, original, editada, children }: { secao: Secao; original: Secao; editada: boolean; children?: React.ReactNode }) {
  const supabase = useMemo(() => criarClienteNavegador(), [])
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(secao.titulo)
  const [blocos, setBlocos] = useState<Bloco[]>(secao.blocos)
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function salvar() {
    setOcupado(true)
    const { error } = await supabase.from('marca_manual').upsert({ secao_id: secao.id, titulo: titulo.trim() || original.titulo, blocos })
    if (error) { setErro(error.message); setOcupado(false); return }
    await registrarAtividade(supabase, 'editou', 'manual_marca', secao.id)
    setOcupado(false)
    setEditando(false)
    router.refresh()
  }

  async function restaurar() {
    if (!confirm(`Voltar "${original.titulo}" ao texto original do manual? A sua edição desta seção será descartada.`)) return
    setOcupado(true)
    await supabase.from('marca_manual').delete().eq('secao_id', secao.id)
    await registrarAtividade(supabase, 'editou', 'manual_marca', secao.id, { restaurou_original: true })
    setTitulo(original.titulo)
    setBlocos(original.blocos)
    setOcupado(false)
    setEditando(false)
    router.refresh()
  }

  return (
    <article id={secao.id} className="scroll-mt-6 group/secao">
      <div className="flex items-baseline gap-3 mb-4">
        {editando
          ? <input className={`${campo} !text-[22px] !font-semibold tracking-tight max-w-[520px]`} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          : <h2 className="font-display text-[24px] text-charcoal tracking-tight">{secao.titulo}</h2>}
        <AbrirPagina colecao="manual" pagina={secao.pagina} titulo="Ver a página original" className="flex items-center gap-1 text-[12px] text-muted hover:text-charcoal transition-colors">
          <FileText size={12} /> p. {secao.pagina}
        </AbrirPagina>
        {editada && !editando && <span className="text-[11px] text-accent">editado</span>}
        {!editando && (
          <button onClick={() => { setTitulo(secao.titulo); setBlocos(secao.blocos); setEditando(true) }} className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] text-muted hover:text-charcoal hover:bg-black/[0.05] opacity-0 group-hover/secao:opacity-100 transition-opacity">
            <Pencil size={12} /> Editar
          </button>
        )}
      </div>

      {editando ? (
        <div className="rounded-2xl border border-accent/30 bg-white/70 p-5 space-y-5">
          {blocos.map((b, i) => (
            <div key={i}>
              <div className="text-[11px] font-medium text-muted mb-1.5">
                {{ paragrafos: 'Texto', destaque: 'Destaque', cartoes: 'Cartões', numerada: 'Lista numerada', palavras: 'Palavras', contraste: 'Comparação', imagens: 'Imagens' }[b.tipo]}
              </div>
              <EditarBloco bloco={b} onMudar={(nb) => setBlocos((l) => l.map((x, j) => (j === i ? nb : x)))} />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-linha">
            <button onClick={salvar} disabled={ocupado} className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-medium text-white bg-charcoal hover:bg-black disabled:opacity-50">
              {ocupado && <Loader2 size={13} className="animate-spin" />} Salvar
            </button>
            <button onClick={() => setEditando(false)} className="px-4 py-[7px] rounded-full text-[13px] text-charcoal bg-black/[0.05] hover:bg-black/[0.09]">Cancelar</button>
            {editada && (
              <button onClick={restaurar} disabled={ocupado} className="ml-auto flex items-center gap-1.5 px-3 py-[7px] rounded-full text-[12.5px] text-muted hover:text-charcoal hover:bg-black/[0.05]">
                <RotateCcw size={13} /> Voltar ao original
              </button>
            )}
            {erro && <span className="text-[12px] text-accent">{erro}</span>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {secao.blocos.map((b, i) => <BlocoManual key={i} bloco={b} />)}
          {children}
        </div>
      )}
    </article>
  )
}

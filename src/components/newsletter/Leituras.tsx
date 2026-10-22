'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import { diaCurto } from '@/lib/datas'
import type { Leitura } from '@/lib/newsletter/escrita'

const campo = 'w-full rounded-[10px] border border-black/[0.10] bg-white px-2.5 py-1.5 text-[13px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15'

/** O que as newsletters de referência estão publicando: repertório para calibrar a edição, nunca para copiar. */
export default function Leituras({ supabase, compacto = false }: { supabase: SupabaseClient; compacto?: boolean }) {
  const [lista, setLista] = useState<Leitura[]>([])
  const [novo, setNovo] = useState<{ newsletter: string; titulo: string; link: string; nota: string } | null>(null)

  const carregar = useCallback(async () => {
    const { data } = await supabase.from('newsletter_leituras').select('*').order('publicado_em', { ascending: false, nullsFirst: false })
    setLista((data ?? []) as Leitura[])
  }, [supabase])
  useEffect(() => { carregar() }, [carregar])

  async function salvar() {
    if (!novo?.titulo.trim() || !novo.newsletter.trim()) return
    await supabase.from('newsletter_leituras').insert({
      newsletter: novo.newsletter.trim(), titulo: novo.titulo.trim(), link: novo.link.trim() || null,
      nota: novo.nota.trim() || null, publicado_em: new Date().toISOString().slice(0, 10),
    })
    setNovo(null)
    carregar()
  }

  async function apagar(id: string) {
    await supabase.from('newsletter_leituras').delete().eq('id', id)
    setLista((l) => l.filter((x) => x.id !== id))
  }

  const visiveis = compacto ? lista.slice(0, 5) : lista

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[14px] font-medium text-charcoal">Leituras do momento</span>
        <button onClick={() => setNovo(novo ? null : { newsletter: '', titulo: '', link: '', nota: '' })} className="text-[12px] text-accent flex items-center gap-1"><Plus size={12} /> Anotar</button>
      </div>
      {!compacto && <p className="text-[12px] text-muted mb-3">O que Cabana, WEARSTLERWORLD, For Scale e vizinhos estão publicando. Para ler antes de escrever e fugir do que todo mundo já está dizendo.</p>}

      {novo && (
        <div className="space-y-1.5 mb-3 p-3 rounded-xl bg-black/[0.03]">
          <input className={campo} placeholder="Newsletter" value={novo.newsletter} onChange={(e) => setNovo({ ...novo, newsletter: e.target.value })} />
          <input className={campo} placeholder="Título da edição" value={novo.titulo} onChange={(e) => setNovo({ ...novo, titulo: e.target.value })} />
          <input className={campo} placeholder="Link" value={novo.link} onChange={(e) => setNovo({ ...novo, link: e.target.value })} />
          <input className={campo} placeholder="Por que vale a leitura" value={novo.nota} onChange={(e) => setNovo({ ...novo, nota: e.target.value })} />
          <button onClick={salvar} className="px-3 py-1 rounded-full bg-charcoal text-white text-[12px]">Guardar</button>
        </div>
      )}

      <div className="space-y-2.5">
        {visiveis.map((l) => (
          <div key={l.id} className="group flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-muted">{l.newsletter}{l.publicado_em ? ` · ${diaCurto(l.publicado_em)}` : ''}</div>
              <a href={l.link ?? undefined} target="_blank" rel="noreferrer" className="text-[13px] text-charcoal font-medium leading-snug hover:underline inline-flex items-center gap-1">
                {l.titulo}{l.link && <ExternalLink size={11} className="text-muted shrink-0" />}
              </a>
              {l.nota && <p className={`text-[12px] text-muted leading-snug mt-0.5 ${compacto ? 'line-clamp-2' : ''}`}>{l.nota}</p>}
            </div>
            <button onClick={() => apagar(l.id)} aria-label="Apagar" className="opacity-0 group-hover:opacity-100 text-muted hover:text-charcoal pt-3"><Trash2 size={12} /></button>
          </div>
        ))}
        {lista.length === 0 && <p className="text-[12px] text-muted">Nada anotado ainda.</p>}
      </div>
    </div>
  )
}

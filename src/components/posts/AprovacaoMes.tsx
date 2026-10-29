'use client'

import { Layers, Film } from 'lucide-react'
import AcoesAprovacao, { type MudarStatus } from './AcoesAprovacao'
import { corPilar, estiloStatus } from './estilos'
import { quadroPorId } from '@/lib/posts/estrategia'
import { PILARES, STATUS, TIPOS, type Post, type Midia } from '@/lib/posts/tipos'
import { partesBR } from '@/lib/datas'

const cartao = 'bg-white rounded-2xl border border-linha shadow-card'
const pilula = 'inline-flex items-center px-2 py-px rounded-full text-[11px] font-medium'

/** 'ter 3/11' */
function diaCurtoSemana(iso: string) {
  const { data } = partesBR(iso)
  const [a, m, d] = data.split('-').map(Number)
  const semana = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', weekday: 'short' }).format(new Date(Date.UTC(a, m - 1, d))).replace('.', '')
  return `${semana} ${d}/${m}`
}

const irPara = (id: string) => document.getElementById(`mes-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function Slide({ m, vertical }: { m: Midia; vertical: boolean }) {
  const caixa = `relative shrink-0 snap-start overflow-hidden rounded-md bg-cream shadow-card ${vertical ? 'w-[200px] aspect-[9/16]' : 'w-[250px] aspect-[4/5]'}`
  if (!m.url) return <div className={caixa} />
  return (
    <div className={caixa}>
      {m.tipo === 'video'
        ? <video src={m.url} className="w-full h-full object-cover" muted loop playsInline controls />
        // eslint-disable-next-line @next/next/no-img-element
        : <img src={m.url} alt="" className="w-full h-full object-cover" />}
    </div>
  )
}

/** Capa no grid do perfil, cortada em 4:5 como o Instagram mostra. */
function Capa({ post }: { post: Post }) {
  const capa = post.midias[0]
  return (
    <button onClick={() => irPara(post.id)} className="relative aspect-[4/5] bg-cream overflow-hidden">
      {capa?.url
        ? (capa.tipo === 'video'
          ? <video src={capa.url} className="w-full h-full object-cover" muted />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={capa.url} alt="" className="w-full h-full object-cover" />)
        : <span className="absolute inset-0 flex items-center justify-center p-1 text-[9px] text-muted text-center">{post.titulo || 'Sem mídia'}</span>}
      {post.tipo === 'carrossel' && <Layers size={11} className="absolute top-1 right-1 text-white drop-shadow" />}
      {post.tipo === 'reels' && <Film size={11} className="absolute top-1 right-1 text-white drop-shadow" />}
    </button>
  )
}

/**
 * O mês inteiro numa página, como a prévia de feed em HTML: o perfil e o calendário no topo,
 * depois cada post com todos os slides lado a lado, a legenda e o porquê.
 */
export default function AprovacaoMes({ posts, onMudar, onAbrir }: { posts: Post[]; onMudar: MudarStatus; onAbrir: (p: Post) => void }) {
  const grade = [...posts].reverse()
  const contar = (f: (p: Post) => boolean) => posts.filter(f).length
  const resumo = [
    { n: posts.length, txt: 'posts no mês' },
    ...(Object.keys(PILARES) as (keyof typeof PILARES)[]).map((k) => ({ n: contar((p) => p.pilar === k), txt: PILARES[k].toLowerCase() })),
    { n: contar((p) => p.status === 'aprovacao'), txt: 'esperando você' },
  ]

  if (posts.length === 0) {
    return (
      <div className={`${cartao} max-w-[640px] py-16 px-8 text-center`}>
        <p className="text-[15px] text-charcoal font-medium">Nenhum post neste mês</p>
        <p className="text-[13px] text-muted mt-1">Quando o mês for montado, os posts aparecem aqui inteiros, com todos os slides.</p>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="grid grid-cols-5 gap-3 mb-8">
        {resumo.map((r) => (
          <div key={r.txt} className={`${cartao} px-4 py-3`}>
            <div className="text-[24px] font-light text-charcoal tabular-nums leading-tight">{r.n}</div>
            <div className="text-[12px] text-muted">{r.txt}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-10 items-start">
        <div className={`${cartao} overflow-hidden`}>
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="w-14 h-14 rounded-full border border-linha flex items-center justify-center bg-white"><img src="/logo-nn.png" alt="" className="w-9" /></span>
            <div>
              <div className="text-[14px] font-semibold text-charcoal">nicollenogueirastudio</div>
              <div className="text-[12.5px] text-muted"><b className="text-charcoal font-medium">{grade.length}</b> posts no mês</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[2px]">
            {grade.map((p) => <Capa key={p.id} post={p} />)}
          </div>
        </div>

        <div>
          <div className="text-[13px] font-medium text-charcoal mb-2">Calendário</div>
          <ol className="divide-y divide-linha border-y border-linha">
            {posts.map((p) => (
              <li key={p.id}>
                <button onClick={() => irPara(p.id)} className="w-full grid grid-cols-[72px_1fr_auto] gap-3 py-2.5 text-left hover:bg-white/50">
                  <span className="text-[12px] text-muted tabular-nums pt-px">{diaCurtoSemana(p.data_hora!)}</span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] text-charcoal truncate">{p.titulo || 'Sem título'}</span>
                    <span className="block text-[11.5px] text-muted truncate">
                      {[quadroPorId(p.quadro)?.nome, TIPOS[p.tipo], p.midias.length > 1 ? `${p.midias.length} slides` : null].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className="flex items-start gap-1.5">
                    {p.pilar && <span className={`${pilula} bg-black/[0.04] text-charcoal/70`}><span className={`w-1.5 h-1.5 rounded-full mr-1 ${corPilar[p.pilar]}`} />{PILARES[p.pilar]}</span>}
                    <span className={`${pilula} ${estiloStatus[p.status]}`}>{STATUS[p.status]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-12 space-y-14">
        {posts.map((p, i) => {
          const vertical = p.tipo === 'reels'
          return (
            <section key={`${p.id}-${p.status}`} id={`mes-${p.id}`} className="scroll-mt-6 pt-6 border-t border-linha">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
                <span className="text-[30px] font-light text-charcoal tabular-nums leading-none">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[16px] text-charcoal">{p.titulo || 'Sem título'}</span>
                <span className="text-[12px] text-muted">
                  {[diaCurtoSemana(p.data_hora!), partesBR(p.data_hora!).hora, quadroPorId(p.quadro)?.nome, `${TIPOS[p.tipo]}${p.midias.length > 1 ? ` · ${p.midias.length}` : ''}`].filter(Boolean).join(' · ')}
                </span>
                {p.pilar && <span className={`${pilula} bg-black/[0.04] text-charcoal/70`}><span className={`w-1.5 h-1.5 rounded-full mr-1 ${corPilar[p.pilar]}`} />{PILARES[p.pilar]}</span>}
                <span className={`${pilula} ${estiloStatus[p.status]}`}>{STATUS[p.status]}</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {p.midias.length
                  ? p.midias.map((m) => <Slide key={m.id} m={m} vertical={vertical} />)
                  : <div className="w-[250px] aspect-[4/5] rounded-md bg-black/[0.04] flex items-center justify-center text-[12px] text-muted">sem mídia</div>}
              </div>

              <div className="grid grid-cols-[1fr_300px] gap-6 mt-4">
                <div className={`${cartao} px-5 py-4 text-[14px] leading-relaxed text-charcoal whitespace-pre-wrap break-words`}>
                  {p.legenda || <span className="text-muted">Sem legenda</span>}
                  {p.hashtags && <div className="text-[#00376b] mt-3">{p.hashtags}</div>}
                </div>
                <aside className="space-y-4">
                  {p.briefing && (
                    <div>
                      <div className="text-[11px] font-medium text-muted uppercase tracking-[0.06em] mb-1">Por que este post</div>
                      <p className="text-[13px] text-charcoal/85 leading-relaxed whitespace-pre-line">{p.briefing}</p>
                    </div>
                  )}
                  <AcoesAprovacao post={p} onMudar={onMudar} onAbrir={onAbrir} />
                </aside>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

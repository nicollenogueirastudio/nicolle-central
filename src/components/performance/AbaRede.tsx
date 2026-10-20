'use client'

import Link from 'next/link'
import { LinhaTempo } from './Graficos'
import { cartao, Tile, Variacao, NaoConectada } from './ui'
import { dataBR } from '@/lib/datas'
import { compacto, type Retrato } from '@/lib/performance/dados'
import { intervalo, moverPeriodo, rotulo, nomeAnterior, type Periodo } from '@/lib/performance/periodos'
import type { Conexao, Rede } from '@/lib/redes/tipos'

// O que cada rede guarda em `detalhe` e como mostrar. `soma` = número diário que se soma no período;
// `retrato` = total da conta naquele dia (mostra o último e a variação).
type Medida = { chave: string; nome: string; modo: 'soma' | 'retrato' }

const MEDIDAS: Partial<Record<Rede, Medida[]>> = {
  pinterest: [
    { chave: 'impressoes', nome: 'Impressões', modo: 'soma' },
    { chave: 'salvos', nome: 'Salvos', modo: 'soma' },
    { chave: 'cliques_pin', nome: 'Cliques no pin', modo: 'soma' },
    { chave: 'cliques_saida', nome: 'Cliques para o site', modo: 'soma' },
  ],
  tiktok: [
    { chave: 'curtidas_total', nome: 'Curtidas na conta', modo: 'retrato' },
    { chave: 'visualizacoes_recentes', nome: 'Views dos 20 últimos vídeos', modo: 'retrato' },
    { chave: 'compartilhamentos_recentes', nome: 'Compartilhamentos (20 últimos)', modo: 'retrato' },
  ],
  youtube: [{ chave: 'visualizacoes_total', nome: 'Visualizações do canal', modo: 'retrato' }],
}

const NOME_SEGUIDORES: Partial<Record<Rede, string>> = { youtube: 'Inscritos' }
const COMO_CONECTAR: Partial<Record<Rede, string>> = {
  pinterest: 'Com o app criado no Pinterest, o botão Conectar leva ao login e a Central passa a ler seguidores, impressões, salvos e cliques todos os dias.',
  tiktok: 'Com o app aprovado pelo TikTok, o botão Conectar leva ao login e a Central passa a ler seguidores, curtidas e os vídeos recentes.',
  youtube: 'Basta uma chave do Google e o @ do canal: inscritos, visualizações e vídeos entram todo dia.',
  linkedin: 'O LinkedIn não libera números de perfil pessoal. Anote os seguidores de vez em quando em Conexões e a curva se forma aqui.',
}

const valor = (r: Retrato, k: string) => {
  const v = (r.detalhe as Record<string, unknown> | null)?.[k]
  return typeof v === 'number' ? v : null
}

export default function AbaRede({ rede, nome, conexao, retratos, periodo }: { rede: Rede; nome: string; conexao?: Conexao; retratos: Retrato[]; periodo: Periodo }) {
  const comNumero = retratos.filter((r) => r.seguidores != null || r.detalhe)
  if (comNumero.length === 0) return <NaoConectada rede={nome} texto={COMO_CONECTAR[rede] ?? ''} />

  const i = intervalo(periodo), a = intervalo(moverPeriodo(periodo, -1))
  const doPeriodo = retratos.filter((r) => r.dia >= i.diaDe && r.dia < i.diaAte)
  const doAnterior = retratos.filter((r) => r.dia >= a.diaDe && r.dia < a.diaAte)
  const nomeAnt = nomeAnterior[periodo.escala]

  const seguidores = retratos.filter((r) => r.seguidores != null)
  const ultimo = seguidores[seguidores.length - 1]
  const segPeriodo = doPeriodo.filter((r) => r.seguidores != null)
  const ganhoPeriodo = segPeriodo.length > 1 ? segPeriodo[segPeriodo.length - 1].seguidores! - segPeriodo[0].seguidores! : null
  const manual = retratos.some((r) => r.origem === 'manual')

  const resumir = (lista: Retrato[], m: Medida) => {
    const vals = lista.map((r) => valor(r, m.chave)).filter((v): v is number => v != null)
    if (!vals.length) return null
    return m.modo === 'soma' ? vals.reduce((s, v) => s + v, 0) : vals[vals.length - 1]
  }
  const medidas = MEDIDAS[rede] ?? []
  const diaria = medidas.find((m) => m.modo === 'soma')
  const curvaDiaria = diaria ? doPeriodo.filter((r) => valor(r, diaria.chave) != null).map((r) => ({ dia: r.dia, valor: valor(r, diaria.chave)! })) : []

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[12px] text-muted">
        {conexao?.status === 'conectada'
          ? <>Conectada{conexao.conta && <> · {conexao.conta}</>}{conexao.ultima_sincronizacao && <> · atualizada {dataBR(conexao.ultima_sincronizacao)}</>}</>
          : <>Números anotados à mão · <Link href="/configuracoes" className="text-charcoal underline underline-offset-2">anotar ou conectar</Link></>}
        {manual && conexao?.status === 'conectada' && <span>· inclui números anotados à mão</span>}
      </div>

      <section className="grid grid-cols-4 gap-4">
        <Tile
          rotulo={NOME_SEGUIDORES[rede] ?? 'Seguidores'}
          valor={ultimo?.seguidores != null ? ultimo.seguidores.toLocaleString('pt-BR') : '—'}
          nota={<span className="text-[12px] text-muted">{ganhoPeriodo == null ? (ultimo ? `em ${dataBR(ultimo.dia + 'T12:00:00Z')}` : '') : `${ganhoPeriodo >= 0 ? '+' : ''}${ganhoPeriodo.toLocaleString('pt-BR')} em ${rotulo(periodo)}`}</span>}
        />
        {medidas.map((m) => (
          <Tile
            key={m.chave}
            rotulo={m.nome + (m.modo === 'soma' ? '' : ' (último)')}
            valor={compacto(resumir(doPeriodo, m))}
            nota={m.modo === 'soma' ? <Variacao atual={resumir(doPeriodo, m)} anterior={resumir(doAnterior, m)} nome={nomeAnt} /> : undefined}
          />
        ))}
      </section>

      <section className={`grid ${diaria && curvaDiaria.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-5`}>
        <div className={`${cartao} p-5`}>
          <div className="text-[14px] font-medium text-charcoal mb-2">{NOME_SEGUIDORES[rede] ?? 'Seguidores'} ao longo do tempo</div>
          {seguidores.length >= 2
            ? <LinhaTempo pontos={seguidores.map((r) => ({ dia: r.dia, valor: r.seguidores! }))} rotulo={NOME_SEGUIDORES[rede] ?? 'Seguidores'} />
            : <p className="text-[13px] text-muted py-10 text-center">A curva aparece a partir do segundo dia com número.</p>}
        </div>
        {diaria && curvaDiaria.length > 1 && (
          <div className={`${cartao} p-5`}>
            <div className="text-[14px] font-medium text-charcoal mb-2">{diaria.nome} por dia · {rotulo(periodo)}</div>
            <LinhaTempo pontos={curvaDiaria} rotulo={diaria.nome} />
          </div>
        )}
      </section>
    </div>
  )
}

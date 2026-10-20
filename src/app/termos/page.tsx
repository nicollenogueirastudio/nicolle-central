import type { Metadata } from 'next'
import PaginaLegal from '@/components/legal/PaginaLegal'

export const metadata: Metadata = { title: 'Termos de uso · Nicolle Nogueira Studio' }

export default function TermosPage() {
  return (
    <PaginaLegal titulo="Termos de uso" atualizado="20 de outubro de 2026">
      <p>
        A Central é uma ferramenta interna do Nicolle Nogueira Studio. O acesso é restrito à equipe do studio, por login,
        e não há cadastro aberto ao público.
      </p>

      <h2>Uso</h2>
      <p>
        A Central serve para planejar o conteúdo do studio e ler, com permissão de leitura, as métricas das contas do
        próprio studio nas redes sociais conectadas. Ela não publica em nome de terceiros nem acessa contas que não sejam
        do studio.
      </p>

      <h2>Contas conectadas</h2>
      <p>
        Cada conexão é autorizada pela dona da conta na tela oficial da rede e pode ser desfeita a qualquer momento. O uso
        das informações segue também os termos de cada rede (Meta, Pinterest, TikTok, Google).
      </p>

      <h2>Dados</h2>
      <p>
        O tratamento dos dados está descrito na <a href="/nicollenogueira/privacidade" className="underline underline-offset-2">política de privacidade</a>.
      </p>

      <h2>Contato</h2>
      <p>
        Nicolle Nogueira Studio · <a href="mailto:contato@nicollenogueira.com.br" className="underline underline-offset-2">contato@nicollenogueira.com.br</a>
      </p>
    </PaginaLegal>
  )
}

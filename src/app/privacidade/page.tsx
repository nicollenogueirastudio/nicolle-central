import type { Metadata } from 'next'
import PaginaLegal from '@/components/legal/PaginaLegal'

export const metadata: Metadata = { title: 'Política de privacidade · Nicolle Nogueira Studio' }

export default function PrivacidadePage() {
  return (
    <PaginaLegal titulo="Política de privacidade" atualizado="20 de outubro de 2026">
      <p>
        A Central é uma ferramenta interna do Nicolle Nogueira Studio, usada apenas pela equipe do studio para planejar
        conteúdo e acompanhar os números das contas do próprio studio nas redes sociais. Ela não é oferecida ao público
        e não tem cadastro aberto.
      </p>

      <h2>Quais dados lemos</h2>
      <p>
        Quando a equipe conecta uma conta do studio (Instagram, Pinterest, TikTok, YouTube), a Central lê, somente com
        permissão de leitura, os números dessa conta: seguidores, publicações e métricas como alcance, impressões,
        salvamentos, cliques, curtidas e visualizações, além das próprias publicações do studio (legenda, data, imagem
        de capa e link).
      </p>
      <p>Não lemos mensagens, não acessamos contas de outras pessoas e não coletamos dados pessoais de seguidores.</p>

      <h2>Para que usamos</h2>
      <p>Exclusivamente para acompanhar o desempenho do conteúdo do studio e planejar as próximas publicações.</p>

      <h2>Onde ficam guardados</h2>
      <p>
        Os dados ficam em banco de dados privado, com acesso restrito por login à equipe do studio. Os acessos às redes
        (tokens) ficam guardados apenas no servidor, nunca expostos na tela.
      </p>

      <h2>Compartilhamento</h2>
      <p>Não vendemos, não alugamos e não compartilhamos esses dados com terceiros.</p>

      <h2>Como desconectar ou apagar</h2>
      <p>
        A conexão pode ser desfeita a qualquer momento nas configurações de cada rede (aplicativos conectados) ou na
        própria Central. Para pedir a exclusão dos dados guardados, escreva para o contato abaixo e apagamos em até 30 dias.
      </p>

      <h2>Contato</h2>
      <p>
        Nicolle Nogueira Studio · <a href="mailto:contato@nicollenogueira.com.br" className="underline underline-offset-2">contato@nicollenogueira.com.br</a> · nicollenogueira.com.br
      </p>
    </PaginaLegal>
  )
}

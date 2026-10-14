# guia da nicolle central · boas práticas e passo a passo

feito a partir do painel interno da latino (a nossa aba de marketing), pra ir construindo a nicolle central aos poucos.
a base que você já tem (next.js + vercel + supabase + tailwind) serve. não precisa trocar nada: este guia é sobre **o que construir, em que ordem e quais cuidados tomar**.

> **como usar:** salve este arquivo no repositório (ex.: `docs/guia.md`) e, se usar o claude code, coloque no `CLAUDE.md` uma linha `@docs/guia.md`, assim ele lê o guia em toda sessão. vá fase por fase. só passe pra próxima quando a anterior estiver salvando dados de verdade e você estiver usando no dia a dia.

---

## parte 1 · regras de base (valem pro projeto inteiro)

### 1.1 segurança do supabase (fazer antes de salvar qualquer dado)
- a chave `anon` do supabase vai pro navegador, então **ela é pública**. o que protege os dados é o **rls (row level security)**.
- ligue o rls em **todas** as tabelas, sem exceção, e crie políticas do tipo "só usuário logado lê e escreve".
- use o **supabase auth** pro login (e-mail com link mágico já resolve).
- a chave `service_role` e os tokens de instagram, meta ads e e-mail ficam **só no servidor** (variáveis de ambiente da vercel), usados em route handlers, server actions ou edge functions. nunca em arquivo com `'use client'` e nunca com prefixo `NEXT_PUBLIC_`.
- teste: abra o site deslogado numa aba anônima e confira que nada carrega.

### 1.2 datas e fuso
- a vercel e o supabase rodam em **utc**. se a tela mostrar a hora crua, o calendário erra em 3 horas.
- crie um arquivo único de datas (ex.: `lib/datas.ts`) com funções `dataBR()` e `dataHoraBR()` usando `timeZone: 'America/Sao_Paulo'`, e use **sempre** ele.
- salve no banco como `timestamptz` (instante). datas "de calendário" sem hora (prazo, vencimento) podem ser `date`.

### 1.3 rotinas automáticas (cron)
quase tudo de marketing depende de coisa rodando sozinha (publicar, puxar métricas, ler gasto de ads).
- **vercel hobby** só deixa cron 1x por dia. pra rodar de 5 em 5 minutos: **vercel pro**, ou **`pg_cron` + edge function no supabase** (funciona no plano grátis).
- todo cron deve gravar quando rodou e se deu certo (tabela `rotinas_log`: nome, início, fim, ok, erro). no painel, um aviso quando uma rotina passou do horário sem rodar. sem isso, um cron parado passa semanas sem ninguém ver.
- funções da vercel têm tempo limite: importações grandes (ex.: 400 posts antigos) vão em lotes/páginas, nunca tudo de uma vez.

### 1.4 histórico (log de atividade) desde o começo
- uma tabela `atividades` (quem, o quê, quando, em qual item) preenchida em toda ação importante (criou post, mudou status, apagou). no nosso, a regra é: **toda tela nova já nasce com log**, nunca "depois".

### 1.5 jeito de trabalhar
- commits pequenos e frequentes. antes de subir: `npm run build` sem erro (e testes, quando tiver).
- **regras de negócio em arquivos puros** (sem banco, sem tela), ex.: `lib/redes/regras.ts`. fica fácil de testar e a tela, o cron e as actions usam a mesma regra.
- apagar = "arquivar" (coluna `arquivado_em`), não deletar de verdade. salva muita dor.
- nome de arquivo e de coluna em português simples, igual em todo lugar.

### 1.6 padronizar nomes (vale ouro depois)
- o que permite somar e comparar mais tarde é **nomear tudo do mesmo jeito**. no nosso, toda campanha de anúncio leva a frente no nome (`[casa] ...`, `[rua] ...`), e o painel divide o gasto lendo o nome.
- defina já as **frentes/pilares** do nn studio (ex.: serviços, produtos, newsletter casa nogs, marca pessoal) e use os mesmos nomes em posts, campanhas e metas.

---

## parte 2 · os módulos de marketing da latino (pra inspirar)

um resumo do que temos, por que existe e qual a versão mais simples pra começar.

| módulo nosso | o que faz | por que existe | versão simples pra começar |
|---|---|---|---|
| **painel de marketing** | resumo do mês: gasto por frente, resultado, posts e "de onde vêm as vendas" | ver tudo numa tela só | cartões com os números do mês |
| **redes sociais: agenda** | posts em semana / quinzena / mês / grade do feed, editor com prévia do instagram | planejar e ver o feed antes de postar | calendário mensal + grade 3 colunas |
| **redes: publicação automática** | cron publica o post agendado no instagram | não depender de lembrar de postar | começar manual: só marcar "postado" |
| **redes: histórico e estudo** | importa todos os posts antigos e métricas, estudo mensal (o que funcionou) | decidir com dado, não com achismo | importar o feed e mostrar curtidas/alcance por post |
| **plano do mês** | regras de quantidade: mínimo de posts, 1 reels, stories de apoio, mistura por pilar | constância | uma meta "x posts no mês" com barra de progresso |
| **sugestões de post** | fotos prontas do acervo viram rascunho com um clique | acabar com a "folha em branco" | uma lista de ideias com botão "virar rascunho" |
| **plano / produções** | cada peça a produzir com briefing, referências, responsável, prazo e prioridade | organizar a produção | quadro (a fazer · fazendo · feito) |
| **referências** | banco de referências pesquisável, com favoritos | inspiração organizada | tabela com imagem, link e etiquetas |
| **estratégia de mídia** | verba do mês dividida por objetivo, com "essa verba dá conta?" | decidir antes de gastar | tabela objetivo × verba × resultado esperado |
| **ads (tráfego pago)** | lê meta (e pinterest) de hora em hora: gasto, cliques, resultado por campanha e por anúncio | saber o que funciona | só leitura, 1x por dia, por campanha |
| **alertas de ads** | avisa anúncio queimando dinheiro, caro demais, cansado (fadiga) ou com pico | não deixar dinheiro escorrer | um alerta: "gastou x e não teve resultado" |
| **relatórios** | relatório mensal por campanha e por frente, comparando períodos | acompanhamento mensal e anual | tabela do mês vs mês anterior |
| **influenciadores** | lista com status (no radar · conversando · parceria · publicou) | não perder contato | exatamente isso, já é útil |
| **branding** | manual vivo: cores que copiam, tipografia, logos pra baixar, voz da marca, sempre/nunca | todo mundo usar a marca igual | uma página estática |
| **mailing (newsletter)** | editor de blocos, lista de contatos com origem, segmentos, envio, rastro de abertura, descadastro | relacionamento direto | lista + envio pelo resend/brevo |
| **tarefas (criação)** | quadro com checklist, comentários com @menção e histórico | o time saber quem faz o quê | quadro simples com responsável e prazo |

---

## parte 3 · passo a passo

cada fase tem: **o que fazer**, **tabelas sugeridas**, **cuidados** e **pronto quando**.

### fase 0 · fundação
- **o que fazer:** login (supabase auth), rls em tudo, arquivo de datas, layout com menu, tabela de atividades.
- **tabelas:** `perfis` (id do auth, nome, papel), `atividades` (usuario_id, acao, entidade, entidade_id, detalhe, criado_em).
- **cuidados:** item 1.1 inteiro. não começar a fase 1 sem o teste da aba anônima.
- **pronto quando:** deslogado não vê nada; logado vê o painel; uma ação qualquer aparece no log.

### fase 1 · calendário de posts salvando de verdade
- **o que fazer:** criar, editar, mover e arquivar posts. visões: mês (calendário), semana e **grade do feed** (3 colunas, como o perfil). editor numa gaveta lateral com prévia do instagram.
- **tabelas:**
  - `posts` (id, tipo: feed · carrossel · reels · story, pilar, legenda, hashtags, primeiro_comentario, data_hora, status, ig_media_id, permalink, publicado_em, arquivado_em)
  - `posts_midia` (post_id, ordem, url, tipo imagem/vídeo)
- **status sugeridos:** `ideia` → `rascunho` → `agendado` → `postado` (+ `erro` e `verificar`, usados na fase 4).
- **cuidados:** mídias no **supabase storage** (bucket com política de acesso). guardar a ordem das fotos do carrossel. um arquivo puro com as regras ("o que falta pra poder agendar": legenda, mídia, data).
- **pronto quando:** você planeja o mês inteiro ali e para de usar outra ferramenta pra isso.

### fase 2 · metas e plano do mês
- **o que fazer:** metas do mês (ex.: 12 posts, 2 reels, 40% serviços / 30% produtos / 30% bastidores) com barra de progresso lendo os posts da fase 1.
- **tabelas:** `metas_mes` (mes `2026-11`, chave, alvo) ou `plano_mes` (mes, min_posts, min_reels, mistura em json).
- **ideia nossa que funcionou:** cada post do feed "pede" stories de apoio (ex.: repost + 2 stories). a agenda mostra os encaixes de story que faltam, tracejados.
- **pronto quando:** abre o mês e vê na hora o que falta pra bater a meta.

### fase 3 · tarefas e produção (opcional, se tiver equipe/freelas)
- **o que fazer:** quadro a fazer · fazendo · feito; cada cartão com responsável, prazo, checklist, referências e comentários.
- **tabelas:** `tarefas`, `tarefas_checklist`, `tarefas_comentarios`.
- **pronto quando:** ninguém precisa perguntar "como tá aquilo?".

### fase 4 · instagram conectado (ler primeiro, publicar depois)
**4a. conectar**
- a conta precisa ser **profissional** (empresa ou criador) e **ligada a uma página do facebook**.
- criar um app em developers.facebook.com, com produto "instagram graph api".
- token: o melhor é o de **usuário do sistema** (system user) no gerenciador de negócios, que **não expira**. o token comum vence em 60 dias e, quando vence, tudo para em silêncio.
- guardar o token só em variável de ambiente.

**4b. importar o histórico**
- puxar todos os posts antigos (em páginas, em lotes) com legenda, tipo, data, permalink e métricas.
- marcar cada post antigo com o pilar (pode ser na mão, aos poucos, ou com sugestão automática).
- **tabela:** `posts_metricas` (post_id, data_coleta, alcance, curtidas, comentarios, salvos, compartilhamentos, plays).

**4c. métricas automáticas**
- cron de hora em hora (ou algumas vezes por dia) grava um **retrato** das métricas.
- **importante:** a api **não guarda histórico de stories** (somem em 24 h) nem a evolução dos números. se não gravar desde o primeiro dia, perde.

**4d. estudo mensal**
- por mês: posts por pilar, alcance médio por tipo, top 5 posts, comparação com o mês anterior. em cartões, gráfico e tabela.

**4e. publicação automática** (só depois de 4a a 4d funcionando)
- cron a cada 5 min pega os posts `agendado` com hora vencida.
- a imagem/vídeo precisa estar numa **url pública** (storage do supabase serve).
- regras que aprendemos na marra:
  - **trave o post antes de publicar** (`agendado` → `publicando`), pra duas execuções não postarem o mesmo post duas vezes.
  - deu certo: `postado` + id + link. deu erro: volta pra `agendado` com o erro anotado e tenta de novo, até 3 vezes; depois vira `erro` e espera alguém olhar.
  - ficou preso em `publicando` mais de 30 min (a função morreu no meio): vira **`verificar`**. **nunca republicar sozinho**, porque pode ter saído. alguém confere no instagram.
  - sem token configurado, o cron não faz nada (nem mexe em status).
- **pronto quando:** você agenda na segunda e esquece até a sexta.

### fase 5 · tráfego pago (só leitura)
- **o que fazer:** cron diário (depois de hora em hora) lendo a api de marketing do meta: gasto, impressões, cliques, resultados e custo por resultado, **por dia e por campanha** (depois por anúncio, com a miniatura do criativo).
- **tabelas:** `ads_campanhas` (id, nome, pilar lido do nome, status), `ads_dia` (campanha_id, data, gasto, impressoes, cliques, resultados, valor).
- **cuidados:**
  - item 1.6: o pilar sai do nome da campanha. o que não tiver nome padronizado vai pra "marca/geral".
  - o meta conta resultado de duas formas: **quem clicou** (janela de 7 dias) e **quem só viu** (1 dia). mostre separado, senão o número fica inflado.
  - guarde os dados no seu banco: a api limita o período que dá pra puxar de uma vez.
- **depois, se quiser:**
  - **alertas:** anúncio gastando sem resultado, custo por resultado acima do limite, frequência alta (o público cansou), pico de gasto.
  - **estratégia do mês:** verba por objetivo e a pergunta "isso dá conta?". regra do meta: um conjunto de anúncios precisa de **~50 resultados por semana** pra sair do aprendizado. verba da semana ÷ custo por resultado < 50 = otimizar pra um evento mais frequente ou juntar conjuntos.
  - **relatório mensal:** mês × mês anterior, por pilar.
- **pronto quando:** você abre e sabe quanto gastou no mês, em quê, e o que deu resultado.

### fase 6 · newsletter casa nogs
- **o que fazer:** lista de contatos, editor de e-mail em blocos (título, texto, imagem com link, botão, grade de produtos), envio, abertura e cliques, descadastro.
- **serviço de envio:** resend, brevo ou parecido. **configurar o domínio** (registros spf, dkim e dmarc no dns), senão cai no spam.
- **tabelas:** `contatos` (nome, email, telefone, origem, origem_detalhe, ativo, descadastrado_em), `newsletters` (assunto, blocos em json, status, enviada_em), `envios` (newsletter_id, contato_id, entregue, aberto, clicado).
- **cuidados:**
  - **link de descadastro em todo e-mail** (obrigatório) e respeitar na hora.
  - guardar **de onde veio** cada contato (site, evento, instagram...). vira segmento depois ("só quem veio do evento x").
  - a mesma pessoa aparece com e-mails diferentes: **o telefone identifica melhor que o e-mail**. limpe duplicados antes de disparos grandes.
  - mande sempre um **teste pra você** antes do envio de verdade.
  - o webhook do serviço de envio atualiza aberturas, cliques e bounces.
- **pronto quando:** a newsletter sai daqui e você vê quem abriu.

### fase 7 · branding
- **o que fazer:** uma página com cores (clicar copia o hex), tipografia, logos pra baixar (e um "baixar tudo"), tom de voz ("como a gente fala"), "sempre / nunca" e fotos de exemplo.
- **dica nossa:** guarde o tom de voz num arquivo de texto no repositório (ex.: `docs/voz-da-marca.md`). a página lê ele, e o claude também consegue usar pra escrever legendas.
- **pronto quando:** você manda o link pra um freela e ele não precisa perguntar nada.

### fase 8 · extras (quando sentir falta)
- **influenciadores:** lista com status (no radar · conversando · parceria · publicou), frente, seguidores, contato e notas.
- **referências:** banco de imagens/links com etiquetas e favoritos.
- **sugestões de post:** fotos do seu acervo viram rascunho com um clique.
- **visão por pessoa:** cada tela lembra se você prefere quadro, lista ou tabela.
- **painel geral:** cartões do mês (posts, alcance, gasto, newsletter) + alertas de rotina parada.

---

## parte 4 · erros que custaram caro pra gente (pra você não repetir)

1. **token que vence sem aviso.** use token que não expira (system user) ou guarde a data de validade e mostre um aviso 15 dias antes.
2. **cron parado sem ninguém ver.** log de rotina + aviso no painel (item 1.3).
3. **post publicado duas vezes / post que não se sabe se saiu.** travar antes de publicar e o status `verificar` (fase 4e).
4. **hora errada na tela.** sempre pelo arquivo de datas (item 1.2).
5. **métrica que não volta mais.** stories e evolução de números só existem se você gravar na hora (fase 4c).
6. **campanha sem padrão de nome.** depois não dá pra separar o gasto (item 1.6).
7. **contato duplicado / fundido errado.** casar por telefone, nunca só por e-mail.
8. **apagar de verdade.** prefira arquivar.
9. **dados abertos.** rls desligado = banco público (item 1.1).

---

## parte 5 · checklist rápido

- [ ] fase 0 · login + rls + datas + log de atividade
- [ ] fase 1 · calendário de posts salvando (mês, semana, grade)
- [ ] fase 2 · metas e plano do mês
- [ ] fase 3 · tarefas (opcional)
- [ ] fase 4a · instagram conectado (system user)
- [ ] fase 4b · histórico importado
- [ ] fase 4c · cron de métricas + stories
- [ ] fase 4d · estudo mensal
- [ ] fase 4e · publicação automática
- [ ] fase 5 · ads só leitura (+ alertas, estratégia, relatório)
- [ ] fase 6 · newsletter com domínio configurado
- [ ] fase 7 · branding
- [ ] fase 8 · extras

-- Lançamentos de projeto (o arco de 16 movimentos) e metas do planejamento, editáveis.

-- 1. LANÇAMENTOS: um arco por projeto (regra do manual: um projeto por vez)
create table public.lancamentos (
  id uuid primary key default gen_random_uuid(),
  projeto text not null,
  cliente text,
  revelacao_em date,                 -- data da revelação combinada com a cliente
  fotografia text,                   -- quem fotografa
  video text,                        -- quem filma
  status text not null default 'planejando' check (status in ('planejando', 'em_andamento', 'concluido', 'arquivado')),
  notas text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create trigger lancamentos_atualizado_em before update on public.lancamentos
  for each row execute function public.tocar_atualizado_em();

alter table public.lancamentos enable row level security;
create policy "lancamentos: ler" on public.lancamentos for select to authenticated using (true);
create policy "lancamentos: criar" on public.lancamentos for insert to authenticated with check (true);
create policy "lancamentos: editar" on public.lancamentos for update to authenticated using (true) with check (true);
create policy "lancamentos: apagar" on public.lancamentos for delete to authenticated using (true);

-- A ficha de lançamento: os 16 movimentos de cada arco.
create table public.lancamento_movimentos (
  lancamento_id uuid not null references public.lancamentos (id) on delete cascade,
  movimento smallint not null check (movimento between 1 and 16),
  data_prevista date,
  canal text,
  feito boolean not null default false,
  observacoes text,
  post_id uuid references public.posts (id) on delete set null,
  primary key (lancamento_id, movimento)
);
alter table public.lancamento_movimentos enable row level security;
create policy "lancamento_movimentos: ler" on public.lancamento_movimentos for select to authenticated using (true);
create policy "lancamento_movimentos: criar" on public.lancamento_movimentos for insert to authenticated with check (true);
create policy "lancamento_movimentos: editar" on public.lancamento_movimentos for update to authenticated using (true) with check (true);
create policy "lancamento_movimentos: apagar" on public.lancamento_movimentos for delete to authenticated using (true);

-- 2. METAS DO PLANEJAMENTO (substitui a tabela `metas` da v1, vazia e trancada)
create table public.planejamento_metas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  detalhe text,
  frente text not null default 'marca'
    check (frente in ('marca', 'conteudo', 'visibilidade', 'produto', 'estrutura', 'pessoal')),
  ano smallint not null default 2026,
  trimestre smallint check (trimestre between 1 and 4),   -- vazio = ano todo
  prazo date,
  status text not null default 'a_fazer' check (status in ('a_fazer', 'em_andamento', 'concluida')),
  concluida_em date,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create trigger planejamento_metas_atualizado_em before update on public.planejamento_metas
  for each row execute function public.tocar_atualizado_em();

alter table public.planejamento_metas enable row level security;
create policy "planejamento_metas: ler" on public.planejamento_metas for select to authenticated using (true);
create policy "planejamento_metas: criar" on public.planejamento_metas for insert to authenticated with check (true);
create policy "planejamento_metas: editar" on public.planejamento_metas for update to authenticated using (true) with check (true);
create policy "planejamento_metas: apagar" on public.planejamento_metas for delete to authenticated using (true);

-- Ponto de partida: 2026, o Ano da Fundação. Primeiro o que já foi construído, depois os marcos do ano.
insert into public.planejamento_metas (titulo, frente, ano, trimestre, status, concluida_em, ordem) values
  ('Diagnóstico estratégico com dados reais de 90 dias', 'marca', 2026, 1, 'concluida', '2026-03-31', 1),
  ('Análise de concorrentes', 'marca', 2026, 1, 'concluida', '2026-03-31', 2),
  ('Manual da Marca: Manual, Luxury Strategy, Marketing & Experiências, Comunidade', 'marca', 2026, 1, 'concluida', '2026-04-30', 3),
  ('Identidade visual nova (JetBrains Mono + Inter, paleta NN)', 'marca', 2026, 1, 'concluida', '2026-04-30', 4),
  ('Padronização interna do escritório', 'estrutura', 2026, 1, 'concluida', '2026-04-30', 5),
  ('Prêmio Casa Club', 'visibilidade', 2026, 1, 'concluida', '2026-04-30', 6),
  ('Casa Nogs estruturada e no ar', 'conteudo', 2026, 1, 'concluida', '2026-04-30', 7),
  ('4 meses de conteúdo-teste no Instagram', 'conteudo', 2026, 1, 'concluida', '2026-04-30', 8),
  ('The Icon Blueprint: planejamento de 12 anos', 'marca', 2026, 1, 'concluida', '2026-04-30', 9),
  ('Prêmio em Manaus: receber e levar para o calendário editorial', 'visibilidade', 2026, 2, 'concluida', '2026-05-31', 10),
  ('Inscrição no Prêmio Deca', 'visibilidade', 2026, null, 'a_fazer', null, 11),
  ('Uma palestra em evento brasileiro', 'visibilidade', 2026, null, 'a_fazer', null, 12),
  ('Um apartamento decorado em collab com construtora', 'produto', 2026, null, 'a_fazer', null, 13),
  ('Um projeto-conceito autoral', 'marca', 2026, null, 'a_fazer', null, 14),
  ('Uma publicação em revista', 'visibilidade', 2026, null, 'a_fazer', null, 15),
  ('Primeira peça de design autoral em colaboração', 'produto', 2026, null, 'em_andamento', null, 16),
  ('Casa Nogs em ritmo semanal', 'conteudo', 2026, null, 'em_andamento', null, 17),
  ('Networking com o canal: editoras, jornalistas, curadoras', 'visibilidade', 2026, null, 'em_andamento', null, 18),
  ('Viagem internacional: Art Basel Miami', 'pessoal', 2026, 4, 'a_fazer', null, 19);

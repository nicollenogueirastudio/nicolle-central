-- Stories: roteiro do dia (planejado) e stories publicados (capturados do Instagram pela rotina diária).
-- Casa Nogs: Notes do Substack, números das edições e datas no quadro de ideias (cronograma).

create table public.stories_roteiros (
  dia date primary key,
  frames jsonb not null default '[]',   -- [{ id, texto, feito }], na ordem da sequência
  notas text,
  atualizado_em timestamptz not null default now()
);
create trigger stories_roteiros_atualizado_em before update on public.stories_roteiros
  for each row execute function public.tocar_atualizado_em();
alter table public.stories_roteiros enable row level security;
create policy "stories_roteiros: ler" on public.stories_roteiros for select to authenticated using (true);
create policy "stories_roteiros: criar" on public.stories_roteiros for insert to authenticated with check (true);
create policy "stories_roteiros: editar" on public.stories_roteiros for update to authenticated using (true) with check (true);
create policy "stories_roteiros: apagar" on public.stories_roteiros for delete to authenticated using (true);

-- Só a rotina escreve (cliente admin); a tela só lê.
create table public.stories_publicados (
  id text primary key,                 -- id da mídia na Meta
  publicado_em timestamptz not null,
  tipo text,                           -- IMAGE ou VIDEO
  permalink text,
  caminho text,                        -- miniatura copiada para o storage (posts-midia/stories/...)
  alcance integer,
  visualizacoes integer,
  respostas integer,
  compartilhamentos integer,
  interacoes integer,
  avancos integer,                     -- toques para o próximo
  voltas integer,                      -- toques para voltar
  saidas integer,                      -- saiu dos stories
  proximo_perfil integer,              -- deslizou para o próximo perfil
  coletado_em timestamptz not null default now()
);
create index stories_publicados_data_idx on public.stories_publicados (publicado_em desc);
alter table public.stories_publicados enable row level security;
create policy "stories_publicados: ler" on public.stories_publicados for select to authenticated using (true);

create table public.substack_notes (
  id bigint primary key,
  publicado_em timestamptz not null,
  texto text,
  imagens jsonb not null default '[]',
  curtidas integer,
  restacks integer,
  respostas integer,
  sincronizado_em timestamptz not null default now()
);
create index substack_notes_data_idx on public.substack_notes (publicado_em desc);
alter table public.substack_notes enable row level security;
create policy "substack_notes: ler" on public.substack_notes for select to authenticated using (true);
create policy "substack_notes: gravar" on public.substack_notes for insert to authenticated with check (true);
create policy "substack_notes: editar" on public.substack_notes for update to authenticated using (true) with check (true);

alter table public.substack_edicoes add column if not exists comentarios integer, add column if not exists palavras integer, add column if not exists restacks integer;

alter table public.newsletter_ideias
  add column if not exists tipo text not null default 'edicao' check (tipo in ('edicao', 'note')),
  add column if not exists data_prevista date;

-- Fase 4b/4c · histórico do Instagram e métricas por post.
-- Os posts antigos entram na própria tabela `posts` (origem = 'instagram', status = 'postado'),
-- assim aparecem no calendário e na grade como o feed real.

create unique index if not exists posts_ig_media_id_idx on public.posts (ig_media_id) where ig_media_id is not null;

-- Retrato diário das métricas de cada post. A Meta não guarda a evolução: se não gravar, perde.
create table if not exists public.posts_metricas (
  post_id uuid not null references public.posts (id) on delete cascade,
  dia date not null,
  alcance integer,
  curtidas integer,
  comentarios integer,
  salvos integer,
  compartilhamentos integer,
  visualizacoes integer,
  interacoes integer,
  coletado_em timestamptz not null default now(),
  primary key (post_id, dia)
);

create index if not exists posts_metricas_dia_idx on public.posts_metricas (dia);

alter table public.posts_metricas enable row level security;
create policy "posts_metricas: ler" on public.posts_metricas for select to authenticated using (true);
-- Escrita só pela rotina automática (service role).

-- Estado das rotinas de importação (cursor do histórico etc.).
create table if not exists public.sincronizacao_estado (
  chave text primary key,
  valor jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);
alter table public.sincronizacao_estado enable row level security;
create policy "sincronizacao_estado: ler" on public.sincronizacao_estado for select to authenticated using (true);

-- Números da Casa Nogs que o Substack não entrega pelo feed: anotados à mão a partir do painel do Substack.
alter table public.substack_edicoes
  add column if not exists aberturas_pct numeric(5, 2),
  add column if not exists visualizacoes integer,
  add column if not exists novos_assinantes integer,
  add column if not exists curtidas integer;

-- Fase 1 · calendário de posts
-- Substitui a tabela `posts` da v1 (vazia e trancada desde a 0002).

drop table if exists public.posts cascade;

-- Atualiza `atualizado_em` sozinho em todo update.
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

-- 1. POSTS
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  tipo text not null default 'feed' check (tipo in ('feed', 'carrossel', 'reels', 'story')),
  pilar text check (pilar in ('autoridade', 'conexao', 'curadoria')),
  titulo text,                       -- nome interno, não vai pro instagram
  legenda text,
  hashtags text,
  primeiro_comentario text,
  data_hora timestamptz,             -- instante (UTC); ideia pode não ter data
  status text not null default 'ideia'
    check (status in ('ideia', 'rascunho', 'agendado', 'publicando', 'postado', 'erro', 'verificar')),
  ig_media_id text,
  permalink text,
  publicado_em timestamptz,
  arquivado_em timestamptz,          -- apagar = arquivar
  criado_por uuid references auth.users (id) default auth.uid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index posts_data_hora_idx on public.posts (data_hora) where arquivado_em is null;
create index posts_status_idx on public.posts (status);

create trigger posts_atualizado_em
  before update on public.posts
  for each row execute function public.tocar_atualizado_em();

alter table public.posts enable row level security;

create policy "posts: logado lê" on public.posts
  for select to authenticated using (true);
create policy "posts: logado cria" on public.posts
  for insert to authenticated with check (true);
create policy "posts: logado edita" on public.posts
  for update to authenticated using (true) with check (true);
-- Sem delete: post se arquiva.

-- 2. MÍDIAS DO POST (ordem = posição no carrossel)
create table public.posts_midia (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  ordem integer not null default 0,
  caminho text not null,             -- caminho no bucket posts-midia
  tipo text not null check (tipo in ('imagem', 'video')),
  criado_em timestamptz not null default now()
);

create index posts_midia_post_idx on public.posts_midia (post_id, ordem);

alter table public.posts_midia enable row level security;

create policy "posts_midia: logado lê" on public.posts_midia
  for select to authenticated using (true);
create policy "posts_midia: logado cria" on public.posts_midia
  for insert to authenticated with check (true);
create policy "posts_midia: logado edita" on public.posts_midia
  for update to authenticated using (true) with check (true);
create policy "posts_midia: logado remove" on public.posts_midia
  for delete to authenticated using (true);

-- 3. STORAGE: bucket privado; a tela usa links assinados temporários.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posts-midia', 'posts-midia', false, 104857600,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime'])
on conflict (id) do nothing;

create policy "posts-midia: logado lê" on storage.objects
  for select to authenticated using (bucket_id = 'posts-midia');
create policy "posts-midia: logado envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'posts-midia');
create policy "posts-midia: logado atualiza" on storage.objects
  for update to authenticated using (bucket_id = 'posts-midia');
create policy "posts-midia: logado remove" on storage.objects
  for delete to authenticated using (bucket_id = 'posts-midia');

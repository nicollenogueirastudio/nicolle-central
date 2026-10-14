-- Fase 0 · fundação
-- Perfis dos usuários + histórico de atividades, com RLS ligado.
-- Regra: só usuário logado lê e escreve. Ninguém cria conta sozinho
-- (cadastro público desligado no Supabase Auth; usuários entram por convite).

-- 1. PERFIS (um por usuário do Auth)
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  papel text not null default 'dona',
  criado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;

create policy "perfis: logado lê" on public.perfis
  for select to authenticated using (true);

create policy "perfis: cada um edita o seu" on public.perfis
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Cria o perfil automaticamente quando um usuário é cadastrado no Auth.
create or replace function public.criar_perfil()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();

-- 2. ATIVIDADES (histórico: quem, o quê, quando, em qual item)
create table if not exists public.atividades (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references auth.users (id) on delete cascade,
  acao text not null,
  entidade text not null,
  entidade_id text,
  detalhe jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists atividades_criado_em_idx on public.atividades (criado_em desc);
create index if not exists atividades_entidade_idx on public.atividades (entidade, entidade_id);

alter table public.atividades enable row level security;

create policy "atividades: logado lê" on public.atividades
  for select to authenticated using (true);

-- Só grava em nome de si mesmo. Sem update/delete: o histórico não se apaga.
create policy "atividades: logado grava a própria" on public.atividades
  for insert to authenticated
  with check (usuario_id = (select auth.uid()));

-- Aba Estratégia do Marketing: o post do feed que serve de exemplo para cada formato (ela pode trocar).
create table if not exists public.estrategia_formatos (
  formato text primary key,
  post_id uuid references public.posts (id) on delete set null,
  atualizado_em timestamptz not null default now()
);
alter table public.estrategia_formatos enable row level security;
drop policy if exists "estrategia_formatos: ler" on public.estrategia_formatos;
drop policy if exists "estrategia_formatos: gravar" on public.estrategia_formatos;
drop policy if exists "estrategia_formatos: editar" on public.estrategia_formatos;
create policy "estrategia_formatos: ler" on public.estrategia_formatos for select to authenticated using (true);
create policy "estrategia_formatos: gravar" on public.estrategia_formatos for insert to authenticated with check (true);
create policy "estrategia_formatos: editar" on public.estrategia_formatos for update to authenticated using (true) with check (true);
insert into public.estrategia_formatos (formato, post_id)
select v.f, (select id from posts where id::text like v.p || '%' limit 1) from (values ('mix','4032d530'),('capa','99ce5af7'),('compilado','106752a1'),('repost','c7bf01d9'),('portfolio-carrossel','adedbcb0'),('portfolio-video','9a6c436f'),('reel-lettering','23a2af96'),('videomaker','141a1ea3'),('newsletter','10bebcee'),('apresentacao','c3cb1ac4')) v(f,p)
on conflict (formato) do nothing;

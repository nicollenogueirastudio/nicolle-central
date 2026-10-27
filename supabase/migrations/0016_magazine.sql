-- MAGAZINE
-- Edições do manual da marca da revista, por seção. O texto-base fica no código (lib/magazine/manual.ts);
-- aqui só entra o que ela editar pela tela. Mesmo formato de marca_manual.

create table public.magazine_manual (
  secao_id text primary key,
  titulo text,
  blocos jsonb not null,
  atualizado_em timestamptz not null default now()
);
create trigger magazine_manual_atualizado_em before update on public.magazine_manual
  for each row execute function public.tocar_atualizado_em();
alter table public.magazine_manual enable row level security;
create policy "magazine_manual: ler" on public.magazine_manual for select to authenticated using (true);
create policy "magazine_manual: criar" on public.magazine_manual for insert to authenticated with check (true);
create policy "magazine_manual: editar" on public.magazine_manual for update to authenticated using (true) with check (true);
create policy "magazine_manual: apagar" on public.magazine_manual for delete to authenticated using (true);

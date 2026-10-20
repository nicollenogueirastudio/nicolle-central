-- Palavra do ano, categorias internas dos posts, textos editáveis do manual e ideias da Casa Nogs.

-- 1. PALAVRA DO ANO: uma por ano, escrita por ela.
create table public.palavras_do_ano (
  ano smallint primary key,
  palavra text not null,
  significado text,
  atualizado_em timestamptz not null default now()
);
create trigger palavras_do_ano_atualizado_em before update on public.palavras_do_ano
  for each row execute function public.tocar_atualizado_em();
alter table public.palavras_do_ano enable row level security;
create policy "palavras_do_ano: ler" on public.palavras_do_ano for select to authenticated using (true);
create policy "palavras_do_ano: criar" on public.palavras_do_ano for insert to authenticated with check (true);
create policy "palavras_do_ano: editar" on public.palavras_do_ano for update to authenticated using (true) with check (true);
insert into public.palavras_do_ano (ano, palavra) values (2026, 'Fundação');

-- 2. CATEGORIA INTERNA DO POST (a "categoria + barra" das legendas: "Projetos /", "Curadoria /"…)
alter table public.posts add column if not exists categoria text
  check (categoria in ('projetos', 'press', 'premios', 'curadoria', 'editorial'));

-- Os posts importados já trazem a categoria no começo da legenda: aproveita.
update public.posts set categoria = case
    when legenda ~* '^\s*projetos?\s*/' then 'projetos'
    when legenda ~* '^\s*press\s*/' then 'press'
    when legenda ~* '^\s*pr[êe]mios?\s*/' then 'premios'
    when legenda ~* '^\s*curadoria\s*/' then 'curadoria'
    when legenda ~* '^\s*editorial\s*/' then 'editorial'
  end
where categoria is null and legenda ~* '^\s*(projetos?|press|pr[êe]mios?|curadoria|editorial)\s*/';

-- 3. MANUAL DA MARCA EDITÁVEL: o texto de cada seção, quando ela foi editada (sem linha = texto original).
create table public.marca_manual (
  secao_id text primary key,
  titulo text,
  blocos jsonb not null,
  atualizado_em timestamptz not null default now()
);
create trigger marca_manual_atualizado_em before update on public.marca_manual
  for each row execute function public.tocar_atualizado_em();
alter table public.marca_manual enable row level security;
create policy "marca_manual: ler" on public.marca_manual for select to authenticated using (true);
create policy "marca_manual: criar" on public.marca_manual for insert to authenticated with check (true);
create policy "marca_manual: editar" on public.marca_manual for update to authenticated using (true) with check (true);
create policy "marca_manual: apagar" on public.marca_manual for delete to authenticated using (true);

-- 4. IDEIAS DA CASA NOGS
create table public.newsletter_ideias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  angulo text,                 -- o ponto de vista: por que isso é Casa Nogs
  referencias text,            -- links, livros, lugares
  status text not null default 'ideia' check (status in ('ideia', 'pesquisa', 'escrevendo', 'publicada')),
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create trigger newsletter_ideias_atualizado_em before update on public.newsletter_ideias
  for each row execute function public.tocar_atualizado_em();
alter table public.newsletter_ideias enable row level security;
create policy "newsletter_ideias: ler" on public.newsletter_ideias for select to authenticated using (true);
create policy "newsletter_ideias: criar" on public.newsletter_ideias for insert to authenticated with check (true);
create policy "newsletter_ideias: editar" on public.newsletter_ideias for update to authenticated using (true) with check (true);
create policy "newsletter_ideias: apagar" on public.newsletter_ideias for delete to authenticated using (true);

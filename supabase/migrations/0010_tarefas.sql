-- Fase 3 · tarefas. Uma lista só: aparece em Marketing → Tarefas, dentro de cada lançamento e no Dashboard.

create table public.tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  notas text,
  prazo date,
  feita boolean not null default false,
  feita_em timestamptz,
  lancamento_id uuid references public.lancamentos (id) on delete cascade,  -- tarefa de um lançamento (some junto)
  chave text,                     -- id da tarefa-chave do manual de lançamento, quando veio do modelo
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index tarefas_abertas_idx on public.tarefas (prazo) where not feita;
create index tarefas_lancamento_idx on public.tarefas (lancamento_id);

create trigger tarefas_atualizado_em before update on public.tarefas
  for each row execute function public.tocar_atualizado_em();

alter table public.tarefas enable row level security;
create policy "tarefas: ler" on public.tarefas for select to authenticated using (true);
create policy "tarefas: criar" on public.tarefas for insert to authenticated with check (true);
create policy "tarefas: editar" on public.tarefas for update to authenticated using (true) with check (true);
create policy "tarefas: apagar" on public.tarefas for delete to authenticated using (true);

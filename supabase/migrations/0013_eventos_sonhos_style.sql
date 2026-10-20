-- Calendário de feiras e prêmios, dream goals e fotos removidas do moodboard.

create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('feira', 'premio')),
  nome text not null,
  descricao text,
  local text,
  abrangencia text not null default 'internacional' check (abrangencia in ('nacional', 'internacional')),
  inicio date,              -- feira: abertura · prêmio: anúncio ou cerimônia
  fim date,                 -- feira: encerramento
  inscricao_ate date,       -- prêmio: prazo de inscrição
  confirmado boolean not null default true,  -- false = data prevista pelo padrão dos anos anteriores
  site text,
  notas text,
  vou boolean not null default false,        -- quer ir / quer se inscrever
  origem text not null default 'manual' check (origem in ('sugerido', 'manual')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create trigger eventos_atualizado_em before update on public.eventos for each row execute function public.tocar_atualizado_em();
alter table public.eventos enable row level security;
create policy "eventos: ler" on public.eventos for select to authenticated using (true);
create policy "eventos: criar" on public.eventos for insert to authenticated with check (true);
create policy "eventos: editar" on public.eventos for update to authenticated using (true) with check (true);
create policy "eventos: apagar" on public.eventos for delete to authenticated using (true);

create table public.sonhos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  porque text,              -- por que esse sonho importa
  primeiro_passo text,      -- o próximo passo concreto para chegar lá
  realizado boolean not null default false,
  realizado_em date,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create trigger sonhos_atualizado_em before update on public.sonhos for each row execute function public.tocar_atualizado_em();
alter table public.sonhos enable row level security;
create policy "sonhos: ler" on public.sonhos for select to authenticated using (true);
create policy "sonhos: criar" on public.sonhos for insert to authenticated with check (true);
create policy "sonhos: editar" on public.sonhos for update to authenticated using (true) with check (true);
create policy "sonhos: apagar" on public.sonhos for delete to authenticated using (true);

create table public.style_removidas (
  pin text primary key,     -- código da imagem no moodboard (src/lib/marca/style.ts)
  removido_em timestamptz not null default now()
);
alter table public.style_removidas enable row level security;
create policy "style_removidas: ler" on public.style_removidas for select to authenticated using (true);
create policy "style_removidas: criar" on public.style_removidas for insert to authenticated with check (true);
create policy "style_removidas: apagar" on public.style_removidas for delete to authenticated using (true);

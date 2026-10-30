-- TRÁFEGO PAGO (Meta Ads)
-- O token da Meta fica só na Vercel (META_TOKEN). Aqui ficam a configuração da conta, os anúncios
-- montados no sistema (com o fluxo rascunho → aprovação → publicado) e o registro de tudo o que
-- o sistema mandou para a Meta.

-- Configuração: uma linha só (id = 1).
create table public.trafego_config (
  id smallint primary key default 1 check (id = 1),
  conta_anuncios_id text,          -- act_123...
  pagina_id text,
  instagram_id text,
  pixel_id text,
  teto_diario numeric(10, 2),      -- maior orçamento diário que o sistema aceita por anúncio (R$)
  teto_mensal numeric(10, 2),      -- aviso quando o investido no mês passa disto (R$)
  atualizado_em timestamptz not null default now()
);
insert into public.trafego_config (id, teto_diario, teto_mensal) values (1, 50, 1500);
create trigger trafego_config_atualizado_em before update on public.trafego_config
  for each row execute function public.tocar_atualizado_em();
alter table public.trafego_config enable row level security;
create policy "trafego_config: ler" on public.trafego_config for select to authenticated using (true);
create policy "trafego_config: editar" on public.trafego_config for update to authenticated using (true) with check (true);

-- Anúncios montados no sistema.
create table public.anuncios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  objetivo text not null default 'alcance' check (objetivo in ('alcance', 'engajamento', 'trafego')),
  post_id uuid references public.posts (id) on delete set null,   -- post do Instagram impulsionado
  ig_media_id text,
  texto text,                       -- só no objetivo tráfego (anúncio com link)
  link text,
  chamada text default 'LEARN_MORE',
  publico jsonb not null default '{"idade_min": 25, "idade_max": 60, "generos": [], "paises": ["BR"], "cidades": [], "interesses": []}'::jsonb,
  orcamento_diario numeric(10, 2) not null default 20,
  inicio date,
  fim date,
  status text not null default 'rascunho'
    check (status in ('rascunho', 'aprovacao', 'ajuste', 'aprovado', 'publicado', 'erro', 'arquivado')),
  nota_aprovacao text,
  meta_campanha_id text,
  meta_conjunto_id text,
  meta_anuncio_id text,
  erro text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index anuncios_status_idx on public.anuncios (status);
create trigger anuncios_atualizado_em before update on public.anuncios
  for each row execute function public.tocar_atualizado_em();
alter table public.anuncios enable row level security;
create policy "anuncios: ler" on public.anuncios for select to authenticated using (true);
create policy "anuncios: criar" on public.anuncios for insert to authenticated with check (true);
create policy "anuncios: editar" on public.anuncios for update to authenticated using (true) with check (true);
create policy "anuncios: apagar" on public.anuncios for delete to authenticated using (true);

-- Tudo o que o sistema mandou para a Meta (ligar, pausar, orçamento, publicar), com o resultado.
create table public.trafego_acoes (
  id bigint generated always as identity primary key,
  quando timestamptz not null default now(),
  usuario_id uuid references auth.users (id),
  acao text not null,
  alvo text,                        -- id na Meta ou id do anúncio no sistema
  detalhe jsonb,
  ok boolean not null,
  erro text
);
create index trafego_acoes_quando_idx on public.trafego_acoes (quando desc);
alter table public.trafego_acoes enable row level security;
create policy "trafego_acoes: ler" on public.trafego_acoes for select to authenticated using (true);
create policy "trafego_acoes: criar" on public.trafego_acoes for insert to authenticated with check (true);

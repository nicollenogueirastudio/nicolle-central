-- Outras redes: Pinterest e TikTok por OAuth, YouTube por chave do Google, LinkedIn à mão.

alter table public.conexoes drop constraint if exists conexoes_rede_check;
alter table public.conexoes add constraint conexoes_rede_check
  check (rede in ('instagram', 'substack', 'pinterest', 'tiktok', 'linkedin', 'youtube'));

insert into public.conexoes (rede, conta) values ('youtube', null) on conflict (rede) do nothing;

alter table public.metricas_conta drop constraint if exists metricas_conta_rede_fkey;
alter table public.metricas_conta add constraint metricas_conta_rede_fkey foreign key (rede) references public.conexoes (rede);

-- Quem anotou o número: a rotina (api) ou a Nicolle (manual).
alter table public.metricas_conta add column if not exists origem text not null default 'api' check (origem in ('api', 'manual'));

-- Tokens de OAuth que se renovam sozinhos (Pinterest, TikTok). Não dá para viverem só na Vercel
-- porque mudam a cada renovação. Ficam numa tabela sem nenhuma política: só a rotina do servidor
-- (service role) lê e escreve; a tela nunca enxerga.
create table if not exists public.conexoes_tokens (
  rede text primary key references public.conexoes (rede),
  access_token text not null,
  refresh_token text,
  expira_em timestamptz,
  refresh_expira_em timestamptz,
  escopo text,
  conta_id text,
  atualizado_em timestamptz not null default now()
);
alter table public.conexoes_tokens enable row level security;

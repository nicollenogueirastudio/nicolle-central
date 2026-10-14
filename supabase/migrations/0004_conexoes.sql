-- Fase 4a · conexões com as redes (só leitura)
-- Tokens NUNCA ficam aqui: vivem só nas variáveis de ambiente da Vercel.

create table public.conexoes (
  rede text primary key check (rede in ('instagram', 'substack', 'pinterest', 'tiktok', 'linkedin')),
  conta text,
  status text not null default 'desconectada'
    check (status in ('desconectada', 'conectada', 'erro')),
  ultima_sincronizacao timestamptz,
  ultimo_erro text,
  token_expira_em timestamptz,
  atualizado_em timestamptz not null default now()
);

alter table public.conexoes enable row level security;
create policy "conexoes: ler" on public.conexoes for select to authenticated using (true);
create policy "conexoes: atualizar" on public.conexoes for update to authenticated using (true) with check (true);

create trigger conexoes_tocar before update on public.conexoes
  for each row execute function public.tocar_atualizado_em();

insert into public.conexoes (rede, conta) values
  ('instagram', 'nicollenogueirastudio'),
  ('substack', 'casanogs.substack.com'),
  ('pinterest', null),
  ('tiktok', null),
  ('linkedin', null);

-- Retrato diário dos números da conta (seguidores etc.). Gravar desde o primeiro dia:
-- as redes não guardam a evolução, se não gravarmos, perde.
create table public.metricas_conta (
  rede text not null references public.conexoes (rede),
  dia date not null,
  seguidores integer,
  seguindo integer,
  publicacoes integer,
  detalhe jsonb,
  coletado_em timestamptz not null default now(),
  primary key (rede, dia)
);

alter table public.metricas_conta enable row level security;
create policy "metricas_conta: ler" on public.metricas_conta for select to authenticated using (true);
create policy "metricas_conta: inserir" on public.metricas_conta for insert to authenticated with check (true);
create policy "metricas_conta: atualizar" on public.metricas_conta for update to authenticated using (true) with check (true);

-- Edições da Casa Nogs lidas do feed RSS do Substack.
create table public.substack_edicoes (
  id text primary key,          -- guid do feed
  titulo text not null,
  subtitulo text,
  link text not null,
  imagem text,
  publicado_em timestamptz,
  sincronizado_em timestamptz not null default now()
);

alter table public.substack_edicoes enable row level security;
create policy "substack_edicoes: ler" on public.substack_edicoes for select to authenticated using (true);
create policy "substack_edicoes: inserir" on public.substack_edicoes for insert to authenticated with check (true);
create policy "substack_edicoes: atualizar" on public.substack_edicoes for update to authenticated using (true) with check (true);

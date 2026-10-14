-- Fecha as tabelas da v1 (schema de abril/2026), que tinham políticas "allow all"
-- (banco público). RLS continua ligado e sem política = ninguém acessa até cada
-- tabela ser refeita na sua fase (posts na fase 1, metas na fase 2...).
drop policy if exists "Allow all for metas" on public.metas;
drop policy if exists "Allow all for posts" on public.posts;
drop policy if exists "Allow all for referencias" on public.referencias;
drop policy if exists "Allow all for edicoes" on public.edicoes;
drop policy if exists "Allow all for configuracoes" on public.configuracoes;
drop policy if exists "Allow all for metricas_historicas" on public.metricas_historicas;

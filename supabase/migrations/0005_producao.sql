-- Produção de conteúdo: o fluxo que a agência fazia em planilha + Drive, agora dentro do post.
-- pauta → criação → aprovação → ajuste → agendado → postado

-- 1. Novos status do fluxo de aprovação
alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts add constraint posts_status_check
  check (status in ('ideia', 'rascunho', 'aprovacao', 'ajuste', 'agendado', 'publicando', 'postado', 'erro', 'verificar'));

-- 2. Campos de estratégia e produção
alter table public.posts
  add column if not exists quadro text,                -- série editorial (Mesa de domingo, Projeto entregue…)
  add column if not exists fase text
    check (fase in ('conexao', 'cultura', 'troca', 'presenca')),   -- filtro das 4 fases da comunidade
  add column if not exists territorio text
    check (territorio in ('materia', 'silencio', 'ritual', 'curadoria', 'refugio')),
  add column if not exists briefing text,              -- o que a peça precisa ser (para quem vai produzir)
  add column if not exists fonte text,                 -- créditos / referência / de onde vêm as imagens
  add column if not exists nota_aprovacao text,        -- comentário da aprovação / pedido de ajuste
  add column if not exists responsavel text,           -- quem está produzindo (Nicolle, freela, agência)
  add column if not exists origem text not null default 'manual'
    check (origem in ('manual', 'agencia', 'instagram'));

-- ===========================================
-- NICOLLE NOGUEIRA STUDIO - Central Estratégica
-- Script de criação das tabelas no Supabase
-- ===========================================

-- Execute este SQL no Supabase: 
-- Dashboard > SQL Editor > New Query > Cole e execute

-- 1. METAS
CREATE TABLE IF NOT EXISTS metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  texto TEXT NOT NULL,
  pilar TEXT NOT NULL CHECK (pilar IN ('autoridade', 'visibilidade', 'diversificacao', 'estrutura')),
  trimestre TEXT NOT NULL,
  ano INTEGER NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. POSTS (Calendário Editorial)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rede TEXT NOT NULL CHECK (rede IN ('instagram', 'youtube', 'pinterest', 'tiktok', 'newsletter')),
  tipo TEXT NOT NULL CHECK (tipo IN ('imagem', 'video', 'carrossel', 'texto')),
  titulo TEXT NOT NULL,
  legenda TEXT,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'agendado', 'publicado')),
  pilar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REFERÊNCIAS (Banco de Referências da Newsletter)
CREATE TABLE IF NOT EXISTS referencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  url TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('produtos', 'arquitetura', 'podcasts', 'livros', 'filmes', 'outros')),
  notas TEXT,
  usada_em TEXT[], -- Array de IDs das edições onde foi usada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EDIÇÕES (Newsletter Casa NOGS)
CREATE TABLE IF NOT EXISTS edicoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  conteudo TEXT,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'agendada', 'publicada')),
  data_publicacao TIMESTAMP WITH TIME ZONE,
  taxa_abertura NUMERIC(5,2),
  taxa_cliques NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONFIGURAÇÕES (Chaves de API - criptografadas)
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MÉTRICAS HISTÓRICAS (para gráficos de evolução)
CREATE TABLE IF NOT EXISTS metricas_historicas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rede TEXT NOT NULL,
  data DATE NOT NULL,
  seguidores INTEGER,
  alcance INTEGER,
  engajamento NUMERIC(5,2),
  outros JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rede, data)
);

-- ===========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ===========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE edicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_historicas ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (ajuste conforme necessidade de autenticação)
-- Por enquanto, permite acesso total para a chave anon (uso pessoal)

CREATE POLICY "Allow all for metas" ON metas FOR ALL USING (true);
CREATE POLICY "Allow all for posts" ON posts FOR ALL USING (true);
CREATE POLICY "Allow all for referencias" ON referencias FOR ALL USING (true);
CREATE POLICY "Allow all for edicoes" ON edicoes FOR ALL USING (true);
CREATE POLICY "Allow all for configuracoes" ON configuracoes FOR ALL USING (true);
CREATE POLICY "Allow all for metricas_historicas" ON metricas_historicas FOR ALL USING (true);

-- ===========================================
-- ÍNDICES PARA PERFORMANCE
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_metas_ano ON metas(ano);
CREATE INDEX IF NOT EXISTS idx_metas_pilar ON metas(pilar);
CREATE INDEX IF NOT EXISTS idx_posts_data ON posts(data);
CREATE INDEX IF NOT EXISTS idx_posts_rede ON posts(rede);
CREATE INDEX IF NOT EXISTS idx_referencias_categoria ON referencias(categoria);
CREATE INDEX IF NOT EXISTS idx_edicoes_status ON edicoes(status);
CREATE INDEX IF NOT EXISTS idx_metricas_rede_data ON metricas_historicas(rede, data);

-- ===========================================
-- DADOS INICIAIS (Metas do Planejamento)
-- ===========================================

-- Descomente e execute separadamente se quiser popular com as metas iniciais

/*
INSERT INTO metas (texto, pilar, trimestre, ano, categoria) VALUES
-- Ano 1 - Q1
('Finalizar manual de marca do Studio', 'autoridade', 'Q1', 2025, 'Marca'),
('Criar banco de imagens de referência do seu estilo', 'autoridade', 'Q1', 2025, 'Marca'),
('Definir 5-7 características do "projeto Nicolle Nogueira"', 'autoridade', 'Q1', 2025, 'Marca'),
('Atualizar site com novo posicionamento', 'visibilidade', 'Q1', 2025, 'Digital'),
('Criar apresentação institucional premium', 'visibilidade', 'Q1', 2025, 'Marca'),
('Documentar fluxo completo de projeto', 'estrutura', 'Q1', 2025, 'Processo'),
('Criar templates de contrato, proposta, briefing', 'estrutura', 'Q1', 2025, 'Processo'),
('Estruturar Braxio para os 3 projetos atuais', 'estrutura', 'Q1', 2025, 'Tech'),
('Organizar Google Drive com estrutura definitiva', 'estrutura', 'Q1', 2025, 'Processo'),
('Definir rituais semanais/mensais de revisão', 'estrutura', 'Q1', 2025, 'Processo'),

-- Ano 1 - Q2
('Submeter projeto para Concurso Deca', 'visibilidade', 'Q2', 2025, 'Vitrine'),
('Decidir sobre Casacor 2026', 'visibilidade', 'Q2', 2025, 'Vitrine'),
('Mapear vitrines alternativas: Reveev, Momentum', 'visibilidade', 'Q2', 2025, 'Vitrine'),
('Criar kit de imprensa profissional', 'visibilidade', 'Q2', 2025, 'PR'),
('Iniciar relacionamento com editores', 'visibilidade', 'Q2', 2025, 'PR'),
('Lançar newsletter no Substack', 'diversificacao', 'Q2', 2025, 'Conteúdo'),
('Definir pilares de conteúdo para Instagram', 'diversificacao', 'Q2', 2025, 'Conteúdo'),
('Criar banco de 20+ posts prontos', 'diversificacao', 'Q2', 2025, 'Conteúdo'),
('Testar formatos: carrossel, reels, bastidores', 'diversificacao', 'Q2', 2025, 'Conteúdo'),
('Documentar projeto em andamento para conteúdo', 'autoridade', 'Q2', 2025, 'Projeto');
*/

-- ===========================================
-- PRONTO! ✓
-- ===========================================
-- Após executar, vá para a página de Configurações do app
-- e insira suas chaves do Supabase para conectar.

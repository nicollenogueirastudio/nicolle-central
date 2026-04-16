# Nicolle Nogueira Studio — Central Estratégica

Sistema de gestão estratégica para planejamento, marketing e performance do Studio.

## 🚀 Deploy Rápido

### 1. Preparar o Supabase (Banco de Dados)

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto (ou use existente)
3. Vá em **SQL Editor** > **New Query**
4. Cole o conteúdo do arquivo `supabase-schema.sql` e execute
5. Vá em **Settings** > **API** e copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (começa com `eyJ...`)

### 2. Subir para o GitHub

1. Crie um repositório no GitHub (ex: `nicolle-central`)
2. No terminal do seu computador:

```bash
# Descompacte o arquivo
unzip nicolle-central.zip
cd nicolle-central

# Inicialize o Git
git init
git add .
git commit -m "Initial commit"

# Conecte ao GitHub (substitua pelo seu usuário)
git remote add origin https://github.com/SEU_USUARIO/nicolle-central.git
git branch -M main
git push -u origin main
```

### 3. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New** > **Project**
3. Importe o repositório `nicolle-central`
4. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua anon key
5. Clique em **Deploy**

🎉 Pronto! Seu app estará em `https://nicolle-central.vercel.app`

---

## 📱 Estrutura do App

```
├── Dashboard          → Visão geral de tudo
├── Planejamento       → Metas dos 3 anos
│   ├── Visão          → Pilares estratégicos
│   └── Metas          → Checklist interativo
├── Marketing          → Calendário editorial
│   └── Pilares        → Categorias de conteúdo
├── Performance        → Métricas das redes
│   ├── Instagram
│   ├── YouTube
│   ├── Pinterest
│   └── TikTok
├── Newsletter         → Casa NOGS
│   ├── Edições        → Rascunhos e publicadas
│   └── Referências    → Banco de inspirações
└── Configurações      → Chaves das APIs
```

---

## 🔌 Integrações

### Instagram (Meta Business)
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um App > Tipo: Business
3. Adicione o produto "Instagram Graph API"
4. Gere um Access Token de longa duração
5. Cole as credenciais na página Configurações do app

### YouTube
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto
3. Ative "YouTube Data API v3"
4. Crie uma API Key
5. Pegue seu Channel ID no YouTube Studio

### Pinterest
1. Acesse [developers.pinterest.com](https://developers.pinterest.com)
2. Crie um App
3. Gere um Access Token
4. Sua conta precisa ser Business

### TikTok
1. Acesse [developers.tiktok.com](https://developers.tiktok.com)
2. Sua conta precisa ser Business/Creator
3. Crie um App e solicite acesso à API
4. Gere as credenciais

### Substack (Casa NOGS)
1. Apenas cole a URL do seu Substack
2. O feed RSS é público, não precisa de autenticação

---

## 🛠 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# Rodar em desenvolvimento
npm run dev

# Abra http://localhost:3000
```

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `supabase-schema.sql` | SQL para criar as tabelas |
| `.env.example` | Modelo de variáveis de ambiente |
| `src/lib/supabase.ts` | Cliente e funções do banco |
| `src/lib/integrations.ts` | APIs das redes sociais |

---

## 💡 Dicas

- **Metas**: Clique para marcar como concluída
- **Calendário**: Arraste posts entre dias (em breve)
- **Referências**: Use categorias para organizar
- **Performance**: Dados atualizam a cada acesso

---

## 🆘 Suporte

Dúvidas? Abra uma issue no GitHub ou fale com a equipe.

---

*Desenvolvido com ♡ para o Nicolle Nogueira Studio*

-- ESCREVER A CASA NOGS
-- Rascunho de edição na estrutura fixa: abertura, No meu radar, Consumindo, Para levar para casa.
-- radar e consumindo guardam a lista de itens: [{ id, titulo, texto, imagem, credito, link }].

create table public.newsletter_rascunhos (
  id uuid primary key default gen_random_uuid(),
  ideia_id uuid references public.newsletter_ideias(id) on delete set null,
  titulo text not null default '',
  subtitulo text,
  abertura text,
  radar jsonb not null default '[]'::jsonb,
  consumindo jsonb not null default '[]'::jsonb,
  levar text,
  fontes text,                 -- uso interno: links da pesquisa, nunca vai para o Substack
  checklist jsonb not null default '{}'::jsonb,
  status text not null default 'rascunho' check (status in ('rascunho', 'revisao', 'pronta', 'publicada')),
  data_prevista date,
  link_substack text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create trigger newsletter_rascunhos_atualizado_em before update on public.newsletter_rascunhos
  for each row execute function public.tocar_atualizado_em();
alter table public.newsletter_rascunhos enable row level security;
create policy "newsletter_rascunhos: ler" on public.newsletter_rascunhos for select to authenticated using (true);
create policy "newsletter_rascunhos: criar" on public.newsletter_rascunhos for insert to authenticated with check (true);
create policy "newsletter_rascunhos: editar" on public.newsletter_rascunhos for update to authenticated using (true) with check (true);
create policy "newsletter_rascunhos: apagar" on public.newsletter_rascunhos for delete to authenticated using (true);

-- Leituras do momento: o que as newsletters de referência estão publicando.
create table public.newsletter_leituras (
  id uuid primary key default gen_random_uuid(),
  newsletter text not null,
  titulo text not null,
  link text,
  publicado_em date,
  nota text,                   -- por que vale a leitura, em uma frase
  criado_em timestamptz not null default now()
);
alter table public.newsletter_leituras enable row level security;
create policy "newsletter_leituras: ler" on public.newsletter_leituras for select to authenticated using (true);
create policy "newsletter_leituras: criar" on public.newsletter_leituras for insert to authenticated with check (true);
create policy "newsletter_leituras: editar" on public.newsletter_leituras for update to authenticated using (true) with check (true);
create policy "newsletter_leituras: apagar" on public.newsletter_leituras for delete to authenticated using (true);

insert into public.newsletter_leituras (newsletter, titulo, link, publicado_em, nota) values
  ('Cabana', 'New York, New York', 'https://cabanamagazine.substack.com/p/new-york-new-york', '2026-10-21', 'O roteiro de outono deles em Nova York: Carlyle, Met, galeria Federico de Vera, mesa de Thanksgiving com Tabitha Simmons.'),
  ('Cabana', 'How to Make a Hotel feel like Home', 'https://cabanamagazine.substack.com/p/how-to-make-a-hotel-feel-like-home', '2026-10-20', 'Sarah Wetenhall sobre The Colony e The Hedges Inn: hotel pensado como casa, o caminho inverso do que a Casa Nogs faz.'),
  ('Cabana', 'Travel Guide: A Weekend in Trieste', 'https://cabanamagazine.substack.com/p/travel-guide-a-weekend-in-trieste', '2026-10-16', 'Formato postcard de cidade, cidade de fronteira entre culturas.'),
  ('Cabana', 'Everything, At Once: Oberto Gili', 'https://cabanamagazine.substack.com/p/everything-at-once-the-story-behind', '2026-10-13', 'Os bastidores de um livro de arquivo fotográfico: 240 imagens de casas.'),
  ('Cabana', 'Cabana Curates: Marvellous Miniature Spaces', 'https://cabanamagazine.substack.com/p/cabana-curates-marvellous-miniature', '2026-10-12', 'Casas em miniatura, da casa de bonecas Oortman no Rijksmuseum à Mouse Mansion.'),
  ('WEARSTLERWORLD', 'INs and OUTs of THE WAY WE WORK', 'https://wearstlerworld.substack.com/p/ins-and-outs-of-the-way-we-work', '2026-10-16', 'Aforismos do estúdio: o processo como conteúdo, sem objeto nem lugar.'),
  ('WEARSTLERWORLD', 'FALLING FOR IT ALL', 'https://wearstlerworld.substack.com/p/falling-for-it-all', '2026-10-09', 'Paris: Paul Bert Serpette, Saint Laurent na Montaigne com Lalanne, Jean-Michel Frank, Perriand e Hoffmann.'),
  ('For Scale', 'A boring home is an ultimate décor achievement', 'https://forscale.substack.com/p/a-boring-home-is-an-ultimate-decor', '2026-09-29', 'Coluna de tese: o tédio como conquista da casa. Pawson, Cini Boeri, o lago de Giverny.'),
  ('Domino Home Front', 'Ignore the ''good'' options, choose the weird one', 'https://dominohomefront.substack.com/p/home-design-personal-style-tips-cristina-cleveland', '2026-10-18', 'Gosto pessoal acima da escolha segura, com editora convidada.'),
  ('Domino Home Front', 'My Asheville ceramics haul', 'https://dominohomefront.substack.com/p/best-east-fork-pottery-pieces', '2026-10-08', 'Visita ao ateliê da East Fork: cerâmica de uso, mesa.'),
  ('W.D.C. Journal', 'Design Round Table: Fall in Vermont', 'https://wdesign.substack.com/p/design-round-table-fall-in-vermont', '2026-10-16', 'Outono na Nova Inglaterra: iluminação feita à mão, Olana de Frederic Church, Hotel Lilien.');

-- Imagens das edições: públicas, porque vão para o Substack.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('newsletter-imagens', 'newsletter-imagens', true, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;
create policy "newsletter-imagens: logado envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'newsletter-imagens');
create policy "newsletter-imagens: logado atualiza" on storage.objects
  for update to authenticated using (bucket_id = 'newsletter-imagens');
create policy "newsletter-imagens: logado remove" on storage.objects
  for delete to authenticated using (bucket_id = 'newsletter-imagens');

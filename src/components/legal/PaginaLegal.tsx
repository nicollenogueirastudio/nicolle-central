// Páginas públicas (sem login) exigidas pelas redes para aprovar os apps: privacidade e termos.

export default function PaginaLegal({ titulo, atualizado, children }: { titulo: string; atualizado: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-cream px-6 py-16">
      <article className="max-w-[680px] mx-auto bg-white rounded-2xl border border-linha shadow-card px-10 py-12">
        <div className="text-[12px] text-muted mb-2">Nicolle Nogueira Studio · Central</div>
        <h1 className="font-display text-[30px] text-charcoal tracking-tight leading-tight">{titulo}</h1>
        <p className="text-[13px] text-muted mt-1 mb-8">Atualizado em {atualizado}</p>
        <div className="space-y-5 text-[15px] leading-relaxed text-charcoal/85 [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:text-charcoal [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </article>
    </main>
  )
}

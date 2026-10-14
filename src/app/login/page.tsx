'use client'

import { useState } from 'react'
import { criarClienteNavegador } from '@/lib/supabase/client'

type Estado = 'parado' | 'enviando' | 'enviado' | 'erro'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<Estado>('parado')
  const [mensagem, setMensagem] = useState('')

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('enviando')

    const supabase = criarClienteNavegador()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Só entra quem já foi cadastrado: ninguém cria conta sozinho.
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setEstado('erro')
      setMensagem('Não foi possível enviar o link. Confira o e-mail ou tente de novo em alguns minutos.')
      return
    }
    setEstado('enviado')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-sm">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
          Nicolle Nogueira Studio
        </div>
        <h1 className="font-display text-4xl text-charcoal mb-10">Central Estratégica</h1>

        {estado === 'enviado' ? (
          <div className="border border-warm-beige bg-soft-white p-6">
            <p className="text-charcoal">Enviamos um link de acesso para <strong>{email}</strong>.</p>
            <p className="text-muted text-sm mt-2">Abra o e-mail neste mesmo navegador e clique no link para entrar.</p>
          </div>
        ) : (
          <form onSubmit={entrar} className="space-y-4">
            <label className="block">
              <span className="text-sm text-muted">E-mail</span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-warm-beige bg-soft-white px-4 py-3 text-charcoal outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="w-full bg-dark text-cream py-3 text-sm tracking-wide hover:bg-charcoal transition-colors disabled:opacity-60"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Receber link de acesso'}
            </button>
            {estado === 'erro' && <p className="text-sm text-accent">{mensagem}</p>}
          </form>
        )}
      </div>
    </main>
  )
}

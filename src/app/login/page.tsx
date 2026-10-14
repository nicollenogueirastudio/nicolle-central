'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, Mail } from 'lucide-react'
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
      <div className="w-full max-w-[380px] text-center animate-fadeIn">
        <div className="mx-auto w-16 h-16 rounded-[18px] bg-dark text-white flex items-center justify-center text-[26px] font-semibold tracking-tight shadow-flutuante mb-6">
          N
        </div>
        <h1 className="font-display text-[28px] leading-tight text-charcoal">Central</h1>
        <p className="text-[15px] text-muted mt-1 mb-9">Nicolle Nogueira Studio</p>

        {estado === 'enviado' ? (
          <div className="bg-white rounded-2xl border border-linha shadow-card p-6">
            <div className="mx-auto w-10 h-10 rounded-full bg-olive/[0.12] text-olive flex items-center justify-center mb-3">
              <Mail size={18} />
            </div>
            <p className="text-[15px] text-charcoal">Enviamos um link para <strong className="font-medium">{email}</strong>.</p>
            <p className="text-[13px] text-muted mt-1.5">Abra o e-mail neste mesmo navegador e clique no link para entrar.</p>
          </div>
        ) : (
          <form onSubmit={entrar} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                required
                autoFocus
                placeholder="seu e-mail"
                aria-label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-black/[0.12] bg-white pl-4 pr-12 py-3 text-[15px] text-charcoal outline-none placeholder:text-muted/60 focus:border-accent focus:ring-[3px] focus:ring-accent/15 transition-shadow"
              />
              <button
                type="submit"
                disabled={estado === 'enviando' || !email}
                aria-label="Receber link de acesso"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-black disabled:bg-black/15 transition-colors"
              >
                {estado === 'enviando' ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={16} />}
              </button>
            </div>
            <p className="text-[12px] text-muted">Você recebe um link de acesso por e-mail. Sem senha.</p>
            {estado === 'erro' && <p className="text-[13px] text-accent">{mensagem}</p>}
          </form>
        )}
      </div>
    </main>
  )
}

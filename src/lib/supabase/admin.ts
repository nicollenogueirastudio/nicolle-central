import { createClient } from '@supabase/supabase-js'

// Cliente com a chave service_role: ignora o RLS. Só para rotinas automáticas (cron)
// no servidor. Nunca importar em arquivo com 'use client'.
export function criarClienteAdmin() {
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!chave) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

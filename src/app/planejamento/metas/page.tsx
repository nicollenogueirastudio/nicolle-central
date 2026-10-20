import { redirect } from 'next/navigation'

// As metas agora vivem na própria página de Planejamento.
export default function MetasPage() {
  redirect('/planejamento')
}

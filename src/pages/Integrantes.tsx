import { Link } from 'react-router-dom'
import { INTEGRANTES } from '../data/integrantes'
import { useTitulo } from '../hooks/useTitulo'

export default function Integrantes() {
  useTitulo('Integrantes')
  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl">Integrantes</h1>
      <p className="max-w-prose text-muted">Grupo responsável pelo VozAtiva na Global Solution FIAP 2026/2.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {INTEGRANTES.map((i) => (
          <li key={i.id} className="cartao flex items-center gap-4">
            <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-bold text-brand-fg">
              {i.nome.charAt(0)}
            </span>
            <div className="min-w-0">
              <h2 className="text-xl">{i.nome}</h2>
              <p className="text-muted">RM {i.rm} · {i.turma}</p>
              <Link to={`/integrantes/${i.id}`} className="font-bold">
                Ver perfil de {i.nome.split(' ')[0]}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

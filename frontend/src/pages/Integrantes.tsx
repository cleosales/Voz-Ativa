import { Link } from 'react-router-dom'
import FotoIntegrante from '../components/FotoIntegrante'
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
            <FotoIntegrante integrante={i} />
            <div className="min-w-0 space-y-1">
              <h2 className="text-xl">{i.nome}</h2>
              <p className="text-muted">RM {i.rm} · {i.turma}</p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 font-bold">
                <Link to={`/integrantes/${i.id}`}>Ver perfil de {i.nome.split(' ')[0]}</Link>
                {i.github && (
                  <a href={i.github} target="_blank" rel="noreferrer" aria-label={`GitHub de ${i.nome} (abre em nova aba)`}>GitHub</a>
                )}
                {i.linkedin && (
                  <a href={i.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${i.nome} (abre em nova aba)`}>LinkedIn</a>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import EstadoVazio from '../components/EstadoVazio'
import FotoIntegrante from '../components/FotoIntegrante'
import { INTEGRANTES } from '../data/integrantes'
import { useTitulo } from '../hooks/useTitulo'

export default function IntegranteDetalhe() {
  const { id } = useParams()
  const integrante = INTEGRANTES.find((i) => String(i.id) === id)
  useTitulo(integrante ? integrante.nome : 'Integrante não encontrado')

  if (!integrante) {
    return (
      <EstadoVazio
        titulo="Integrante não encontrado"
        acao={<Link to="/integrantes" className="btn btn-primario">Ver todos os integrantes</Link>}
      >
        Não existe integrante com este identificador.
      </EstadoVazio>
    )
  }

  return (
    <div className="space-y-6">
      <p><Link to="/integrantes">← Todos os integrantes</Link></p>
      <div className="cartao space-y-3">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <FotoIntegrante integrante={integrante} tamanho="grande" />
          <h1 className="text-3xl sm:text-4xl">{integrante.nome}</h1>
        </div>
        <dl className="grid gap-2 sm:grid-cols-[10rem_1fr]">
          <dt className="font-bold">RM</dt>
          <dd>{integrante.rm}</dd>
          <dt className="font-bold">Turma</dt>
          <dd>{integrante.turma}</dd>
          <dt className="font-bold">Projeto</dt>
          <dd>{integrante.papel}</dd>
          {integrante.github && (
            <>
              <dt className="font-bold">GitHub</dt>
              <dd><a href={integrante.github} target="_blank" rel="noreferrer" className="break-all">{integrante.github}</a></dd>
            </>
          )}
          {integrante.linkedin && (
            <>
              <dt className="font-bold">LinkedIn</dt>
              <dd><a href={integrante.linkedin} target="_blank" rel="noreferrer" className="break-all">{integrante.linkedin}</a></dd>
            </>
          )}
        </dl>
      </div>
    </div>
  )
}

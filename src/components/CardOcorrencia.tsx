import { Link } from 'react-router-dom'
import type { Ocorrencia } from '../types'
import { formatarData, formatarProtocolo } from '../utils/formatar'
import { StatusBadge, UrgenciaBadge } from './StatusBadge'

interface Props {
  ocorrencia: Ocorrencia
  nomeCategoria: string
}

export default function CardOcorrencia({ ocorrencia, nomeCategoria }: Props) {
  const protocolo = formatarProtocolo(ocorrencia.id)

  return (
    <article className="cartao flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-bold text-muted">{protocolo}</p>
        <StatusBadge status={ocorrencia.status} />
      </div>

      <h3 className="text-xl">{nomeCategoria}</h3>
      <p className="text-muted">
        {ocorrencia.local}, {ocorrencia.bairro}
      </p>
      <p className="line-clamp-3">{ocorrencia.descricao}</p>

      <div className="flex flex-wrap gap-2">
        <UrgenciaBadge urgencia={ocorrencia.urgencia} />
        {ocorrencia.afetaAcessibilidade === 'S' && (
          <span className="inline-flex items-center rounded-full border-2 border-accent bg-accent px-3 py-0.5 text-sm font-bold text-accent-fg">
            Afeta acessibilidade
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-sm text-muted">Aberta em {formatarData(ocorrencia.dataAbertura)}</span>
        <Link
          to={`/ocorrencias/${ocorrencia.id}`}
          className="btn btn-secundario"
          aria-label={`Ver detalhes da ocorrência ${protocolo}`}
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}

import type { StatusOcorrencia } from '../types'
import { rotuloStatus, rotuloUrgencia } from '../utils/formatar'

const ESTILO_STATUS: Record<string, string> = {
  ABERTA: 'border-warn bg-warn-soft',
  EM_ANALISE: 'border-brand bg-brand-soft',
  EM_ANDAMENTO: 'border-brand bg-brand-soft',
  RESOLVIDA: 'border-ok bg-ok-soft',
}

const SIMBOLO_STATUS: Record<string, string> = {
  ABERTA: '○',
  EM_ANALISE: '◔',
  EM_ANDAMENTO: '◑',
  RESOLVIDA: '●',
}

export function StatusBadge({ status }: { status: StatusOcorrencia | string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-0.5 text-sm font-bold ${ESTILO_STATUS[status] ?? 'border-line-strong'}`}
    >
      <span aria-hidden="true">{SIMBOLO_STATUS[status] ?? '○'}</span>
      {rotuloStatus(status)}
    </span>
  )
}

const ESTILO_URGENCIA: Record<number, string> = {
  1: 'border-line-strong',
  2: 'border-warn bg-warn-soft',
  3: 'border-danger bg-danger-soft',
}

export function UrgenciaBadge({ urgencia }: { urgencia: number }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 px-3 py-0.5 text-sm font-bold ${ESTILO_URGENCIA[urgencia] ?? 'border-line-strong'}`}
    >
      Urgência {rotuloUrgencia(urgencia).toLowerCase()}
    </span>
  )
}

export default StatusBadge

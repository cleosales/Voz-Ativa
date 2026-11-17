import type { ReactNode } from 'react'

type Tipo = 'erro' | 'sucesso' | 'aviso' | 'info'

interface Props {
  tipo: Tipo
  titulo?: string
  children: ReactNode
  acao?: ReactNode
}

const ESTILOS: Record<Tipo, string> = {
  erro: 'border-danger bg-danger-soft text-ink',
  sucesso: 'border-ok bg-ok-soft text-ink',
  aviso: 'border-warn bg-warn-soft text-ink',
  info: 'border-brand bg-brand-soft text-ink',
}

const ICONES: Record<Tipo, string> = {
  erro: '✕',
  sucesso: '✓',
  aviso: '!',
  info: 'i',
}

const COR_ICONE: Record<Tipo, string> = {
  erro: 'bg-danger text-bg',
  sucesso: 'bg-ok text-bg',
  aviso: 'bg-warn text-bg',
  info: 'bg-brand text-brand-fg',
}

export default function Alerta({ tipo, titulo, children, acao }: Props) {
  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`flex gap-3 rounded-lg border-2 p-4 ${ESTILOS[tipo]}`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${COR_ICONE[tipo]}`}
      >
        {ICONES[tipo]}
      </span>
      <div className="min-w-0 flex-1">
        {titulo && <p className="font-bold">{titulo}</p>}
        <div>{children}</div>
        {acao && <div className="mt-3">{acao}</div>}
      </div>
    </div>
  )
}

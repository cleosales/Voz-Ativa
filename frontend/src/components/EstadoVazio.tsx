import type { ReactNode } from 'react'

interface Props {
  titulo: string
  children?: ReactNode
  acao?: ReactNode
}

export default function EstadoVazio({ titulo, children, acao }: Props) {
  return (
    <div className="rounded-xl border-2 border-dashed border-line-strong p-8 text-center">
      <p className="text-lg font-bold">{titulo}</p>
      {children && <p className="mx-auto mt-2 max-w-prose text-muted">{children}</p>}
      {acao && <div className="mt-4 flex justify-center">{acao}</div>}
    </div>
  )
}

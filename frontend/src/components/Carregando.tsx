interface Props {
  texto?: string
}

export default function Carregando({ texto = 'Carregando…' }: Props) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-8 text-muted">
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-4 border-line-strong border-t-brand"
      />
      <span>{texto}</span>
    </div>
  )
}

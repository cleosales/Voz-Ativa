import type { Integrante } from '../types'

interface Props {
  integrante: Integrante
  tamanho?: 'pequena' | 'grande'
}

// Foto redonda do integrante; sem foto, mostra a inicial do nome.
export default function FotoIntegrante({ integrante, tamanho = 'pequena' }: Props) {
  const medida = tamanho === 'grande' ? 'h-32 w-32 sm:h-40 sm:w-40' : 'h-20 w-20'

  if (!integrante.foto) {
    return (
      <span aria-hidden="true" className={`${medida} flex shrink-0 items-center justify-center rounded-full bg-brand text-3xl font-bold text-brand-fg`}>
        {integrante.nome.charAt(0)}
      </span>
    )
  }

  return (
    <img
      src={integrante.foto}
      alt={`Foto de ${integrante.nome}`}
      width={160}
      height={160}
      loading="lazy"
      className={`${medida} shrink-0 rounded-full border-2 border-brand object-cover`}
    />
  )
}

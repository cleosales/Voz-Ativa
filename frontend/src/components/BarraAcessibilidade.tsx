import { useAcessibilidade } from '../contexts/AcessibilidadeContext'

export default function BarraAcessibilidade() {
  const { aumentarFonte, diminuirFonte, alternarContraste, altoContraste, podeAumentar, podeDiminuir } =
    useAcessibilidade()

  const botao =
    'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border-2 border-line-strong bg-bg px-3 text-sm font-bold text-ink hover:bg-surface disabled:opacity-50'

  return (
    <div className="border-b border-line bg-surface">
      <div className="container-pagina flex flex-wrap items-center justify-between gap-2 py-2">
        <p className="text-sm text-muted">Recursos de acessibilidade</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ajustes de leitura">
          <button type="button" className={botao} onClick={diminuirFonte} disabled={!podeDiminuir} aria-label="Diminuir tamanho da letra">
            A−
          </button>
          <button type="button" className={botao} onClick={aumentarFonte} disabled={!podeAumentar} aria-label="Aumentar tamanho da letra">
            A+
          </button>
          <button type="button" className={botao} onClick={alternarContraste} aria-pressed={altoContraste}>
            Alto contraste: {altoContraste ? 'ligado' : 'desligado'}
          </button>
        </div>
      </div>
    </div>
  )
}

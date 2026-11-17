import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-line bg-surface">
      <div className="container-pagina grid gap-6 py-8 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold">VozAtiva</p>
          <p className="mt-1 text-muted">Toda voz importa. Toda necessidade merece ser ouvida.</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="space-y-1">
            <li><Link to="/registrar">Registrar ocorrência</Link></li>
            <li><Link to="/ocorrencias">Acompanhar ocorrências</Link></li>
            <li><Link to="/faq">Perguntas frequentes</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </nav>
        <p className="text-sm text-muted">
          Projeto acadêmico da Global Solution FIAP 2026/2 · CitizenTech · 1TDSPI.
          ODS 3, 9, 10 e 11.
        </p>
      </div>
    </footer>
  )
}

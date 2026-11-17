import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', rotulo: 'Início', fim: true },
  { to: '/registrar', rotulo: 'Registrar' },
  { to: '/ocorrencias', rotulo: 'Ocorrências' },
  { to: '/painel', rotulo: 'Painel' },
  { to: '/categorias', rotulo: 'Categorias' },
  { to: '/sobre', rotulo: 'Sobre' },
  { to: '/integrantes', rotulo: 'Integrantes' },
  { to: '/faq', rotulo: 'FAQ' },
  { to: '/contato', rotulo: 'Contato' },
]

function classeLink({ isActive }: { isActive: boolean }) {
  return `block rounded-lg px-3 py-2 font-bold no-underline ${
    isActive ? 'bg-brand text-brand-fg' : 'text-ink hover:bg-surface'
  }`
}

export default function Header() {
  const [aberto, setAberto] = useState(false)
  const local = useLocation()

  // Fecha o menu ao trocar de página
  useEffect(() => {
    setAberto(false)
  }, [local.pathname])

  // Esc fecha o menu
  useEffect(() => {
    if (!aberto) return
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  return (
    <header className="border-b-2 border-line bg-bg">
      <div className="container-pagina flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold no-underline" aria-label="VozAtiva, página inicial">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-fg">
            V
          </span>
          VozAtiva
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.fim} className={classeLink}>
                  {l.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="btn btn-secundario xl:hidden"
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? 'Fechar menu' : 'Menu'}
        </button>
      </div>

      {aberto && (
        <nav id="menu-mobile" aria-label="Principal (menu)" className="border-t border-line xl:hidden">
          <ul className="container-pagina grid gap-1 py-3 sm:grid-cols-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.fim} className={classeLink}>
                  {l.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BarraAcessibilidade from './BarraAcessibilidade'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname } = useLocation()
  const principal = useRef<HTMLElement>(null)
  const primeira = useRef(true)

  // A cada troca de rota volta ao topo e leva o foco ao conteúdo (ajuda leitores de tela e teclado)
  useEffect(() => {
    window.scrollTo(0, 0)
    if (primeira.current) {
      primeira.current = false
      return
    }
    principal.current?.focus()
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:p-3 focus:text-brand-fg"
      >
        Ir para o conteúdo
      </a>
      <BarraAcessibilidade />
      <Header />
      <main id="conteudo" ref={principal} tabIndex={-1} className="container-pagina flex-1 py-8 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

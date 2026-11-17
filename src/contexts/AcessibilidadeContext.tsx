import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Tamanhos de letra em % do tamanho base do navegador
const ESCALAS = [100, 115, 130, 150]
const CHAVE = 'vozativa-acessibilidade'

interface Preferencias {
  escala: number
  altoContraste: boolean
}

interface Valor extends Preferencias {
  aumentarFonte: () => void
  diminuirFonte: () => void
  alternarContraste: () => void
  podeAumentar: boolean
  podeDiminuir: boolean
}

const Contexto = createContext<Valor | null>(null)

function carregar(): Preferencias {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo) {
      const p = JSON.parse(salvo) as Partial<Preferencias>
      return {
        escala: ESCALAS.includes(p.escala ?? 0) ? (p.escala as number) : 100,
        altoContraste: Boolean(p.altoContraste),
      }
    }
  } catch {
    // localStorage indisponível: usa o padrão
  }
  return { escala: 100, altoContraste: false }
}

export function AcessibilidadeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferencias>(carregar)

  useEffect(() => {
    document.documentElement.style.fontSize = `${prefs.escala}%`
    document.documentElement.classList.toggle('alto-contraste', prefs.altoContraste)
    try {
      localStorage.setItem(CHAVE, JSON.stringify(prefs))
    } catch {
      // sem persistência, mas a página continua funcionando
    }
  }, [prefs])

  const indice = ESCALAS.indexOf(prefs.escala)

  const valor: Valor = {
    ...prefs,
    podeAumentar: indice < ESCALAS.length - 1,
    podeDiminuir: indice > 0,
    aumentarFonte: () => setPrefs((p) => ({ ...p, escala: ESCALAS[Math.min(ESCALAS.indexOf(p.escala) + 1, ESCALAS.length - 1)] })),
    diminuirFonte: () => setPrefs((p) => ({ ...p, escala: ESCALAS[Math.max(ESCALAS.indexOf(p.escala) - 1, 0)] })),
    alternarContraste: () => setPrefs((p) => ({ ...p, altoContraste: !p.altoContraste })),
  }

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAcessibilidade(): Valor {
  const valor = useContext(Contexto)
  if (!valor) throw new Error('useAcessibilidade deve ser usado dentro de AcessibilidadeProvider')
  return valor
}

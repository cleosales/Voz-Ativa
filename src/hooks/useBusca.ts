import { useCallback, useEffect, useState } from 'react'

export function useBusca<T>(buscar: (signal: AbortSignal) => Promise<T>, dependencias: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    setCarregando(true)
    setErro(null)

    buscar(controle.signal)
      .then((resultado) => {
        setDados(resultado)
        setCarregando(false)
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setErro(e instanceof Error ? e.message : 'Ocorreu um erro inesperado.')
        setCarregando(false)
      })

    return () => controle.abort()

  }, [versao, ...dependencias])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])

  return { dados, carregando, erro, recarregar }
}

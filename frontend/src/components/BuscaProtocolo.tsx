import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { lerProtocolo } from '../utils/formatar'

export default function BuscaProtocolo() {
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const navegar = useNavigate()

  function enviar(e: FormEvent) {
    e.preventDefault()
    const id = lerProtocolo(texto)
    if (!texto.trim()) {
      setErro('Digite o número do protocolo.')
      return
    }
    if (id === null) {
      setErro('Protocolo inválido. Use o formato VA-0001.')
      return
    }
    setErro('')
    navegar(`/ocorrencias/${id}`)
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-1.5">
      <label htmlFor="busca-protocolo" className="block font-bold">
        Acompanhar pelo protocolo
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="busca-protocolo"
          className="campo sm:max-w-xs"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex.: VA-0001"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? 'busca-protocolo-erro' : undefined}
        />
        <button type="submit" className="btn btn-primario">
          Buscar
        </button>
      </div>
      {erro && (
        <p id="busca-protocolo-erro" className="font-bold text-danger">
          {erro}
        </p>
      )}
    </form>
  )
}

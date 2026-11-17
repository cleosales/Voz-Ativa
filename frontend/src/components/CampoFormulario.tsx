interface Opcao {
  valor: string
  rotulo: string
}

interface Props {
  id: string
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  tipo?: 'text' | 'email' | 'textarea' | 'select'
  erro?: string
  dica?: string
  obrigatorio?: boolean
  opcoes?: Opcao[]
  placeholder?: string
  maxLength?: number
  desabilitado?: boolean
  autoComplete?: string
}

/** Campo com label, dica e mensagem de erro ligados por aria-describedby. */
export default function CampoFormulario({
  id,
  rotulo,
  valor,
  aoMudar,
  tipo = 'text',
  erro,
  dica,
  obrigatorio,
  opcoes,
  placeholder,
  maxLength,
  desabilitado,
  autoComplete,
}: Props) {
  const idDica = dica ? `${id}-dica` : undefined
  const idErro = erro ? `${id}-erro` : undefined
  const descricao = [idDica, idErro].filter(Boolean).join(' ') || undefined

  const comuns = {
    id,
    value: valor,
    disabled: desabilitado,
    required: obrigatorio,
    'aria-invalid': erro ? (true as const) : undefined,
    'aria-describedby': descricao,
    className: 'campo',
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-bold">
        {rotulo}
        {obrigatorio && (
          <span className="font-normal text-muted"> (obrigatório)</span>
        )}
      </label>
      {dica && (
        <p id={idDica} className="text-sm text-muted">
          {dica}
        </p>
      )}

      {tipo === 'textarea' && (
        <textarea
          {...comuns}
          rows={5}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => aoMudar(e.target.value)}
        />
      )}

      {tipo === 'select' && (
        <select {...comuns} onChange={(e) => aoMudar(e.target.value)}>
          {(opcoes ?? []).map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
      )}

      {(tipo === 'text' || tipo === 'email') && (
        <input
          {...comuns}
          type={tipo}
          maxLength={maxLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => aoMudar(e.target.value)}
        />
      )}

      {erro && (
        <p id={idErro} className="font-bold text-danger">
          {erro}
        </p>
      )}
    </div>
  )
}

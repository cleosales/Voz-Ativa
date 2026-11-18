import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import CampoFormulario from '../components/CampoFormulario'
import Carregando from '../components/Carregando'
import EstadoVazio from '../components/EstadoVazio'
import { useBusca } from '../hooks/useBusca'
import { useTitulo } from '../hooks/useTitulo'
import { criarOcorrencia, listarCategorias } from '../services/api'
import { sugerirUrgencia } from '../services/ia'
import type { Sugestao } from '../services/ia'
import { formatarProtocolo, URGENCIA_ROTULO } from '../utils/formatar'

const TITULOS = ['Qual é o tipo de problema?', 'Onde fica?', 'O que está acontecendo?', 'Afeta a acessibilidade?', 'Revise e confirme']

const OPCOES_URGENCIA = [
  { valor: '1', rotulo: 'Baixa' },
  { valor: '2', rotulo: 'Média' },
  { valor: '3', rotulo: 'Alta' },
]

export default function Registrar() {
  useTitulo('Registrar ocorrência')
  const { dados: categorias, carregando, erro, recarregar } = useBusca(listarCategorias)

  const [passo, setPasso] = useState(0)
  const [categoriaId, setCategoriaId] = useState('')
  const [bairro, setBairro] = useState('')
  const [local, setLocal] = useState('')
  const [descricao, setDescricao] = useState('')
  const [afeta, setAfeta] = useState<'S' | 'N' | ''>('')
  const [erroPasso, setErroPasso] = useState<Record<string, string>>({})

  const [sugestao, setSugestao] = useState<Sugestao | null>(null)
  const [buscandoSugestao, setBuscandoSugestao] = useState(false)
  const [urgencia, setUrgencia] = useState('1')

  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')
  const [concluido, setConcluido] = useState<{ id: number | null; mensagem: string } | null>(null)

  const titulo = useRef<HTMLHeadingElement>(null)
  const primeiraVez = useRef(true)

  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false
      return
    }
    titulo.current?.focus()
  }, [passo, concluido])

  const categoria = categorias?.find((c) => String(c.id) === categoriaId)

  function validar(): Record<string, string> {
    const e: Record<string, string> = {}
    if (passo === 0 && !categoriaId) e.categoria = 'Escolha um tipo de problema para continuar.'
    if (passo === 1) {
      if (!bairro.trim()) e.bairro = 'Informe o bairro.'
      if (!local.trim()) e.local = 'Informe o local, como rua e número ou um ponto de referência.'
    }
    if (passo === 2) {
      if (descricao.trim().length < 10) e.descricao = 'Descreva o problema com pelo menos 10 caracteres.'
      else if (descricao.trim().length > 500) e.descricao = 'A descrição deve ter no máximo 500 caracteres.'
    }
    if (passo === 3 && !afeta) e.afeta = 'Escolha uma opção.'
    return e
  }

  async function avancar() {
    const e = validar()
    setErroPasso(e)
    if (Object.keys(e).length > 0) return

    if (passo === 3) {
      setPasso(4)
      setSugestao(null)
      setBuscandoSugestao(true)
      const s = await sugerirUrgencia({
        categoria: categoria?.nome ?? '',
        bairro: bairro.trim(),
        descricao,
        categoriaDeAcessibilidade: categoria?.acessibilidade === 'S',
        afetaAcessibilidade: afeta === 'S',
      })
      setSugestao(s)
      setUrgencia(String(s.urgencia))
      setBuscandoSugestao(false)
      return
    }
    setPasso(passo + 1)
  }

  function voltar() {
    setErroPasso({})
    setErroEnvio('')
    setPasso(Math.max(passo - 1, 0))
  }

  async function confirmar() {
    setEnviando(true)
    setErroEnvio('')
    try {
      const r = await criarOcorrencia({
        categoriaId: Number(categoriaId),
        bairro: bairro.trim(),
        local: local.trim(),
        descricao: descricao.trim(),
        afetaAcessibilidade: afeta === 'S' ? 'S' : 'N',
        status: 'ABERTA',
        urgencia: Number(urgencia),
      })
      setConcluido(r)
    } catch (err) {
      setErroEnvio(err instanceof Error ? err.message : 'Erro inesperado ao enviar.')
    } finally {
      setEnviando(false)
    }
  }

  function novoRegistro() {
    setConcluido(null)
    setPasso(0)
    setCategoriaId('')
    setBairro('')
    setLocal('')
    setDescricao('')
    setAfeta('')
    setSugestao(null)
    setErroPasso({})
  }

  if (carregando) return <Carregando texto="Preparando o assistente…" />

  if (erro) {
    return (
      <Alerta tipo="erro" titulo="Não foi possível carregar as categorias" acao={<button type="button" className="btn btn-secundario" onClick={recarregar}>Tentar de novo</button>}>
        {erro}
      </Alerta>
    )
  }

  if (!categorias || categorias.length === 0) {
    return (
      <EstadoVazio titulo="Ainda não há categorias cadastradas" acao={<Link to="/categorias" className="btn btn-primario">Cadastrar categorias</Link>}>
        Para registrar uma ocorrência, é preciso ter ao menos uma categoria.
      </EstadoVazio>
    )
  }

  if (concluido) {
    const protocolo = concluido.id ? formatarProtocolo(concluido.id) : null
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 ref={titulo} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">Ocorrência registrada</h1>
        <Alerta tipo="sucesso">{concluido.mensagem}</Alerta>
        {protocolo && (
          <div className="cartao space-y-1 text-center">
            <p className="text-muted">Anote seu protocolo</p>
            <p className="text-4xl font-bold">{protocolo}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {concluido.id ? (
            <Link to={`/ocorrencias/${concluido.id}`} className="btn btn-primario">Acompanhar esta ocorrência</Link>
          ) : (
            <Link to="/ocorrencias" className="btn btn-primario">Ver ocorrências</Link>
          )}
          <button type="button" className="btn btn-secundario" onClick={novoRegistro}>Registrar outro problema</button>
        </div>
      </div>
    )
  }

  const total = TITULOS.length

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl">Registrar um problema</h1>
        <p aria-live="polite" className="text-muted">Passo {passo + 1} de {total}</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
          <div className="h-full rounded-full bg-brand" style={{ width: `${((passo + 1) / total) * 100}%` }} />
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (passo < 4) void avancar()
        }}
        className="cartao space-y-5"
      >
        <h2 ref={titulo} tabIndex={-1} className="text-2xl outline-none">{TITULOS[passo]}</h2>

        {passo === 0 && (
          <fieldset className="space-y-3" aria-describedby={erroPasso.categoria ? 'erro-cat' : undefined}>
            <legend className="sr-only">Tipo de problema</legend>
            {categorias.map((c) => (
              <label key={c.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 border-line-strong p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                <input
                  type="radio"
                  name="categoria"
                  value={c.id}
                  checked={categoriaId === String(c.id)}
                  onChange={() => setCategoriaId(String(c.id))}
                  className="mt-1 h-5 w-5 accent-brand"
                />
                <span>
                  <span className="block font-bold">{c.nome}</span>
                  <span className="block text-sm text-muted">{c.descricao}</span>
                </span>
              </label>
            ))}
            {erroPasso.categoria && <p id="erro-cat" className="font-bold text-danger">{erroPasso.categoria}</p>}
          </fieldset>
        )}

        {passo === 1 && (
          <>
            <CampoFormulario id="r-bairro" rotulo="Bairro" obrigatorio valor={bairro} aoMudar={setBairro} erro={erroPasso.bairro} maxLength={100} />
            <CampoFormulario id="r-local" rotulo="Local" obrigatorio dica="Rua e número, ou um ponto de referência." valor={local} aoMudar={setLocal} erro={erroPasso.local} maxLength={150} />
          </>
        )}

        {passo === 2 && (
          <CampoFormulario
            id="r-desc"
            rotulo="Descrição"
            tipo="textarea"
            obrigatorio
            dica={`Conte com suas palavras. ${descricao.length} de 500 caracteres.`}
            valor={descricao}
            aoMudar={setDescricao}
            erro={erroPasso.descricao}
            maxLength={500}
          />
        )}

        {passo === 3 && (
          <fieldset className="space-y-3" aria-describedby={erroPasso.afeta ? 'erro-afeta' : undefined}>
            <legend className="mb-2 text-muted">
              Marque "Sim" se o problema atrapalha pessoas com deficiência, idosos ou quem tem mobilidade reduzida.
            </legend>
            {[
              ['S', 'Sim, afeta a acessibilidade'],
              ['N', 'Não afeta'],
            ].map(([valor, rotulo]) => (
              <label key={valor} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-line-strong p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                <input
                  type="radio"
                  name="afeta"
                  value={valor}
                  checked={afeta === valor}
                  onChange={() => setAfeta(valor === 'S' ? 'S' : 'N')}
                  className="h-5 w-5 accent-brand"
                />
                <span className="font-bold">{rotulo}</span>
              </label>
            ))}
            {erroPasso.afeta && <p id="erro-afeta" className="font-bold text-danger">{erroPasso.afeta}</p>}
          </fieldset>
        )}

        {passo === 4 && (
          <div className="space-y-5">
            <dl className="grid gap-2 sm:grid-cols-[9rem_1fr]">
              <dt className="font-bold">Tipo</dt><dd>{categoria?.nome}</dd>
              <dt className="font-bold">Bairro</dt><dd>{bairro}</dd>
              <dt className="font-bold">Local</dt><dd>{local}</dd>
              <dt className="font-bold">Descrição</dt><dd className="break-words">{descricao}</dd>
              <dt className="font-bold">Acessibilidade</dt><dd>{afeta === 'S' ? 'Afeta' : 'Não afeta'}</dd>
            </dl>

            {buscandoSugestao && <Carregando texto="Calculando a urgência sugerida…" />}

            {sugestao && (
              <div className="space-y-3">
                <Alerta tipo="info" titulo={`Urgência sugerida: ${URGENCIA_ROTULO[sugestao.urgencia]}`}>
                  {sugestao.origem === 'ia'
                    ? 'Sugestão calculada pelos modelos de IA do VozAtiva.'
                    : 'Sugestão calculada por uma regra simples (a API de IA não está conectada).'}{' '}
                  Você pode ajustar antes de confirmar.
                </Alerta>
                <CampoFormulario id="r-urg" rotulo="Urgência" tipo="select" opcoes={OPCOES_URGENCIA} valor={urgencia} aoMudar={setUrgencia} />
              </div>
            )}

            {erroEnvio && <Alerta tipo="erro" titulo="Não foi possível registrar">{erroEnvio}</Alerta>}
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 pt-2">
          <button type="button" className="btn btn-secundario" onClick={voltar} disabled={passo === 0 || enviando}>
            Voltar
          </button>
          {passo < 4 ? (
            <button type="submit" className="btn btn-primario">Continuar</button>
          ) : (
            <button type="button" className="btn btn-primario" onClick={confirmar} disabled={enviando || buscandoSugestao || !sugestao}>
              {enviando ? 'Enviando…' : 'Confirmar e registrar'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

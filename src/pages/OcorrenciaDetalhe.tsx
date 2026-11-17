import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Alerta from '../components/Alerta'
import CampoFormulario from '../components/CampoFormulario'
import Carregando from '../components/Carregando'
import EstadoVazio from '../components/EstadoVazio'
import { StatusBadge, UrgenciaBadge } from '../components/StatusBadge'
import { useBusca } from '../hooks/useBusca'
import { useTitulo } from '../hooks/useTitulo'
import {
  ApiError,
  atualizarOcorrencia,
  buscarOcorrencia,
  criarAtualizacao,
  excluirOcorrencia,
  listarAtualizacoes,
  listarCategorias,
} from '../services/api'
import type { Atualizacao, Categoria, Ocorrencia, StatusOcorrencia } from '../types'
import { formatarData, formatarProtocolo, STATUS_ORDEM, STATUS_ROTULO } from '../utils/formatar'

interface Pacote {
  ocorrencia: Ocorrencia
  atualizacoes: Atualizacao[]
  categorias: Categoria[]
}

async function buscarPacote(id: number, signal: AbortSignal): Promise<Pacote> {
  const [ocorrencia, atualizacoes, categorias] = await Promise.all([
    buscarOcorrencia(id, signal),
    listarAtualizacoes(id, signal),
    listarCategorias(signal),
  ])
  return { ocorrencia, atualizacoes, categorias }
}

export default function OcorrenciaDetalhe() {
  const { id } = useParams()
  const idNumero = Number(id)
  const idValido = Number.isInteger(idNumero) && idNumero > 0
  useTitulo(idValido ? `Ocorrência ${formatarProtocolo(idNumero)}` : 'Ocorrência')

  const navegar = useNavigate()
  const { dados, carregando, erro, recarregar } = useBusca((s) => buscarPacote(idNumero, s), [idNumero])

  const [resultado, setResultado] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  // formulário de nova atualização
  const [novoStatus, setNovoStatus] = useState('')
  const [textoAtualizacao, setTextoAtualizacao] = useState('')
  const [errosAtualizacao, setErrosAtualizacao] = useState<{ status?: string; texto?: string }>({})
  const [enviandoAtualizacao, setEnviandoAtualizacao] = useState(false)

  // formulário de edição
  const [editando, setEditando] = useState(false)
  const [edBairro, setEdBairro] = useState('')
  const [edLocal, setEdLocal] = useState('')
  const [edDescricao, setEdDescricao] = useState('')
  const [edUrgencia, setEdUrgencia] = useState('1')
  const [edAfeta, setEdAfeta] = useState('N')
  const [errosEdicao, setErrosEdicao] = useState<Record<string, string>>({})
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)

  if (!idValido) {
    return (
      <EstadoVazio titulo="Protocolo inválido" acao={<Link to="/ocorrencias" className="btn btn-primario">Ver ocorrências</Link>}>
        O número informado não é válido.
      </EstadoVazio>
    )
  }

  if (carregando) return <Carregando texto="Buscando a ocorrência…" />

  if (erro) {
    const naoExiste = erro.toLowerCase().includes('não encontrada')
    return (
      <div className="space-y-4">
        <Alerta
          tipo="erro"
          titulo={naoExiste ? 'Ocorrência não encontrada' : 'Não foi possível carregar a ocorrência'}
          acao={
            <div className="flex flex-wrap gap-2">
              {!naoExiste && <button type="button" className="btn btn-secundario" onClick={recarregar}>Tentar de novo</button>}
              <Link to="/ocorrencias" className="btn btn-secundario">Ver todas as ocorrências</Link>
            </div>
          }
        >
          {erro}
        </Alerta>
      </div>
    )
  }

  if (!dados) return null

  const { ocorrencia, categorias } = dados
  const protocolo = formatarProtocolo(ocorrencia.id)
  const categoria = categorias.find((c) => c.id === ocorrencia.categoriaId)
  const resolvida = ocorrencia.status === 'RESOLVIDA'

  // Linha do tempo em ordem cronológica
  const atualizacoes = [...dados.atualizacoes].sort(
    (a, b) => new Date(a.dataAtualizacao).getTime() - new Date(b.dataAtualizacao).getTime(),
  )

  // Só oferece status à frente do atual (o status avança na ordem prevista)
  const posicaoAtual = STATUS_ORDEM.indexOf(ocorrencia.status)
  const opcoesStatus = [{ valor: '', rotulo: 'Selecione o novo status' }]
  for (let i = posicaoAtual + 1; i < STATUS_ORDEM.length; i++) {
    opcoesStatus.push({ valor: STATUS_ORDEM[i], rotulo: STATUS_ROTULO[STATUS_ORDEM[i]] })
  }

  function mensagemDeErro(err: unknown): string {
    if (err instanceof ApiError || err instanceof Error) return err.message
    return 'Erro inesperado.'
  }

  async function enviarAtualizacao(e: FormEvent) {
    e.preventDefault()
    const erros: { status?: string; texto?: string } = {}
    if (!novoStatus) erros.status = 'Escolha o novo status.'
    if (!textoAtualizacao.trim()) erros.texto = 'Descreva o que mudou.'
    else if (textoAtualizacao.trim().length > 500) erros.texto = 'A descrição deve ter no máximo 500 caracteres.'
    setErrosAtualizacao(erros)
    if (erros.status || erros.texto) return

    setEnviandoAtualizacao(true)
    setResultado(null)
    try {
      const r = await criarAtualizacao(ocorrencia.id, {
        descricao: textoAtualizacao.trim(),
        novoStatus: novoStatus as StatusOcorrencia,
      })
      setResultado({ tipo: 'sucesso', texto: r.mensagem })
      setNovoStatus('')
      setTextoAtualizacao('')
      recarregar()
    } catch (err) {
      setResultado({ tipo: 'erro', texto: mensagemDeErro(err) })
    } finally {
      setEnviandoAtualizacao(false)
    }
  }

  function abrirEdicao() {
    setEdBairro(ocorrencia.bairro)
    setEdLocal(ocorrencia.local)
    setEdDescricao(ocorrencia.descricao)
    setEdUrgencia(String(ocorrencia.urgencia))
    setEdAfeta(ocorrencia.afetaAcessibilidade)
    setErrosEdicao({})
    setEditando(true)
  }

  async function salvarEdicao(e: FormEvent) {
    e.preventDefault()
    const erros: Record<string, string> = {}
    if (!edBairro.trim()) erros.bairro = 'Informe o bairro.'
    if (!edLocal.trim()) erros.local = 'Informe o local.'
    if (edDescricao.trim().length < 10) erros.descricao = 'Descreva com pelo menos 10 caracteres.'
    setErrosEdicao(erros)
    if (Object.keys(erros).length > 0) return

    setSalvandoEdicao(true)
    setResultado(null)
    try {
      const r = await atualizarOcorrencia(ocorrencia.id, {
        categoriaId: ocorrencia.categoriaId,
        bairro: edBairro.trim(),
        local: edLocal.trim(),
        descricao: edDescricao.trim(),
        afetaAcessibilidade: edAfeta === 'S' ? 'S' : 'N',
        status: ocorrencia.status,
        urgencia: Number(edUrgencia),
      })
      setResultado({ tipo: 'sucesso', texto: r.mensagem })
      setEditando(false)
      recarregar()
    } catch (err) {
      setResultado({ tipo: 'erro', texto: mensagemDeErro(err) })
    } finally {
      setSalvandoEdicao(false)
    }
  }

  async function excluir() {
    setResultado(null)
    try {
      await excluirOcorrencia(ocorrencia.id)
      navegar('/ocorrencias', { state: { aviso: `Ocorrência ${protocolo} excluída.` } })
    } catch (err) {
      setConfirmandoExclusao(false)
      setResultado({ tipo: 'erro', texto: mensagemDeErro(err) })
    }
  }

  return (
    <div className="space-y-8">
      <p><Link to="/ocorrencias">← Todas as ocorrências</Link></p>

      {resultado && <Alerta tipo={resultado.tipo}>{resultado.texto}</Alerta>}

      <section aria-labelledby="titulo-oc" className="cartao space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold text-muted">{protocolo}</p>
            <h1 id="titulo-oc" className="text-3xl sm:text-4xl">{categoria?.nome ?? 'Ocorrência'}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={ocorrencia.status} />
            <UrgenciaBadge urgencia={ocorrencia.urgencia} />
          </div>
        </div>

        <dl className="grid gap-2 sm:grid-cols-[10rem_1fr]">
          <dt className="font-bold">Bairro</dt><dd>{ocorrencia.bairro}</dd>
          <dt className="font-bold">Local</dt><dd>{ocorrencia.local}</dd>
          <dt className="font-bold">Descrição</dt><dd className="break-words">{ocorrencia.descricao}</dd>
          <dt className="font-bold">Acessibilidade</dt>
          <dd>{ocorrencia.afetaAcessibilidade === 'S' ? 'Afeta a acessibilidade' : 'Não afeta'}</dd>
          <dt className="font-bold">Aberta em</dt><dd>{formatarData(ocorrencia.dataAbertura)}</dd>
        </dl>

        <div className="flex flex-wrap gap-3 border-t border-line pt-4">
          <button type="button" className="btn btn-secundario" onClick={abrirEdicao} disabled={editando}>Editar dados</button>
          {!confirmandoExclusao ? (
            <button type="button" className="btn btn-secundario" onClick={() => setConfirmandoExclusao(true)}>Excluir ocorrência</button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">Excluir {protocolo} de vez?</p>
              <button type="button" className="btn btn-perigo" onClick={excluir}>Sim, excluir</button>
              <button type="button" className="btn btn-secundario" onClick={() => setConfirmandoExclusao(false)}>Cancelar</button>
            </div>
          )}
        </div>
      </section>

      {editando && (
        <form onSubmit={salvarEdicao} noValidate className="cartao space-y-5" aria-label="Editar ocorrência">
          <h2 className="text-2xl">Editar dados</h2>
          <CampoFormulario id="ed-bairro" rotulo="Bairro" obrigatorio valor={edBairro} aoMudar={setEdBairro} erro={errosEdicao.bairro} maxLength={100} />
          <CampoFormulario id="ed-local" rotulo="Local" obrigatorio valor={edLocal} aoMudar={setEdLocal} erro={errosEdicao.local} maxLength={150} />
          <CampoFormulario id="ed-desc" rotulo="Descrição" tipo="textarea" obrigatorio valor={edDescricao} aoMudar={setEdDescricao} erro={errosEdicao.descricao} maxLength={500} />
          <div className="grid gap-5 sm:grid-cols-2">
            <CampoFormulario id="ed-urg" rotulo="Urgência" tipo="select" valor={edUrgencia} aoMudar={setEdUrgencia}
              opcoes={[{ valor: '1', rotulo: 'Baixa' }, { valor: '2', rotulo: 'Média' }, { valor: '3', rotulo: 'Alta' }]} />
            <CampoFormulario id="ed-afeta" rotulo="Afeta acessibilidade?" tipo="select" valor={edAfeta} aoMudar={setEdAfeta}
              opcoes={[{ valor: 'S', rotulo: 'Sim' }, { valor: 'N', rotulo: 'Não' }]} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primario" disabled={salvandoEdicao}>{salvandoEdicao ? 'Salvando…' : 'Salvar alterações'}</button>
            <button type="button" className="btn btn-secundario" onClick={() => setEditando(false)} disabled={salvandoEdicao}>Cancelar</button>
          </div>
        </form>
      )}

      <section aria-labelledby="linha-tempo" className="space-y-4">
        <h2 id="linha-tempo" className="text-2xl">Linha do tempo</h2>
        <ol className="space-y-5 border-l-4 border-brand pl-5">
          <li>
            <p className="font-bold">Ocorrência aberta</p>
            <p className="text-sm text-muted">{formatarData(ocorrencia.dataAbertura)}</p>
          </li>
          {atualizacoes.map((a) => (
            <li key={a.id}>
              <p className="flex flex-wrap items-center gap-2 font-bold">
                Status: <StatusBadge status={a.novoStatus} />
              </p>
              <p className="break-words">{a.descricao}</p>
              <p className="text-sm text-muted">{formatarData(a.dataAtualizacao)}</p>
            </li>
          ))}
        </ol>
        {atualizacoes.length === 0 && <p className="text-muted">Ainda não há atualizações além da abertura.</p>}
      </section>

      <section aria-labelledby="nova-atualizacao">
        {resolvida ? (
          <Alerta tipo="info" titulo="Ocorrência resolvida">Não é possível adicionar novas atualizações a uma ocorrência resolvida.</Alerta>
        ) : (
          <form onSubmit={enviarAtualizacao} noValidate className="cartao space-y-5">
            <h2 id="nova-atualizacao" className="text-2xl">Atualizar andamento</h2>
            <CampoFormulario id="at-status" rotulo="Novo status" tipo="select" obrigatorio opcoes={opcoesStatus} valor={novoStatus} aoMudar={setNovoStatus} erro={errosAtualizacao.status} />
            <CampoFormulario id="at-texto" rotulo="O que mudou?" tipo="textarea" obrigatorio valor={textoAtualizacao} aoMudar={setTextoAtualizacao} erro={errosAtualizacao.texto} maxLength={500} />
            <button type="submit" className="btn btn-primario" disabled={enviandoAtualizacao}>
              {enviandoAtualizacao ? 'Registrando…' : 'Registrar atualização'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

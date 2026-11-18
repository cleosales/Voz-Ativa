import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Alerta from '../components/Alerta'
import BuscaProtocolo from '../components/BuscaProtocolo'
import CampoFormulario from '../components/CampoFormulario'
import CardOcorrencia from '../components/CardOcorrencia'
import Carregando from '../components/Carregando'
import EstadoVazio from '../components/EstadoVazio'
import { useBusca } from '../hooks/useBusca'
import { useTitulo } from '../hooks/useTitulo'
import { listarCategorias, listarOcorrencias } from '../services/api'
import { STATUS_ORDEM, STATUS_ROTULO } from '../utils/formatar'

async function buscarTudo(signal: AbortSignal) {
  const [ocorrencias, categorias] = await Promise.all([listarOcorrencias(signal), listarCategorias(signal)])
  return { ocorrencias, categorias }
}

export default function Ocorrencias() {
  useTitulo('Ocorrências')
  const local = useLocation()
  const aviso = (local.state as { aviso?: string } | null)?.aviso
  const { dados, carregando, erro, recarregar } = useBusca(buscarTudo)

  const [categoria, setCategoria] = useState('')
  const [status, setStatus] = useState('')
  const [urgencia, setUrgencia] = useState('')
  const [bairro, setBairro] = useState('')

  const nomes = useMemo(() => {
    const mapa = new Map<number, string>()
    for (const c of dados?.categorias ?? []) mapa.set(c.id, c.nome)
    return mapa
  }, [dados])

  const filtradas = useMemo(() => {
    const resultado = []
    const busca = bairro.trim().toLowerCase()
    for (const o of dados?.ocorrencias ?? []) {
      if (categoria && String(o.categoriaId) !== categoria) continue
      if (status && o.status !== status) continue
      if (urgencia && String(o.urgencia) !== urgencia) continue
      if (busca && !o.bairro.toLowerCase().includes(busca)) continue
      resultado.push(o)
    }
   
    resultado.sort((a, b) => b.id - a.id)
    return resultado
  }, [dados, categoria, status, urgencia, bairro])

  const opcoesCategoria = [{ valor: '', rotulo: 'Todas' }]
  for (const c of dados?.categorias ?? []) opcoesCategoria.push({ valor: String(c.id), rotulo: c.nome })
  const opcoesStatus = [{ valor: '', rotulo: 'Todos' }]
  for (const s of STATUS_ORDEM) opcoesStatus.push({ valor: s, rotulo: STATUS_ROTULO[s] })
  const opcoesUrgencia = [
    { valor: '', rotulo: 'Todas' },
    { valor: '3', rotulo: 'Alta' },
    { valor: '2', rotulo: 'Média' },
    { valor: '1', rotulo: 'Baixa' },
  ]

  function limpar() {
    setCategoria('')
    setStatus('')
    setUrgencia('')
    setBairro('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl">Ocorrências</h1>
        <Link to="/registrar" className="btn btn-primario">Registrar nova</Link>
      </div>

      {aviso && <Alerta tipo="sucesso">{aviso}</Alerta>}

      <div className="cartao bg-surface"><BuscaProtocolo /></div>

      {carregando && <Carregando texto="Carregando ocorrências… Se a API estava inativa, pode levar alguns segundos." />}

      {erro && (
        <Alerta tipo="erro" titulo="Não foi possível carregar as ocorrências" acao={<button type="button" className="btn btn-secundario" onClick={recarregar}>Tentar de novo</button>}>
          {erro}
        </Alerta>
      )}

      {dados && dados.ocorrencias.length === 0 && (
        <EstadoVazio titulo="Ainda não há ocorrências" acao={<Link to="/registrar" className="btn btn-primario">Registrar a primeira</Link>}>
          Quando alguém registrar um problema, ele aparece aqui.
        </EstadoVazio>
      )}

      {dados && dados.ocorrencias.length > 0 && (
        <>
          <form className="cartao grid gap-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => e.preventDefault()} aria-label="Filtros">
            <CampoFormulario id="f-cat" rotulo="Categoria" tipo="select" opcoes={opcoesCategoria} valor={categoria} aoMudar={setCategoria} />
            <CampoFormulario id="f-status" rotulo="Status" tipo="select" opcoes={opcoesStatus} valor={status} aoMudar={setStatus} />
            <CampoFormulario id="f-urg" rotulo="Urgência" tipo="select" opcoes={opcoesUrgencia} valor={urgencia} aoMudar={setUrgencia} />
            <CampoFormulario id="f-bairro" rotulo="Bairro" valor={bairro} aoMudar={setBairro} placeholder="Digite parte do nome" />
          </form>

          <p aria-live="polite" className="text-muted">
            Mostrando {filtradas.length} de {dados.ocorrencias.length} ocorrências.
          </p>

          {filtradas.length === 0 ? (
            <EstadoVazio titulo="Nenhuma ocorrência com esses filtros" acao={<button type="button" className="btn btn-secundario" onClick={limpar}>Limpar filtros</button>}>
              Tente remover algum filtro.
            </EstadoVazio>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtradas.map((o) => (
                <li key={o.id}>
                  <CardOcorrencia ocorrencia={o} nomeCategoria={nomes.get(o.categoriaId) ?? 'Categoria'} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

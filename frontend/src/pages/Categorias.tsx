import { useState } from 'react'
import type { FormEvent } from 'react'
import Alerta from '../components/Alerta'
import CampoFormulario from '../components/CampoFormulario'
import Carregando from '../components/Carregando'
import EstadoVazio from '../components/EstadoVazio'
import { useBusca } from '../hooks/useBusca'
import { useTitulo } from '../hooks/useTitulo'
import { criarCategoria, excluirCategoria, listarCategorias } from '../services/api'
import type { SimNao } from '../types'

const OPCOES_ACESSIBILIDADE = [
  { valor: 'S', rotulo: 'Sim, é uma barreira de acessibilidade' },
  { valor: 'N', rotulo: 'Não' },
]

export default function Categorias() {
  useTitulo('Categorias')
  const { dados, carregando, erro, recarregar } = useBusca(listarCategorias)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [acessibilidade, setAcessibilidade] = useState<SimNao>('N')
  const [erros, setErros] = useState<{ nome?: string; descricao?: string }>({})
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)
  const [confirmando, setConfirmando] = useState<number | null>(null)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const novos: { nome?: string; descricao?: string } = {}
    if (!nome.trim()) novos.nome = 'Informe o nome da categoria.'
    else if (nome.trim().length > 100) novos.nome = 'O nome deve ter no máximo 100 caracteres.'
    if (!descricao.trim()) novos.descricao = 'Informe uma descrição.'
    else if (descricao.trim().length > 255) novos.descricao = 'A descrição deve ter no máximo 255 caracteres.'
    setErros(novos)
    if (novos.nome || novos.descricao) return

    setEnviando(true)
    setResultado(null)
    try {
      const r = await criarCategoria({ nome: nome.trim(), descricao: descricao.trim(), acessibilidade })
      setResultado({ tipo: 'sucesso', texto: r.mensagem })
      setNome('')
      setDescricao('')
      setAcessibilidade('N')
      recarregar()
    } catch (err) {
      setResultado({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro inesperado.' })
    } finally {
      setEnviando(false)
    }
  }

  async function excluir(id: number) {
    setResultado(null)
    try {
      await excluirCategoria(id)
      setResultado({ tipo: 'sucesso', texto: 'Categoria excluída.' })
      recarregar()
    } catch (err) {
      setResultado({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro inesperado.' })
    } finally {
      setConfirmando(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl">Categorias</h1>
        <p className="max-w-prose text-muted">Tipos de problema que podem ser registrados, como calçada, iluminação ou vazamento.</p>
      </div>

      {resultado && <Alerta tipo={resultado.tipo}>{resultado.texto}</Alerta>}

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <section aria-labelledby="lista-cat" className="space-y-3">
          <h2 id="lista-cat" className="text-2xl">Categorias cadastradas</h2>
          {carregando && <Carregando texto="Carregando categorias…" />}
          {erro && (
            <Alerta tipo="erro" titulo="Não foi possível carregar as categorias" acao={<button type="button" className="btn btn-secundario" onClick={recarregar}>Tentar de novo</button>}>
              {erro}
            </Alerta>
          )}
          {dados && dados.length === 0 && (
            <EstadoVazio titulo="Nenhuma categoria cadastrada">Cadastre a primeira no formulário ao lado para poder registrar ocorrências.</EstadoVazio>
          )}
          {dados && dados.length > 0 && (
            <ul className="space-y-3">
              {dados.map((c) => (
                <li key={c.id} className="cartao space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-xl">{c.nome}</h3>
                    {c.acessibilidade === 'S' && (
                      <span className="rounded-full bg-accent px-3 py-0.5 text-sm font-bold text-accent-fg">Acessibilidade</span>
                    )}
                  </div>
                  <p className="text-muted">{c.descricao}</p>
                  {confirmando === c.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">Excluir "{c.nome}"?</p>
                      <button type="button" className="btn btn-perigo" onClick={() => excluir(c.id)}>Sim, excluir</button>
                      <button type="button" className="btn btn-secundario" onClick={() => setConfirmando(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn-secundario" onClick={() => setConfirmando(c.id)} aria-label={`Excluir categoria ${c.nome}`}>
                      Excluir
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="nova-cat">
          <form onSubmit={enviar} noValidate className="cartao space-y-5">
            <h2 id="nova-cat" className="text-2xl">Nova categoria</h2>
            <CampoFormulario id="cat-nome" rotulo="Nome" obrigatorio valor={nome} aoMudar={setNome} erro={erros.nome} maxLength={100} />
            <CampoFormulario id="cat-desc" rotulo="Descrição" tipo="textarea" obrigatorio valor={descricao} aoMudar={setDescricao} erro={erros.descricao} maxLength={255} />
            <CampoFormulario
              id="cat-acess"
              rotulo="Afeta acessibilidade?"
              tipo="select"
              opcoes={OPCOES_ACESSIBILIDADE}
              valor={acessibilidade}
              aoMudar={(v) => setAcessibilidade(v === 'S' ? 'S' : 'N')}
            />
            <button type="submit" className="btn btn-primario w-full" disabled={enviando}>
              {enviando ? 'Salvando…' : 'Cadastrar categoria'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

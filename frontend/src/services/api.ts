import type {
  Atualizacao,
  AtualizacaoEntrada,
  Categoria,
  CategoriaEntrada,
  Ocorrencia,
  OcorrenciaEntrada,
  ResultadoEscrita,
} from '../types'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export class ApiError extends Error {
  status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
  }
}

interface Opcoes {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

interface Resposta<T> {
  dados: T
  location: string | null
}

function mensagemPadrao(status: number): string {
  if (status === 404) return 'Não encontramos o que você procurou.'
  if (status === 405) return 'Essa ação não é permitida.'
  if (status === 409) return 'Essa ação entra em conflito com os dados existentes.'
  if (status >= 500) return 'A API está com problemas no momento. Tente de novo em instantes.'
  return 'Não foi possível concluir a ação.'
}

async function requisitar<T>(caminho: string, opcoes: Opcoes = {}): Promise<Resposta<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (opcoes.body !== undefined) headers['Content-Type'] = 'application/json'

  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: opcoes.method ?? 'GET',
      headers,
      body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined,
      signal: opcoes.signal,
    })
  } catch (erro) {
    if (erro instanceof DOMException && erro.name === 'AbortError') throw erro
    throw new ApiError(
      0,
      'Não foi possível conectar à API. Verifique sua internet e tente de novo. Se a API estava inativa, a primeira chamada pode demorar um pouco.',
    )
  }

  const texto = await resposta.text()

  if (!resposta.ok) {

    let mensagem = mensagemPadrao(resposta.status)
    try {
      const json = JSON.parse(texto) as { mensagem?: string }
      if (json.mensagem) mensagem = json.mensagem
    } catch {
      
    }
    throw new ApiError(resposta.status, mensagem)
  }

  let dados: unknown = undefined
  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      dados = texto 
    }
  }

  return { dados: dados as T, location: resposta.headers.get('Location') }
}


function idDaLocation(location: string | null): number | null {
  if (!location) return null
  const ultimo = location.replace(/\/+$/, '').split('/').pop()
  const id = Number(ultimo)
  return Number.isInteger(id) && id > 0 ? id : null
}

async function escrever(
  caminho: string,
  method: 'POST' | 'PUT',
  body: unknown,
): Promise<ResultadoEscrita> {
  const { dados, location } = await requisitar<string>(caminho, { method, body })
  return {
    id: idDaLocation(location),
    mensagem: typeof dados === 'string' ? dados : 'Ação concluída com sucesso!',
  }
}

// ---------- Categorias ----------

export async function listarCategorias(signal?: AbortSignal): Promise<Categoria[]> {
  const { dados } = await requisitar<Categoria[]>('/categorias', { signal })
  return dados ?? []
}

export function criarCategoria(entrada: CategoriaEntrada): Promise<ResultadoEscrita> {
  return escrever('/categorias', 'POST', entrada)
}

export async function excluirCategoria(id: number): Promise<void> {
  await requisitar<void>(`/categorias/${id}`, { method: 'DELETE' })
}

// ---------- Ocorrências ----------

export async function listarOcorrencias(signal?: AbortSignal): Promise<Ocorrencia[]> {
  const { dados } = await requisitar<Ocorrencia[]>('/ocorrencias', { signal })
  return dados ?? []
}

export async function buscarOcorrencia(id: number, signal?: AbortSignal): Promise<Ocorrencia> {
  const { dados } = await requisitar<Ocorrencia>(`/ocorrencias/${id}`, { signal })
  return dados
}

export function criarOcorrencia(entrada: OcorrenciaEntrada): Promise<ResultadoEscrita> {
  return escrever('/ocorrencias', 'POST', entrada)
}

export function atualizarOcorrencia(id: number, entrada: OcorrenciaEntrada): Promise<ResultadoEscrita> {
  return escrever(`/ocorrencias/${id}`, 'PUT', entrada)
}

export async function excluirOcorrencia(id: number): Promise<void> {
  await requisitar<void>(`/ocorrencias/${id}`, { method: 'DELETE' })
}

// ---------- Atualizações (linha do tempo) ----------

export async function listarAtualizacoes(ocorrenciaId: number, signal?: AbortSignal): Promise<Atualizacao[]> {
  const { dados } = await requisitar<Atualizacao[]>(`/ocorrencias/${ocorrenciaId}/atualizacoes`, { signal })
  return dados ?? []
}

export function criarAtualizacao(ocorrenciaId: number, entrada: AtualizacaoEntrada): Promise<ResultadoEscrita> {
  return escrever(`/ocorrencias/${ocorrenciaId}/atualizacoes`, 'POST', entrada)
}

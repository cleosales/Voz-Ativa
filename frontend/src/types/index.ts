// Tipos que espelham os DTOs da API Java (OcorrenciaRespostaDto, CategoriaRespostaDto etc.)

export type StatusOcorrencia = 'ABERTA' | 'EM_ANALISE' | 'EM_ANDAMENTO' | 'RESOLVIDA'

export type Urgencia = 1 | 2 | 3

export type SimNao = 'S' | 'N'

export interface Categoria {
  id: number
  nome: string
  descricao: string
  acessibilidade: SimNao
}

export interface CategoriaEntrada {
  nome: string
  descricao: string
  acessibilidade: SimNao
}

export interface Ocorrencia {
  id: number
  categoriaId: number
  bairro: string
  local: string
  descricao: string
  afetaAcessibilidade: SimNao
  status: StatusOcorrencia
  urgencia: number
  dataAbertura: string
}

export interface OcorrenciaEntrada {
  categoriaId: number
  bairro: string
  local: string
  descricao: string
  afetaAcessibilidade: SimNao
  status: StatusOcorrencia
  urgencia: number
}

export interface Atualizacao {
  id: number
  ocorrenciaId: number
  descricao: string
  novoStatus: StatusOcorrencia
  dataAtualizacao: string
}

export interface AtualizacaoEntrada {
  descricao: string
  novoStatus: StatusOcorrencia
}

/** Resultado de uma escrita: a API devolve texto e o id vem no header Location. */
export interface ResultadoEscrita {
  id: number | null
  mensagem: string
}

export interface Integrante {
  id: number
  nome: string
  rm: string
  turma: string
  papel: string
  foto?: string
  github?: string
  linkedin?: string
}

// Sugestão de urgência para o assistente de registro.
// Se VITE_IA_URL estiver definida, consulta a API Flask (POST /prever/urgencia).
// Se não estiver (ou se falhar), usa uma regra local simples e avisa a origem.
import type { Urgencia } from '../types'

const IA_URL = (import.meta.env.VITE_IA_URL ?? '').replace(/\/+$/, '')

export interface EntradaSugestao {
  categoria: string
  bairro: string
  descricao: string
  categoriaDeAcessibilidade: boolean
  afetaAcessibilidade: boolean
}

export interface Sugestao {
  urgencia: Urgencia
  origem: 'ia' | 'regra'
}

const PALAVRAS_DE_RISCO = ['vazamento', 'buraco', 'sem luz', 'apagado', 'risco', 'perigo', 'queda', 'cadeirante', 'bloqueado']

/** Regra local: mais acessibilidade e palavras de risco aumentam a urgência. */
export function calcularUrgenciaLocal(entrada: EntradaSugestao): Urgencia {
  let pontos = 1
  if (entrada.afetaAcessibilidade) pontos += 1
  if (entrada.afetaAcessibilidade && entrada.categoriaDeAcessibilidade) pontos += 1
  const texto = entrada.descricao.toLowerCase()
  let achouRisco = false
  for (const palavra of PALAVRAS_DE_RISCO) {
    if (texto.includes(palavra)) achouRisco = true
  }
  if (achouRisco) pontos += 1
  if (pontos >= 3) return 3
  return pontos === 2 ? 2 : 1
}

function converterUrgencia(valor: unknown): Urgencia | null {
  if (valor === 1 || valor === 2 || valor === 3) return valor
  if (typeof valor === 'string') {
    const v = valor.toLowerCase()
    if (v === 'baixa') return 1
    if (v === 'media' || v === 'média') return 2
    if (v === 'alta') return 3
  }
  return null
}

export async function sugerirUrgencia(entrada: EntradaSugestao): Promise<Sugestao> {
  const local: Sugestao = { urgencia: calcularUrgenciaLocal(entrada), origem: 'regra' }
  if (!IA_URL) return local

  const controle = new AbortController()
  const limite = window.setTimeout(() => controle.abort(), 8000)
  try {
    const resposta = await fetch(`${IA_URL}/prever/urgencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        categoria: entrada.categoria,
        bairro: entrada.bairro,
        afeta_acessibilidade: entrada.afetaAcessibilidade ? 1 : 0,
      }),
      signal: controle.signal,
    })
    if (!resposta.ok) return local
    const json = (await resposta.json()) as { urgencia?: unknown }
    const urgencia = converterUrgencia(json.urgencia)
    return urgencia ? { urgencia, origem: 'ia' } : local
  } catch {
    return local
  } finally {
    window.clearTimeout(limite)
  }
}

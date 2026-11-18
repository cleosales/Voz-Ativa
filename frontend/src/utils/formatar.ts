import type { StatusOcorrencia } from '../types'

export const STATUS_ORDEM: StatusOcorrencia[] = ['ABERTA', 'EM_ANALISE', 'EM_ANDAMENTO', 'RESOLVIDA']

export const STATUS_ROTULO: Record<StatusOcorrencia, string> = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
}

export const URGENCIA_ROTULO: Record<number, string> = {
  1: 'Baixa',
  2: 'Média',
  3: 'Alta',
}

export function formatarProtocolo(id: number): string {
  return `VA-${String(id).padStart(4, '0')}`
}

export function lerProtocolo(texto: string): number | null {
  const limpo = texto.trim().toUpperCase().replace(/^VA-?/, '')
  if (!/^\d+$/.test(limpo)) return null
  const id = Number(limpo)
  return id > 0 ? id : null
}

export function formatarData(iso: string): string {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function rotuloUrgencia(urgencia: number): string {
  return URGENCIA_ROTULO[urgencia] ?? `Nível ${urgencia}`
}

export function rotuloStatus(status: string): string {
  return STATUS_ROTULO[status as StatusOcorrencia] ?? status
}

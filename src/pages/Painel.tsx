import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
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

interface LinhaBairro {
  bairro: string
  total: number
  barreiras: number
}

export default function Painel() {
  useTitulo('Painel de bairros')
  const { dados, carregando, erro, recarregar } = useBusca(buscarTudo)

  const porBairro = new Map<string, LinhaBairro>()
  const porStatus = new Map<string, number>()
  const porCategoria = new Map<number, number>()

  for (const o of dados?.ocorrencias ?? []) {
    const chave = o.bairro.trim()
    const linha = porBairro.get(chave) ?? { bairro: chave, total: 0, barreiras: 0 }
    linha.total += 1
    if (o.afetaAcessibilidade === 'S') linha.barreiras += 1
    porBairro.set(chave, linha)
    porStatus.set(o.status, (porStatus.get(o.status) ?? 0) + 1)
    porCategoria.set(o.categoriaId, (porCategoria.get(o.categoriaId) ?? 0) + 1)
  }

  const ranking = Array.from(porBairro.values()).sort((a, b) => b.total - a.total || b.barreiras - a.barreiras)
  const maior = ranking.length > 0 ? ranking[0].total : 1

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl">Painel de bairros</h1>
        <p className="max-w-prose text-muted">Quais bairros têm mais ocorrências e onde estão as barreiras de acessibilidade.</p>
      </div>

      {carregando && <Carregando texto="Calculando o painel…" />}
      {erro && (
        <Alerta tipo="erro" titulo="Não foi possível carregar o painel" acao={<button type="button" className="btn btn-secundario" onClick={recarregar}>Tentar de novo</button>}>
          {erro}
        </Alerta>
      )}

      {dados && dados.ocorrencias.length === 0 && (
        <EstadoVazio titulo="Sem dados para o painel" acao={<Link to="/registrar" className="btn btn-primario">Registrar ocorrência</Link>}>
          O painel aparece quando houver ocorrências registradas.
        </EstadoVazio>
      )}

      {dados && dados.ocorrencias.length > 0 && (
        <>
          <section aria-labelledby="rank" className="space-y-3">
            <h2 id="rank" className="text-2xl">Ranking de bairros</h2>
            <ol className="space-y-3">
              {ranking.map((l) => (
                <li key={l.bairro} className="cartao">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-lg font-bold">{l.bairro}</p>
                    <p>
                      <span className="font-bold">{l.total}</span> {l.total === 1 ? 'ocorrência' : 'ocorrências'}
                      {l.barreiras > 0 && (
                        <span className="ml-2 inline-flex rounded-full bg-accent px-3 py-0.5 text-sm font-bold text-accent-fg">
                          {l.barreiras} {l.barreiras === 1 ? 'barreira' : 'barreiras'} de acessibilidade
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(l.total / maior) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section aria-labelledby="st" className="cartao space-y-2">
              <h2 id="st" className="text-2xl">Por status</h2>
              <ul className="space-y-1">
                {STATUS_ORDEM.map((s) => (
                  <li key={s} className="flex justify-between gap-3">
                    <span>{STATUS_ROTULO[s]}</span>
                    <span className="font-bold">{porStatus.get(s) ?? 0}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="cat" className="cartao space-y-2">
              <h2 id="cat" className="text-2xl">Por categoria</h2>
              <ul className="space-y-1">
                {dados.categorias.map((c) => (
                  <li key={c.id} className="flex justify-between gap-3">
                    <span>{c.nome}</span>
                    <span className="font-bold">{porCategoria.get(c.id) ?? 0}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

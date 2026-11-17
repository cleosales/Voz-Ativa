import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import BuscaProtocolo from '../components/BuscaProtocolo'
import Carregando from '../components/Carregando'
import { useBusca } from '../hooks/useBusca'
import { useTitulo } from '../hooks/useTitulo'
import { listarOcorrencias } from '../services/api'

const PASSOS = [
  ['Conte o problema', 'O assistente pergunta uma coisa de cada vez, em linguagem simples.'],
  ['Receba um protocolo', 'Cada registro ganha um número, como VA-0001, para você acompanhar.'],
  ['Acompanhe o andamento', 'Veja a linha do tempo: aberta, em análise, em andamento e resolvida.'],
]

export default function Home() {
  useTitulo('Início')
  const { dados, carregando, erro, recarregar } = useBusca(listarOcorrencias)

  const total = dados?.length ?? 0
  let acessibilidade = 0
  let resolvidas = 0
  for (const o of dados ?? []) {
    if (o.afetaAcessibilidade === 'S') acessibilidade += 1
    if (o.status === 'RESOLVIDA') resolvidas += 1
  }

  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-4xl sm:text-5xl">Toda voz importa. Toda necessidade merece ser ouvida.</h1>
          <p className="max-w-prose text-lg text-muted">
            Registre problemas do espaço público, acompanhe pelo protocolo e ajude a cidade a priorizar o que é mais
            urgente, principalmente as barreiras que afetam pessoas com deficiência, idosos e quem tem mobilidade reduzida.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/registrar" className="btn btn-primario">Registrar um problema</Link>
            <Link to="/ocorrencias" className="btn btn-secundario">Ver ocorrências</Link>
          </div>
        </div>

        {/* Exemplo ilustrativo de protocolo e linha do tempo */}
        <aside aria-label="Exemplo de acompanhamento" className="cartao space-y-4 border-2 border-line-strong">
          <p className="text-sm text-muted">Exemplo de acompanhamento</p>
          <p className="text-3xl font-bold">VA-0042</p>
          <p>Calçada sem rampa de acesso na Rua das Flores</p>
          <ol className="space-y-3 border-l-4 border-brand pl-4">
            <li><p className="font-bold">Aberta</p><p className="text-sm text-muted">Registro recebido</p></li>
            <li><p className="font-bold">Em análise</p><p className="text-sm text-muted">Equipe verificou o local</p></li>
            <li><p className="font-bold">Em andamento</p><p className="text-sm text-muted">Obra da rampa agendada</p></li>
          </ol>
        </aside>
      </section>

      <section aria-labelledby="como" className="space-y-5">
        <h2 id="como" className="text-2xl sm:text-3xl">Como funciona</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {PASSOS.map(([titulo, texto], i) => (
            <li key={titulo} className="cartao">
              <p className="text-3xl font-bold text-brand" aria-hidden="true">{i + 1}</p>
              <h3 className="mt-1 text-xl">{titulo}</h3>
              <p className="mt-1 text-muted">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="numeros" className="space-y-5">
        <h2 id="numeros" className="text-2xl sm:text-3xl">A cidade em números</h2>
        {carregando && <Carregando texto="Buscando os números na API…" />}
        {erro && (
          <Alerta tipo="erro" titulo="Não foi possível carregar os números" acao={<button type="button" className="btn btn-secundario" onClick={recarregar}>Tentar de novo</button>}>
            {erro}
          </Alerta>
        )}
        {dados && (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="cartao"><dt className="text-muted">Ocorrências registradas</dt><dd className="text-4xl font-bold">{total}</dd></div>
            <div className="cartao"><dt className="text-muted">Afetam a acessibilidade</dt><dd className="text-4xl font-bold">{acessibilidade}</dd></div>
            <div className="cartao"><dt className="text-muted">Já resolvidas</dt><dd className="text-4xl font-bold">{resolvidas}</dd></div>
          </dl>
        )}
      </section>

      <section className="cartao bg-surface">
        <BuscaProtocolo />
      </section>
    </div>
  )
}

import { useTitulo } from '../hooks/useTitulo'

const ODS = [
  ['ODS 3', 'Saúde e bem-estar'],
  ['ODS 9', 'Inovação e infraestrutura'],
  ['ODS 10', 'Redução das desigualdades'],
  ['ODS 11', 'Cidades e comunidades sustentáveis'],
]

export default function Sobre() {
  useTitulo('Sobre')
  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-3xl sm:text-4xl">Sobre o VozAtiva</h1>

      <section className="space-y-2">
        <h2 className="text-2xl">O problema</h2>
        <p>
          Calçada sem rampa, poste apagado, vazamento, lixo acumulado: problemas do espaço público afetam todos, mas pesam
          mais para pessoas com deficiência, idosos e moradores de bairros que raramente são ouvidos. Muitas vezes
          registrar o problema é difícil e acompanhar a resposta é ainda mais.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl">A solução</h2>
        <p>
          O VozAtiva permite registrar o problema de forma guiada e simples, acompanhar o andamento pelo número de
          protocolo e ajudar a cidade a priorizar o que é mais urgente, com destaque para barreiras de acessibilidade.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl">Como está construído</h2>
        <p>
          O front-end é uma SPA em React, Vite, TypeScript e Tailwind CSS, publicada na Vercel. Ele consome a API Java
          (Spring Boot e JDBC, com banco Oracle) usando apenas a Fetch API. Opcionalmente, a urgência pode ser sugerida
          por uma API Flask com modelos de IA.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl">Objetivos de Desenvolvimento Sustentável</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ODS.map(([sigla, nome]) => (
            <li key={sigla} className="cartao">
              <p className="font-bold">{sigla}</p>
              <p className="text-muted">{nome}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

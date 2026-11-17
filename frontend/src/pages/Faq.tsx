import { useTitulo } from '../hooks/useTitulo'

const PERGUNTAS = [
  {
    p: 'Preciso criar conta para registrar um problema?',
    r: 'Não. Basta abrir a página Registrar e responder as perguntas do assistente, passo a passo.',
  },
  {
    p: 'Como acompanho minha ocorrência?',
    r: 'Ao registrar, você recebe um protocolo no formato VA-0001. Digite-o no campo de busca da página Ocorrências para ver o status e a linha do tempo.',
  },
  {
    p: 'O que significa "afeta acessibilidade"?',
    r: 'Marque quando o problema atrapalha pessoas com deficiência, idosos ou quem tem mobilidade reduzida, como calçada sem rampa ou piso tátil danificado.',
  },
  {
    p: 'Quais são os status de uma ocorrência?',
    r: 'Aberta, Em análise, Em andamento e Resolvida. Cada mudança fica registrada na linha do tempo.',
  },
  {
    p: 'Como a urgência é definida?',
    r: 'O assistente sugere um nível de 1 a 3 (baixa, média ou alta) e você pode ajustar antes de confirmar.',
  },
  {
    p: 'Dá para aumentar a letra ou usar alto contraste?',
    r: 'Sim. Os botões A−, A+ e Alto contraste ficam no topo de todas as páginas e a escolha é lembrada neste navegador.',
  },
]

export default function Faq() {
  useTitulo('Perguntas frequentes')
  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl">Perguntas frequentes</h1>
      <div className="max-w-3xl space-y-3">
        {PERGUNTAS.map((item) => (
          <details key={item.p} className="cartao group">
            <summary className="min-h-11 cursor-pointer text-lg font-bold">{item.p}</summary>
            <p className="mt-3 text-muted">{item.r}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

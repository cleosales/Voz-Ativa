import { Link } from 'react-router-dom'
import EstadoVazio from '../components/EstadoVazio'
import { useTitulo } from '../hooks/useTitulo'

export default function NaoEncontrada() {
  useTitulo('Página não encontrada')
  return (
    <EstadoVazio
      titulo="Não encontramos esta página"
      acao={<Link to="/" className="btn btn-primario">Voltar ao início</Link>}
    >
      O endereço pode ter sido digitado errado ou a página mudou de lugar.
    </EstadoVazio>
  )
}

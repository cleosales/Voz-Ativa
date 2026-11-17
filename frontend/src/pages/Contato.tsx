import { useState } from 'react'
import type { FormEvent } from 'react'
import Alerta from '../components/Alerta'
import CampoFormulario from '../components/CampoFormulario'
import Carregando from '../components/Carregando'
import { useTitulo } from '../hooks/useTitulo'

const ASSUNTOS = [
  { valor: '', rotulo: 'Selecione um assunto' },
  { valor: 'duvida', rotulo: 'Dúvida sobre o uso' },
  { valor: 'sugestao', rotulo: 'Sugestão' },
  { valor: 'problema', rotulo: 'Problema no site' },
]

interface Erros {
  nome?: string
  email?: string
  assunto?: string
  mensagem?: string
}

export default function Contato() {
  useTitulo('Contato')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 3) e.nome = 'Informe seu nome completo (mínimo 3 letras).'
    if (!email.trim()) e.email = 'Informe seu e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Digite um e-mail válido, como nome@exemplo.com.'
    if (!assunto) e.assunto = 'Escolha um assunto.'
    if (mensagem.trim().length < 10) e.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.'
    return e
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length > 0) return
    // O projeto não tem endpoint de contato: o envio é apenas simulado aqui.
    setEnviando(true)
    window.setTimeout(() => {
      setEnviando(false)
      setEnviado(true)
      setNome('')
      setEmail('')
      setAssunto('')
      setMensagem('')
    }, 800)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl sm:text-4xl">Contato</h1>
      <p className="text-muted">Tem dúvida ou sugestão? Preencha o formulário. Todos os campos são obrigatórios.</p>

      {enviado && (
        <Alerta tipo="sucesso" titulo="Mensagem enviada">
          Obrigado pelo contato! (Nesta versão acadêmica o envio é uma demonstração e não chega a um servidor de e-mail.)
        </Alerta>
      )}

      <form onSubmit={enviar} noValidate className="cartao space-y-5">
        <CampoFormulario id="c-nome" rotulo="Nome" obrigatorio valor={nome} aoMudar={setNome} erro={erros.nome} autoComplete="name" />
        <CampoFormulario id="c-email" rotulo="E-mail" tipo="email" obrigatorio valor={email} aoMudar={setEmail} erro={erros.email} autoComplete="email" />
        <CampoFormulario id="c-assunto" rotulo="Assunto" tipo="select" obrigatorio opcoes={ASSUNTOS} valor={assunto} aoMudar={setAssunto} erro={erros.assunto} />
        <CampoFormulario id="c-msg" rotulo="Mensagem" tipo="textarea" obrigatorio maxLength={500} valor={mensagem} aoMudar={setMensagem} erro={erros.mensagem} />
        <button type="submit" className="btn btn-primario w-full sm:w-auto" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar mensagem'}
        </button>
        {enviando && <Carregando texto="Enviando sua mensagem…" />}
      </form>
    </div>
  )
}

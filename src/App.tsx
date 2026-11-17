import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Categorias from './pages/Categorias'
import Contato from './pages/Contato'
import Faq from './pages/Faq'
import Home from './pages/Home'
import IntegranteDetalhe from './pages/IntegranteDetalhe'
import Integrantes from './pages/Integrantes'
import NaoEncontrada from './pages/NaoEncontrada'
import OcorrenciaDetalhe from './pages/OcorrenciaDetalhe'
import Ocorrencias from './pages/Ocorrencias'
import Painel from './pages/Painel'
import Registrar from './pages/Registrar'
import Sobre from './pages/Sobre'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/integrantes/:id" element={<IntegranteDetalhe />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/ocorrencias" element={<Ocorrencias />} />
        <Route path="/ocorrencias/:id" element={<OcorrenciaDetalhe />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}

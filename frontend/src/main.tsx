import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AcessibilidadeProvider } from './contexts/AcessibilidadeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AcessibilidadeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AcessibilidadeProvider>
  </StrictMode>,
)

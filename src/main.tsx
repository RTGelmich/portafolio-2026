import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { App } from './App'
import { ProveedorIdioma } from './i18n/idioma'
import { ProveedorTema } from './tema/tema'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorTema>
      <ProveedorIdioma>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProveedorIdioma>
    </ProveedorTema>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n'
import ThemeService from './shared/services/ThemeService'
import AppRouter from './app/routes/AppRouter'

ThemeService.init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)

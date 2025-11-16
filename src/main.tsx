import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import logoTitleUrl from './img/logo_title.png'

const ensureFavicon = () => {
  const existing = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
  const link = existing ?? document.createElement('link')
  link.rel = 'icon'
  link.href = logoTitleUrl
  if (!existing) document.head.appendChild(link)
}
ensureFavicon()
document.title = 'Armeta | Цифровой инструктор'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
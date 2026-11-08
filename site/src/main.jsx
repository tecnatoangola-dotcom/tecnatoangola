import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// ── Service Worker (PWA) ──────────────────────────────────────────────────
// Em PRODUÇÃO: regista o SW (offline + cache).
// Em DEV: NUNCA regista — e limpa SWs "fantasma" e caches de builds
// anteriores (ex.: `vite preview` no mesmo porto que o dev server), que
// eram a causa de páginas em branco ao atualizar. O SW fantasma continuava
// a servir index.html + assets antigos que o dev server não tem.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Purge de caches de terceiros criados por versões antigas do SW
    // (`cloudinary-images` cacheava respostas em erro → imagens partidas
    // depois de deploys; as fontes também tinham cache pelo SW). Os assets
    // externos já têm cache HTTP própria (CDN Cloudinary + headers).
    const cachesLegado = ['cloudinary-images', 'google-fonts-styles', 'google-fonts-webfonts', 'nvidia-api-sync']
    for (const nome of cachesLegado) {
      caches.delete(nome).catch(() => {})
    }
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  } else {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const r of regs) r.unregister()
    })
    caches.keys().then((keys) => {
      for (const k of keys) caches.delete(k)
    })
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

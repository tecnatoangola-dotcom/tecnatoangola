import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import MobileCtaBar from './components/MobileCtaBar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { ConteudoProvider } from './lib/conteudo.jsx'
import { track, trackOnce } from './lib/track.js'
import CandidaturaPage from './pages/CandidaturaPage.jsx'
import Entrar from './pages/Entrar.jsx'
import Home from './pages/Home.jsx'
import Perfil from './pages/Perfil.jsx'
import QuemSomos from './pages/QuemSomos.jsx'
import Registar from './pages/Registar.jsx'

function Analytics() {
  useEffect(() => {
    trackOnce('visita')

    const interval = setInterval(() => track('ping'), 60_000)
    return () => clearInterval(interval)
  }, [])

  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ConteudoProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-paper pb-20 sm:pb-0">
            <Analytics />
            <ScrollToTop />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/candidatura" element={<CandidaturaPage />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/entrar" element={<Entrar />} />
                <Route path="/registar" element={<Registar />} />
                <Route path="/perfil" element={<Perfil />} />
              </Routes>
            </main>
            <Footer />
            <MobileCtaBar />
          </div>
        </BrowserRouter>
      </ConteudoProvider>
    </AuthProvider>
  )
}

import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SitePopup } from './components/FloatingYouTubeButton.jsx'
import AISupport from './components/AISupport.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import MobileCtaBar from './components/MobileCtaBar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { ConteudoProvider } from './lib/conteudo.jsx'
import { IdiomaProvider } from './i18n/idioma.jsx'
import { track, trackOnce } from './lib/track.js'
import AreasPage from './pages/AreasPage.jsx'
import CandidaturaPage from './pages/CandidaturaPage.jsx'
import ComoFuncionaPage from './pages/ComoFuncionaPage.jsx'
import Confirmacao from './pages/Confirmacao.jsx'
import Entrar from './pages/Entrar.jsx'
import FaqPage from './pages/FaqPage.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import ParticiparPage from './pages/ParticiparPage.jsx'
import Perfil from './pages/Perfil.jsx'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade.jsx'
import ProjectoPage from './pages/ProjectoPage.jsx'
import QuemSomos from './pages/QuemSomos.jsx'
import Recuperar from './pages/Recuperar.jsx'
import Redefinir from './pages/Redefinir.jsx'
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
    <IdiomaProvider>
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
                <Route path="/projecto" element={<ProjectoPage />} />
                <Route path="/areas" element={<AreasPage />} />
                <Route path="/como-funciona" element={<ComoFuncionaPage />} />
                <Route path="/participar" element={<ParticiparPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/candidatura" element={<CandidaturaPage />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/entrar" element={<Entrar />} />
                <Route path="/registar" element={<Registar />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/recuperar" element={<Recuperar />} />
                <Route path="/redefinir" element={<Redefinir />} />
                <Route path="/confirmacao" element={<Confirmacao />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <MobileCtaBar />
            <SitePopup />
            <AISupport />
          </div>
        </BrowserRouter>
        </ConteudoProvider>
      </AuthProvider>
    </IdiomaProvider>
  )
}

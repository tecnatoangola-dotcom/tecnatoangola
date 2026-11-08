import { useState, useEffect } from 'react'
import { useConteudo } from '../lib/conteudo.js'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    canalPrincipal: 'Canal principal',
    ariaCanal: 'Canal principal do TECNATO no YouTube',
    fecharAnuncio: 'Fechar anúncio',
    videoTecnato: 'Vídeo TECNATO',
    imagemAnuncio: 'Imagem do anúncio',
    naoMostrar: 'Não mostrar novamente',
  },
  en: {
    canalPrincipal: 'Main channel',
    ariaCanal: 'TECNATO main channel on YouTube',
    fecharAnuncio: 'Close announcement',
    videoTecnato: 'TECNATO video',
    imagemAnuncio: 'Announcement image',
    naoMostrar: "Don't show again",
  },
}

// SVG do YouTube
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 flex-shrink-0">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

// SVG fechar
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

// SVG play para vídeo
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
    <path d="M8 5v14l11-7z" />
  </svg>
)

function FloatingYouTubeButton() {
  const conteudo = useConteudo()
  const { lang } = useIdioma()
  const c = T[lang]
  const youtubeUrl = 'https://www.youtube.com/@tecnatoangola'

  // Botão flutuante fixo à esquerda
  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={c.ariaCanal}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3 bg-ink text-white px-4 py-3 rounded-r-2xl shadow-xl border border-line transition-all duration-300 hover:bg-brand hover:text-ink hover:shadow-[0_0_30px_rgba(255,160,0,0.4)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-ink lg:left-6"
      style={{ transform: 'translateY(-50%)' }}
    >
      <YouTubeIcon />
      <span className="font-mono text-[10px] tracking-[0.1em] uppercase whitespace-nowrap hidden sm:inline">{c.canalPrincipal}</span>
    </a>
  )
}

// Componente do Popup/Modal
export function SitePopup() {
  const conteudo = useConteudo()
  const { lang } = useIdioma()
  const c = T[lang]
  const [isOpen, setIsOpen] = useState(false)
  const [showAgain, setShowAgain] = useState(true)
  const popup = conteudo.popup

  // Verifica se deve mostrar
  useEffect(() => {
    if (!popup?.ativo || !popup?.conteudo) return

    const frequency = popup.frequencia || 'sessao'
    const delay = (popup.delaySegundos || 5) * 1000

    // Verifica se já foi visto nesta sessão/dia
    const storageKey = `tecnato_popup_${popup.id || 'default'}`
    const now = Date.now()

    let shouldShow = true

    if (frequency === 'sessao') {
      shouldShow = !sessionStorage.getItem(storageKey)
    } else if (frequency === 'dia') {
      const lastShown = localStorage.getItem(storageKey)
      shouldShow = !lastShown || (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000
    } else if (frequency === 'sempre') {
      shouldShow = true
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [popup])

  if (!isOpen || !popup?.conteudo) return null

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false)
    if (dontShowAgain) {
      const storageKey = `tecnato_popup_${popup.id || 'default'}`
      if (popup.frequencia === 'dia') {
        localStorage.setItem(storageKey, Date.now().toString())
      } else {
        sessionStorage.setItem(storageKey, 'true')
      }
    }
  }

  const { titulo, descricao, imagemUrl, youtubeUrl, botaoTexto, botaoLink } = popup.conteudo

  // Detecta se é YouTube
  const isYouTube = youtubeUrl && (youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be'))

  // Extrai video ID do YouTube para embed
  let youtubeEmbedUrl = null
  if (isYouTube) {
    const match = youtubeUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
    if (match) {
      youtubeEmbedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&rel=0&modestbranding=1`
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-line animate-slide-up">
        {/* Botão fechar */}
        <button
          type="button"
          onClick={() => handleClose(false)}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 text-ink/60 hover:bg-white hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label={c.fecharAnuncio}
        >
          <CloseIcon />
        </button>

        <div className="p-5 sm:p-6">
          {/* Cabeçalho */}
          {titulo && (
            <h2 id="popup-title" className="text-xl sm:text-2xl font-bold tracking-[-0.03em] text-ink">
              {titulo}
            </h2>
          )}

          {/* Conteúdo: vídeo ou imagem */}
          <div className="mt-4 relative">
            {isYouTube && youtubeEmbedUrl && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-ink">
                <iframe
                  src={youtubeEmbedUrl}
                  title={titulo || c.videoTecnato}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            {!isYouTube && imagemUrl && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-ink-soft">
                <img
                  src={imagemUrl}
                  alt={titulo || c.imagemAnuncio}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {descricao && (
              <p className="mt-4 text-base leading-relaxed text-ink/70 whitespace-pre-line">
                {descricao}
              </p>
            )}
          </div>

          {/* Botão de ação */}
          {botaoTexto && botaoLink && (
            <a
              href={botaoLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-mono text-[11px] tracking-[0.1em] uppercase text-white transition-colors hover:bg-brand hover:text-ink sm:w-auto"
            >
              {botaoTexto}
              <span aria-hidden="true">→</span>
            </a>
          )}

          {/* Opção não mostrar novamente */}
          <label className="mt-4 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!showAgain}
              onChange={(e) => setShowAgain(!e.target.checked)}
              className="h-4 w-4 rounded border-line text-brand focus:ring-brand focus:ring-2"
            />
            <span className="text-sm text-ink/60">{c.naoMostrar}</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default FloatingYouTubeButton
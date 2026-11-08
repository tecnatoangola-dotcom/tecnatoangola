import { Component } from 'react'

const T = {
  pt: {
    titulo: 'Algo correu mal no TECNATO',
    texto:
      'Encontrámos um erro ao mostrar esta página. Podes tentar novamente — os teus dados estão seguros.',
    recarregar: 'Recarregar',
  },
  en: {
    titulo: 'Something went wrong at TECNATO',
    texto:
      'We ran into an error while displaying this page. You can try again — your data is safe.',
    recarregar: 'Reload',
  },
}

// Idioma ativo fora do IdiomaProvider (o ErrorBoundary envolve a app toda).
function idiomaAtual() {
  try {
    const guardado = window.localStorage.getItem('tecnato:idioma')
    if (guardado === 'en' || guardado === 'pt') return guardado
  } catch {
    /* localStorage indisponível (modo privado) */
  }
  if (typeof document !== 'undefined' && document.documentElement.lang === 'en') return 'en'
  return 'pt'
}

// Captura qualquer erro de render do React e mostra uma mensagem de erro
// utilizável — garante que o utilizador NUNCA vê uma página toda branca.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { erro: null }
  }

  static getDerivedStateFromError(erro) {
    return { erro }
  }

  componentDidCatch(erro, info) {
    console.error('Erro no render:', erro, info?.componentStack)
  }

  render() {
    if (this.state.erro) {
      const c = T[idiomaAtual()]
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: '#121313',
            color: '#eaeaea',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            padding: 24,
          }}
        >
          <div style={{ fontSize: 40 }}>⚠</div>
          <h1 style={{ fontSize: 18, margin: 0 }}>{c.titulo}</h1>
          <p style={{ opacity: 0.7, maxWidth: 480, margin: 0 }}>{c.texto}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {c.recarregar}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

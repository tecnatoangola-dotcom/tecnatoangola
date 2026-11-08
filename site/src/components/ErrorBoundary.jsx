import { Component } from 'react'

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
          <h1 style={{ fontSize: 18, margin: 0 }}>Algo correu mal no TECNATO</h1>
          <p style={{ opacity: 0.7, maxWidth: 480, margin: 0 }}>
            Encontrámos um erro ao mostrar esta página. Podes tentar novamente — os teus
            dados estão seguros.
          </p>
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
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

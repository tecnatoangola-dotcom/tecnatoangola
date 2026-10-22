// Ícones lineares (stroke) para as etiquetas de secção — mesmo estilo das
// etiquetas monoespaçadas: substituem os números 01, 02, 03… por símbolos
// com significado (ex.: alvo = o projecto).
const FORMAS = {
  alvo: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </>
  ),
  areas: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </>
  ),
  passos: <polyline points="3,19.5 8.5,19.5 8.5,14.5 14,14.5 14,9.5 19.5,9.5 19.5,4.5 21.5,4.5" />,
  megafone: (
    <>
      <path d="M3 11v3l10 4.5V6.5L3 11z" />
      <path d="M13 6.5l7-2.5v16l-7-2.5" />
      <path d="M20.5 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ),
  centelha: <path d="M12 2.5l2.3 6.2 6.2 2.3-6.2 2.3L12 19.5l-2.3-6.2-6.2-2.3 6.2-2.3L12 2.5z" />,
  documento: (
    <>
      <path d="M7 3h7l5 5v13H7V3z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h4.5M10 16.5h4.5" />
    </>
  ),
  interro: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.6 2.6 0 1 1 4.4 2.1c-.8.7-2 1.1-2 2.4" />
      <path d="M12 17.3h.01" />
    </>
  ),
  pessoas: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20c.4-3.4 3-5 6.2-5s5.8 1.6 6.2 5" />
      <path d="M15.6 8.1a2.8 2.8 0 1 1 2 4.9" />
      <path d="M16.4 15.2c2.7.1 4.6 1.6 4.9 4.3" />
    </>
  ),
  livro: (
    <>
      <path d="M2.5 4h7a3 3 0 0 1 3 3v13a2.6 2.6 0 0 0-2.6-2.5H2.5V4z" />
      <path d="M21.5 4h-7a3 3 0 0 0-3 3v13a2.6 2.6 0 0 1 2.6-2.5h7.4V4z" />
    </>
  ),
  globo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3.2 3.6 3.2 14.4 0 18" />
      <path d="M12 3c-3.2 3.6-3.2 14.4 0 18" />
    </>
  ),
  olho: (
    <>
      <path d="M2 12s3.6-6.2 10-6.2S22 12 22 12s-3.6 6.2-10 6.2S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  crescente: (
    <>
      <path d="M3 17l5.6-5.6 3.8 3.8L20.6 7" />
      <path d="M14.6 7h6v6" />
    </>
  ),
  estrela: (
    <>
      <path d="M12 3l2.6 5.4 6 .9-4.3 4.2 1 5.9-5.3-2.8-5.3 2.8 1-5.9L3.4 9.3l6-.9L12 3z" />
    </>
  ),
  maleta: (
    <>
      <rect x="3" y="7.5" width="18" height="13" rx="1.5" />
      <path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2" />
      <path d="M3 12.5h18" />
    </>
  ),
  frasco: (
    <>
      <path d="M10 3h4l-.7 6.2 5.2 9.2A1.8 1.8 0 0 1 16.9 21H7.1a1.8 1.8 0 0 1-1.6-2.6l5.2-9.2L10 3z" />
      <path d="M8 15.5h8" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="10.2" y="10.2" width="3.6" height="3.6" />
      <path d="M12 3.5v3.5M12 17v3.5M3.5 12H7M17 12h3.5M6.5 5v2M17.5 5v2M6.5 19v-2M17.5 19v-2M5 6.5H7M5 17.5H7M19 6.5H17M19 17.5H17" />
    </>
  ),
  coracao: (
    <path d="M12 20.5c-4.6-2.9-8.5-6-8.5-10.1A4.6 4.6 0 0 1 12 7.7a4.6 4.6 0 0 1 8.5 2.7c0 4.1-3.9 7.2-8.5 10.1z" />
  ),
  engrenagem: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.8M12 18.2V21M3 12h2.8M18.2 12H21M5.9 5.9l2 2M16.1 16.1l2 2M18.1 5.9l-2 2M7.9 16.1l-2 2" />
    </>
  ),
  visto: <path d="M4.5 12.5l4.7 4.7L19.5 6.9" />,
  escudo: (
    <>
      <path d="M12 2.5l8 3v6.2c0 4.9-3.4 8.7-8 10.8-4.6-2.1-8-5.9-8-10.8V5.5l8-3z" />
      <path d="M8.8 11.6l2.3 2.3 4.1-4.6" />
    </>
  ),
}

export function Icone({ nome, className = 'h-4 w-4' }) {
  const formas = FORMAS[nome]
  if (!formas) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {formas}
    </svg>
  )
}

export function temIcone(nome) {
  return Boolean(FORMAS[nome])
}

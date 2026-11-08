export const WHATSAPP_NUMBER = '244935073125'

export const SITE_URL = 'https://tecnatoangola.com/'

const MENSAGEM_WHATSAPP = {
  pt: 'Olá! Quero apresentar o meu projecto ao TECNATO.',
  en: 'Hello! I would like to present my project to TECNATO.',
}

export function whatsappUrl(lang = 'pt') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    MENSAGEM_WHATSAPP[lang] || MENSAGEM_WHATSAPP.pt,
  )}`
}

// Mantido para compatibilidade com pontos que ainda não recebem o idioma.
export const WHATSAPP_URL = whatsappUrl('pt')

export const EMAIL = 'suporte@tecnatoangola.com'

// `chave` indexa NAV_TEXTOS; o rótulo nunca deve ser comparado por texto.
export const NAV_LINKS = [
  { href: '/projecto', chave: 'projecto' },
  { href: '/areas', chave: 'areas' },
  { href: '/como-funciona', chave: 'comoFunciona' },
  { href: '/participar', chave: 'participar' },
  { href: '/candidatura', chave: 'candidatura' },
  { href: '/quem-somos', chave: 'quemSomos' },
  { href: '/faq', chave: 'faq' },
]

export const NAV_TEXTOS = {
  pt: {
    projecto: 'O projecto',
    areas: 'Áreas',
    comoFunciona: 'Como funciona',
    participar: 'Participar',
    candidatura: 'Candidatura',
    quemSomos: 'Quem somos',
    faq: 'FAQ',
  },
  en: {
    projecto: 'The project',
    areas: 'Fields',
    comoFunciona: 'How it works',
    participar: 'Take part',
    candidatura: 'Apply',
    quemSomos: 'About us',
    faq: 'FAQ',
  },
}

export const PARCEIROS = [
  {
    nome: 'Hostinger',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787595825/Hostinger_Logo.png',
  },
  {
    nome: 'EZZO Digital',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787585618/4cdf9d321166a0803632bc80d821b6bb.png',
  },
  {
    nome: 'Keimadura',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787584053/logo-keimadura-erp.png',
  },
  {
    nome: 'ChatGPT',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792062577/ChatGPT-Logo.png',
  },
  {
    nome: 'Google',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792062577/Google__G__logo.svg.webp',
  },
  {
    nome: 'Netlify',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792062576/Netlify_logo__2.svg.webp',
  },
  {
    nome: 'Supabase',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792070651/45a7d301-f2f5-46a1-b896-d7fbcc79db8b-removebg-preview.png',
  },
  {
    nome: 'Garcian',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792070654/supabase-logo-vector__1_-removebg-preview.png',
  },
  {
    nome: 'Anthropic',
    logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787595826/Anthropic-Logo.wine.png',
  },
]

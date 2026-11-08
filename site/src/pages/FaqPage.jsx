import { useSeo } from '../lib/seo.jsx'
import Faq from '../components/Faq.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    titulo: 'Perguntas frequentes',
    descricao:
      'Respostas directas às dúvidas mais comuns sobre candidatura, elegibilidade, áreas, prémios e funcionamento da plataforma.',
  },
  en: {
    titulo: 'Frequently asked questions',
    descricao:
      'Direct answers to the most common questions about applying, eligibility, fields, prizes and how the platform works.',
  },
}

export default function FaqPage() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({ titulo: c.titulo, descricao: c.descricao, caminho: '/faq' })
  return <Faq />
}

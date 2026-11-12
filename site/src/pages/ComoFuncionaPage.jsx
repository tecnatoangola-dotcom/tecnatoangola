import { useSeo } from '../lib/seo.jsx'
import ComoFunciona from '../components/ComoFunciona.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    titulo: 'Como funciona',
    descricao:
      'Cinco fases: apresentação, selecção, desenvolvimento, competição e reconhecimento. Entende o processo do TECNATO.',
  },
  en: {
    titulo: 'How it works',
    descricao:
      'Five stages: presentation, selection, development, competition and recognition. Understand the TECNATO process.',
  },
}

export default function ComoFuncionaPage() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({ titulo: c.titulo, descricao: c.descricao, caminho: '/como-funciona', tipoPagina: 'como-funciona', lang })
  return <ComoFunciona />
}

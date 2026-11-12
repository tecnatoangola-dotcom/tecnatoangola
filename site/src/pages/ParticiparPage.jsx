import { useSeo } from '../lib/seo.jsx'
import Participar from '../components/Participar.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    titulo: 'Quem pode participar',
    descricao:
      'Equipas formais e informais, startups, projectos científicos, iniciativas sociais. Descobre se podes candidatar-te e o que ganhas.',
  },
  en: {
    titulo: 'Who can take part',
    descricao:
      'Formal and informal teams, startups, scientific projects, social initiatives. Find out if you can apply and what you gain.',
  },
}

export default function ParticiparPage() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({ titulo: c.titulo, descricao: c.descricao, caminho: '/participar', tipoPagina: 'participar', lang })
  return <Participar />
}

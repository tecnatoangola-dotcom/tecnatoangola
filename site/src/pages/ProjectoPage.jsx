import { useSeo } from '../lib/seo.jsx'
import Projecto from '../components/Projecto.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    titulo: 'O projecto TECNATO',
    descricao:
      'Conhece a missão, o problema que resolvemos e os valores que guiam o TECNATO — a plataforma de talentos de Angola.',
  },
  en: {
    titulo: 'The TECNATO project',
    descricao:
      'Discover the mission, the problem we solve and the values that guide TECNATO — Angola’s talent platform.',
  },
}

export default function ProjectoPage() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({ titulo: c.titulo, descricao: c.descricao, caminho: '/projecto', tipoPagina: 'projecto', lang })
  return <Projecto />
}

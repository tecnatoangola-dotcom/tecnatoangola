import { useSeo } from '../lib/seo.jsx'
import Areas from '../components/Areas.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    titulo: 'Áreas de projecto',
    descricao:
      'Gestão, Ciência, Tecnologia, Empreendedorismo, Impacto Social, Invenções. Descobre em que área se encaixa o teu projecto.',
  },
  en: {
    titulo: 'Project fields',
    descricao:
      'Management, Science, Technology, Entrepreneurship, Social Impact, Inventions. Find out where your project fits.',
  },
}

export default function AreasPage() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({ titulo: c.titulo, descricao: c.descricao, caminho: '/areas' })
  return <Areas />
}

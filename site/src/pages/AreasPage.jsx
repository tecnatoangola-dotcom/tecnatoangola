import { useSeo } from '../lib/seo.jsx'
import Areas from '../components/Areas.jsx'

export default function AreasPage() {
  useSeo({
    titulo: 'Áreas de projecto — TECNATO',
    descricao: 'Gestão, Ciência, Tecnologia, Empreendedorismo, Impacto Social, Invenções. Descobre em que área se encaixa o teu projecto.',
    caminho: '/areas',
  })
  return <Areas />
}
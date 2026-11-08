import { useSeo } from '../lib/seo.jsx'
import Participar from '../components/Participar.jsx'

export default function ParticiparPage() {
  useSeo({
    titulo: 'Quem pode participar — TECNATO',
    descricao: 'Equipas formais e informais, startups, projectos científicos, iniciativas sociais. Descobre se podes candidatar-te e o que ganhas.',
    caminho: '/participar',
  })
  return <Participar />
}
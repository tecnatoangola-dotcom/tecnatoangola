import { useSeo } from '../lib/seo.jsx'
import Projecto from '../components/Projecto.jsx'

export default function ProjectoPage() {
  useSeo({
    titulo: 'O projecto TECNATO',
    descricao: 'Conhece a missão, o problema que resolvemos e os valores que guiam o TECNATO — a plataforma de talentos de Angola.',
    caminho: '/projecto',
  })
  return <Projecto />
}
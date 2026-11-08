import { useSeo } from '../lib/seo.jsx'
import ComoFunciona from '../components/ComoFunciona.jsx'

export default function ComoFuncionaPage() {
  useSeo({
    titulo: 'Como funciona — TECNATO',
    descricao: 'Cinco fases: apresentação, seleção, desenvolvimento, competição e reconhecimento. Entende o processo do TECNATO.',
    caminho: '/como-funciona',
  })
  return <ComoFunciona />
}
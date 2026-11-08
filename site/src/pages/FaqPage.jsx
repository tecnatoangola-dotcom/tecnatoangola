import { useSeo } from '../lib/seo.jsx'
import Faq from '../components/Faq.jsx'

export default function FaqPage() {
  useSeo({
    titulo: 'Perguntas frequentes — TECNATO',
    descricao: 'Respostas directas às dúvidas mais comuns sobre candidatura, elegibilidade, áreas, prémios e funcionamento da plataforma.',
    caminho: '/faq',
  })
  return <Faq />
}
import Areas from '../components/Areas.jsx'
import Candidatura from '../components/Candidatura.jsx'
import ComoFunciona from '../components/ComoFunciona.jsx'
import Cta from '../components/Cta.jsx'
import Faq from '../components/Faq.jsx'
import Gallery from '../components/Gallery.jsx'
import Hero from '../components/Hero.jsx'
import Impacto from '../components/Impacto.jsx'
import Marquee from '../components/Marquee.jsx'
import Participar from '../components/Participar.jsx'
import Projecto from '../components/Projecto.jsx'
import ParceirosMarquee from '../components/ParceirosMarquee.jsx'
import { useConteudo } from '../lib/conteudo.js'
import { useSeo } from '../lib/seo.jsx'
import { Icone } from '../components/Icones.jsx'

export default function Home() {
  useSeo({
    titulo: 'Talento, Oportunidade e Inovação em Angola',
    descricao:
      'TECNATO identifica, valoriza e dá visibilidade a talentos, projectos e iniciativas em Gestão, Administração, Ciência, Inovação, Empreendedorismo e Tecnologia. Candidata o teu projecto e representa o teu município.',
    caminho: '/',
  })
  const conteudo = useConteudo()
  return (
    <>
      <Hero />
      <div className="mt-2 sm:mt-4">
        <Gallery />
      </div>
      <Marquee />
      <Projecto />
      <section id="parceiros" className="scroll-mt-16 border-t border-line bg-paper">
        <div className="mx-auto max-w-[1440px] border-x border-line px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="section-label flex items-center gap-3 text-brand-deep lg:col-span-2">
              <Icone nome="globo" className="h-4 w-4" />
              Parceiros
            </p>
            <div className="lg:col-span-7">
              <h2 className="text-4xl leading-[0.95] font-semibold tracking-[-0.055em] sm:text-5xl">{conteudo.parceiros.titulo_normal} <em className="editorial-serif font-normal">{conteudo.parceiros.titulo_acento}</em></h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70">{conteudo.parceiros.subtitulo}</p>
            </div>
            <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em] uppercase text-ink/45 lg:col-span-3 lg:self-end lg:text-right">Construído em Angola<br />com parceiros globais</p>
          </div>
          <div className="mt-10"><ParceirosMarquee /></div>
        </div>
      </section>
      <Areas />
      <ComoFunciona />
      <Participar />
      <Impacto />
      <Candidatura />
      <Faq />
      <Cta />
    </>
  )
}

import { Link } from 'react-router-dom'
import { whatsappUrl } from '../constants.js'
import { Icone } from './Icones.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    label: 'O convite',
    titulo1: 'A próxima grande oportunidade pode estar mais ',
    titulo2: ' do que imaginas.',
    destaque: 'perto',
    texto:
      'Não sabemos ainda de onde virão todas as ideias. Mas acreditamos que vale a pena criar um espaço para as descobrir — identificando talentos, dando visibilidade a projectos e aproximando o público das mentes que constroem soluções para o futuro.',
    cta1: 'Apresenta o teu projecto',
    cta2: 'Falar por WhatsApp',
    nota: 'O próximo génio pode estar no teu bairro.',
    selo: 'Inscrições abertas',
    seloTexto: 'Há uma oportunidade à tua espera.',
  },
  en: {
    label: 'The invitation',
    titulo1: 'The next big opportunity may be ',
    titulo2: ' than you imagine.',
    destaque: 'closer',
    texto:
      'We do not yet know where all the ideas will come from. But we believe it is worth creating a space to discover them — identifying talent, giving visibility to projects and bringing the public closer to the minds building solutions for the future.',
    cta1: 'Present your project',
    cta2: 'Chat on WhatsApp',
    nota: 'The next genius may be in your neighbourhood.',
    selo: 'Applications open',
    seloTexto: 'An opportunity is waiting for you.',
  },
}

export default function Cta() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <section className="border-t border-line bg-brand">
      <div className="mx-auto grid max-w-[1440px] border-x border-ink/20 lg:grid-cols-12">
        <div className="px-5 py-16 sm:px-8 sm:py-24 lg:col-span-9 lg:px-12">
          <p className="section-label flex items-center gap-3 text-ink/60">
            <Icone nome="megafone" className="h-4 w-4" />
            {c.label}
          </p>
          <h2 className="mt-7 max-w-4xl text-5xl leading-[0.9] font-semibold tracking-[-0.065em] sm:text-6xl lg:text-7xl">
            {c.titulo1}
            <em className="editorial-serif font-normal">{c.destaque}</em>
            {c.titulo2}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">{c.texto}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/candidatura"
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 bg-ink px-7 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-white transition-colors hover:bg-white hover:text-ink sm:w-auto"
            >
              {c.cta1}
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={whatsappUrl(lang)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-13 w-full items-center justify-center border border-ink/30 px-7 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:bg-white/60 sm:w-auto"
            >
              {c.cta2}
            </a>
          </div>

          <p className="mt-10 font-mono text-[10px] font-medium tracking-[0.2em] uppercase">{c.nota}</p>
        </div>
        <div className="hidden border-l border-ink/20 p-7 lg:flex lg:col-span-3 lg:flex-col lg:justify-between">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/55">{c.selo}</p>
          <p className="text-3xl leading-none font-semibold tracking-[-0.05em]">{c.seloTexto}</p>
        </div>
      </div>
    </section>
  )
}

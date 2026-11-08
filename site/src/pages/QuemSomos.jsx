import { Link } from 'react-router-dom'
import { Icone } from '../components/Icones.jsx'
import { Section, SectionLabel } from '../components/Section.jsx'
import { whatsappUrl } from '../constants.js'
import { useConteudo } from '../lib/conteudo.js'
import { useSeo } from '../lib/seo.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const ICONES_PILARES = ['olho', 'crescente', 'pessoas']

const T = {
  pt: {
    seoTitulo: 'Quem somos',
    seoDescricao:
      'Conhece a TECNATO: uma plataforma angolana criada para identificar, valorizar e visibilizar o talento nacional — do bairro para o mundo.',
    label: 'Quem somos',
    titulo1: 'A luz para os ',
    titulo2: ' da banda.',
    destaque: 'génios',
    intro:
      'Somos o TECNATO — uma plataforma feita em Angola para dar voz, rosto e oportunidade aos talentos e projectos que nascem nos bairros, nas universidades, nas oficinas e nas ideias tardias da noite. Onde quer que estejas, se tens algo a mostrar, aqui és visto.',
    historiaLabel: 'A nossa história',
    historiaTitulo: 'Do bairro para o mundo — com trabalho e tecnologia.',
    historiaIntro:
      'O TECNATO nasceu de uma constatação simples: Angola tem génios em todos os cantos, mas falta a luz que os ilumina. Construímos essa luz.',
    pilares: [
      {
        titulo: 'Visibilidade',
        texto:
          'Mostramos o que se faz de bom em Angola — projectos, ideias e pessoas que merecem ser vistas para além do próprio bairro.',
      },
      {
        titulo: 'Oportunidade',
        texto:
          'Ligamos talentos a quem procura soluções: investidores, empresas, mentores e parceiros nacionais e internacionais.',
      },
      {
        titulo: 'Comunidade',
        texto:
          'Crescemos em conjunto. Cada candidatura enviada é um génio que decide aparecer — e isso muda o país.',
      },
    ],
    fundadoresLabel: 'Fundadores',
    ctaTitulo: 'O próximo génio pode ser tu.',
    ctaTexto: 'Apresenta o teu projecto ao TECNATO e entra na lista dos que ousam aparecer.',
    ctaBotao: 'Apresentar projecto',
    whatsapp: 'Falar por WhatsApp',
    retrato: 'Retrato de',
  },
  en: {
    seoTitulo: 'About us',
    seoDescricao:
      'Meet TECNATO: an Angolan platform built to identify, value and give visibility to national talent — from the neighbourhood to the world.',
    label: 'About us',
    titulo1: 'The light for the ',
    titulo2: ' of the neighbourhood.',
    destaque: 'geniuses',
    intro:
      'We are TECNATO — a platform made in Angola to give voice, face and opportunity to the talents and projects born in neighbourhoods, universities, workshops and late-night ideas. Wherever you are, if you have something to show, here you are seen.',
    historiaLabel: 'Our story',
    historiaTitulo: 'From the neighbourhood to the world — with work and technology.',
    historiaIntro:
      'TECNATO was born from a simple observation: Angola has geniuses in every corner, but lacks the light that reveals them. We built that light.',
    pilares: [
      {
        titulo: 'Visibility',
        texto:
          'We show what is done well in Angola — projects, ideas and people who deserve to be seen beyond their own neighbourhood.',
      },
      {
        titulo: 'Opportunity',
        texto:
          'We connect talent with those looking for solutions: investors, companies, mentors and national and international partners.',
      },
      {
        titulo: 'Community',
        texto:
          'We grow together. Every application sent is a genius who decides to show up — and that changes the country.',
      },
    ],
    fundadoresLabel: 'Founders',
    ctaTitulo: 'The next genius could be you.',
    ctaTexto: 'Present your project to TECNATO and join the list of those who dare to show up.',
    ctaBotao: 'Present project',
    whatsapp: 'Chat on WhatsApp',
    retrato: 'Portrait of',
  },
}

export default function QuemSomos() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    descricao: c.seoDescricao,
    caminho: '/quem-somos',
  })

  const conteudo = useConteudo()
  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionLabel icone="pessoas">{c.label}</SectionLabel>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            {c.titulo1}
            <span className="text-brand-deep">{c.destaque}</span>
            {c.titulo2}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">{c.intro}</p>
        </div>
      </section>

      <Section
        label={c.historiaLabel}
        icone="livro"
        title={c.historiaTitulo}
        intro={c.historiaIntro}
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {c.pilares.map((pilar, i) => (
            <div key={pilar.titulo} className="rounded-2xl border border-line bg-white p-6">
              <span className="section-label flex items-center text-brand-deep">
                <Icone nome={ICONES_PILARES[i]} className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-xl font-bold">{pilar.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{pilar.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        label={c.fundadoresLabel}
        icone="estrela"
        title={conteudo.quem_somos.titulo}
        tone="dark"
        intro={conteudo.quem_somos.intro}
      >
        <div className="mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          {(conteudo.quem_somos.fundadores || []).map((pessoa) => (
            <article
              key={pessoa.nome}
              className="overflow-hidden border border-white/10 bg-white/5"
            >
              <img
                src={pessoa.foto}
                alt={`${c.retrato} ${pessoa.nome}`}
                loading="lazy"
                decoding="async"
                className="h-64 w-full bg-ink-soft object-contain sm:h-72"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl font-bold">{pessoa.nome}</h3>
                <p className="mt-1 text-sm font-semibold tracking-wide text-brand uppercase">
                  {pessoa.cargo}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{pessoa.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="max-w-xl text-3xl leading-tight font-bold sm:text-4xl">{c.ctaTitulo}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              {c.ctaTexto}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/candidatura"
              className="flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-deep"
            >
              {c.ctaBotao}
            </Link>
            <a
              href={whatsappUrl(lang)}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              {c.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

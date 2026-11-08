import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useConteudo } from '../lib/conteudo.js'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    destaques: [
      ['Palco', 'para talentos que também precisam de ser vistos'],
      ['Projectos', 'não apenas promessas — equipas, ideias e soluções'],
      ['Mérito', 'de qualquer bairro, musseque, escola ou universidade'],
    ],
    etiqueta: 'plataforma para talentos — Luanda, Angola',
    titulo1: 'A luz para os ',
    titulo2: ' da banda.',
    paragrafo1:
      'O ',
    paragrafo2:
      ' é uma plataforma de identificação, valorização e visibilidade de talentos, projectos e iniciativas nas áreas da Gestão, Administração, Ciência, Inovação, Empreendedorismo, Tecnologia e outras áreas do conhecimento e da criatividade humana.',
    cta1: 'Quero apresentar o meu projecto',
    cta2: 'Quero conhecer o TECNATO',
    nota: 'Vídeo até 1 min · equipas formais e informais · municípios de Luanda',
    selo: 'Lugar para construir',
    legenda: 'O futuro nasce onde alguém decide começar.',
  },
  en: {
    destaques: [
      ['A stage', 'for talents who also need to be seen'],
      ['Projects', 'not just promises — teams, ideas and solutions'],
      ['Merit', 'from any neighbourhood, school or university'],
    ],
    etiqueta: 'a platform for talent — Luanda, Angola',
    titulo1: 'The light for the ',
    titulo2: ' of the neighbourhood.',
    paragrafo1: '',
    paragrafo2:
      ' is a platform that identifies, values and gives visibility to talents, projects and initiatives in Management, Administration, Science, Innovation, Entrepreneurship, Technology and other fields of human knowledge and creativity.',
    cta1: 'I want to present my project',
    cta2: 'I want to know TECNATO',
    nota: 'Video up to 1 min · formal and informal teams · municipalities of Luanda',
    selo: 'A place to build',
    legenda: 'The future is born where someone decides to start.',
  },
}

export default function Hero() {
  const conteudo = useConteudo()
  const { lang } = useIdioma()
  const c = T[lang]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)

  // Imagens para rotação: hero principal + galeria
  const rotationImages = useRef([
    { src: conteudo.hero.imagem, alt: conteudo.hero.alt },
    ...(conteudo.galeria.imagens || []).map((img) => ({ src: img.src, alt: img.alt })),
  ]).current

  // Se rotação desligada, usa só a imagem principal
  const shouldRotate = conteudo.hero.rotacao === true

  // Avança para a próxima imagem
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % rotationImages.length)
  }

  // Inicia/para o intervalo
  useEffect(() => {
    if (!shouldRotate || isHovered) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    intervalRef.current = setInterval(nextImage, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [shouldRotate, isHovered, rotationImages.length])

  const currentImage = rotationImages[currentIndex] || rotationImages[0]

  return (
    <section id="topo" className="relative overflow-hidden border-b border-line bg-paper">
      <div className="mx-auto grid max-w-[1440px] border-x border-line lg:grid-cols-12">
        <div className="relative px-5 pt-10 pb-10 sm:px-8 sm:pt-16 lg:col-span-8 lg:px-12 lg:pt-20 lg:pb-12">
          <div aria-hidden="true" className="absolute inset-0 technical-grid opacity-45" />
          <div className="hero-reveal relative">
            <p className="section-label flex items-center gap-3 text-ink/55">
              <span className="animate-soft-pulse h-1.5 w-1.5 bg-brand" />
              {c.etiqueta}
            </p>
            <h1 className="mt-10 max-w-4xl text-[3.25rem] leading-[0.88] font-semibold tracking-[-0.07em] sm:text-7xl lg:text-[7.4rem]">
              {c.titulo1}
              <em className="editorial-serif font-normal tracking-[-0.04em]">
                {lang === 'en' ? 'geniuses' : 'génios'}
              </em>
              {c.titulo2}
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              {c.paragrafo1}
              <strong className="font-semibold text-ink">TECNATO</strong>
              {c.paragrafo2}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/candidatura"
                className="inline-flex min-h-13 w-full items-center justify-center gap-2 bg-ink px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-white transition-colors hover:bg-brand hover:text-ink sm:w-auto"
              >
                {c.cta1}
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#projecto"
                className="inline-flex min-h-13 w-full items-center justify-center border border-ink/35 px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:bg-white sm:w-auto"
              >
                {c.cta2}
              </a>
            </div>

            <p className="mt-5 font-mono text-[10px] tracking-[0.1em] uppercase text-ink/50">
              {c.nota}
            </p>
          </div>
        </div>
        <div
          className="relative min-h-[420px] overflow-hidden border-t border-line lg:col-span-4 lg:border-t-0 lg:border-l"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="h-full w-full object-cover grayscale-[20%]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <p className="absolute top-5 left-5 bg-brand px-3 py-2 font-mono text-[10px] tracking-[0.14em] uppercase">{c.selo}</p>
          <p className="absolute right-5 bottom-5 max-w-48 text-right font-mono text-[10px] leading-relaxed tracking-[0.1em] uppercase text-white/80">{c.legenda}</p>
        </div>
        <dl className="col-span-full grid border-t border-line sm:grid-cols-3">
          {c.destaques.map(([title, text]) => (
            <div key={title} className="border-r border-line p-5 last:border-r-0 sm:p-7">
              <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/45">{title}</dt>
              <dd className="mt-3 max-w-xs text-base leading-snug font-medium sm:text-lg">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

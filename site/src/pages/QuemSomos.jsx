import { Link } from 'react-router-dom'
import { Section, SectionLabel } from '../components/Section.jsx'
import { FUNDADORES, WHATSAPP_URL } from '../constants.js'

const PILARES = [
  {
    titulo: 'Visibilidade',
    texto: 'Mostramos o que se faz de bom em Angola — projectos, ideias e pessoas que merecem ser vistas para além do próprio bairro.',
  },
  {
    titulo: 'Oportunidade',
    texto: 'Ligamos talentos a quem procura soluções: investidores, empresas, mentores e parceiros nacionais e internacionais.',
  },
  {
    titulo: 'Comunidade',
    texto: 'Crescemos em conjunto. Cada candidatura enviada é um génio que decide aparecer — e isso muda o país.',
  },
]

export default function QuemSomos() {
  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionLabel index="00">Quem somos</SectionLabel>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            A luz para os <span className="text-brand-deep">génios</span> da banda.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Somos o TECNATO — uma plataforma feita em Angola para dar voz, rosto e oportunidade
            aos talentos e projectos que nascem nos bairros, nas universidades, nas oficinas e
            nas ideias tardias da noite. Onde quer que estejas, se tens algo a mostrar, aqui és
            visto.
          </p>
        </div>
      </section>

      <Section
        label="A nossa história"
        index="01"
        title="Do bairro para o mundo — com trabalho e tecnologia."
        intro="O TECNATO nasceu de uma constatação simples: Angola tem génios em todos os cantos, mas falta a luz que os ilumina. Construímos essa luz."
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PILARES.map((pilar, i) => (
            <div
              key={pilar.titulo}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <p className="section-label text-brand-deep">0{i + 1}</p>
              <h3 className="mt-3 text-xl font-bold">{pilar.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{pilar.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        label="Fundadores"
        index="02"
        title="Quem está por trás do TECNATO."
        tone="dark"
        intro="Duas pessoas, uma obsessão: que o talento angolano deixe de depender de sorte para depender de visibilidade."
      >
        <div className="mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          {FUNDADORES.map((pessoa) => (
            <article
              key={pessoa.nome}
              className="overflow-hidden border border-white/10 bg-white/5"
            >
              <img
                src={pessoa.foto}
                alt={`Retrato de ${pessoa.nome}`}
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
            <h2 className="max-w-xl text-3xl leading-tight font-bold sm:text-4xl">
              O próximo génio pode ser tu.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              Apresenta o teu projecto ao TECNATO e entra na lista dos que ousam aparecer.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/candidatura"
              className="flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-deep"
            >
              Apresentar projecto
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              Falar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'

const HIGHLIGHTS = [
  ['Palco', 'para talentos que também precisam de ser vistos'],
  ['Projectos', 'não apenas promessas — equipas, ideias e soluções'],
  ['Mérito', 'de qualquer bairro, musseque, escola ou universidade'],
]

export default function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden border-b border-line bg-paper">
      <div className="mx-auto grid max-w-[1440px] border-x border-line lg:grid-cols-12">
        <div className="relative px-5 pt-10 pb-10 sm:px-8 sm:pt-16 lg:col-span-8 lg:px-12 lg:pt-20 lg:pb-12">
          <div aria-hidden="true" className="absolute inset-0 technical-grid opacity-45" />
          <div className="hero-reveal relative">
            <p className="section-label flex items-center gap-3 text-ink/55">
              <span className="animate-soft-pulse h-1.5 w-1.5 bg-brand" />
              01 / plataforma para talentos — Luanda, Angola
            </p>
            <h1 className="mt-10 max-w-4xl text-[3.25rem] leading-[0.88] font-semibold tracking-[-0.07em] sm:text-7xl lg:text-[7.4rem]">
              A luz para os <em className="editorial-serif font-normal tracking-[-0.04em]">génios</em> da banda.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              O <strong className="font-semibold text-ink">TECNATO</strong> é uma plataforma de identificação, valorização e visibilidade de talentos, projectos e iniciativas nas áreas da Gestão, Administração, Ciência, Inovação, Empreendedorismo, Tecnologia e outras áreas do conhecimento e da criatividade humana.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/candidatura"
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 bg-ink px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-white transition-colors hover:bg-brand hover:text-ink sm:w-auto"
          >
            Quero apresentar o meu projecto
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href="#projecto"
            className="inline-flex min-h-13 w-full items-center justify-center border border-ink/35 px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:bg-white sm:w-auto"
          >
            Quero conhecer o TECNATO
          </a>
        </div>

            <p className="mt-5 font-mono text-[10px] tracking-[0.1em] uppercase text-ink/50">
              Vídeo até 1 min · equipas formais e informais · municípios de Luanda
            </p>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden border-t border-line lg:col-span-4 lg:border-t-0 lg:border-l">
          <img src="/images/oficina-tecnologica.png" alt="Jovens a construírem um protótipo numa oficina" className="h-full w-full object-cover grayscale-[20%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <p className="absolute top-5 left-5 bg-brand px-3 py-2 font-mono text-[10px] tracking-[0.14em] uppercase">Lugar para construir</p>
          <p className="absolute right-5 bottom-5 max-w-48 text-right font-mono text-[10px] leading-relaxed tracking-[0.1em] uppercase text-white/80">O futuro nasce onde alguém decide começar.</p>
        </div>
        <dl className="col-span-full grid border-t border-line sm:grid-cols-3">
          {HIGHLIGHTS.map(([title, text]) => (
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

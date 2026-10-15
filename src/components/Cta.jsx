import { Link } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants.js'

export default function Cta() {
  return (
    <section className="border-t border-line bg-brand">
      <div className="mx-auto grid max-w-[1440px] border-x border-ink/20 lg:grid-cols-12">
        <div className="px-5 py-16 sm:px-8 sm:py-24 lg:col-span-9 lg:px-12">
        <p className="section-label text-ink/60">07 / O convite</p>
        <h2 className="mt-7 max-w-4xl text-5xl leading-[0.9] font-semibold tracking-[-0.065em] sm:text-6xl lg:text-7xl">
          A próxima grande ideia pode estar mais <em className="editorial-serif font-normal">perto</em> do que imaginas.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">
          Não sabemos ainda de onde virão todas as ideias. Mas acreditamos que vale a pena criar um
          espaço para as descobrir — identificando talentos, dando visibilidade a projectos e
          aproximando o público das mentes que constroem soluções para o futuro.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/candidatura"
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 bg-ink px-7 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-white transition-colors hover:bg-white hover:text-ink sm:w-auto"
          >
            Apresenta o teu projecto
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-13 w-full items-center justify-center border border-ink/30 px-7 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:bg-white/60 sm:w-auto"
          >
            Falar por WhatsApp
          </a>
        </div>

        <p className="mt-10 font-mono text-[10px] font-medium tracking-[0.2em] uppercase">
          O próximo génio pode estar no teu bairro.
        </p>
        </div>
        <div className="hidden border-l border-ink/20 p-7 lg:flex lg:col-span-3 lg:flex-col lg:justify-between">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/55">Inscrições abertas</p>
          <p className="text-3xl leading-none font-semibold tracking-[-0.05em]">Há uma ideia à tua espera.</p>
        </div>
      </div>
    </section>
  )
}

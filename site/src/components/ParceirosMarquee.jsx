import { useConteudo } from '../lib/conteudo.js'

export default function ParceirosMarquee() {
  const conteudo = useConteudo()
  const parceiros = conteudo.parceiros.logos || []
  if (!parceiros.length) return null
  return (
    <div
      className="overflow-hidden border-y border-line py-7 sm:py-9"
      role="region"
      aria-label="Parceiros do TECNATO"
    >
      <div className="animate-marquee flex w-max items-center gap-10 sm:gap-14">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center gap-10 sm:gap-14"
            aria-hidden={copy === 1}
          >
            {parceiros.map((parceiro) => (
              <div key={parceiro.nome} className="flex h-12 w-36 shrink-0 items-center justify-center px-2 sm:h-14 sm:w-44">
                <img
                  src={parceiro.logo}
                  alt={parceiro.nome}
                  loading="lazy"
                  decoding="async"
                  className="max-h-8 w-auto max-w-full object-contain grayscale transition duration-300 hover:scale-105 hover:grayscale-0 sm:max-h-10"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

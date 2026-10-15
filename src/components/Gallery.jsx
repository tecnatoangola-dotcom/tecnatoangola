const PHOTOS = [
  {
    src: '/images/oficina-tecnologica.png',
    alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica',
    caption: 'Do protótipo à oficina',
  },
  {
    src: '/images/da-ideia-ao-negocio.png',
    alt: 'Equipa TECNATO a planear a transformação de uma ideia num negócio',
    caption: 'Da ideia ao negócio',
  },
  {
    src: '/images/estrategia-equipa.png',
    alt: 'Sessão de estratégia TECNATO com apresentação de um plano de negócio',
    caption: 'Sessões de estratégia',
  },
  {
    src: '/images/arquitetos-futuro.png',
    alt: 'Jovens arquitetos da equipa TECNATO a planearem o futuro numa mesa de trabalho',
    caption: 'Planear o futuro',
  },
  {
    src: '/images/equipa_campo-do-futuro.png',
    alt: 'Equipa TECNATO reunida no Campo do Futuro',
    caption: 'Equipa no Campo do Futuro',
  },
]

function Card({ photo, duplicate }) {
  return (
    <figure
      aria-hidden={duplicate}
      className="mr-3 w-68 shrink-0 overflow-hidden border border-line bg-white sm:mr-4 sm:w-80"
    >
      <img
        src={photo.src}
        alt={duplicate ? '' : photo.alt}
        loading="lazy"
        className="h-40 w-full object-cover grayscale-[20%] transition duration-500 hover:grayscale-0 sm:h-48"
        width="1536"
        height="1024"
      />
      <figcaption className="flex justify-between px-3 py-2 font-mono text-[10px] leading-snug tracking-[0.08em] uppercase text-ink/65">
        <span>{photo.caption}</span><span>↗</span>
      </figcaption>
    </figure>
  )
}

export default function Gallery() {
  const items = [...PHOTOS, ...PHOTOS]

  return (
    <section aria-label="Galeria TECNATO" className="overflow-hidden border-b border-line bg-paper py-6">
      <div className="mx-auto mb-5 flex max-w-[1440px] items-center justify-between border-x border-line px-5 sm:px-8 lg:px-12">
        <p className="section-label text-ink/50">Em movimento / registos de campo</p>
        <p className="hidden font-mono text-[10px] tracking-[0.12em] text-ink/40 uppercase sm:block">Luanda · Angola</p>
      </div>

      <div className="group">
        <div className="animate-gallery flex w-max group-hover:[animation-play-state:paused]">
          {items.map((photo, index) => (
            <Card
              key={`${photo.src}-${index}`}
              photo={photo}
              duplicate={index >= PHOTOS.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

import { useConteudo } from '../lib/conteudo.js'

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
  const conteudo = useConteudo()
  const photos = conteudo.galeria.imagens?.length ? conteudo.galeria.imagens : []
  const items = [...photos, ...photos]

  if (!photos.length) return null

  return (
    <section aria-label="Galeria TECNATO" className="overflow-hidden border-b border-line bg-paper py-6">
      <div className="mx-auto mb-5 flex max-w-[1440px] items-center justify-between border-x border-line px-5 sm:px-8 lg:px-12">
        <p className="section-label text-ink/50">{conteudo.galeria.etiqueta}</p>
        <p className="hidden font-mono text-[10px] tracking-[0.12em] text-ink/40 uppercase sm:block">Luanda · Angola</p>
      </div>

      <div className="group">
        <div className="animate-gallery flex w-max group-hover:[animation-play-state:paused]">
          {items.map((photo, index) => (
            <Card
              key={`${photo.src}-${index}`}
              photo={photo}
              duplicate={index >= photos.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

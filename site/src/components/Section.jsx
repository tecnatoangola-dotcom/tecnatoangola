export function SectionLabel({ index, children, tone = 'light' }) {
  return (
    <p
      className={`section-label flex items-center gap-3 ${
        tone === 'dark' ? 'text-brand' : 'text-brand-deep'
      }`}
    >
      <span className="opacity-60">{index}</span>
      <span className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}

export function Section({ id, label, index, title, intro, children, tone = 'light' }) {
  const dark = tone === 'dark'

  return (
    <section id={id} className={`scroll-mt-16 ${dark ? 'bg-ink text-white' : 'border-t border-line bg-paper text-ink'}`}>
      <div className="scroll-reveal mx-auto max-w-[1440px] border-x border-line px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <SectionLabel index={index} tone={tone}>
          {label}
        </SectionLabel>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <h2 className="text-4xl leading-[0.95] font-semibold tracking-[-0.055em] sm:text-5xl lg:col-span-7 lg:text-6xl">
            {title}
          </h2>
          {intro && (
            <p
              className={`text-base leading-relaxed lg:col-span-5 lg:self-end ${
                dark ? 'text-white/70' : 'text-ink/70'
              }`}
            >
              {intro}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  )
}

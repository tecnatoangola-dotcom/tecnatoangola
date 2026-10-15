import { Section } from './Section.jsx'

const PHASES = [
  [
    'Apresentação dos candidatos',
    'As equipas apresentam-se com um vídeo de até 1 minuto e uma foto da equipa: equipa, município que pretendem representar, projecto e propósito.',
  ],
  [
    'Identificação e selecção de talentos',
    'As candidaturas são apreciadas segundo critérios oficiais, para identificar equipas e projectos com potencial de integrar a plataforma.',
  ],
  [
    'Desenvolvimento das equipas e projectos',
    'As equipas seleccionadas aperfeiçoam propostas e participam nas actividades de desenvolvimento da edição — não só a ideia, mas a execução.',
  ],
  [
    'Apresentação, debate e competição',
    'Os projectos são apresentados ao público, sujeitos a perguntas e debate. As equipas defendem as suas propostas perante a comunidade.',
  ],
  [
    'Reconhecimento dos talentos',
    'Categorias de distinção, prémios e votação serão divulgados oficialmente. Mérito transformado em reconhecimento e exposição.',
  ],
]

export default function ComoFunciona() {
  return (
    <Section
      id="como-funciona"
      index="03"
      label="Como funciona"
      title="Cinco fases, um objectivo: mostrar o que estás a construir."
      intro="Um processo organizado de apresentação, acompanhamento e competição — do primeiro vídeo ao reconhecimento final."
    >
      <ol className="mt-12 border-y border-line">
        {PHASES.map(([title, text], index) => (
          <li
            key={title}
            className="grid gap-3 border-b border-line p-6 last:border-b-0 transition-colors hover:bg-white sm:p-8 md:grid-cols-12 md:items-baseline md:gap-6"
          >
            <div className="flex items-baseline gap-3 md:col-span-3">
              <span className="font-mono text-xl font-medium text-brand-deep sm:text-2xl">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-ink/40 uppercase">
                Fase {index + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold md:col-span-4">{title}</h3>
            <p className="text-sm leading-relaxed text-ink/65 md:col-span-5">{text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

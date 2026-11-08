import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    label: 'Como funciona',
    title: 'Cinco fases, um objectivo: mostrar o que estás a construir.',
    intro:
      'Um processo organizado de apresentação, acompanhamento e competição — do primeiro vídeo ao reconhecimento final.',
    fases: [
      [
        'Apresentação dos candidatos',
        'Cada equipa envia um vídeo de até 1 minuto e uma foto da equipa: quem são, o município que pretendem representar, o projecto e o porquê.',
      ],
      [
        'Identificação e selecção de talentos',
        'As candidaturas são apreciadas segundo critérios oficiais. Equipas e projectos com potencial dão o salto e entram na plataforma.',
      ],
      [
        'Desenvolvimento das equipas e projectos',
        'Quem é seleccionado aperfeiçoa a proposta e participa nas actividades de desenvolvimento da edição — a ideia conta, a execução conta mais.',
      ],
      [
        'Apresentação, debate e competição',
        'Os projectos sobem ao palco: apresentação ao público, perguntas e debate. As equipas defendem as suas propostas perante a comunidade.',
      ],
      [
        'Reconhecimento dos talentos',
        'Categorias de distinção, prémios e votação divulgados oficialmente. Mérito transformado em reconhecimento e exposição.',
      ],
    ],
  },
  en: {
    label: 'How it works',
    title: 'Five stages, one goal: show what you are building.',
    intro:
      'An organised process of presentation, mentoring and competition — from the first video to the final recognition.',
    fases: [
      [
        'Candidates present themselves',
        'Each team sends a video of up to 1 minute and a team photo: who they are, the municipality they want to represent, the project and why.',
      ],
      [
        'Identifying and selecting talent',
        'Applications are assessed against official criteria. Teams and projects with potential move forward and join the platform.',
      ],
      [
        'Developing teams and projects',
        'Selected teams refine their proposal and take part in the edition’s development activities — the idea counts, execution counts more.',
      ],
      [
        'Presentation, debate and competition',
        'Projects take the stage: a public presentation, questions and debate. Teams defend their proposals before the community.',
      ],
      [
        'Recognising talent',
        'Award categories, prizes and voting announced officially. Merit turned into recognition and exposure.',
      ],
    ],
  },
}

export default function ComoFunciona() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="como-funciona" icone="passos" label={c.label} title={c.title} intro={c.intro}>
      <ol className="mt-12 border-y border-line">
        {c.fases.map(([title, text], index) => (
          <li
            key={title}
            className="grid gap-3 border-b border-line p-6 last:border-b-0 transition-colors hover:bg-white sm:p-8 md:grid-cols-12 md:items-baseline md:gap-6"
          >
            <div className="flex items-baseline gap-3 md:col-span-3">
              <span className="font-mono text-xl font-medium text-brand-deep sm:text-2xl">
                {String(index + 1).padStart(2, '0')}
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

import { Icone } from './Icones.jsx'
import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const ICONES_VALORES = ['pessoas', 'estrela', 'centelha', 'livro', 'escudo', 'olho']

const T = {
  pt: {
    label: 'O projecto',
    title: 'E se o próximo génio de Angola estiver no teu bairro?',
    intro:
      'Em cada bairro, musseque, município, escola ou universidade existem jovens com capacidades extraordinárias — mas poucos têm um palco para as mostrar. O TECNATO nasce para mudar isso.',
    blocos: [
      {
        etiqueta: 'A / Porque existe',
        titulo: 'O problema',
        texto:
          'Muitos talentos e projectos permanecem limitados à sua comunidade porque nunca encontraram uma plataforma capaz de lhes dar visibilidade. Potencial ignorado por origem, condição social ou percurso académico.',
      },
      {
        etiqueta: 'B / A resposta',
        titulo: 'O que é o TECNATO',
        texto:
          'Uma plataforma de talentos, projectos, competição e entretenimento educativo. Aqui o talento não se limita à arte: inclui criar empresa, inventar, investigar, organizar equipas e resolver problemas.',
      },
      {
        etiqueta: 'C / O compromisso',
        titulo: 'A missão',
        texto:
          'Identificar, valorizar e dar visibilidade aos talentos de Angola, promovendo a apresentação de projectos, o confronto construtivo de ideias e a valorização de soluções com potencial de impacto.',
      },
    ],
    valoresLabel: 'Os nossos valores',
    valores: [
      ['Inclusão', 'O talento pode surgir em qualquer contexto social ou educativo.'],
      ['Mérito', 'Valorizamos capacidades demonstradas, projectos de qualidade e o trabalho das equipas.'],
      ['Inovação', 'Incentivamos novas formas de pensar, criar e resolver problemas.'],
      ['Aprendizagem', 'A troca de conhecimentos e o debate construtivo geram melhores ideias.'],
      ['Responsabilidade', 'Valorizamos projectos que respondem a necessidades reais e criam benefícios.'],
      ['Integridade', 'Transparência, respeito, critérios claros e credibilidade na condução da plataforma.'],
    ],
  },
  en: {
    label: 'The project',
    title: 'What if Angola’s next genius lives in your neighbourhood?',
    intro:
      'In every neighbourhood, municipality, school or university there are young people with extraordinary abilities — but few have a stage to show them. TECNATO was born to change that.',
    blocos: [
      {
        etiqueta: 'A / Why it exists',
        titulo: 'The problem',
        texto:
          'Many talents and projects stay limited to their own community because they never found a platform able to give them visibility. Potential ignored because of origin, social condition or academic path.',
      },
      {
        etiqueta: 'B / The answer',
        titulo: 'What TECNATO is',
        texto:
          'A platform for talent, projects, competition and educational entertainment. Here talent is not limited to art: it includes building companies, inventing, researching, organising teams and solving problems.',
      },
      {
        etiqueta: 'C / The commitment',
        titulo: 'The mission',
        texto:
          'To identify, value and give visibility to Angola’s talents, promoting the presentation of projects, the constructive clash of ideas and the value of solutions with impact potential.',
      },
    ],
    valoresLabel: 'Our values',
    valores: [
      ['Inclusion', 'Talent can emerge in any social or educational context.'],
      ['Merit', 'We value demonstrated ability, quality projects and the work of teams.'],
      ['Innovation', 'We encourage new ways of thinking, creating and solving problems.'],
      ['Learning', 'Sharing knowledge and constructive debate generate better ideas.'],
      ['Responsibility', 'We value projects that respond to real needs and create benefits.'],
      ['Integrity', 'Transparency, respect, clear criteria and credibility in running the platform.'],
    ],
  },
}

export default function Projecto() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="projecto" icone="alvo" label={c.label} title={c.title} intro={c.intro}>
      <div className="mt-12 grid border border-line md:grid-cols-3">
        {c.blocos.map((bloco, index) => (
          <article
            key={bloco.titulo}
            className={`p-6 sm:p-8 ${
              index < c.blocos.length - 1
                ? 'border-b border-line md:border-r md:border-b-0'
                : ''
            }`}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-deep">
              {bloco.etiqueta}
            </p>
            <h3 className="mt-8 text-xl font-semibold">{bloco.titulo}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{bloco.texto}</p>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <p className="section-label text-ink/50">{c.valoresLabel}</p>
        <ul className="mt-5 grid border-y border-line sm:grid-cols-2 lg:grid-cols-3">
          {c.valores.map(([title, text], index) => (
            <li key={title} className="border-r border-b border-line p-6 last:border-b-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0">
              <div className="flex items-center gap-3">
                <Icone nome={ICONES_VALORES[index]} className="h-4 w-4 shrink-0 text-brand-deep" />
                <h3 className="text-base font-semibold">{title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

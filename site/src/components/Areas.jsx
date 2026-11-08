import { Icone } from './Icones.jsx'
import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const ICONES_AREAS = ['maleta', 'frasco', 'chip', 'crescente', 'coracao', 'engrenagem']

const T = {
  pt: {
    label: 'Que projectos procuramos',
    title: 'Os problemas da sociedade são diversos. As soluções também.',
    intro:
      'Não limitamos o potencial a uma lista de áreas. Se o teu projecto resolve um problema, gera benefícios ou cria valor, apresenta-o na mesma.',
    areas: [
      [
        'Gestão e Administração',
        'Projectos que melhorem a organização de empresas, equipas, instituições, serviços ou actividades económicas.',
      ],
      [
        'Ciência e Investigação',
        'Iniciativas que investiguem fenómenos, explorem conhecimentos ou proponham respostas fundamentadas.',
      ],
      [
        'Tecnologia e Inovação',
        'Aplicações, dispositivos, sistemas e protótipos que usem criatividade ou tecnologia para responder a necessidades.',
      ],
      [
        'Empreendedorismo e Negócios',
        'Startups e ideias empresariais orientadas para criar valor, prestar serviços e explorar oportunidades de mercado.',
      ],
      [
        'Impacto Social e Comunitário',
        'Iniciativas que procurem melhorar condições de vida, responder a problemas comunitários ou gerar benefícios sociais.',
      ],
      [
        'Invenções e Criações Próprias',
        'Mecanismos, equipamentos, métodos e ferramentas desenvolvidos pelas próprias equipas.',
      ],
    ],
    outras: 'Outras áreas',
    outrasTexto:
      'Não enquadras o teu projecto nas categorias anteriores? Apresenta-o na mesma. Queremos conhecer aquilo que os talentos de Angola são capazes de criar.',
  },
  en: {
    label: 'The projects we look for',
    title: 'Society’s problems are many. So are the solutions.',
    intro:
      'We do not limit potential to a list of fields. If your project solves a problem, creates benefits or generates value, submit it anyway.',
    areas: [
      [
        'Management and Administration',
        'Projects that improve how companies, teams, institutions, services or economic activities are organised.',
      ],
      [
        'Science and Research',
        'Initiatives that investigate phenomena, explore knowledge or propose evidence-based answers.',
      ],
      [
        'Technology and Innovation',
        'Applications, devices, systems and prototypes that use creativity or technology to meet needs.',
      ],
      [
        'Entrepreneurship and Business',
        'Startups and business ideas aimed at creating value, delivering services and seizing market opportunities.',
      ],
      [
        'Social and Community Impact',
        'Initiatives that seek to improve living conditions, respond to community problems or generate social benefit.',
      ],
      [
        'Inventions and Original Creations',
        'Mechanisms, equipment, methods and tools developed by the teams themselves.',
      ],
    ],
    outras: 'Other fields',
    outrasTexto:
      'Does your project not fit the categories above? Submit it anyway. We want to see what Angola’s talents are capable of creating.',
  },
}

export default function Areas() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="areas" icone="areas" label={c.label} title={c.title} intro={c.intro}>
      <div className="mt-12 grid border border-line md:grid-cols-2 lg:grid-cols-3">
        {c.areas.map(([title, text], index) => (
          <article key={title} className="group border-r border-b border-line p-6 transition-colors hover:bg-brand sm:p-7 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0">
            <Icone nome={ICONES_AREAS[index]} className="h-4 w-4 shrink-0 text-brand-deep" />
            <h3 className="mt-4 text-lg leading-snug font-semibold">{title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{text}</p>
          </article>
        ))}
        <article className="bg-brand p-6 sm:p-7">
          <Icone nome="estrela" className="h-4 w-4 text-ink/50" />
          <h3 className="mt-4 text-lg leading-snug font-semibold">{c.outras}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/75">{c.outrasTexto}</p>
        </article>
      </div>
    </Section>
  )
}

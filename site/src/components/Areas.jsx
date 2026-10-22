import { Icone } from './Icones.jsx'
import { Section } from './Section.jsx'

const AREAS = [
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
]

const ICONES_AREAS = ['maleta', 'frasco', 'chip', 'crescente', 'coracao', 'engrenagem']

export default function Areas() {
  return (
    <Section
      id="areas"
      icone="areas"
      label="Que projectos procuramos"
      title="Os problemas da sociedade são diversos. As soluções também."
      intro="Não limitamos o potencial a uma lista de áreas. Se o teu projecto resolve um problema, gera benefícios ou cria valor, apresenta-o na mesma."
    >
      <div className="mt-12 grid border border-line md:grid-cols-2 lg:grid-cols-3">
        {AREAS.map(([title, text], index) => (
          <article key={title} className="group border-r border-b border-line p-6 transition-colors hover:bg-brand sm:p-7 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0">
            <Icone nome={ICONES_AREAS[index]} className="h-4 w-4 shrink-0 text-brand-deep" />
            <h3 className="mt-4 text-lg leading-snug font-semibold">{title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{text}</p>
          </article>
        ))}
        <article className="bg-brand p-6 sm:p-7">
          <Icone nome="estrela" className="h-4 w-4 text-ink/50" />
          <h3 className="mt-4 text-lg leading-snug font-semibold">Outras áreas</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/75">
            Não enquadras o teu projecto nas categorias anteriores? Apresenta-o na mesma. Queremos
            conhecer aquilo que os talentos de Angola são capazes de criar.
          </p>
        </article>
      </div>
    </Section>
  )
}

import { Section } from './Section.jsx'

const IMPACT = [
  'Dar maior visibilidade aos talentos jovens de diferentes realidades',
  'Incentivar a apresentação de projectos e iniciativas',
  'Promover o interesse por Gestão, Ciência, Administração, Inovação e Empreendedorismo',
  'Estimular a criatividade e a procura de soluções para problemas concretos',
  'Valorizar a colaboração, a liderança e a capacidade de execução',
  'Aproximar o público de projectos que merecem ser conhecidos',
  'Promover uma cultura de reconhecimento do mérito e da aprendizagem',
  'Crescer de Luanda para outras províncias de Angola',
]

export default function Impacto() {
  return (
    <Section
      id="impacto"
      index="05"
      label="O impacto"
      tone="dark"
      title="Luanda é o começo. Angola é o horizonte."
      intro="O talento não existe apenas nos lugares onde é mais visível. Existe em comunidades com poucos recursos, em oficinas, em salas de aula e em quem aprendeu a criar soluções através da experiência."
    >
      <ul className="mt-12 grid border border-white/15 sm:grid-cols-2">
        {IMPACT.map((item, index) => (
          <li key={item} className="flex items-start gap-4 border-r border-b border-white/15 p-5 last:border-b-0 sm:p-6">
            <span className="font-mono text-[10px] font-medium tracking-wider text-brand">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-sm leading-relaxed text-white/75">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 border-y border-white/15 py-8 sm:py-12">
        <p className="text-4xl leading-[0.95] font-semibold tracking-[-0.05em] sm:text-5xl">
          Dos bairros aos <em className="editorial-serif font-normal">musseques.</em> Das ruas às universidades.
          <span className="text-brand"> De Luanda para Angola.</span>
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
          Não se trata apenas de encontrar os projectos mais conhecidos. Trata-se de criar condições
          para descobrir aqueles que ainda não tiveram a oportunidade de mostrar o que sabem fazer.
        </p>
      </div>
    </Section>
  )
}

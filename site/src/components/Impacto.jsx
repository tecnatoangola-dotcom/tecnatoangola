import { Icone } from './Icones.jsx'
import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    label: 'O impacto',
    title: 'Luanda é o começo. Angola é o horizonte.',
    intro:
      'O talento não existe apenas nos lugares onde é mais visível. Existe em comunidades com poucos recursos, em oficinas, em salas de aula e em quem aprendeu a criar soluções através da experiência.',
    itens: [
      'Dar maior visibilidade aos talentos jovens de diferentes realidades',
      'Incentivar a apresentação de projectos e iniciativas',
      'Promover o interesse por Gestão, Ciência, Administração, Inovação e Empreendedorismo',
      'Estimular a criatividade e a procura de soluções para problemas concretos',
      'Valorizar a colaboração, a liderança e a capacidade de execução',
      'Aproximar o público de projectos que merecem ser conhecidos',
      'Promover uma cultura de reconhecimento do mérito e da aprendizagem',
      'Crescer de Luanda para outras províncias de Angola',
    ],
    frase1: 'Dos bairros aos ',
    frase2: '. Das ruas às universidades.',
    frase3: ' De Luanda para Angola.',
    musseques: 'musseques',
    nota:
      'Não se trata apenas de encontrar os projectos mais conhecidos. Trata-se de criar condições para descobrir aqueles que ainda não tiveram a oportunidade de mostrar o que sabem fazer.',
  },
  en: {
    label: 'The impact',
    title: 'Luanda is the beginning. Angola is the horizon.',
    intro:
      'Talent does not only exist where it is most visible. It exists in low-resource communities, in workshops, in classrooms and in those who learned to create solutions through experience.',
    itens: [
      'Give greater visibility to young talents from different realities',
      'Encourage the presentation of projects and initiatives',
      'Promote interest in Management, Science, Administration, Innovation and Entrepreneurship',
      'Stimulate creativity and the search for solutions to concrete problems',
      'Value collaboration, leadership and the ability to execute',
      'Bring the public closer to projects that deserve to be known',
      'Promote a culture that recognises merit and learning',
      'Grow from Luanda to other provinces of Angola',
    ],
    frase1: 'From the neighbourhoods ',
    frase2: ' to the musseques. From the streets to the universities.',
    frase3: ' From Luanda to Angola.',
    musseques: 'musseques',
    nota:
      'It is not only about finding the best-known projects. It is about creating the conditions to discover those who have not yet had the chance to show what they can do.',
  },
}

export default function Impacto() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="impacto" icone="centelha" label={c.label} tone="dark" title={c.title} intro={c.intro}>
      <ul className="mt-12 grid border border-white/15 sm:grid-cols-2">
        {c.itens.map((item) => (
          <li key={item} className="flex items-start gap-4 border-r border-b border-white/15 p-5 last:border-b-0 sm:p-6">
            <Icone nome="centelha" className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
            <span className="text-sm leading-relaxed text-white/75">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 border-y border-white/15 py-8 sm:py-12">
        <p className="text-4xl leading-[0.95] font-semibold tracking-[-0.05em] sm:text-5xl">
          {c.frase1}
          <em className="editorial-serif font-normal">{c.musseques}</em>
          {c.frase2}
          <span className="text-brand">{c.frase3}</span>
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">{c.nota}</p>
      </div>
    </Section>
  )
}

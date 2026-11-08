import { Icone } from './Icones.jsx'
import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const ICONES_BENEFITS = ['olho', 'passos', 'livro', 'estrela', 'crescente', 'globo', 'coracao', 'centelha']

const T = {
  pt: {
    label: 'Quem pode participar',
    title: 'Se tens uma equipa e algo relevante para mostrar, queremos conhecer o teu trabalho.',
    intro:
      'Não precisa de ser uma grande empresa nem estar totalmente desenvolvido. Basta uma equipa, uma proposta identificável e vontade de apresentar o trabalho com clareza.',
    quemLabel: 'Podes participar se…',
    quem: [
      'Grupos formalmente constituídos',
      'Equipas informais a trabalhar numa ideia',
      'Startups em fase inicial ou em actividade',
      'Projectos científicos ou tecnológicos',
      'Iniciativas empresariais ou empreendedoras',
      'Projectos de carácter social ou comunitário',
      'Grupos com invenções ou criações próprias',
      'Iniciativas noutras áreas com potencial',
    ],
    ganhosLabel: 'O que ganas ao participar',
    ganhos: [
      ['Visibilidade', 'Dá a conhecer a tua equipa, projecto e município através dos canais do TECNATO.'],
      ['Experiência', 'Aprende a explicar uma ideia, defender uma proposta e responder a perguntas.'],
      ['Aprendizagem', 'Beneficia do contacto com diferentes ideias, perspectivas e formas de resolver problemas.'],
      ['Reconhecimento', 'Demonstra as tuas capacidades perante o público e os mecanismos de avaliação.'],
      ['Evolução', 'Participa numa experiência orientada para a análise e evolução das propostas.'],
      ['Rede', 'Aumenta a exposição do teu trabalho e cria novas oportunidades de contacto.'],
      ['Orgulho', 'Contribui para mostrar que o talento existe em diferentes comunidades de Luanda.'],
      ['Entretenimento', 'Acompanha debates e conteúdos que despertam curiosidade e pensamento crítico.'],
    ],
    nota:
      'Os benefícios dependem do formato e das oportunidades disponibilizadas em cada edição. A participação não garante financiamento, emprego, investimento ou sucesso comercial — garante o compromisso de valorizar o teu talento e os teus projectos.',
  },
  en: {
    label: 'Who can take part',
    title: 'If you have a team and something relevant to show, we want to know your work.',
    intro:
      'It does not need to be a large company or fully developed. A team, an identifiable proposal and the will to present your work clearly are enough.',
    quemLabel: 'You can take part if…',
    quem: [
      'Formally registered groups',
      'Informal teams working on an idea',
      'Early-stage or active startups',
      'Scientific or technological projects',
      'Business or entrepreneurial initiatives',
      'Social or community projects',
      'Groups with their own inventions or creations',
      'Initiatives in other fields with potential',
    ],
    ganhosLabel: 'What you gain by taking part',
    ganhos: [
      ['Visibility', 'Show your team, project and municipality through TECNATO’s channels.'],
      ['Experience', 'Learn to explain an idea, defend a proposal and answer questions.'],
      ['Learning', 'Benefit from contact with different ideas, perspectives and ways of solving problems.'],
      ['Recognition', 'Demonstrate your abilities before the public and the assessment process.'],
      ['Growth', 'Take part in an experience focused on analysing and improving proposals.'],
      ['Network', 'Increase the exposure of your work and create new contacts.'],
      ['Pride', 'Help show that talent exists in different communities of Luanda.'],
      ['Entertainment', 'Follow debates and content that spark curiosity and critical thinking.'],
    ],
    nota:
      'Benefits depend on the format and opportunities available in each edition. Taking part does not guarantee funding, employment, investment or commercial success — it guarantees our commitment to value your talent and your projects.',
  },
}

export default function Participar() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="participar" icone="megafone" label={c.label} title={c.title} intro={c.intro}>
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="section-label text-ink/50">{c.quemLabel}</p>
          <ul className="mt-5 border-t border-line">
            {c.quem.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-line py-3.5 text-sm text-ink/75">
                <Icone nome="visto" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-deep" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <p className="section-label text-ink/50">{c.ganhosLabel}</p>
          <ul className="mt-5 grid border border-line sm:grid-cols-2">
            {c.ganhos.map(([title, text], index) => (
              <li key={title} className="border-r border-b border-line p-5 sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-child(n+7)]:border-b-0">
                <Icone nome={ICONES_BENEFITS[index]} className="h-4 w-4 shrink-0 text-brand-deep" />
                <h3 className="mt-3 text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">{c.nota}</p>
        </div>
      </div>
    </Section>
  )
}

import { Section } from './Section.jsx'

const WHO = [
  'Grupos formalmente constituídos',
  'Equipas informais a trabalhar numa ideia',
  'Startups em fase inicial ou em actividade',
  'Projectos científicos ou tecnológicos',
  'Iniciativas empresariais ou empreendedoras',
  'Projectos de carácter social ou comunitário',
  'Grupos com invenções ou criações próprias',
  'Iniciativas noutras áreas com potencial',
]

const BENEFITS = [
  ['Visibilidade', 'Dá a conhecer a tua equipa, projecto e município através dos canais do TECNATO.'],
  ['Experiência', 'Aprende a explicar uma ideia, defender uma proposta e responder a perguntas.'],
  ['Aprendizagem', 'Beneficia do contacto com diferentes ideias, perspectivas e formas de resolver problemas.'],
  ['Reconhecimento', 'Demonstra as tuas capacidades perante o público e os mecanismos de avaliação.'],
  ['Evolução', 'Participa numa experiência orientada para a análise e evolução das propostas.'],
  ['Rede', 'Aumenta a exposição do teu trabalho e cria novas oportunidades de contacto.'],
  ['Orgulho', 'Contribui para mostrar que o talento existe em diferentes comunidades de Luanda.'],
  ['Entretenimento', 'Acompanha debates e conteúdos que despertam curiosidade e pensamento crítico.'],
]

export default function Participar() {
  return (
    <Section
      id="participar"
      index="04"
      label="Quem pode participar"
      title="Se tens uma equipa e algo relevante para mostrar, queremos conhecer o teu trabalho."
      intro="Não precisa de ser uma grande empresa nem estar totalmente desenvolvido. Basta uma equipa, uma proposta identificável e vontade de apresentar o trabalho com clareza."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="section-label text-ink/50">Podes participar se…</p>
          <ul className="mt-5 border-t border-line">
            {WHO.map((item, index) => (
              <li key={item} className="flex items-start gap-3 border-b border-line py-3.5 text-sm text-ink/75">
                <span className="font-mono text-[10px] tracking-wider text-brand-deep">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <p className="section-label text-ink/50">O que ganas ao participar</p>
          <ul className="mt-5 grid border border-line sm:grid-cols-2">
            {BENEFITS.map(([title, text], index) => (
              <li key={title} className="border-r border-b border-line p-5 sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-child(n+7)]:border-b-0">
                <span className="font-mono text-[10px] tracking-wider text-brand-deep">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            Os benefícios dependem do formato e das oportunidades disponibilizadas em cada edição. A
            participação não garante financiamento, emprego, investimento ou sucesso comercial —
            garante o compromisso de valorizar o teu talento e os teus projectos.
          </p>
        </div>
      </div>
    </Section>
  )
}

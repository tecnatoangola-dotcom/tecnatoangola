import { Section } from './Section.jsx'

const VALUES = [
  ['Inclusão', 'O talento pode surgir em qualquer contexto social ou educativo.'],
  ['Mérito', 'Valorizamos capacidades demonstradas, projectos de qualidade e o trabalho das equipas.'],
  ['Inovação', 'Incentivamos novas formas de pensar, criar e resolver problemas.'],
  ['Aprendizagem', 'A troca de conhecimentos e o debate construtivo geram melhores ideias.'],
  ['Responsabilidade', 'Valorizamos projectos que respondem a necessidades reais e criam benefícios.'],
  ['Integridade', 'Transparência, respeito, critérios claros e credibilidade na condução da plataforma.'],
]

export default function Projecto() {
  return (
    <Section
      id="projecto"
      index="01"
      label="O projecto"
      title="E se o próximo génio de Angola estiver no teu bairro?"
      intro="Em cada bairro, musseque, município, escola ou universidade existem jovens com capacidades extraordinárias — mas poucos têm um palco para as mostrar. O TECNATO nasce para mudar isso."
    >
      <div className="mt-12 grid border border-line md:grid-cols-3">
        <article className="border-b border-line p-6 last:border-b-0 md:border-r md:border-b-0 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-deep">A / Porque existe</p>
          <h3 className="mt-8 text-xl font-semibold">O problema</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Muitos talentos e projectos permanecem limitados à sua comunidade porque nunca
            encontraram uma plataforma capaz de lhes dar visibilidade. Potencial ignorado por
            origem, condição social ou percurso académico.
          </p>
        </article>
        <article className="border-b border-line p-6 last:border-b-0 md:border-r md:border-b-0 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-deep">B / A resposta</p>
          <h3 className="mt-8 text-xl font-semibold">O que é o TECNATO</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Uma plataforma de talentos, projectos, competição e entretenimento educativo. Aqui o
            talento não se limita à arte: inclui criar empresa, inventar, investigar, organizar
            equipas e resolver problemas.
          </p>
        </article>
        <article className="p-6 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-deep">C / O compromisso</p>
          <h3 className="mt-8 text-xl font-semibold">A missão</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Identificar, valorizar e dar visibilidade aos talentos de Angola, promovendo a
            apresentação de projectos, o confronto construtivo de ideias e a valorização de soluções
            com potencial de impacto.
          </p>
        </article>
      </div>

      <div className="mt-14">
        <p className="section-label text-ink/50">Os nossos valores</p>
        <ul className="mt-5 grid border-y border-line sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(([title, text], index) => (
            <li key={title} className="border-r border-b border-line p-6 last:border-b-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] font-medium tracking-wider text-brand-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
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

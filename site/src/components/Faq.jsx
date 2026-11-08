import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    label: 'Perguntas frequentes',
    title: 'Tudo o que precisas de saber antes de te candidatares.',
    intro: 'Respostas directas às dúvidas mais comuns das equipas que querem fazer parte do TECNATO.',
    faqs: [
      [
        'O que é o TECNATO?',
        'É uma plataforma de talentos, projectos, competição e entretenimento educativo que pretende identificar e dar visibilidade a jovens com capacidades extraordinárias e equipas que desenvolvem iniciativas com potencial.',
      ],
      [
        'O TECNATO é apenas para estudantes universitários?',
        'Não. A proposta é inclusiva e procura valorizar talentos de diferentes percursos educativos e realidades sociais. Os requisitos específicos serão definidos e divulgados pela organização.',
      ],
      [
        'Preciso de ter uma empresa formalmente constituída?',
        'Não necessariamente. Podem apresentar-se grupos formais ou informais com projectos ou iniciativas. As condições de elegibilidade de cada edição serão comunicadas oficialmente.',
      ],
      [
        'O meu projecto precisa de estar totalmente desenvolvido?',
        'Não. Podes apresentar uma iniciativa em fase inicial, desde que expliques claramente a proposta, a equipa, o problema que pretendes resolver e o potencial do projecto.',
      ],
      [
        'Que áreas são aceites?',
        'Gestão, Administração, Ciência, Tecnologia, Inovação, Empreendedorismo, áreas sociais e outras áreas relevantes. A proposta não se limita a uma única profissão ou disciplina.',
      ],
      [
        'Posso participar individualmente?',
        'A candidatura descrita é dirigida a equipas, formais ou informais. Se tens uma ideia e ainda não tens equipa, acompanha os canais oficiais para futuras orientações e oportunidades.',
      ],
      [
        'Como faço a candidatura?',
        'Entra na página de candidatura do TECNATO, escolhe enviar na plataforma ou por WhatsApp e envia o vídeo de até 1 minuto e a foto da equipa — ambos são obrigatórios. Na plataforma, os ficheiros ficam guardados na nossa nuvem e recebes um código de referência no fim.',
      ],
      [
        'O envio do vídeo garante a minha participação?',
        'Não. O envio corresponde à apresentação da candidatura. A participação depende da análise e selecção segundo os procedimentos definidos pela organização.',
      ],
      [
        'Existem prémios ou financiamento para os projectos?',
        'Quaisquer prémios, fundos, apoios ou oportunidades serão anunciados oficialmente quando confirmados. Não deves assumir que a candidatura garante financiamento ou investimento.',
      ],
    ],
  },
  en: {
    label: 'Frequently asked questions',
    title: 'Everything you need to know before applying.',
    intro: 'Direct answers to the most common questions from teams that want to join TECNATO.',
    faqs: [
      [
        'What is TECNATO?',
        'It is a platform for talent, projects, competition and educational entertainment that aims to identify and give visibility to young people with extraordinary abilities and to teams developing initiatives with potential.',
      ],
      [
        'Is TECNATO only for university students?',
        'No. The proposal is inclusive and seeks to value talent from different educational paths and social realities. Specific requirements will be defined and announced by the organisation.',
      ],
      [
        'Do I need a formally registered company?',
        'Not necessarily. Formal or informal groups with projects or initiatives may apply. Eligibility conditions for each edition will be announced officially.',
      ],
      [
        'Does my project need to be fully developed?',
        'No. You can present an initiative at an early stage, as long as you clearly explain the proposal, the team, the problem you intend to solve and the project’s potential.',
      ],
      [
        'Which fields are accepted?',
        'Management, Administration, Science, Technology, Innovation, Entrepreneurship, social fields and other relevant areas. The proposal is not limited to a single profession or discipline.',
      ],
      [
        'Can I take part individually?',
        'The application described is aimed at teams, formal or informal. If you have an idea and no team yet, follow the official channels for future guidance and opportunities.',
      ],
      [
        'How do I apply?',
        'Go to the TECNATO application page, choose to send it on the platform or via WhatsApp, and send the video of up to 1 minute and the team photo — both are required. On the platform, files are stored in our cloud and you receive a reference code at the end.',
      ],
      [
        'Does sending the video guarantee my participation?',
        'No. Sending it corresponds to submitting the application. Participation depends on assessment and selection according to the procedures defined by the organisation.',
      ],
      [
        'Are there prizes or funding for the projects?',
        'Any prizes, funds, support or opportunities will be announced officially once confirmed. You should not assume that applying guarantees funding or investment.',
      ],
    ],
  },
}

export default function Faq() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="faq" icone="interro" label={c.label} title={c.title} intro={c.intro}>
      <div className="mt-12 grid border-t border-l border-line md:grid-cols-2">
        {c.faqs.map(([question, answer]) => (
          <details
            key={question}
            className="group border-r border-b border-line bg-paper p-5 open:bg-white sm:p-6"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-0.5 text-sm font-semibold">
              {question}
              <span
                aria-hidden="true"
                className="mt-0.5 font-mono text-lg leading-none text-brand-deep transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

import { Section } from './Section.jsx'

const FAQS = [
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
]

export default function Faq() {
  return (
    <Section
      id="faq"
      icone="interro"
      label="Perguntas frequentes"
      title="Tudo o que precisas de saber antes de te candidatares."
      intro="Respostas directas às dúvidas mais comuns das equipas que querem fazer parte do TECNATO."
    >
      <div className="mt-12 grid border-t border-l border-line md:grid-cols-2">
        {FAQS.map(([question, answer]) => (
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

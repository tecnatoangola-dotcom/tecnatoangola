import { Link } from 'react-router-dom'
import { whatsappUrl } from '../constants.js'
import { Section } from './Section.jsx'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    label: 'Candidatura',
    title: 'Tens um projecto? Este convite é para ti.',
    intro:
      'Não esperes que o teu projecto esteja presente em todo o lado para começares a falar dele. Prepara uma apresentação clara e mostra-nos o teu trabalho.',
    passos: [
      ['Reúne a tua equipa', 'Identifica os membros do grupo e prepara uma apresentação conjunta.'],
      [
        'Prepara o vídeo e a foto',
        'Grava um vídeo com duração máxima de 1 minuto e escolhe uma foto da equipa — ambos são obrigatórios.',
      ],
      [
        'Apresenta os elementos essenciais',
        'Equipa e membros · município de Luanda que representas · nome do projecto · o que pretende fazer · problema a resolver · solução e benefícios · estado actual e próximos passos · porquê TECNATO.',
      ],
      [
        'Envia o vídeo e a foto',
        'Usa a página de candidatura do TECNATO: os ficheiros são enviados directamente para a nossa nuvem, com confirmação imediata.',
      ],
      [
        'Acompanha as comunicações oficiais',
        'Segue os canais do TECNATO para prazos, critérios de selecção e próximas etapas.',
      ],
    ],
    asideLabel: 'A tua candidatura',
    asideTexto: 'Não precisas de esperar pelo projecto perfeito. Precisas de começar a mostrá-lo.',
    cta: 'Enviar o meu vídeo agora',
    whatsapp: 'Prefiro enviar por WhatsApp',
    nota:
      'Nota: a candidatura deve respeitar os requisitos e prazos oficialmente comunicados. O envio do vídeo não significa selecção automática para a competição.',
  },
  en: {
    label: 'Application',
    title: 'Have a project? This invitation is for you.',
    intro:
      'Do not wait for your project to be everywhere before you start talking about it. Prepare a clear presentation and show us your work.',
    passos: [
      ['Gather your team', 'Identify the group members and prepare a joint presentation.'],
      [
        'Prepare the video and photo',
        'Record a video of up to 1 minute and choose a team photo — both are required.',
      ],
      [
        'Present the essentials',
        'Team and members · Luanda municipality you represent · project name · what you intend to do · problem to solve · solution and benefits · current stage and next steps · why TECNATO.',
      ],
      [
        'Send the video and photo',
        'Use the TECNATO application page: files are uploaded directly to our cloud with immediate confirmation.',
      ],
      [
        'Follow official communications',
        'Follow TECNATO’s channels for deadlines, selection criteria and next steps.',
      ],
    ],
    asideLabel: 'Your application',
    asideTexto: 'You do not need to wait for the perfect project. You need to start showing it.',
    cta: 'Send my video now',
    whatsapp: 'I prefer to send via WhatsApp',
    nota:
      'Note: applications must meet the officially announced requirements and deadlines. Sending a video does not mean automatic selection for the competition.',
  },
}

export default function Candidatura() {
  const { lang } = useIdioma()
  const c = T[lang]

  return (
    <Section id="candidatura" icone="documento" label={c.label} title={c.title} intro={c.intro}>
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <ol className="border-t border-line lg:col-span-8">
          {c.passos.map(([title, text], index) => (
            <li key={title} className="grid gap-4 border-b border-line py-6 sm:py-7 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-2">
                <span className="font-mono text-lg font-medium text-brand-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-10">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="border-l-2 border-brand pl-5 lg:col-span-4 lg:pt-2">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/50">{c.asideLabel}</p>
          <p className="mt-4 text-2xl leading-[1.05] font-medium tracking-[-0.04em]">{c.asideTexto}</p>
          <Link
            to="/candidatura"
            className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 bg-ink px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-white transition-colors hover:bg-brand hover:text-ink"
          >
            {c.cta}
            <span aria-hidden="true">→</span>
          </Link>

          <a href={whatsappUrl(lang)} target="_blank" rel="noreferrer" className="mt-3 flex min-h-13 w-full items-center justify-center border border-ink/25 px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:border-ink">{c.whatsapp}</a>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">{c.nota}</p>
        </aside>
      </div>
    </Section>
  )
}

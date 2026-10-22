import { Link } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants.js'
import { Section } from './Section.jsx'

const STEPS = [
  [
    'Reúne a tua equipa',
    'Identifica os membros do grupo e prepara uma apresentação conjunta.',
  ],
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
]

export default function Candidatura() {
  return (
    <Section
      id="candidatura"
      icone="documento"
      label="Candidatura"
      title="Tens um projecto? Este convite é para ti."
      intro="Não esperes que o teu projecto esteja presente em todo o lado para começares a falar dele. Prepara uma apresentação clara e mostra-nos o teu trabalho."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <ol className="border-t border-line lg:col-span-8">
          {STEPS.map(([title, text], index) => (
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
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/50">A tua candidatura</p>
          <p className="mt-4 text-2xl leading-[1.05] font-medium tracking-[-0.04em]">Não precisas de esperar pelo projecto perfeito. Precisas de começar a mostrá-lo.</p>
          <Link
            to="/candidatura"
            className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 bg-ink px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-white transition-colors hover:bg-brand hover:text-ink"
          >
            Enviar o meu vídeo agora
            <span aria-hidden="true">→</span>
          </Link>

          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-3 flex min-h-13 w-full items-center justify-center border border-ink/25 px-6 py-4 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:border-ink">Prefiro enviar por WhatsApp</a>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
          Nota: a candidatura deve respeitar os requisitos e prazos oficialmente comunicados. O
          envio do vídeo não significa selecção automática para a competição.
          </p>
        </aside>
      </div>
    </Section>
  )
}

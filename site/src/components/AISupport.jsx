import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useConteudo } from '../lib/conteudo.js'
import { whatsappUrl } from '../constants.js'
import { useIdioma } from '../i18n/idioma.jsx'

const T = {
  pt: {
    tu: 'Tu',
    falarWhatsapp: 'Falar por WhatsApp',
    verImagem: 'Ver imagem',
    imagemTecnato: 'Imagem do TECNATO',
    fecharImagem: 'Fechar imagem',
    abrirTecnocrata: 'Abrir Tecnocrata',
    fecharTecnocrata: 'Fechar Tecnocrata',
    indisponivel: 'Tecnocrata indisponível',
    assistenteOnline: 'Assistente do TECNATO • online',
    expandirChat: 'Expandir chat',
    minimizarChat: 'Minimizar chat',
    fecharChat: 'Fechar chat',
    vindasInicio: 'Olá! Sou o ',
    vindasFim: ', o assistente do TECNATO. Como posso ajudar-te hoje?',
    sugestoes: [
      'Como faço uma candidatura?',
      'Quais são as áreas disponíveis?',
      'Quem são os fundadores?',
      'Como funciona o processo?',
    ],
    verImagensDisponiveis: 'Ver imagens disponíveis',
    verImagensTecnato: 'Ver imagens TECNATO',
    placeholder: 'Escreve a tua pergunta...',
    mensagemPara: 'Mensagem para o Tecnocrata',
    enviarMensagem: 'Enviar mensagem',
    erroProcessar: 'Desculpa, não consegui processar a tua mensagem.',
    erroContacto:
      'Peço desculpa, não consegui contactar o Tecnocrata neste momento. Tenta novamente daqui a instantes ou fala connosco por WhatsApp.',
  },
  en: {
    tu: 'You',
    falarWhatsapp: 'Chat on WhatsApp',
    verImagem: 'View image',
    imagemTecnato: 'TECNATO image',
    fecharImagem: 'Close image',
    abrirTecnocrata: 'Open Tecnocrata',
    fecharTecnocrata: 'Close Tecnocrata',
    indisponivel: 'Tecnocrata unavailable',
    assistenteOnline: 'TECNATO assistant • online',
    expandirChat: 'Expand chat',
    minimizarChat: 'Minimize chat',
    fecharChat: 'Close chat',
    vindasInicio: "Hi! I'm ",
    vindasFim: ", TECNATO's assistant. How can I help you today?",
    sugestoes: [
      'How do I apply?',
      'Which fields are available?',
      'Who are the founders?',
      'How does the process work?',
    ],
    verImagensDisponiveis: 'View available images',
    verImagensTecnato: 'View TECNATO images',
    placeholder: 'Type your question...',
    mensagemPara: 'Message to Tecnocrata',
    enviarMensagem: 'Send message',
    erroProcessar: "Sorry, I couldn't process your message.",
    erroContacto:
      "I'm sorry, I couldn't reach Tecnocrata right now. Please try again in a moment or talk to us on WhatsApp.",
  },
}

// Logo oficial do Tecnato (nuvem)
const LOGO_TECNATO_URL = 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692837/TECNATO_2.png'

// Avatar oficial do Tecnato — usado no header e nas respostas da AI
function AvatarTecnato({ className = 'h-8 w-8' }) {
  return (
    <div className={`flex-shrink-0 ${className} rounded-full bg-white border border-line flex items-center justify-center overflow-hidden`}>
      <img src={LOGO_TECNATO_URL} alt="Tecnato" className="h-[68%] w-[68%] object-contain" />
    </div>
  )
}

// Ícone de perfil do utilizador (apenas ícone, sem letra)
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// Ícone WhatsApp
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

// SVG fechar
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

// SVG minimizar
const MinimizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5">
    <path d="M5 12h14" />
  </svg>
)

// SVG expandir
const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5">
    <path d="M5 12h14M12 5v14" />
  </svg>
)

// SVG enviar
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

// SVG imagem
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 17" />
  </svg>
)

// SVG link
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

// SVG carregando
const LoadingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 animate-spin">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
)

// Texto inline com suporte a **negrito**, *itálico* e `código`
function inline(txt, keyPrefix) {
  const partes = []
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g
  let ultimo = 0
  let m
  let k = 0
  while ((m = regex.exec(txt)) !== null) {
    if (m.index > ultimo) partes.push(txt.slice(ultimo, m.index))
    if (m[1] !== undefined) partes.push(<strong key={`${keyPrefix}-b${k++}`} className="font-semibold text-ink">{m[1]}</strong>)
    else if (m[2] !== undefined) partes.push(<em key={`${keyPrefix}-i${k++}`}>{m[2]}</em>)
    else partes.push(<code key={`${keyPrefix}-c${k++}`} className="px-1 py-0.5 rounded bg-ink/5 text-[13px]">{m[3]}</code>)
    ultimo = regex.lastIndex
  }
  if (ultimo < txt.length) partes.push(txt.slice(ultimo))
  return partes
}

// Renderizador markdown leve — parágrafos, listas, negrito (estilo ChatGPT)
function Markdown({ texto }) {
  const linhas = String(texto || '').split('\n')
  const blocos = []
  let lista = null

  const fechar = () => {
    if (lista) {
      blocos.push(lista)
      lista = null
    }
  }

  linhas.forEach((linha) => {
    const t = linha.trim()
    if (t === '') {
      fechar()
      return
    }
    const bullet = t.match(/^[-*•]\s+(.+)/)
    const numero = t.match(/^(\d+)[.)]\s+(.+)/)
    if (bullet || numero) {
      const tipo = bullet ? 'ul' : 'ol'
      if (!lista || lista.tipo !== tipo) {
        fechar()
        lista = { tipo, itens: [] }
      }
      lista.itens.push(bullet ? bullet[1] : numero[2])
      return
    }
    fechar()
    blocos.push({ tipo: 'p', texto: t })
  })
  fechar()

  return blocos.map((b, i) => {
    if (b.tipo === 'ul' || b.tipo === 'ol') {
      const Comp = b.tipo === 'ul' ? 'ul' : 'ol'
      return (
        <Comp key={i} className={`my-2 space-y-1 ${b.tipo === 'ul' ? 'list-disc ml-5 marker:text-brand' : 'list-decimal ml-5 marker:text-brand/70'}`}>
          {b.itens.map((it, j) => <li key={j}>{inline(it, `${i}-${j}`)}</li>)}
        </Comp>
      )
    }
    return <p key={i} className="my-1.5 first:mt-0 last:mb-0">{inline(b.texto, String(i))}</p>
  })
}

// Durante o streaming, esconde as tags especiais ainda incompletas/visíveis
function exibirSemTags(texto) {
  return texto
    .replace(/\[LINK:[^\]\n]*/g, '')
    .replace(/\[IMAGE:\d*[^\]\n]*/g, '')
    .replace(/\*\*?$/, '') // asteriscos de negrito incompletos no fim
}

// Mensagem no chat — estilo ChatGPT:
// AI = texto simples no fundo (sem cartão); utilizador = bolha à direita
function Message({ message, images, onImageClick }) {
  const { lang } = useIdioma()
  const c = T[lang]
  const content = message.content

  if (message.role === 'user') {
    return (
      <div className="flex justify-end items-end gap-2 animate-fade-in">
        <div className="max-w-[85%] px-4 py-2.5 rounded-3xl bg-ink/10 text-ink text-[15px] leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-ink/10 text-ink/60 flex items-center justify-center" aria-label={c.tu}>
          <UserIcon />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 animate-fade-in">
      <AvatarTecnato className="h-7 w-7 mt-1" />
      <div className="flex-1 min-w-0">
        <div className="text-[15px] leading-7 text-ink/90">
          <Markdown texto={content} />
          {message.streaming && (
            <span className="inline-block ml-0.5 h-4 w-2.5 translate-y-0.5 bg-brand/80 animate-pulse rounded-[1px]" />
          )}
        </div>

        {/* Botão WhatsApp (mensagens de encaminhamento para a equipa) */}
        {message.whatsapp && (
          <a
            href={whatsappUrl(lang)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1ebe5b] transition-colors"
          >
            <WhatsAppIcon />
            {c.falarWhatsapp}
          </a>
        )}

        {/* Imagens anexadas à mensagem */}
        {message.images && message.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onImageClick(img)}
                className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-ink-soft border border-line transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label={`${c.verImagem}: ${img.alt || c.imagemTecnato}`}
              >
                <img src={img.src} alt={img.alt || c.imagemTecnato} className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        {/* Links sugeridos */}
        {message.links && message.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => {
                  e.preventDefault()
                  // Navegação SPA via data attribute
                  window.dispatchEvent(new CustomEvent('ai-navigate', { detail: link.url }))
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-[0.05em] uppercase bg-brand/10 text-brand border border-brand/20 rounded-lg hover:bg-brand hover:text-ink transition-colors"
              >
                <LinkIcon />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Modal de visualização de imagem em tamanho grande
function ImageViewer({ image, onClose }) {
  const { lang } = useIdioma()
  const c = T[lang]

  if (!image) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label={c.fecharImagem}
        >
          <CloseIcon />
        </button>
        <img
          src={image.src}
          alt={image.alt || c.imagemTecnato}
          className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
        />
        {image.alt && (
          <p className="mt-3 text-center text-white/70 text-sm">{image.alt}</p>
        )}
      </div>
    </div>
  )
}

// Identificadores anónimos para registo de conversas (relatórios admin).
// visitante_id é estável por browser; sessao_id muda a cada visita (sessionStorage).
function visitanteID() {
  let id = localStorage.getItem('tec_visitante_id')
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('tec_visitante_id', id)
  }
  return id
}
function sessaoID() {
  let id = sessionStorage.getItem('tec_sessao_id')
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem('tec_sessao_id', id)
  }
  return id
}

export default function AISupport() {
  const conteudo = useConteudo()
  const { lang } = useIdioma()
  const c = T[lang]
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewerImage, setViewerImage] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef(null)
  const chatRef = useRef(null)

  const aiConfig = conteudo.aiSupport || {}

  // Imagens disponíveis para o AI
  const aiImages = [
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381441/Treino_Desportivo_com_Tecnologia_TECNATO.png', alt: 'Treino desportivo com tecnologia TECNATO' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381313/Tecnato_Creative_Studio_Collaboration.png', alt: 'Tecnato Creative Studio Collaboration' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381307/Jovens_Unidos_por_um_Futuro_Sustent%C3%A1vel.png', alt: 'Jovens unidos por um futuro sustentável' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692877/estrategia-equipa.png', alt: 'Sessão de estratégia da equipa TECNATO' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692874/equipa_campo-do-futuro.png', alt: 'Equipa TECNATO no Campo do Futuro' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png', alt: 'Oficina tecnológica TECNATO' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/arquitetos-futuro.png', alt: 'Arquitetos do futuro TECNATO' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/da-ideia-ao-negocio.png', alt: 'Da ideia ao negócio TECNATO' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/elias-retrato.png', alt: 'Elias Sebastião - CTO & Co-Fundador TECNATO' },
    { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692874/garcia-retrato.png', alt: 'Garcia Manuel - CEO e Fundador TECNATO' },
  ]

  // Páginas do site para o AI conhecer
  const sitePages = [
    { path: '/', label: 'Página inicial', description: 'Apresentação do TECNATO, hero, galeria, áreas, como funciona, participar, impacto, candidatura, FAQ' },
    { path: '/projecto', label: 'O projecto', description: 'Visão geral do projecto TECNATO' },
    { path: '/areas', label: 'Áreas', description: 'Áreas de atuação: Gestão, Ciência, Tecnologia, Empreendedorismo, Impacto Social, Invenções' },
    { path: '/como-funciona', label: 'Como funciona', description: 'Processo de candidatura, avaliação, seleção' },
    { path: '/participar', label: 'Participar', description: 'Quem pode participar, benefícios, requisitos' },
    { path: '/quem-somos', label: 'Quem somos', description: 'História, pilares (Visibilidade, Oportunidade, Comunidade), fundadores' },
    { path: '/entrar', label: 'Entrar / Login', description: 'Autenticação de utilizadores' },
    { path: '/registar', label: 'Registar', description: 'Criação de conta nova' },
    { path: '/politica-de-privacidade', label: 'Política de privacidade', description: 'Termos de privacidade e proteção de dados' },
    { path: '/candidatura', label: 'Candidatura', description: 'Formulário de submissão de projectos (equipa, projecto, município, área, vídeo, foto)' },
    { path: '/perfil', label: 'Perfil do utilizador', description: 'Gestão de candidaturas, dados pessoais' },
    { path: '/faq', label: 'FAQ', description: 'Perguntas frequentes sobre candidatura, elegibilidade, áreas, prémios' },
  ]

  // Scroll para última mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Navegação SPA via evento customizado
  useEffect(() => {
    const handleNavigate = (e) => {
      const url = e.detail
      if (url.startsWith('/')) {
        navigate(url)
        // Se chat estiver minimizado, expande
        if (isMinimized) setIsMinimized(false)
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
    window.addEventListener('ai-navigate', handleNavigate)
    return () => window.removeEventListener('ai-navigate', handleNavigate)
  }, [navigate, isMinimized])

  // Envia mensagem para API — `textoDirecto` permite enviar sem depender do estado do input
  const sendMessage = async (textoDirecto) => {
    const texto = (typeof textoDirecto === 'string' ? textoDirecto : inputValue).trim()
    if (!texto || isLoading) return

    // Prepara contexto para a AI
    let systemPrompt = `És o **Tecnocrata**, o assistente virtual oficial do TECNATO — a plataforma angolana de identificação, valorização e visibilidade de talentos, projectos e iniciativas. O teu nome é Tecnocrata: quando te perguntarem quem és ou como te chamas, responde que és o Tecnocrata, assistente do TECNATO.

CONTEXTO DO TECNATO:
- Plataforma para talentos de Angola (Luanda e todo o país)
- Áreas: Gestão e Administração, Ciência e Investigação, Tecnologia e Inovação, Empreendedorismo e Negócios, Impacto Social e Comunitário, Invenções e Criações Próprias
- Municípios de Luanda: Ingombotas, Sambizanga, Rangel, Maianga, Samba, Talatona, Mussulo, Hoji ya Henda, Cazenga, Cacuaco, Mulenvos, Kilamba Kiaxi, Viana, Camama, Kilamba, Belas
- Fundadores: Garcia Manuel (CEO) e Elias Sebastião (CTO)
- Site: https://tecnatoangola.com/

PÁGINAS DISPONÍVEIS:
${sitePages.map(p => `- ${p.label}: ${p.path} — ${p.description}`).join('\n')}

IMAGENS DISPONÍVEIS (podes enviar no chat quando relevante):
${aiImages.map((img, i) => `${i + 1}. ${img.alt}: ${img.src}`).join('\n')}

REGRAS:
1. Responde em português de Angola, tom profissional mas acolhedor
2. Quando enviares links internos, usa o formato especial: [LINK:path|label]
3. Quando quiseres mostrar imagem, usa: [IMAGE:index|alt] (índice base 1)
4. Podes combinar texto, links e imagens na mesma resposta
5. Se o utilizador pedir "link da candidatura", envia [LINK:/candidatura|Formulário de candidatura]
6. Mantém respostas concisas mas completas
7. Se não souberes, diz que vais encaminhar para a equipa humana
8. Formata a resposta em markdown simples: **negrito** para termos importantes, listas com "- " para enumerar opções, parágrafos curtos separados por linha em branco. Nunca uses cabeçalhos (#) nem tabelas

PÁGINA ATUAL DO UTILIZADOR: ${location.pathname}${location.hash}
HORA: ${new Date().toLocaleString('pt-PT')}`

    // Instruções personalizadas definidas no admin (campo systemPrompt)
    if (aiConfig.systemPrompt?.trim()) {
      systemPrompt += `\n\n---\n\nINSTRUÇÕES DO ADMINISTRADOR:\n${aiConfig.systemPrompt.trim()}`
    }

    // Adiciona instruções MD personalizadas se existirem
    if (aiConfig.mdInstructions?.trim()) {
      systemPrompt += `\n\n---\n\nINSTRUÇÕES PERSONALIZADAS (MD):\n${aiConfig.mdInstructions.trim()}`
    }

    // Histórico anterior da conversa (para o modelo manter contexto)
    const historico = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    // A mensagem do utilizador entra no histórico e o input é limpo de imediato.
    // Sem isto, o texto ficava preso no input e nada aparecia na área de mensagens.
    setIsLoading(true)
    setInputValue('')
    setMessages((prev) => [...prev, {
      role: 'user',
      content: texto,
      timestamp: Date.now(),
    }])

    // Mensagem da AI placeholder — vai sendo preenchida com o streaming
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: '',
      streaming: true,
      timestamp: Date.now(),
    }])

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: texto,
          history: historico,
          systemPrompt,
          temperature: 0.7,
          maxTokens: 1000,
          stream: true,
          // Registo de conversa para os relatórios do admin
          sessaoId: sessaoID(),
          visitanteId: visitanteID(),
          pagina: location.pathname,
        }),
      })

      if (!response.ok) {
        // Não expor detalhes internos da API ao utilizador (segurança)
        console.error('AI Chat: API respondeu', response.status)
        throw new Error('api')
      }

      const atualizarStream = (texto, pronto) => {
        setMessages((prev) => {
          const copia = [...prev]
          const idx = copia.length - 1
          if (copia[idx]?.role === 'assistant' && copia[idx]?.streaming) {
            copia[idx] = { ...copia[idx], content: texto, streaming: !pronto }
          }
          return copia
        })
      }

      let aiContent = ''

      const contentType = response.headers.get('content-type') || ''
      if (response.body && contentType.includes('text/event-stream')) {
        // ── Streaming: lê os tokens SSE e vai actualizando a mensagem ──
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const linhas = buffer.split('\n')
          buffer = linhas.pop() // guarda o resto incompleto
          for (const linha of linhas) {
            const t = linha.trim()
            if (!t.startsWith('data:')) continue
            const payload = t.slice(5).trim()
            if (!payload || payload === '[DONE]') continue
            try {
              const json = JSON.parse(payload)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) {
                aiContent += delta
                atualizarStream(exibirSemTags(aiContent), false)
              }
            } catch {
              // fragmento inválido — ignora
            }
          }
        }
      } else {
        // Fallback sem streaming
        const data = await response.json()
        aiContent = data.content || c.erroProcessar
      }

      if (!aiContent.trim()) {
        aiContent = c.erroProcessar
      }

      // Processa tags especiais [LINK:...] e [IMAGE:...] no texto final
      const links = []
      const images = []
      let aiFinal = aiContent

      aiFinal = aiFinal.replace(/\[LINK:([^|]+)\|([^\]]+)\]/g, (match, url, label) => {
        links.push({ url, label })
        return ''
      })

      aiFinal = aiFinal.replace(/\[IMAGE:(\d+)\|([^\]]*)\]/g, (match, index, alt) => {
        const idx = parseInt(index) - 1
        if (aiImages[idx]) {
          images.push({ src: aiImages[idx].src, alt: alt || aiImages[idx].alt })
        }
        return ''
      })

      // Substitui o placeholder pela mensagem final (com links/imagens)
      setMessages((prev) => {
        const copia = [...prev]
        const idx = copia.length - 1
        if (copia[idx]?.role === 'assistant' && copia[idx]?.streaming) {
          copia[idx] = {
            role: 'assistant',
            content: aiFinal.trim(),
            timestamp: Date.now(),
            links: links.length > 0 ? links : undefined,
            images: images.length > 0 ? images : undefined,
          }
        }
        return copia
      })
    } catch (error) {
      console.error('AI Chat error:', error)
      // Mensagem simples e segura — sem expor dados internos da API.
      // Se existir um placeholder de streaming, substitui-o; senão, acrescenta.
      const erroMsg = {
        role: 'assistant',
        content: c.erroContacto,
        whatsapp: true,
        timestamp: Date.now(),
      }
      setMessages((prev) => {
        const idx = prev.length - 1
        if (prev[idx]?.role === 'assistant' && prev[idx]?.streaming) {
          const copia = [...prev]
          copia[idx] = erroMsg
          return copia
        }
        return [...prev, erroMsg]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
    if (!isOpen) setShowWelcome(false)
  }

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  // Botão flutuante (sempre visível)
  return (
    <>
      {/* Botão flutuante redondo — círculo azul escuro com logo Technato */}
      <button
        type="button"
        onClick={toggleChat}
        className={`fixed bottom-24 right-4 z-50 h-14 w-14 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-ink flex items-center justify-center overflow-hidden
          ${isOpen && !isMinimized ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
          ${isOpen && isMinimized ? 'scale-100 opacity-100' : ''}
        `}
        style={{
          backgroundColor: '#003366', // azul escuro mais visível para testar logo
        }}
        aria-label={isOpen ? c.fecharTecnocrata : c.abrirTecnocrata}
        aria-expanded={isOpen && !isMinimized}
      >
        {!isOpen && !aiConfig.ativo && (
          <span className="sr-only">{c.indisponivel}</span>
        )}
        <img
          src="https://res.cloudinary.com/cqdjtwze/image/upload/v1792692837/TECNATO_2.png"
          alt="TECNATO"
          className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
        />
      </button>

      {/* Badge de notificação no botão (quando fechado) */}
      {!isOpen && messages.some(m => m.role === 'assistant' && !m.read) && (
        <span className="fixed bottom-24 right-4 z-50 translate-x-1/2 -translate-y-1/2 h-5 w-5 sm:bottom-6 sm:right-6 sm:h-6 sm:w-6 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
          !
        </span>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 z-50 w-full max-w-sm sm:bottom-6 sm:right-6 sm:max-w-md lg:max-w-lg transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px] sm:h-[600px]'} animate-slide-up`}>
          <div
            ref={chatRef}
            className={`h-full flex flex-col rounded-2xl bg-white shadow-2xl border border-line overflow-hidden ${isMinimized ? 'rounded-full' : 'rounded-2xl'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 text-white border-b border-white/10" style={{ backgroundColor: '#0d1b3a' }}>
              <div className="flex items-center gap-3">
                <AvatarTecnato className="h-9 w-9" />
                <div>
                  <p className="font-semibold text-sm">Tecnocrata</p>
                  <p className="text-[10px] text-brand/90">{c.assistenteOnline}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMinimize}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
                  aria-label={isMinimized ? c.expandirChat : c.minimizarChat}
                >
                  {isMinimized ? <ExpandIcon /> : <MinimizeIcon />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
                  aria-label={c.fecharChat}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
                {showWelcome && messages.length === 0 && (
                  <div className="flex gap-3 animate-fade-in">
                    <AvatarTecnato className="h-7 w-7 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] leading-7 text-ink/90">
                        {c.vindasInicio}<strong>Tecnocrata</strong>{c.vindasFim}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.sugestoes.map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendMessage(sug)}
                            className="px-3 py-1.5 text-xs font-mono tracking-[0.05em] uppercase bg-brand/10 text-brand border border-brand/20 rounded-lg hover:bg-brand hover:text-ink transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages
                  .filter((msg) => !(msg.streaming && !msg.content)) // placeholder vazio → usa os pontos
                  .map((msg, idx) => (
                    <Message
                      key={idx}
                      message={msg}
                      images={aiImages}
                      onImageClick={setViewerImage}
                    />
                  ))}

                {/* Indicador estilo GPT — até ao primeiro token chegar */}
                {isLoading && !messages.some((m) => m.streaming && m.content) && (
                  <div className="flex gap-3 animate-fade-in">
                    <AvatarTecnato className="h-7 w-7 mt-1" />
                    <div className="flex items-center gap-1.5 h-7">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Area */}
            {!isMinimized && (
              <div className="border-t border-line bg-white p-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const img = aiImages[Math.floor(Math.random() * aiImages.length)]
                      setViewerImage(img)
                    }}
                    className="flex-shrink-0 p-2 rounded-xl text-ink/50 hover:text-brand hover:bg-brand/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
                    aria-label={c.verImagensTecnato}
                    title={c.verImagensDisponiveis}
                  >
                    <ImageIcon />
                  </button>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={aiConfig.ativo ? c.placeholder : c.indisponivel}
                    className="flex-1 min-h-11 px-4 py-2.5 text-sm border border-line bg-white rounded-xl focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    disabled={isLoading || !aiConfig.ativo}
                    aria-label={c.mensagemPara}
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim() || isLoading || !aiConfig.ativo}
                    className="flex-shrink-0 min-h-11 px-4 bg-ink text-white rounded-xl font-mono text-[10px] tracking-[0.1em] uppercase hover:bg-brand hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
                    aria-label={c.enviarMensagem}
                  >
                    {isLoading ? <LoadingIcon /> : <SendIcon />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      <ImageViewer image={viewerImage} onClose={() => setViewerImage(null)} />
    </>
  )
}
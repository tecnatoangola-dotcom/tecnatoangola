import { useEffect, useState } from 'react'
import { Handshake, Image, Images, Users, Video, User, Bell, Bot, Sparkles, BarChart3 } from 'lucide-react'
import { api } from '../api.js'
import RelatoriosConversa from './RelatoriosConversa.jsx'

const SECCOES = [
  { chave: 'hero', label: 'Hero', Icon: Image },
  { chave: 'galeria', label: 'Galeria', Icon: Images },
  { chave: 'candidatura', label: 'Candidatura', Icon: Video },
  { chave: 'quem_somos', label: 'Quem somos', Icon: Users },
  { chave: 'parceiros', label: 'Parceiros', Icon: Handshake },
  { chave: 'popup', label: 'Popups', Icon: Bell },
  { chave: 'aiSupport', label: 'AI Support', Icon: Bot },
  { chave: 'relatorios', label: 'Relatórios de conversa', Icon: BarChart3, semGuardar: true },
]

// Valores actuais do site — servem de base quando a BD ainda não tem nada guardado.
const DEFAULTS = {
  hero: {
    imagem: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png',
    alt: 'Jovens a construírem um protótipo numa oficina',
    rotacao: true,
  },
  galeria: {
    etiqueta: 'Em movimento / registos de campo',
    imagens: [
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png', alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica', caption: 'Oficina tecnológica' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692877/estrategia-equipa.png', alt: 'Sessão de estratégia TECNATO com apresentação de um plano de negócio', caption: 'Sessões de estratégia' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692874/equipa_campo-do-futuro.png', alt: 'Equipa TECNATO reunida no Campo do Futuro', caption: 'Equipa no Campo do Futuro' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png', alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica', caption: 'Oficina tecnológica' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/arquitetos-futuro.png', alt: 'Jovens arquitetos da equipa TECNATO a planearem o futuro numa mesa de trabalho', caption: 'Planear o futuro' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/da-ideia-ao-negocio.png', alt: 'Equipa TECNATO a planear a transformação de uma ideia num negócio', caption: 'Da ideia ao negócio' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381307/Jovens_Unidos_por_um_Futuro_Sustent%C3%A1vel.png', alt: 'Jovens unidos por um futuro sustentável', caption: 'Jovens unidos por um futuro sustentável' },
      { src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381441/Treino_Desportivo_com_Tecnologia_TECNATO.png', alt: 'Treino desportivo com tecnologia TECNATO', caption: 'Treino desportivo com tecnologia' },
    ],
  },
  candidatura: { videoUrl: '' },
  quem_somos: {
    titulo: 'Quem está por trás do TECNATO.',
    intro: 'Duas pessoas, uma obsessão: que o talento angolano deixe de depender de sorte para depender de visibilidade.',
    fundadores: [
      {
        nome: 'Garcia Manuel',
        cargo: 'CEO e Fundador do TECNATO',
        foto: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692874/garcia-retrato.png',
        bio: 'Lidera a visão e a estratégia do TECNATO. Acredita que o talento angolano existe em todos os bairros e que só falta uma luz para o mundo o ver.',
      },
      {
        nome: 'Elias Sebastião',
        cargo: 'CTO & Co-Fundador do TECNATO',
        foto: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/elias-retrato.png',
        bio: 'Cuida da operação e da tecnologia da plataforma. Do primeiro código ao painel que liga talentos a oportunidades, faz parte da construção diária do TECNATO.',
      },
    ],
  },
  parceiros: {
    titulo_normal: 'Quem caminha',
    titulo_acento: 'connosco.',
    subtitulo: 'Ferramentas e equipas que tornam o TECNATO possível — da infraestrutura à inteligência que potencia a plataforma.',
    logos: [
      { nome: 'Hostinger', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787595825/Hostinger_Logo.png' },
      { nome: 'EZZO Digital', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787585618/4cdf9d321166a0803632bc80d821b6bb.png' },
      { nome: 'Keimadura', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787584053/logo-keimadura-erp.png' },
      { nome: 'ChatGPT', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792062577/ChatGPT-Logo.png' },
      { nome: 'Google', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792062577/Google__G__logo.svg.webp' },
      { nome: 'Netlify', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792062576/Netlify_logo__2.svg.webp' },
      { nome: 'Supabase', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792070651/45a7d301-f2f5-46a1-b896-d7fbcc79db8b-removebg-preview.png' },
      { nome: 'Garcian', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1792070654/supabase-logo-vector__1_-removebg-preview.png' },
      { nome: 'Anthropic', logo: 'https://res.cloudinary.com/ltei8lqg/image/upload/v1787595826/Anthropic-Logo.wine.png' },
    ],
  },
  popup: {
    ativo: false,
    id: 'anuncio-principal',
    frequencia: 'sessao',
    delaySegundos: 5,
    conteudo: {
      titulo: '',
      descricao: '',
      imagemUrl: '',
      youtubeUrl: '',
      botaoTexto: '',
      botaoLink: '',
    },
  },
  aiSupport: {
    ativo: false,
    apiKey: '',
    model: 'nvidia/llama-3.1-nemotron-70b-instruct',
    systemPrompt: '',
    mdInstructions: '',
  },
}

function carregarImagem(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Não foi possível ler esta imagem.'))
    }
    img.src = url
  })
}

async function prepararUpload(file) {
  if (file.type === 'image/svg+xml') {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let bin = ''
    for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i])
    return { contentType: file.type, dataBase64: btoa(bin) }
  }
  const img = await carregarImagem(file)
  const escala = Math.min(1, 1800 / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
  return { contentType: 'image/jpeg', dataBase64: dataUrl.slice(dataUrl.indexOf(',') + 1) }
}

async function enviarFicheiro({ file, seccao, nome }) {
  const { contentType, dataBase64 } = await prepararUpload(file)
  const res = await api('/site/upload', {
    method: 'POST',
    body: JSON.stringify({ seccao, nome, contentType, dataBase64 }),
  })
  return res.url
}

function previewVideo(url) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return { tipo: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&playsinline=1` }
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return { tipo: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1` }
  return { tipo: 'video', src: url }
}

const INPUT = 'w-full border border-line bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none'
const LABEL = 'mb-1.5 block admin-label text-ink/50'
const BTN = 'inline-flex min-h-10 items-center border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink'
const BTN_PRIMARIO = 'inline-flex min-h-10 items-center bg-ink px-5 font-mono text-[10px] tracking-[0.1em] text-white uppercase hover:bg-ink-soft disabled:opacity-50'

function CampoURL({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder={placeholder}
        className={INPUT}
      />
    </label>
  )
}

function BotaoFicheiro({ onFile, children, disabled }) {
  return (
    <label className={`${BTN} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      {children}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
      />
    </label>
  )
}

function Campo({ label, value, onChange, textarea, placeholder }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${INPUT} resize-y`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={INPUT} />
      )}
    </label>
  )
}

export default function Site() {
  const [dados, setDados] = useState(null)
  const [aba, setAba] = useState('hero')
  const [erro, setErro] = useState('')
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState('')

  useEffect(() => {
    api('/site')
      .then((json) => {
        const carregado = {}
        for (const { chave, semGuardar } of SECCOES) {
          if (semGuardar) continue // abas especiais sem conteúdo editável
          carregado[chave] = { ...DEFAULTS[chave], ...(json.conteudo?.[chave]?.valor || {}) }
        }
        setDados(carregado)
      })
      .catch((err) => {
        setErro(err.message)
        setDados(DEFAULTS)
      })
  }, [])

  if (!dados) return <p className="text-sm text-ink/55">A carregar o editor…</p>

  function setValor(chave, patch) {
    setDados((current) => ({ ...current, [chave]: { ...current[chave], ...patch } }))
    setFeedback('')
  }

  async function guardar() {
    setBusy(true)
    setErro('')
    setFeedback('')
    try {
      await api(`/site/${aba}`, { method: 'PUT', body: JSON.stringify({ valor: dados[aba] }) })
      setFeedback('Guardado. O site mostra as alterações de imediato (pode ser preciso recarregar a página).')
    } catch (err) {
      setErro(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function submeterImagem({ file, seccao, nome, aplicar }) {
    setUploading(seccao + nome)
    setErro('')
    try {
      const url = await enviarFicheiro({ file, seccao, nome })
      aplicar(url)
    } catch (err) {
      setErro(err.message)
    } finally {
      setUploading('')
    }
  }

  return (
    <div className="panel-rise space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-label text-brand-deep">05 / site</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] lg:text-4xl">Editor do site</h1>
          <p className="mt-1 text-sm text-ink/60">
            Edita textos, fotos e vídeos do site público sem tocar no código.
          </p>
        </div>
        {!SECCOES.find((s) => s.chave === aba)?.semGuardar && (
          <button type="button" onClick={guardar} disabled={busy} className={BTN_PRIMARIO}>
            {busy ? 'A guardar…' : `Guardar ${SECCOES.find((s) => s.chave === aba)?.label.toLowerCase()}`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap border border-line bg-white">
        {SECCOES.map((seccao) => (
          <button
            key={seccao.chave}
            type="button"
            onClick={() => { setAba(seccao.chave); setFeedback(''); setErro('') }}
            className={`inline-flex min-h-10 items-center gap-1.5 border-r border-line px-4 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors last:border-r-0 ${
              aba === seccao.chave ? 'bg-ink text-white' : 'hover:bg-paper'
            }`}
          >
            <seccao.Icon aria-hidden="true" size={13} strokeWidth={1.8} />
            {seccao.label}
          </button>
        ))}
      </div>

      {erro && <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</div>}
      {feedback && <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{feedback}</div>}

      {aba === 'relatorios' && <RelatoriosConversa />}

      {aba === 'hero' && (
        <div className="grid gap-5 border border-line bg-white p-5 lg:grid-cols-2">
          <div>
            <p className={LABEL}>Foto de capa do hero</p>
            <img src={dados.hero.imagem} alt="" className="border border-line object-cover" style={{ maxHeight: 220 }} />
            <div className="mt-3 flex flex-wrap gap-2">
              <BotaoFicheiro
                disabled={Boolean(uploading)}
                onFile={(file) =>
                  submeterImagem({ file, seccao: 'hero', nome: 'hero', aplicar: (url) => setValor('hero', { imagem: url }) })
                }
              >
                {uploading === 'herohero' ? 'A enviar…' : 'trocar foto (upload)'}
              </BotaoFicheiro>
            </div>
            <CampoURL
              label="Ou insira URL direta da imagem (Cloudinary, etc.)"
              value={dados.hero.imagem}
              onChange={(v) => setValor('hero', { imagem: v })}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>
          <div className="space-y-4">
            <Campo label="Texto alternativo (acessibilidade)" value={dados.hero.alt} onChange={(v) => setValor('hero', { alt: v })} />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dados.hero.rotacao === true}
                onChange={(e) => setValor('hero', { rotacao: e.target.checked })}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand focus:ring-2"
              />
              <span className="text-sm font-medium text-ink/80">
                Rotação automática no hero
              </span>
            </label>
            <p className="text-xs text-ink/55 leading-relaxed">
              <strong>Ligado:</strong> o hero alterna entre a foto principal e todas as fotos da galeria "Em movimento" a cada 5 segundos. Pausa ao passar o mouse.<br />
              <strong>Desligado:</strong> mostra apenas a foto principal do hero (a definida acima).
            </p>
          </div>
        </div>
      )}

      {aba === 'galeria' && (
        <div className="space-y-4 border border-line bg-white p-5">
          <Campo label="Etiqueta da secção" value={dados.galeria.etiqueta} onChange={(v) => setValor('galeria', { etiqueta: v })} />
          <ul className="space-y-3">
            {(dados.galeria.imagens || []).map((foto, index) => (
              <li key={index} className="grid gap-3 border border-line p-3 sm:grid-cols-[140px_1fr]">
                <img src={foto.src} alt="" className="h-24 w-full border border-line object-cover sm:w-[140px]" />
                <div className="space-y-2">
                  <Campo label="Legenda" value={foto.caption} onChange={(v) => setValor('galeria', { imagens: dados.galeria.imagens.map((f, i) => (i === index ? { ...f, caption: v } : f)) })} />
                  <Campo label="Descrição (alt)" value={foto.alt} onChange={(v) => setValor('galeria', { imagens: dados.galeria.imagens.map((f, i) => (i === index ? { ...f, alt: v } : f)) })} />
                  <CampoURL
                    label="URL da imagem (Cloudinary, etc.)"
                    value={foto.src}
                    onChange={(v) => setValor('galeria', { imagens: dados.galeria.imagens.map((f, i) => (i === index ? { ...f, src: v } : f)) })}
                    placeholder="https://res.cloudinary.com/..."
                  />
                  <div className="flex flex-wrap gap-2">
                    <BotaoFicheiro
                      disabled={Boolean(uploading)}
                      onFile={(file) =>
                        submeterImagem({
                          file,
                          seccao: 'galeria',
                          nome: `foto-${index + 1}`,
                          aplicar: (url) => setValor('galeria', { imagens: dados.galeria.imagens.map((f, i) => (i === index ? { ...f, src: url } : f)) }),
                        })
                      }
                    >
                      {uploading === `galeriafoto-${index + 1}` ? 'A enviar…' : 'trocar foto (upload)'}
                    </BotaoFicheiro>
                    <button
                      type="button"
                      onClick={() => setValor('galeria', { imagens: dados.galeria.imagens.filter((_, i) => i !== index) })}
                      className="inline-flex min-h-10 items-center border border-red-200 px-4 font-mono text-[10px] tracking-[0.1em] text-red-700 uppercase hover:bg-red-50"
                    >
                      remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line pt-4">
            <p className={LABEL}>Adicionar nova foto por URL</p>
            <CampoURL
              label="URL da imagem"
              value=""
              onChange={(v) => {
                if (v) {
                  setValor('galeria', { imagens: [...(dados.galeria.imagens || []), { src: v, alt: '', caption: 'Nova foto' }] })
                }
              }}
              placeholder="https://res.cloudinary.com/... (deixe vazio para não adicionar)"
            />
            <BotaoFicheiro
              disabled={Boolean(uploading)}
              onFile={(file) =>
                submeterImagem({
                  file,
                  seccao: 'galeria',
                  nome: 'nova',
                  aplicar: (url) =>
                    setValor('galeria', { imagens: [...(dados.galeria.imagens || []), { src: url, alt: '', caption: 'Nova foto' }] }),
                })
              }
            >
              {uploading === 'galerianova' ? 'A enviar…' : '+ adicionar foto (upload)'}
            </BotaoFicheiro>
          </div>
        </div>
      )}

      {aba === 'candidatura' && (
        <div className="grid gap-5 border border-line bg-white p-5 lg:grid-cols-2">
          <div className="space-y-3">
            <Campo
              label="Link do vídeo (YouTube, Vimeo ou MP4)"
              value={dados.candidatura.videoUrl}
              onChange={(v) => setValor('candidatura', { videoUrl: v })}
              placeholder="Ex.: https://www.youtube.com/watch?v=XXXXXXXX"
            />
            <p className="text-xs leading-relaxed text-ink/55">
              O vídeo aparece na página de candidatura (lado esquerdo) e reproduz automaticamente,
              em ciclo. Começa sempre sem som — política de autoplay dos browsers — mas o site
              mostra o botão «Ligar som» no canto do vídeo. Deixa vazio para esconder.
            </p>
          </div>
          <div>
            <p className={LABEL}>Pré-visualização</p>
            {(() => {
              const preview = previewVideo(dados.candidatura.videoUrl)
              if (!preview) return <div className="flex aspect-video items-center justify-center border border-dashed border-line text-xs text-ink/45">Sem vídeo configurado.</div>
              return preview.tipo === 'iframe'
                ? <iframe src={preview.src} title="Pré-visualização" className="aspect-video w-full border border-line" allow="autoplay; encrypted-media" allowFullScreen />
                : <video src={preview.src} controls className="aspect-video w-full border border-line bg-ink object-cover" />
            })()}
          </div>
        </div>
      )}

      {aba === 'quem_somos' && (
        <div className="space-y-4 border border-line bg-white p-5">
          <Campo label="Título da secção Fundadores" value={dados.quem_somos.titulo} onChange={(v) => setValor('quem_somos', { titulo: v })} />
          <Campo label="Introdução" value={dados.quem_somos.intro} onChange={(v) => setValor('quem_somos', { intro: v })} textarea />
          <div className="border-t border-line pt-4">
            <p className="admin-label text-brand-deep mb-3 flex items-center gap-2">
              <User size={14} strokeWidth={2} />
              Fundadores ({ (dados.quem_somos.fundadores || []).length })
            </p>
            <ul className="space-y-3">
              {(dados.quem_somos.fundadores || []).map((fundador, index) => (
                <li key={index} className="grid gap-3 border border-line p-3 sm:grid-cols-[140px_1fr]">
                  <img src={fundador.foto} alt="" className="h-24 w-full border border-line object-cover sm:w-[140px]" />
                  <div className="space-y-2">
                    <Campo label="Nome" value={fundador.nome} onChange={(v) => setValor('quem_somos', { fundadores: dados.quem_somos.fundadores.map((f, i) => (i === index ? { ...f, nome: v } : f)) })} />
                    <Campo label="Cargo" value={fundador.cargo} onChange={(v) => setValor('quem_somos', { fundadores: dados.quem_somos.fundadores.map((f, i) => (i === index ? { ...f, cargo: v } : f)) })} />
                    <Campo label="Bio" value={fundador.bio} onChange={(v) => setValor('quem_somos', { fundadores: dados.quem_somos.fundadores.map((f, i) => (i === index ? { ...f, bio: v } : f)) })} textarea />
                    <CampoURL
                      label="URL da foto (Cloudinary, etc.)"
                      value={fundador.foto}
                      onChange={(v) => setValor('quem_somos', { fundadores: dados.quem_somos.fundadores.map((f, i) => (i === index ? { ...f, foto: v } : f)) })}
                      placeholder="https://res.cloudinary.com/..."
                    />
                    <div className="flex flex-wrap gap-2">
                      <BotaoFicheiro
                        disabled={Boolean(uploading)}
                        onFile={(file) =>
                          submeterImagem({
                            file,
                            seccao: 'quem_somos',
                            nome: `fundador-${index + 1}`,
                            aplicar: (url) => setValor('quem_somos', { fundadores: dados.quem_somos.fundadores.map((f, i) => (i === index ? { ...f, foto: url } : f)) }),
                          })
                        }
                      >
                        {uploading === `quem_sonfundador-${index + 1}` ? 'A enviar…' : 'trocar foto (upload)'}
                      </BotaoFicheiro>
                      <button
                        type="button"
                        onClick={() => setValor('quem_somos', { fundadores: dados.quem_somos.fundadores.filter((_, i) => i !== index) })}
                        className="inline-flex min-h-10 items-center border border-red-200 px-4 font-mono text-[10px] tracking-[0.1em] text-red-700 uppercase hover:bg-red-50"
                      >
                        remover fundador
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-line pt-4">
              <p className={LABEL}>Adicionar novo fundador</p>
              <Campo
                label="Nome"
                value=""
                onChange={(nome) => {
                  if (nome) {
                    setValor('quem_somos', { fundadores: [...(dados.quem_somos.fundadores || []), { nome, cargo: '', foto: '', bio: '' }] })
                  }
                }}
                placeholder="Ex.: Garcia Manuel"
              />
              <CampoURL
                label="URL da foto (Cloudinary, etc.)"
                value=""
                onChange={(v) => {
                  if (v) {
                    setValor('quem_somos', { fundadores: [...(dados.quem_somos.fundadores || []), { nome: 'Novo fundador', cargo: '', foto: v, bio: '' }] })
                  }
                }}
                placeholder="https://res.cloudinary.com/... (deixe vazio para não adicionar)"
              />
              <BotaoFicheiro
                disabled={Boolean(uploading)}
                onFile={(file) =>
                  submeterImagem({
                    file,
                    seccao: 'quem_somos',
                    nome: 'novo-fundador',
                    aplicar: (url) =>
                      setValor('quem_somos', { fundadores: [...(dados.quem_somos.fundadores || []), { nome: 'Novo fundador', cargo: '', foto: url, bio: '' }] }),
                  })
              }
              >
                {uploading === 'quem_sonovo-fundador' ? 'A enviar…' : '+ adicionar fundador (upload)'}
              </BotaoFicheiro>
            </div>
          </div>
        </div>
      )}

      {aba === 'parceiros' && (
        <div className="space-y-4 border border-line bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Título (parte normal)" value={dados.parceiros.titulo_normal} onChange={(v) => setValor('parceiros', { titulo_normal: v })} />
            <Campo label="Título (parte em serifa)" value={dados.parceiros.titulo_acento} onChange={(v) => setValor('parceiros', { titulo_acento: v })} />
          </div>
          <Campo label="Subtítulo" value={dados.parceiros.subtitulo} onChange={(v) => setValor('parceiros', { subtitulo: v })} textarea />
          <div>
            <p className={LABEL}>Logos dos parceiros ({(dados.parceiros.logos || []).length})</p>
            <ul className="space-y-3">
              {(dados.parceiros.logos || []).map((logo, index) => (
                <li key={index} className="grid gap-3 border border-line p-3 sm:grid-cols-[140px_1fr]">
                  <div className="flex h-16 items-center justify-center border border-line bg-paper px-2">
                    <img src={logo.logo} alt="" className="max-h-10 max-w-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <Campo label="Nome" value={logo.nome} onChange={(v) => setValor('parceiros', { logos: dados.parceiros.logos.map((l, i) => (i === index ? { ...l, nome: v } : l)) })} />
                    <Campo label="URL do logo" value={logo.logo} onChange={(v) => setValor('parceiros', { logos: dados.parceiros.logos.map((l, i) => (i === index ? { ...l, logo: v } : l)) })} />
                    <div className="flex flex-wrap gap-2">
                      <BotaoFicheiro
                        disabled={Boolean(uploading)}
                        onFile={(file) =>
                          submeterImagem({
                            file,
                            seccao: 'parceiros',
                            nome: logo.nome || `logo-${index + 1}`,
                            aplicar: (url) => setValor('parceiros', { logos: dados.parceiros.logos.map((l, i) => (i === index ? { ...l, logo: url } : l)) }),
                          })
                        }
                      >
                        {uploading === `parceiros${logo.nome || ''}` ? 'A enviar…' : 'trocar logo'}
                      </BotaoFicheiro>
                      <button
                        type="button"
                        onClick={() => setValor('parceiros', { logos: dados.parceiros.logos.filter((_, i) => i !== index) })}
                        className="inline-flex min-h-10 items-center border border-red-200 px-4 font-mono text-[10px] tracking-[0.1em] text-red-700 uppercase hover:bg-red-50"
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setValor('parceiros', { logos: [...(dados.parceiros.logos || []), { nome: 'Novo parceiro', logo: '' }] })}
              className={`${BTN} mt-3`}
            >
              + adicionar parceiro (usar URL ou trocar logo por ficheiro)
            </button>
          </div>
        </div>
      )}

      {aba === 'popup' && (
        <div className="space-y-4 border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dados.popup.ativo === true}
                onChange={(e) => setValor('popup', { ativo: e.target.checked })}
                className="h-5 w-5 rounded border-line text-brand focus:ring-brand focus:ring-2"
              />
              <span className="text-lg font-semibold text-ink">
                {dados.popup.ativo ? 'Popup ativo' : 'Popup inativo'}
              </span>
            </label>
            <span className="ml-auto px-3 py-1 text-xs font-mono tracking-[0.1em] uppercase rounded-full border
              {dados.popup.ativo ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}
            ">
              {dados.popup.ativo ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              label="ID do popup (único)"
              value={dados.popup.id}
              onChange={(v) => setValor('popup', { id: v })}
              placeholder="anuncio-principal"
            />
            <Campo
              label="Título do popup"
              value={dados.popup.conteudo?.titulo || ''}
              onChange={(v) => setValor('popup', { conteudo: { ...dados.popup.conteudo, titulo: v } })}
              placeholder="Ex.: Nova oportunidade TECNATO"
            />
          </div>

          <Campo
            label="Descrição / Texto do anúncio"
            value={dados.popup.conteudo?.descricao || ''}
            onChange={(v) => setValor('popup', { conteudo: { ...dados.popup.conteudo, descricao: v } })}
            placeholder="Descreva o anúncio, promoção ou mensagem..."
            textarea
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <CampoURL
              label="URL da imagem (opcional)"
              value={dados.popup.conteudo?.imagemUrl || ''}
              onChange={(v) => setValor('popup', { conteudo: { ...dados.popup.conteudo, imagemUrl: v } })}
              placeholder="https://res.cloudinary.com/... (JPG, PNG, WebP)"
            />
            <CampoURL
              label="URL do YouTube (opcional)"
              value={dados.popup.conteudo?.youtubeUrl || ''}
              onChange={(v) => setValor('popup', { conteudo: { ...dados.popup.conteudo, youtubeUrl: v } })}
              placeholder="https://www.youtube.com/watch?v=... ou youtu.be/..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              label="Texto do botão (opcional)"
              value={dados.popup.conteudo?.botaoTexto || ''}
              onChange={(v) => setValor('popup', { conteudo: { ...dados.popup.conteudo, botaoTexto: v } })}
              placeholder="Ex.: Saiba mais, Inscrever-se, Ver vídeo"
            />
            <CampoURL
              label="Link do botão (opcional)"
              value={dados.popup.conteudo?.botaoLink || ''}
              onChange={(v) => setValor('popup', { conteudo: { ...dados.popup.conteudo, botaoLink: v } })}
              placeholder="https://tecnatoangola.com/..."
            />
          </div>

          <div className="border-t border-line pt-4">
            <p className={LABEL}>Configurações de exibição</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Campo
                label="Delay (segundos)"
                value={dados.popup.delaySegundos || 5}
                onChange={(v) => setValor('popup', { delaySegundos: parseInt(v) || 0 })}
                placeholder="5"
              />
              <label className="block">
                <span className={LABEL}>Frequência</span>
                <select
                  value={dados.popup.frequencia || 'sessao'}
                  onChange={(e) => setValor('popup', { frequencia: e.target.value })}
                  className={INPUT}
                >
                  <option value="sessao">Uma vez por sessão</option>
                  <option value="dia">Uma vez por dia</option>
                  <option value="sempre">Sempre que entrar no site</option>
                </select>
              </label>
            </div>
            <p className="mt-3 text-xs text-ink/55 leading-relaxed">
              <strong>Uma vez por sessão:</strong> o utilizador vê o popup uma vez por visita (fecha o browser = nova sessão).<br />
              <strong>Uma vez por dia:</strong> o utilizador vê no máximo uma vez a cada 24 horas.<br />
              <strong>Sempre:</strong> aparece sempre que o utilizador entra no site (pode ser perturbador).
            </p>
          </div>

          <div className="border-t border-line pt-4">
            <p className={LABEL}>Pré-visualização</p>
            <div className="mt-3 p-4 border border-dashed border-line rounded-xl bg-paper">
              <p className="text-sm text-ink/60 text-center py-8">
                {dados.popup.ativo ? 'Popup configurado e ativo. Visite o site para ver o resultado.' : 'Ative o popup acima para pré-visualizar no site.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {aba === 'aiSupport' && (
        <div className="space-y-4 border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dados.aiSupport.ativo === true}
                onChange={(e) => setValor('aiSupport', { ativo: e.target.checked })}
                className="h-5 w-5 rounded border-line text-brand focus:ring-brand focus:ring-2"
              />
              <span className="text-lg font-semibold text-ink">
                {dados.aiSupport.ativo ? 'AI Support ativo' : 'AI Support inativo'}
              </span>
            </label>
            <span className="ml-auto px-3 py-1 text-xs font-mono tracking-[0.1em] uppercase rounded-full border
              {dados.aiSupport.ativo ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}
            ">
              {dados.aiSupport.ativo ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              label="API Key (NVIDIA)"
              value={dados.aiSupport.apiKey || ''}
              onChange={(v) => setValor('aiSupport', { apiKey: v })}
              placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <Campo
              label="Modelo"
              value={dados.aiSupport.model || 'nvidia/llama-3.1-nemotron-70b-instruct'}
              onChange={(v) => setValor('aiSupport', { model: v })}
              placeholder="nvidia/llama-3.1-nemotron-70b-instruct"
            />
          </div>

          <Campo
            label="System Prompt (opcional — usa o padrão se vazio)"
            value={dados.aiSupport.systemPrompt || ''}
            onChange={(v) => setValor('aiSupport', { systemPrompt: v })}
            placeholder="Instruções personalizadas para a IA..."
            textarea
          />

          <div className="border-t border-line pt-4">
            <p className={LABEL}>Modelos disponíveis (NVIDIA)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'nvidia/llama-3.1-nemotron-70b-instruct',
                'nvidia/nemotron-3-ultra',
                'nvidia/llama-3.1-nemotron-70b-reward',
                'meta/llama-3.1-405b-instruct',
                'meta/llama-3.1-70b-instruct',
                'mistralai/mistral-large',
                'google/gemma-2-27b-it',
              ].map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setValor('aiSupport', { model })}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                    dados.aiSupport.model === model
                      ? 'bg-brand text-ink border-brand'
                      : 'bg-white text-ink/70 border-line hover:border-brand'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink/55 leading-relaxed">
              Clica num modelo para selecionar. Precisas de uma <strong>API Key da NVIDIA</strong> (grátis em <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-brand underline">build.nvidia.com</a>).
            </p>
          </div>

          <div className="border-t border-line pt-4">
            <p className={LABEL}>Instruções personalizadas (Markdown)</p>
            <p className="mt-2 text-xs text-ink/55 leading-relaxed">
              Carrega um ficheiro <code>.md</code> com instruções adicionais para a IA. Estas instruções são anexadas ao system prompt base e permitem criar loops de agente, regras específicas, exemplos de poucos disparos (few-shot), etc.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className={`${BTN} cursor-pointer`}>
                Carregar .md
                <input
                  type="file"
                  accept=".md,text/markdown"
                  className="hidden"
                  disabled={Boolean(uploading)}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    if (!file.name.endsWith('.md')) return alert('Apenas ficheiros .md são permitidos')
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      const content = e.target.result
                      setValor('aiSupport', { mdInstructions: content })
                    }
                    reader.readAsText(file)
                    event.target.value = ''
                  }}
                />
              </label>
              {(dados.aiSupport.mdInstructions?.length || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setValor('aiSupport', { mdInstructions: '' })}
                  className="inline-flex min-h-10 items-center border border-red-200 px-4 font-mono text-[10px] tracking-[0.1em] text-red-700 uppercase hover:bg-red-50"
                >
                  remover instruções MD
                </button>
              )}
            </div>
            {(dados.aiSupport.mdInstructions?.length || 0) > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-mono text-green-800 mb-2">Instruções MD carregadas ({dados.aiSupport.mdInstructions.length} caracteres):</p>
                <pre className="text-xs text-green-700 bg-white/50 p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap font-mono">{dados.aiSupport.mdInstructions.slice(0, 500)}{dados.aiSupport.mdInstructions.length > 500 ? '…' : ''}</pre>
              </div>
            )}
          </div>

          <div className="border-t border-line pt-4">
            <p className={LABEL}>Testar conexão</p>
            <button
              type="button"
              onClick={async () => {
                if (!dados.aiSupport.apiKey) return alert('Insere a API Key primeiro')
                try {
                  const res = await fetch('/api/ai-test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: dados.aiSupport.apiKey, model: dados.aiSupport.model }),
                  })
                  if (res.ok) alert('Conexão OK!')
                  else alert('Erro: ' + (await res.text()))
                } catch (e) {
                  alert('Erro: ' + e.message)
                }
              }}
              className="mt-2 inline-flex min-h-10 items-center border border-line bg-white px-4 font-mono text-[10px] tracking-[0.1em] uppercase hover:border-ink"
            >
              Testar API Key
            </button>
          </div>

          <div className="border-t border-line pt-4">
            <p className={LABEL}>Pré-visualização</p>
            <div className="mt-3 p-4 border border-dashed border-line rounded-xl bg-paper">
              <p className="text-sm text-ink/60 text-center py-8">
                {dados.aiSupport.ativo ? 'AI Support ativo. O botão flutuante aparece no site.' : 'Ativa o AI Support acima para ver o botão no site.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { api } from '../api.js'

const SECCOES = [
  { chave: 'hero', label: 'Hero' },
  { chave: 'galeria', label: 'Galeria' },
  { chave: 'candidatura', label: 'Candidatura' },
  { chave: 'quem_somos', label: 'Quem somos' },
  { chave: 'parceiros', label: 'Parceiros' },
]

// Valores actuais do site — servem de base quando a BD ainda não tem nada guardado.
const DEFAULTS = {
  hero: {
    imagem: '/images/oficina-tecnologica.png',
    alt: 'Jovens a construírem um protótipo numa oficina',
  },
  galeria: {
    etiqueta: 'Em movimento / registos de campo',
    imagens: [
      { src: '/images/oficina-tecnologica.png', alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica', caption: 'Do protótipo à oficina' },
      { src: '/images/da-ideia-ao-negocio.png', alt: 'Equipa TECNATO a planear a transformação de uma ideia num negócio', caption: 'Da ideia ao negócio' },
      { src: '/images/estrategia-equipa.png', alt: 'Sessão de estratégia TECNATO com apresentação de um plano de negócio', caption: 'Sessões de estratégia' },
      { src: '/images/arquitetos-futuro.png', alt: 'Jovens arquitetos da equipa TECNATO a planearem o futuro numa mesa de trabalho', caption: 'Planear o futuro' },
      { src: '/images/equipa_campo-do-futuro.png', alt: 'Equipa TECNATO reunida no Campo do Futuro', caption: 'Equipa no Campo do Futuro' },
    ],
  },
  candidatura: { videoUrl: '' },
  quem_somos: {
    titulo: 'Quem está por trás do TECNATO.',
    intro: 'Duas pessoas, uma obsessão: que o talento angolano deixe de depender de sorte para depender de visibilidade.',
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
        for (const { chave } of SECCOES) {
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
        <button type="button" onClick={guardar} disabled={busy} className={BTN_PRIMARIO}>
          {busy ? 'A guardar…' : `Guardar ${SECCOES.find((s) => s.chave === aba)?.label.toLowerCase()}`}
        </button>
      </div>

      <div className="flex flex-wrap border border-line bg-white">
        {SECCOES.map((seccao) => (
          <button
            key={seccao.chave}
            type="button"
            onClick={() => { setAba(seccao.chave); setFeedback(''); setErro('') }}
            className={`min-h-10 border-r border-line px-4 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors last:border-r-0 ${
              aba === seccao.chave ? 'bg-ink text-white' : 'hover:bg-paper'
            }`}
          >
            {seccao.label}
          </button>
        ))}
      </div>

      {erro && <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</div>}
      {feedback && <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{feedback}</div>}

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
                {uploading === 'herohero' ? 'A enviar…' : 'trocar foto'}
              </BotaoFicheiro>
            </div>
          </div>
          <Campo label="Texto alternativo (acessibilidade)" value={dados.hero.alt} onChange={(v) => setValor('hero', { alt: v })} />
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
                      {uploading === `galeriafoto-${index + 1}` ? 'A enviar…' : 'trocar foto'}
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
            {uploading === 'galerianova' ? 'A enviar…' : '+ adicionar foto'}
          </BotaoFicheiro>
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
              sem som, em ciclo. Deixa vazio para esconder. Actualizar o link actualiza o vídeo no site.
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
    </div>
  )
}

import { createContext, useContext } from 'react'
import { PARCEIROS } from '../constants.js'

// Valores por omissão — o site mostra sempre estes dados se a BD estiver vazia
// ou se o Supabase não estiver configurado.
export const CONTEUDO_PADRAO = {
  hero: {
    imagem: '/images/oficina-tecnologica.png',
    alt: 'Jovens a construírem um protótipo numa oficina',
  },
  galeria: {
    etiqueta: 'Em movimento / registos de campo',
    imagens: [
      {
        src: '/images/oficina-tecnologica.png',
        alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica',
        caption: 'Do protótipo à oficina',
      },
      {
        src: '/images/da-ideia-ao-negocio.png',
        alt: 'Equipa TECNATO a planear a transformação de uma ideia num negócio',
        caption: 'Da ideia ao negócio',
      },
      {
        src: '/images/estrategia-equipa.png',
        alt: 'Sessão de estratégia TECNATO com apresentação de um plano de negócio',
        caption: 'Sessões de estratégia',
      },
      {
        src: '/images/arquitetos-futuro.png',
        alt: 'Jovens arquitetos da equipa TECNATO a planearem o futuro numa mesa de trabalho',
        caption: 'Planear o futuro',
      },
      {
        src: '/images/equipa_campo-do-futuro.png',
        alt: 'Equipa TECNATO reunida no Campo do Futuro',
        caption: 'Equipa no Campo do Futuro',
      },
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
    subtitulo:
      'Ferramentas e equipas que tornam o TECNATO possível — da infraestrutura à inteligência que potencia a plataforma.',
    logos: PARCEIROS,
  },
}

export const ConteudoContext = createContext(CONTEUDO_PADRAO)

export function useConteudo() {
  return useContext(ConteudoContext)
}

// Converte um link (YouTube / Vimeo / MP4) em fonte reproduzível em ciclo e mudo.
export function fonteVideo(url) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) {
    return {
      tipo: 'iframe',
      src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&playsinline=1&modestbranding=1&enablejsapi=1`,
    }
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) {
    return {
      tipo: 'iframe',
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1`,
    }
  }
  return { tipo: 'video', src: url }
}

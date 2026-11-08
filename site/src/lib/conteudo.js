import { createContext, useContext } from 'react'
import { PARCEIROS } from '../constants.js'

// Valores por omissão — o site mostra sempre estes dados se a BD estiver vazia
// ou se o Supabase não estiver configurado.
export const CONTEUDO_PADRAO = {
  hero: {
    imagem: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png',
    alt: 'Jovens a construírem um protótipo numa oficina',
    rotacao: true,
  },
  galeria: {
    etiqueta: 'Em movimento / registos de campo',
    imagens: [
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png',
        alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica',
        caption: 'Oficina tecnológica',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692877/estrategia-equipa.png',
        alt: 'Sessão de estratégia TECNATO com apresentação de um plano de negócio',
        caption: 'Sessões de estratégia',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692874/equipa_campo-do-futuro.png',
        alt: 'Equipa TECNATO reunida no Campo do Futuro',
        caption: 'Equipa no Campo do Futuro',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png',
        alt: 'Jovens engenheiros da equipa TECNATO a desenvolver um protótipo numa oficina tecnológica',
        caption: 'Oficina tecnológica',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/arquitetos-futuro.png',
        alt: 'Jovens arquitetos da equipa TECNATO a planearem o futuro numa mesa de trabalho',
        caption: 'Planear o futuro',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/da-ideia-ao-negocio.png',
        alt: 'Equipa TECNATO a planear a transformação de uma ideia num negócio',
        caption: 'Da ideia ao negócio',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381307/Jovens_Unidos_por_um_Futuro_Sustent%C3%A1vel.png',
        alt: 'Jovens unidos por um futuro sustentável',
        caption: 'Jovens unidos por um futuro sustentável',
      },
      {
        src: 'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381441/Treino_Desportivo_com_Tecnologia_TECNATO.png',
        alt: 'Treino desportivo com tecnologia TECNATO',
        caption: 'Treino desportivo com tecnologia',
      },
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
    subtitulo:
      'Ferramentas e equipas que tornam o TECNATO possível — da infraestrutura à inteligência que potencia a plataforma.',
    logos: PARCEIROS,
  },
  // Configuração do chat AI — carregada da BD (chave 'aiSupport' em site_conteudo).
  // Sem esta chave em CONTEUDO_PADRAO o ConteudoProvider ignora o valor da BD
  // (só faz merge de chaves presentes aqui) e o chat fica desativado.
  aiSupport: {
    ativo: false,
    apiKey: '',
    model: 'nvidia/nemotron-3-ultra-550b-a55b',
    systemPrompt: '',
    mdInstructions: '',
  },
  popup: {
    ativo: false,
    id: 'anuncio-principal',
    frequencia: 'sessao', // 'sessao' | 'dia' | 'sempre'
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

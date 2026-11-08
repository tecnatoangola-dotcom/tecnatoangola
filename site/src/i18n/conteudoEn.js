// Traduções do conteúdo editorial que vem por omissão no código (CONTEUDO_PADRAO).
// Conteúdo editado no CRM continua a chegar em português; em inglês mostramos estas
// versões para não deixar texto português no meio do site.
// Imagens, vídeos, logos e nomes próprios não são traduzidos.

export const CONTEUDO_EN = {
  heroAlt: 'Young people building a prototype in a technology workshop',
  galeriaEtiqueta: 'In motion / field records',
  galeria: {
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692873/oficina-tecnologica.png': {
      alt: 'Young TECNATO engineers developing a prototype in a technology workshop',
      caption: 'Technology workshop',
    },
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692877/estrategia-equipa.png': {
      alt: 'TECNATO strategy session presenting a business plan',
      caption: 'Strategy sessions',
    },
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692874/equipa_campo-do-futuro.png': {
      alt: 'TECNATO team gathered at Campo do Futuro',
      caption: 'Team at Campo do Futuro',
    },
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/arquitetos-futuro.png': {
      alt: 'Young TECNATO architects planning the future at a work table',
      caption: 'Planning the future',
    },
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1792692872/da-ideia-ao-negocio.png': {
      alt: 'TECNATO team planning how to turn an idea into a business',
      caption: 'From idea to business',
    },
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381307/Jovens_Unidos_por_um_Futuro_Sustent%C3%A1vel.png': {
      alt: 'Young people united for a sustainable future',
      caption: 'Young people united for a sustainable future',
    },
    'https://res.cloudinary.com/cqdjtwze/image/upload/v1793381441/Treino_Desportivo_com_Tecnologia_TECNATO.png': {
      alt: 'Sports training with TECNATO technology',
      caption: 'Sports training with technology',
    },
  },
  quemSomosTitulo: 'Who is behind TECNATO.',
  quemSomosIntro:
    'Two people, one obsession: that Angolan talent should stop depending on luck and start depending on visibility.',
  fundadores: {
    'Garcia Manuel': {
      cargo: 'CEO and Founder of TECNATO',
      bio: 'Leads TECNATO’s vision and strategy. He believes Angolan talent exists in every neighbourhood and that it only needs a light for the world to see it.',
    },
    'Elias Sebastião': {
      cargo: 'CTO & Co-Founder of TECNATO',
      bio: 'Runs the platform’s operations and technology. From the first line of code to the panel that connects talents to opportunities, he is part of TECNATO’s daily building.',
    },
  },
  parceirosTituloNormal: 'Who walks',
  parceirosTituloAcento: 'with us.',
  parceirosSubtitulo:
    'Tools and teams that make TECNATO possible — from infrastructure to the intelligence that powers the platform.',
}

export function localizarConteudo(conteudo, lang) {
  if (lang !== 'en' || !conteudo) return conteudo

  const galeria = (conteudo.galeria?.imagens || []).map((imagem) => {
    const traducao = CONTEUDO_EN.galeria[imagem.src]
    return traducao ? { ...imagem, ...traducao } : imagem
  })

  const fundadores = (conteudo.quem_somos?.fundadores || []).map((pessoa) => {
    const traducao = CONTEUDO_EN.fundadores[pessoa.nome]
    return traducao ? { ...pessoa, ...traducao } : pessoa
  })

  return {
    ...conteudo,
    hero: { ...conteudo.hero, alt: CONTEUDO_EN.heroAlt },
    galeria: {
      ...conteudo.galeria,
      etiqueta: CONTEUDO_EN.galeriaEtiqueta,
      imagens: galeria,
    },
    quem_somos: {
      ...conteudo.quem_somos,
      titulo: CONTEUDO_EN.quemSomosTitulo,
      intro: CONTEUDO_EN.quemSomosIntro,
      fundadores,
    },
    parceiros: {
      ...conteudo.parceiros,
      titulo_normal: CONTEUDO_EN.parceirosTituloNormal,
      titulo_acento: CONTEUDO_EN.parceirosTituloAcento,
      subtitulo: CONTEUDO_EN.parceirosSubtitulo,
    },
  }
}

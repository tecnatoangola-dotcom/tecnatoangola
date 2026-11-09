// Otimiza imagens do Cloudinary na hora: formato moderno + qualidade auto
// + largura máxima. Sem mexer nos ficheiros originais nem na BD.
// Ex.: .../image/upload/v123/foto.png → .../image/upload/w_800,q_auto,f_auto/v123/foto.png
// (2,2 MB → ~73 KB nas fotos da galeria). URLs já otimizadas passam intactas.
export function otimizarImagem(url, largura = 800) {
  if (!url || typeof url !== 'string') return url
  const m = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/)
  if (!m) return url
  const resto = m[2]
  if (/w_\d+|q_auto|f_auto/.test(resto.split('/')[0])) return url
  return `${m[1]}w_${largura},q_auto,f_auto/${resto}`
}

// Otimiza em profundidade os campos de imagem conhecidos do conteúdo do CMS
// (hero, galeria, fundadores, logos de parceiros, popup). Vale para a BD e
// para os valores por omissão.
export function otimizarConteudo(conteudo) {
  if (!conteudo || typeof conteudo !== 'object') return conteudo
  const c = { ...conteudo }
  if (c.hero?.imagem) c.hero = { ...c.hero, imagem: otimizarImagem(c.hero.imagem, 1200) }
  if (Array.isArray(c.galeria?.imagens)) {
    c.galeria = { ...c.galeria, imagens: c.galeria.imagens.map((i) => ({ ...i, src: otimizarImagem(i.src, 1200) })) }
  }
  if (Array.isArray(c.quem_somos?.fundadores)) {
    c.quem_somos = { ...c.quem_somos, fundadores: c.quem_somos.fundadores.map((f) => ({ ...f, foto: otimizarImagem(f.foto, 800) })) }
  }
  if (Array.isArray(c.parceiros?.logos)) {
    c.parceiros = { ...c.parceiros, logos: c.parceiros.logos.map((l) => ({ ...l, logo: otimizarImagem(l.logo, 400) })) }
  }
  if (c.popup?.conteudo?.imagemUrl) {
    c.popup = { ...c.popup, conteudo: { ...c.popup.conteudo, imagemUrl: otimizarImagem(c.popup.conteudo.imagemUrl, 1200) } }
  }
  return c
}

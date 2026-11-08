// Renderer markdown leve — negrito, itálico, código, listas e parágrafos.
// Usado nos relatórios da AI e nas respostas do assistente de relatórios.

function inline(txt, keyPrefix) {
  const partes = []
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g
  let ultimo = 0
  let m
  let k = 0
  while ((m = regex.exec(txt)) !== null) {
    if (m.index > ultimo) partes.push(txt.slice(ultimo, m.index))
    if (m[1] !== undefined) partes.push(<strong key={`${keyPrefix}-b${k++}`} className="font-semibold">{m[1]}</strong>)
    else if (m[2] !== undefined) partes.push(<em key={`${keyPrefix}-i${k++}`}>{m[2]}</em>)
    else partes.push(<code key={`${keyPrefix}-c${k++}`} className="rounded bg-ink/5 px-1 py-0.5 text-[12px]">{m[3]}</code>)
    ultimo = regex.lastIndex
  }
  if (ultimo < txt.length) partes.push(txt.slice(ultimo))
  return partes
}

export default function Markdown({ texto }) {
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
        <Comp
          key={i}
          className={`my-2 space-y-1 ${b.tipo === 'ul' ? 'list-disc marker:text-brand ml-5' : 'list-decimal marker:text-brand/70 ml-5'}`}
        >
          {b.itens.map((it, j) => <li key={j}>{inline(it, `${i}-${j}`)}</li>)}
        </Comp>
      )
    }
    return <p key={i} className="my-1.5 first:mt-0 last:mb-0">{inline(b.texto, String(i))}</p>
  })
}

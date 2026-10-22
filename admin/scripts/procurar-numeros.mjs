// localiza ficheiros e linhas com etiquetas numeradas restantes (UTF-8 correcto)
import fs from 'node:fs'
import path from 'node:path'

const raiz = 'site/src'
function * caminhar(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield * caminhar(p)
    else if (/\.(jsx|js)$/.test(e.name)) yield p
  }
}
for (const p of caminhar(raiz)) {
  const linhas = fs.readFileSync(p, 'utf8').split('\n')
  linhas.forEach((linha, i) => {
    if (/(^|[^\w])0[1-9]([^\w]|\/|$)|0\{|\d\+\s*1.+padStart|padStart/.test(linha)) {
      console.log(`${p}:${i + 1}: ${linha.trim().slice(0, 100)}`)
    }
  })
}

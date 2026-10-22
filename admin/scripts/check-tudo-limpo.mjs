// Verificação final: nenhum ficheiro JSX do site com BOM nem dupla codificação
import fs from 'node:fs'
import path from 'node:path'

let problemas = 0
function * caminhar(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield * caminhar(p)
    else if (/\.(jsx?|js)$/.test(e.name)) yield p
  }
}
for (const f of caminhar('site/src')) {
  const b = fs.readFileSync(f)
  const bom = b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf
  let dupla = 0
  for (let i = 0; i < b.length - 3; i++) {
    if (b[i] === 0xc3 && b[i + 1] === 0x83 && b[i + 2] === 0xc2) dupla++
  }
  if (bom || dupla) {
    problemas++
    console.log(`PROBLEMA: ${f} · BOM=${bom} · dupla-codificação=${dupla}`)
  }
}
console.log(problemas === 0 ? 'OK: todos os ficheiros limpos (sem BOM, sem mojibake)' : `${problemas} ficheiros com problemas`)

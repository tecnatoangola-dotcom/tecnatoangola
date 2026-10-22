// Prova de bytes: ficheiro limpo = "é" como C3 A9; dupla codificação = C3 83 C2 A9
import fs from 'node:fs'

const alvo = [
  'site/src/components/Projecto.jsx',
  'site/src/components/Areas.jsx',
  'site/src/pages/QuemSomos.jsx',
  'site/src/components/Hero.jsx',
]

for (const f of alvo) {
  const b = fs.readFileSync(f)
  let limpa = 0
  let dupla = 0
  for (let i = 0; i < b.length - 1; i++) {
    if (b[i] === 0xc3 && b[i + 1] === 0xa9) limpa++
  }
  for (let i = 0; i < b.length - 3; i++) {
    if (b[i] === 0xc3 && b[i + 1] === 0x83 && b[i + 2] === 0xc2 && b[i + 3] === 0xa9) dupla++
  }
  console.log(f, '| «é» limpo:', limpa, '| «Ã©» dupla-codificada:', dupla)
}

const p = fs.readFileSync('site/src/components/Projecto.jsx', 'utf8')
console.log('Projecto tem index="01":', p.includes('index="01"'))
console.log('Projecto tem icone="alvo":', p.includes('icone="alvo"'))

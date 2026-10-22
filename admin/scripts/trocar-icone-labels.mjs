// Troca index->icone nos 7 componentes (Node = escreve UTF-8 exactamente, sem BOM)
import fs from 'node:fs'

const TROCAS = [
  ['site/src/components/Projecto.jsx', 'index="01"', 'icone="alvo"'],
  ['site/src/components/Areas.jsx', 'index="02"', 'icone="areas"'],
  ['site/src/components/ComoFunciona.jsx', 'index="03"', 'icone="passos"'],
  ['site/src/components/Participar.jsx', 'index="04"', 'icone="megafone"'],
  ['site/src/components/Impacto.jsx', 'index="05"', 'icone="centelha"'],
  ['site/src/components/Candidatura.jsx', 'index="06"', 'icone="documento"'],
  ['site/src/components/Faq.jsx', 'index="07"', 'icone="interro"'],
]

for (const [caminho, de, para] of TROCAS) {
  const antes = fs.readFileSync(caminho)
  const texto = antes.toString('utf8')
  if (!texto.includes(de)) {
    console.log(`${caminho}: NÃO encontrou ${de} — sem alteração`)
    continue
  }
  const novo = texto.replace(de, para)
  fs.writeFileSync(caminho, Buffer.from(novo, 'utf8'))
  const bytes = fs.readFileSync(caminho)
  const bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf
  console.log(`${caminho}: trocado ${de} -> ${para} · BOM: ${bom ? 'SIM (mal!)' : 'não (bem)'}`)
}

// Troca o ambiente para o projecto NOVO: site/.env, admin/.env e publicar/ENV-NETLIFY.txt.
// Guarda os valores antigos com prefixo OLD_ (nunca removidos) — reversível.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = dirname(dirname(dirname(fileURLToPath(import.meta.url)))) // raiz do repo (ficheiro está em admin/scripts)
const ler = (f) => {
  const linhas = readFileSync(f, 'utf8').split(/\r?\n/)
  const mapa = new Map()
  for (const l of linhas) {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) mapa.set(m[1], m[2])
  }
  return { linhas, mapa }
}
const NOVO = ler(join(raiz, 'admin', '.env')).mapa
const chave = (nome) => {
  const v = NOVO.get(nome)
  if (!v) throw new Error(`falta ${nome} no admin/.env`)
  return v
}

const URL_N = chave('NOVO_SUPABASE_URL')
const ANON_N = chave('NOVO_SUPABASE_ANON_KEY')
const SERV_N = chave('NOVO_SUPABASE_SERVICE_KEY')

const trocar = (ficheiro, pares, backup) => {
  const { linhas, mapa } = ler(ficheiro)
  const saida = []
  const jaOld = new Set()
  for (const l of linhas) {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!m) { saida.push(l); continue }
    const nome = m[1]
    if (nome.startsWith('OLD_')) jaOld.add(nome)
    if (pares[nome] !== undefined) {
      if (backup && mapa.has(backup(nome)) === false && !jaOld.has(backup(nome)) && mapa.has(nome)) {
        // não é possível inserir aqui; costumamos acrescentar no fim
      }
      saida.push(`${nome}=${pares[nome]}`)
    } else {
      saida.push(l)
    }
  }
  // backups OLD_ (só se não existirem)
  for (const [nome, valor] of Object.entries(pares)) {
    const nomeOld = backup(nome)
    if (nomeOld && !jaOld.has(nomeOld)) saida.push(`${nomeOld}=${mapa.get(nome) ?? ''}`)
  }
  if (Object.values(pares).some((v) => v === undefined)) throw new Error('par sem valor')
  writeFileSync(ficheiro, saida.join('\n'), 'utf8')
  console.log('actualizado:', ficheiro)
}

// 1) site/.env — service + VITE anon
const sitePares = {
  SUPABASE_URL: URL_N,
  SUPABASE_SERVICE_KEY: SERV_N,
  VITE_SUPABASE_URL: URL_N,
  VITE_SUPABASE_ANON_KEY: ANON_N,
}
const siteParaBackup = { SUPABASE_URL: 'OLD_SUPABASE_URL', SUPABASE_SERVICE_KEY: 'OLD_SUPABASE_SERVICE_KEY', VITE_SUPABASE_URL: 'OLD_VITE_SUPABASE_URL', VITE_SUPABASE_ANON_KEY: 'OLD_VITE_SUPABASE_ANON_KEY' }
trocar(join(raiz, 'site', '.env'), sitePares, (n) => siteParaBackup[n])

// 2) admin/.env — service (grava OLD_ para o projecto antigo)
const adminPares = { SUPABASE_URL: URL_N, SUPABASE_SERVICE_KEY: SERV_N }
const adminBackup = { SUPABASE_URL: 'OLD_SUPABASE_URL', SUPABASE_SERVICE_KEY: 'OLD_SUPABASE_SERVICE_KEY' }
trocar(join(raiz, 'admin', '.env'), adminPares, (n) => adminBackup[n])

// 3) publicar/ENV-NETLIFY.txt — substitui os valores S musician/URL/ANON (script de publicação)
const pub = join(raiz, 'publicar', 'ENV-NETLIFY.txt')
if (existsSync(pub)) {
  const { linhas, mapa } = ler(pub)
  const saida = []
  for (const l of linhas) {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!m) { saida.push(l); continue }
    const nome = m[1]
    if (nome === 'SUPABASE_URL') saida.push(`SUPABASE_URL=${URL_N}`)
    else if (nome === 'SUPABASE_SERVICE_KEY') saida.push(`SUPABASE_SERVICE_KEY=${SERV_N}`)
    else if (nome === 'VITE_SUPABASE_URL') saida.push(`VITE_SUPABASE_URL=${URL_N}`)
    else if (nome === 'VITE_SUPABASE_ANON_KEY') saida.push(`VITE_SUPABASE_ANON_KEY=${ANON_N}`)
    else saida.push(l)
  }
  // backups OLD_ no ficheiro de publicação também
  if (!mapa.has('OLD_SUPABASE_URL')) {
    saida.push(`OLD_SUPABASE_URL=${mapa.get('SUPABASE_URL') ?? ''}`)
    saida.push(`OLD_SUPABASE_SERVICE_KEY=${mapa.get('SUPABASE_SERVICE_KEY') ?? ''}`)
    saida.push(`OLD_VITE_SUPABASE_ANON_KEY=${mapa.get('VITE_SUPABASE_ANON_KEY') ?? ''}`)
  }
  writeFileSync(pub, saida.join('\n'), 'utf8')
  console.log('actualizado:', pub)
} else {
  console.log('(publicar/ENV-NETLIFY.txt não existe — saltado)')
}

console.log('\n✓ ambiente trocado para o projecto NOVO (antigo guardado com OLD_)')

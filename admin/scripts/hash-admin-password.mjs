import crypto from 'node:crypto'

const password = process.env.ADMIN_PASSWORD
if (!password || password.length < 12) {
  throw new Error('Defina ADMIN_PASSWORD com pelo menos 12 caracteres antes de executar este script.')
}

const salt = crypto.randomBytes(16).toString('hex')
const hash = crypto.scryptSync(password, salt, 64).toString('hex')
console.log(`scrypt$${salt}$${hash}`)

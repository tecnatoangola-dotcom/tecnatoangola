import fs from 'node:fs'
import crypto from 'node:crypto'

const env = fs.readFileSync('E:/Tecnato/repo/admin/.env', 'utf8')
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1].trim().replace(/^['"]|['"]$/g, '')
const secret = get('ADMIN_SECRET')

const payload = {
  email: 'eliassebastiao@tecnato.com',
  name: 'Elias Sebastião',
  exp: Date.now() + 8 * 3600_000,
}
const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url')
const token = `${b64}.${sig}`

fs.writeFileSync('C:/Users/elias/AppData/Local/Temp/opencode/admin_token.txt', token)
console.log('TOKEN-OK')
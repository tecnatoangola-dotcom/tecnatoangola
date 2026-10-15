import 'dotenv/config'
import pg from 'pg'

export function makeClient() {
  return new pg.Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 6543),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  })
}

export async function withDb(fn) {
  const client = makeClient()
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

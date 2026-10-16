import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import ExcelJS from 'exceljs'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 5200
const SECRET = process.env.ADMIN_SECRET || ''
const ADMINS = JSON.parse(process.env.ADMIN_USERS || '[]')
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const BUCKET = process.env.SUPABASE_BUCKET || 'candidaturas'
const BUCKET_PERFIS = process.env.SUPABASE_BUCKET_PERFIS || 'perfis'
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || ''
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const LOGIN_WINDOW_MS = 15 * 60_000
const LOGIN_MAX_ATTEMPTS = 8
const loginAttempts = new Map()

const sb =
  SUPABASE_URL && SERVICE_KEY
    ? createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Cache-Control', 'no-store')
  next()
})
app.use(cors({
  origin(origin, callback) {
    if (!origin || !ADMIN_ORIGIN || origin === ADMIN_ORIGIN) return callback(null, true)
    return callback(new Error('Origem não autorizada.'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))

if (IS_PRODUCTION && (!SECRET || SECRET.length < 32 || !SUPABASE_URL || !SERVICE_KEY || !ADMINS.length || !ADMIN_ORIGIN)) {
  throw new Error('Variáveis de segurança do admin incompletas. Configure ADMIN_SECRET, ADMIN_USERS, ADMIN_ORIGIN e Supabase.')
}

function signToken(admin) {
  const payload = Buffer.from(
    JSON.stringify({ email: admin.email, name: admin.name, exp: Date.now() + 12 * 3600_000 }),
  ).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

function readToken(token) {
  if (!token || !token.includes('.')) return null
  const idx = token.lastIndexOf('.')
  const payload = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

function getCookie(req, name) {
  const pair = String(req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null
}

function tokenFor(req) {
  const header = req.headers.authorization || ''
  return getCookie(req, 'tec_admin_session') || (header.startsWith('Bearer ') ? header.slice(7) : null)
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left))
  const b = Buffer.from(String(right))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function verifyPassword(password, admin) {
  if (typeof admin.passwordHash === 'string') {
    const [algorithm, salt, expected] = admin.passwordHash.split('$')
    if (algorithm !== 'scrypt' || !salt || !expected) return false
    const derived = crypto.scryptSync(String(password), salt, 64).toString('hex')
    return safeEqual(derived, expected)
  }
  return !IS_PRODUCTION && typeof admin.password === 'string' && safeEqual(password, admin.password)
}

function loginKey(req) { return `${req.ip}:${String(req.body?.email || '').toLowerCase()}` }
function mayAttemptLogin(req) {
  const record = loginAttempts.get(loginKey(req))
  return !record || record.until < Date.now() || record.count < LOGIN_MAX_ATTEMPTS
}
function failedLogin(req) {
  const key = loginKey(req); const current = loginAttempts.get(key)
  const count = current?.until > Date.now() ? current.count + 1 : 1
  loginAttempts.set(key, { count, until: Date.now() + LOGIN_WINDOW_MS })
}
function clearLoginAttempts(req) { loginAttempts.delete(loginKey(req)) }

function requireAdmin(req, res, next) {
  const admin = readToken(tokenFor(req))
  if (!admin) return res.status(401).json({ error: 'Sessão inválida. Entra novamente.' })
  req.admin = admin
  next()
}

function requireService(req, res, next) {
  if (!sb) {
    return res.status(503).json({
      error: 'SUPABASE_SERVICE_KEY não configurada em admin/.env — adiciona a chave e reinicia o servidor.',
    })
  }
  next()
}

function asyncRoute(handler) {
  return (req, res) => {
    Promise.resolve(handler(req, res)).catch((error) => {
      console.error('[TECNATO-ADMIN]', error)
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Erro interno.' })
    })
  }
}

async function listAllUsers() {
  const users = []
  let page = 1
  for (;;) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 100 })
    if (error) throw error
    users.push(...data.users)
    if (data.users.length < 100) break
    page += 1
  }
  return users
}

const DAY = 86_400_000

async function buildDashboard() {
  const now = Date.now()
  const iso = (ms) => new Date(ms).toISOString()
  const onlineSince = iso(now - 3 * 60_000)
  const monthSince = iso(now - 30 * DAY)

  const [onlineRows, monthRows, cands, users] = await Promise.all([
    sb.from('eventos')
      .select('visitor_id, tipo')
      .in('tipo', ['ping', 'visita'])
      .gte('created_at', onlineSince),
    sb.from('eventos')
      .select('visitor_id, tipo, created_at')
      .gte('created_at', monthSince),
    sb.from('candidaturas').select('status, municipio, area, created_at, referencia, equipa, projecto, avaliado_em'),
    listAllUsers(),
  ])

  const online = new Set((onlineRows.data || []).map((row) => row.visitor_id)).size
  const monthEvents = monthRows.data || []
  const visitantesMes = new Set(
    monthEvents.filter((e) => e.tipo === 'ping' || e.tipo === 'visita').map((e) => e.visitor_id),
  )
  const converters = new Set(
    monthEvents
      .filter((e) =>
        ['candidatura_plataforma', 'candidatura_whatsapp', 'registo'].includes(e.tipo),
      )
      .map((e) => e.visitor_id),
  )
  const semAccaoMes = [...visitantesMes].filter((id) => !converters.has(id)).length

  const todasCands = cands.data || []
  const candsMes = todasCands.filter((c) => new Date(c.created_at).getTime() >= now - 30 * DAY)
  const registadosMes = users.filter((u) => new Date(u.created_at).getTime() >= now - 30 * DAY)
  const whatsappMes = monthEvents.filter((e) => e.tipo === 'candidatura_whatsapp').length

  const porEstado = {}
  for (const c of todasCands) porEstado[c.status] = (porEstado[c.status] || 0) + 1

  const porMunicipio = {}
  for (const c of todasCands) porMunicipio[c.municipio] = (porMunicipio[c.municipio] || 0) + 1

  const porArea = {}
  for (const c of todasCands) porArea[c.area] = (porArea[c.area] || 0) + 1

  // Sales Ops — fila de trabalho: pendentes ordenados por idade (mais antigo primeiro)
  const pendentes = todasCands
    .filter((c) => c.status === 'submetida' || c.status === 'em_verificacao')
    .map((c) => {
      const dias = Math.floor((now - new Date(c.created_at).getTime()) / DAY)
      const proxima =
        c.status === 'submetida'
          ? 'Verificar candidatura'
          : 'Decidir sentença'
      const urgencia = dias >= 7 ? 'alta' : dias >= 3 ? 'media' : 'baixa'
      return {
        referencia: c.referencia,
        equipa: c.equipa,
        projecto: c.projecto,
        municipio: c.municipio,
        area: c.area,
        status: c.status,
        created_at: c.created_at,
        dias,
        proxima,
        urgencia,
      }
    })
    .sort((a, b) => b.dias - a.dias)

  const days = []
  for (let i = 29; i >= 0; i -= 1) {
    const start = now - (i + 1) * DAY
    const label = iso(now - i * DAY).slice(0, 10)
    const inDay = (value) => new Date(value).getTime() > start && new Date(value).getTime() <= start + DAY

    days.push({
      dia: label.slice(8) + '/' + label.slice(5, 7),
      candidaturas: todasCands.filter((c) => inDay(c.created_at)).length,
      registos: users.filter((u) => inDay(u.created_at)).length,
      whatsapp: monthEvents.filter((e) => e.tipo === 'candidatura_whatsapp' && inDay(e.created_at))
        .length,
      visitas: monthEvents.filter(
        (e) => (e.tipo === 'visita' || e.tipo === 'ping') && inDay(e.created_at),
      ).length,
    })
  }

  return {
    cards: {
      online,
      submetidas_total: todasCands.length,
      submetidas_mes: candsMes.length,
      registados_total: users.length,
      registados_mes: registadosMes.length,
      whatsapp_mes: whatsappMes,
      sem_accao_mes: semAccaoMes,
      em_verificacao: porEstado.em_verificacao || 0,
      submetidas_estado: porEstado.submetida || 0,
      aprovadas: porEstado.aprovada || 0,
      rejeitadas: porEstado.rejeitada || 0,
      visitantes_mes: visitantesMes.size,
      conversao_mes: converters.size,
    },
    por_estado: porEstado,
    por_municipio: porMunicipio,
    por_area: porArea,
    funil: {
      visitantes: visitantesMes.size,
      contactos: converters.size + whatsappMes,
      candidaturas: candsMes.length,
      em_verificacao: porEstado.em_verificacao || 0,
      aprovadas: porEstado.aprovada || 0,
    },
    pendentes: pendentes.slice(0, 12),
    serie: days,
  }
}

async function usersPayload() {
  const [users, perfisRes, candsRes] = await Promise.all([
    listAllUsers(),
    sb.from('perfis').select('user_id, nome, foto_path'),
    sb.from('candidaturas').select('user_id, referencia, status, created_at'),
  ])

  const perfilMap = new Map((perfisRes.data || []).map((p) => [p.user_id, p]))
  const candsByUser = new Map()
  for (const c of candsRes.data || []) {
    if (!c.user_id) continue
    const arr = candsByUser.get(c.user_id) || []
    arr.push(c)
    candsByUser.set(c.user_id, arr)
  }

  const base = users
    .map((u) => {
      const perfil = perfilMap.get(u.id)
      const candidaturas = candsByUser.get(u.id) || []
      return {
        id: u.id,
        nome: perfil?.nome || u.user_metadata?.nome || '—',
        email: u.email,
        criado_em: u.created_at,
        ultimo_login: u.last_sign_in_at || null,
        confirmado: Boolean(u.email_confirmed_at),
        foto_path: perfil?.foto_path || null,
        n_candidaturas: candidaturas.length,
        candidaturas,
        provedor: u.app_metadata?.provider || 'email',
      }
    })
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))

  await Promise.all(
    base.map(async (u) => {
      if (!u.foto_path) return
      const { data } = await sb.storage
        .from(BUCKET_PERFIS)
        .createSignedUrl(u.foto_path, 6 * 3600_000)
      u.foto_url = data?.signedUrl || null
    }),
  )

  return base
}

async function removeStorageFolder(bucket, folder) {
  const { data } = await sb.storage.from(bucket).list(folder, { limit: 100 })
  if (data?.length) {
    await sb.storage.from(bucket).remove(data.map((f) => `${folder}/${f.name}`))
  }
}

async function deleteUserData(userId) {
  const { data: refs } = await sb
    .from('candidaturas')
    .select('referencia')
    .eq('user_id', userId)

  for (const row of refs || []) {
    await removeStorageFolder(BUCKET, row.referencia)
  }
  await removeStorageFolder(BUCKET_PERFIS, userId)

  await sb.from('candidaturas').delete().eq('user_id', userId)
  await sb.from('perfis').delete().eq('user_id', userId)

  return (refs || []).length
}

// ── Auth ─────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!mayAttemptLogin(req)) return res.status(429).json({ error: 'Demasiadas tentativas. Tenta novamente dentro de alguns minutos.' })
  if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 512) {
    failedLogin(req)
    return res.status(401).json({ error: 'Credenciais inválidas.' })
  }
  const admin = ADMINS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && verifyPassword(password, a),
  )
  if (!admin) {
    failedLogin(req)
    return res.status(401).json({ error: 'Credenciais inválidas.' })
  }
  clearLoginAttempts(req)
  res.cookie('tec_admin_session', signToken(admin), {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: 12 * 3600_000,
    path: '/api',
  })
  res.json({ admin: { name: admin.name, email: admin.email } })
})

app.get('/api/me', requireAdmin, (req, res) => res.json({ admin: req.admin }))
app.post('/api/logout', (_req, res) => {
  res.clearCookie('tec_admin_session', { httpOnly: true, secure: IS_PRODUCTION, sameSite: 'strict', path: '/api' })
  res.status(204).end()
})

// ── Dashboard ────────────────────────────────────────────────
app.get(
  '/api/dashboard',
  requireAdmin,
  requireService,
  asyncRoute(async (_req, res) => {
    res.json(await buildDashboard())
  }),
)

// ── Utilizadores ─────────────────────────────────────────────
app.get(
  '/api/users',
  requireAdmin,
  requireService,
  asyncRoute(async (_req, res) => {
    res.json({ users: await usersPayload() })
  }),
)

app.delete(
  '/api/users/:id/data',
  requireAdmin,
  requireService,
  asyncRoute(async (req, res) => {
    const n = await deleteUserData(req.params.id)
    res.json({ ok: true, apagadas: n, mensagem: 'Dados do utilizador apagados.' })
  }),
)

app.delete(
  '/api/users/:id',
  requireAdmin,
  requireService,
  asyncRoute(async (req, res) => {
    await deleteUserData(req.params.id)
    const { error } = await sb.auth.admin.deleteUser(req.params.id)
    if (error && error.message !== 'User not found') throw error
    res.json({ ok: true, mensagem: 'Conta eliminada do sistema.' })
  }),
)

// ── Candidaturas ─────────────────────────────────────────────
app.get(
  '/api/candidaturas',
  requireAdmin,
  requireService,
  asyncRoute(async (_req, res) => {
    const [{ data: rows }, users] = await Promise.all([
      sb.from('candidaturas').select('*').order('created_at', { ascending: false }),
      listAllUsers(),
    ])
    const userMap = new Map(users.map((u) => [u.id, u]))

    const withUsers = await Promise.all(
      (rows || []).map(async (row) => {
        const user = row.user_id ? userMap.get(row.user_id) : null
        let fotoUrl = null
        if (row.foto_path) {
          const { data: signed } = await sb.storage
            .from(BUCKET)
            .createSignedUrl(row.foto_path, 6 * 3600_000)
          fotoUrl = signed?.signedUrl || null
        }
        return {
          ...row,
          user_email: user?.email || null,
          user_nome: user?.user_metadata?.nome || null,
          foto_url: fotoUrl,
        }
      }),
    )

    res.json({ candidaturas: withUsers })
  }),
)

app.get(
  '/api/candidaturas/:referencia/media',
  requireAdmin,
  requireService,
  asyncRoute(async (req, res) => {
    const { data: row, error } = await sb
      .from('candidaturas')
      .select('video_path, foto_path')
      .eq('referencia', req.params.referencia)
      .single()
    if (error || !row) return res.status(404).json({ error: 'Candidatura não encontrada.' })

    const [video, foto] = await Promise.all([
      row.video_path
        ? sb.storage.from(BUCKET).createSignedUrl(row.video_path, 6 * 3600_000)
        : { data: null },
      row.foto_path
        ? sb.storage.from(BUCKET).createSignedUrl(row.foto_path, 6 * 3600_000)
        : { data: null },
    ])

    res.json({
      videoUrl: video.data?.signedUrl || null,
      fotoUrl: foto.data?.signedUrl || null,
    })
  }),
)

app.patch(
  '/api/candidaturas/:referencia',
  requireAdmin,
  requireService,
  asyncRoute(async (req, res) => {
    const { status, nota } = req.body || {}
    const validos = ['submetida', 'em_verificacao', 'aprovada', 'rejeitada']
    if (!validos.includes(status)) return res.status(400).json({ error: 'Estado inválido.' })

    const { data, error } = await sb
      .from('candidaturas')
      .update({
        status,
        admin_nota: nota || null,
        avaliado_em: new Date().toISOString(),
        avaliado_por: req.admin.name,
      })
      .eq('referencia', req.params.referencia)
      .select()
      .single()

    if (error) throw error
    res.json({ ok: true, candidatura: data })
  }),
)

app.delete(
  '/api/candidaturas/:referencia',
  requireAdmin,
  requireService,
  asyncRoute(async (req, res) => {
    const referencia = req.params.referencia
    const { data: row, error } = await sb
      .from('candidaturas')
      .select('video_path, foto_path')
      .eq('referencia', referencia)
      .single()
    if (error || !row) return res.status(404).json({ error: 'Candidatura não encontrada.' })

    await removeStorageFolder(BUCKET, referencia)
    if (row.foto_path && !row.foto_path.startsWith(`${referencia}/`)) {
      await sb.storage.from(BUCKET).remove([row.foto_path])
    }
    if (row.video_path && !row.video_path.startsWith(`${referencia}/`)) {
      await sb.storage.from(BUCKET).remove([row.video_path])
    }

    const { error: delError } = await sb.from('candidaturas').delete().eq('referencia', referencia)
    if (delError) throw delError

    console.log(
      `[TECNATO-ADMIN] Candidatura ${referencia} apagada por ${req.admin.email}`,
    )
    res.json({ ok: true, mensagem: 'Candidatura apagada definitivamente da base de dados.' })
  }),
)

// ── Relatórios ───────────────────────────────────────────────
app.get(
  '/api/reports/excel',
  requireAdmin,
  requireService,
  asyncRoute(async (_req, res) => {
    const [dashboard, users, candsRes, eventosRes] = await Promise.all([
      buildDashboard(),
      usersPayload(),
      sb.from('candidaturas').select('*').order('created_at', { ascending: false }),
      sb
        .from('eventos')
        .select('tipo, created_at')
        .gte('created_at', new Date(Date.now() - 30 * DAY).toISOString()),
    ])

    const userMap = new Map(users.map((u) => [u.id, u]))
    const wb = new ExcelJS.Workbook()
    wb.creator = 'TECNATO Admin'
    wb.created = new Date()

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B0B0B' } }
    const headerFont = { color: { argb: 'FFFFA000' }, bold: true }

    function sheet(name, columns, rows) {
      const ws = wb.addWorksheet(name)
      ws.columns = columns
      ws.getRow(1).fill = headerFill
      ws.getRow(1).font = headerFont
      ws.getRow(1).alignment = { vertical: 'middle' }
      rows.forEach((row) => ws.addRow(row))
      ws.views = [{ state: 'frozen', ySplit: 1 }]
      return ws
    }

    sheet(
      'Resumo',
      [{ header: 'Indicador', key: 'i', width: 42 }, { header: 'Valor', key: 'v', width: 18 }],
      Object.entries(dashboard.cards).map(([key, value]) => ({ i: key, v: value })),
    )

    sheet(
      'Utilizadores',
      [
        { header: 'Nome', key: 'nome', width: 28 },
        { header: 'Email', key: 'email', width: 32 },
        { header: 'Criado em', key: 'criado', width: 22 },
        { header: 'Último login', key: 'login', width: 22 },
        { header: 'Confirmado', key: 'conf', width: 12 },
        { header: 'Candidaturas', key: 'cands', width: 14 },
      ],
      users.map((u) => ({
        nome: u.nome,
        email: u.email,
        criado: new Date(u.criado_em).toLocaleString('pt-PT'),
        login: u.ultimo_login ? new Date(u.ultimo_login).toLocaleString('pt-PT') : '—',
        conf: u.confirmado ? 'Sim' : 'Não',
        cands: u.n_candidaturas,
      })),
    )

    sheet(
      'Candidaturas',
      [
        { header: 'Referência', key: 'ref', width: 14 },
        { header: 'Equipa', key: 'equipa', width: 24 },
        { header: 'Projecto', key: 'projecto', width: 26 },
        { header: 'Município', key: 'municipio', width: 16 },
        { header: 'Área', key: 'area', width: 26 },
        { header: 'WhatsApp', key: 'whats', width: 20 },
        { header: 'Email', key: 'email', width: 28 },
        { header: 'Estado', key: 'status', width: 16 },
        { header: 'Criada em', key: 'criada', width: 22 },
        { header: 'Utilizador', key: 'user', width: 28 },
        { header: 'Descrição', key: 'desc', width: 60 },
        { header: 'Sentença (nota)', key: 'nota', width: 50 },
      ],
      (candsRes.data || []).map((c) => ({
        ref: c.referencia,
        equipa: c.equipa,
        projecto: c.projecto,
        municipio: c.municipio,
        area: c.area,
        whats: c.whatsapp,
        email: c.email || '—',
        status: c.status,
        criada: new Date(c.created_at).toLocaleString('pt-PT'),
        user: c.user_id ? userMap.get(c.user_id)?.email || c.user_id : 'sem conta',
        desc: c.descricao,
        nota: c.admin_nota || '—',
      })),
    )

    const eventosAgrupados = {}
    for (const e of eventosRes.data || []) {
      const dia = e.created_at.slice(0, 10)
      const key = `${dia}|${e.tipo}`
      eventosAgrupados[key] = (eventosAgrupados[key] || 0) + 1
    }
    sheet(
      'Eventos (30 dias)',
      [
        { header: 'Data', key: 'dia', width: 14 },
        { header: 'Tipo', key: 'tipo', width: 26 },
        { header: 'Ocorrências', key: 'n', width: 14 },
      ],
      Object.entries(eventosAgrupados)
        .sort()
        .map(([key, n]) => {
          const [dia, tipo] = key.split('|')
          return { dia, tipo, n }
        }),
    )

    const buffer = await wb.xlsx.writeBuffer()
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="tecnato-crm-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    )
    res.send(Buffer.from(buffer))
  }),
)

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: Boolean(sb), admins: ADMINS.length }),
)

// ── SPA ──────────────────────────────────────────────────────
const dist = path.join(__dirname, '..', 'dist')
app.use(express.static(dist))
app.get(/^(?!\/api).*/, (_req, res, next) => {
  res.sendFile(path.join(dist, 'index.html'), (err) => {
    if (err) next()
  })
})

if (!process.env.NETLIFY) {
  app.listen(PORT, () => {
    console.log(`[TECNATO-ADMIN] API em http://localhost:${PORT}`)
    console.log(`[TECNATO-ADMIN] service key: ${sb ? 'OK' : 'EM FALTA'}`)
  })
}

export default app

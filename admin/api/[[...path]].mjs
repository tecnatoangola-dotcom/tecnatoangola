// API completa do CRM na Vercel — um único handler que recebe todas as rotas /api/*.
// O Express app é directamente compatível com o runtime Node da Vercel (req, res).
// A escuta (listen) fica desligada em serverless — ver server/index.js.
import app from '../server/index.js'

export default app

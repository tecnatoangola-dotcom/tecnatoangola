#!/usr/bin/env node
/**
 * Gera sitemap.xml dinâmico no build
 * Executa após o build do Vite: `node scripts/generate-sitemap.mjs`
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const SITE_URL = 'https://tecnatoangola.com'
const DIST_DIR = path.resolve('dist')

// Rotas públicas do site (SPA routes que devem ser indexadas)
const routes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/candidatura', changefreq: 'weekly', priority: 0.9 },
  { path: '/areas', changefreq: 'weekly', priority: 0.9 },
  { path: '/como-funciona', changefreq: 'monthly', priority: 0.8 },
  { path: '/participar', changefreq: 'weekly', priority: 0.9 },
  { path: '/faq', changefreq: 'monthly', priority: 0.6 },
  { path: '/quem-somos', changefreq: 'monthly', priority: 0.7 },
  { path: '/politica-de-privacidade', changefreq: 'yearly', priority: 0.3 },
  { path: '/projecto', changefreq: 'monthly', priority: 0.7 },
  // Rotas com noindex (não entram no sitemap):
  // /perfil, /entrar, /registar, /recuperar, /redefinir, /confirmacao
]

function getLastMod() {
  // Usa a data do último commit git se disponível, senão hoje
  try {
    const gitDate = execSync('git log -1 --format=%cd --date=iso-strict', { encoding: 'utf-8' }).trim()
    if (gitDate) return gitDate.split('T')[0]
  } catch {}
  return new Date().toISOString().split('T')[0]
}

async function generateSitemap() {
  const lastmod = getLastMod()

  const urls = routes.map(({ path: routePath, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8')
  console.log('[Sitemap] Gerado:', sitemapPath)
  console.log('[Sitemap] URLs:', routes.length)
  console.log('[Sitemap] Lastmod:', lastmod)
}

generateSitemap().catch((err) => {
  console.error('[Sitemap] Erro:', err)
  process.exit(1)
})
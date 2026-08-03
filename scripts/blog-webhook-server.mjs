#!/usr/bin/env node
/**
 * Webhook local no VPS para o n8n disparar publicação + deploy.
 * Escuta em 127.0.0.1:3921 (e 172.17.0.1 via docker0).
 *
 * POST /blog/publish
 * Header: Authorization: Bearer <BLOG_CRON_TOKEN>
 * Header opcional: X-Slot: morning|evening|n8n
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_DIR = process.env.SITE_DIR || join(__dirname, '..')
const PORT = Number(process.env.BLOG_WEBHOOK_PORT || 3921)
const HOST = process.env.BLOG_WEBHOOK_HOST || '0.0.0.0'

function loadEnv() {
  const envPath = join(SITE_DIR, '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const k = m[1]
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (!process.env[k]) process.env[k] = v
  }
}

loadEnv()
const TOKEN = process.env.BLOG_CRON_TOKEN || ''

function authorized(req) {
  if (!TOKEN) return false
  const h = req.headers.authorization || ''
  return h === `Bearer ${TOKEN}`
}

function runPublish(slot) {
  return new Promise((resolve, reject) => {
    const child = spawn('/bin/bash', [join(SITE_DIR, 'scripts/blog-cron.sh'), slot], {
      cwd: SITE_DIR,
      env: { ...process.env, SLOT: slot },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    child.stdout.on('data', (d) => {
      out += d.toString()
    })
    child.stderr.on('data', (d) => {
      out += d.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve(out)
      else reject(new Error(out || `exit ${code}`))
    })
  })
}

const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'iaxlab-blog-webhook' }))
    return
  }

  if (req.method === 'POST' && (req.url === '/blog/publish' || req.url?.startsWith('/blog/publish?'))) {
    if (!authorized(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'unauthorized' }))
      return
    }
    const slot = req.headers['x-slot'] || 'n8n'
    try {
      const log = await runPublish(String(slot))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, slot, logTail: log.slice(-2000) }))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: String(err.message || err) }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: false, error: 'not found' }))
})

server.listen(PORT, HOST, () => {
  console.log(`[blog-webhook] listening on ${HOST}:${PORT}`)
})

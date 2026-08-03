#!/usr/bin/env node
/**
 * IAX LAB — publica 1 notícia de IA (nunca repetida) no Blog IA.
 *
 * Fluxo:
 *  1. Lê public/blog/index.json (fingerprints + sourceUrls já publicados)
 *  2. Busca RSS de notícias de IA (Google News PT-BR + feeds EN)
 *  3. Escolhe a primeira URL ainda não publicada
 *  4. Gera artigo em PT-BR via xAI (Grok)
 *  5. Gera capa horizontal via xAI Images API (ou placeholder SVG)
 *  6. Grava post JSON + capa + atualiza index
 *
 * Env:
 *  XAI_API_KEY   (obrigatório para texto; recomendado para capa)
 *  DRY_RUN=1     (não grava arquivos)
 *  SLOT=morning|evening  (tag opcional no post)
 *
 * Uso:
 *  node scripts/publish-ai-news.mjs
 *  XAI_API_KEY=... node scripts/publish-ai-news.mjs
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_DIR = join(ROOT, 'public', 'blog')
const INDEX_PATH = join(BLOG_DIR, 'index.json')
const POSTS_DIR = join(BLOG_DIR, 'posts')
const COVERS_DIR = join(BLOG_DIR, 'covers')

const XAI_API_KEY = process.env.XAI_API_KEY || ''
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'
const SLOT = process.env.SLOT || ''

const RSS_FEEDS = [
  // Google News — IA (PT-BR)
  'https://news.google.com/rss/search?q=intelig%C3%AAncia+artificial+OR+%22intelig%C3%AAncia+artificial%22+OR+ChatGPT+OR+OpenAI+OR+Anthropic+when:2d&hl=pt-BR&gl=BR&ceid=BR:pt-419',
  // Google News — AI (EN, fallback)
  'https://news.google.com/rss/search?q=artificial+intelligence+OR+generative+AI+when:1d&hl=en-US&gl=US&ceid=US:en',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
]

// ——— utils ———

function log(...args) {
  console.log('[ai-blog]', ...args)
}

function fingerprintOf(url, title = '') {
  const norm = `${normalizeUrl(url)}|${title.trim().toLowerCase()}`
  return createHash('sha256').update(norm).digest('hex').slice(0, 24)
}

function normalizeUrl(url) {
  try {
    const u = new URL(url)
    u.hash = ''
    // Google News redirect wrappers with ?url=
    if (u.hostname.includes('news.google.com')) {
      const real = u.searchParams.get('url')
      if (real) return normalizeUrl(real)
    }
    // strip tracking
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(
      (k) => u.searchParams.delete(k),
    )
    return u.toString().replace(/\/$/, '')
  } catch {
    return url.trim()
  }
}

function isGoogleNewsArticleUrl(url) {
  try {
    const u = new URL(url)
    return (
      u.hostname.includes('news.google.com') &&
      (u.pathname.includes('/articles/') || u.pathname.includes('/read/'))
    )
  } catch {
    return false
  }
}

/**
 * Resolve Google News RSS wrapper -> URL real do publisher.
 * (mesma abordagem do pacote google-news-url-decoder)
 */
async function resolveGoogleNewsUrl(sourceUrl) {
  if (!isGoogleNewsArticleUrl(sourceUrl)) return normalizeUrl(sourceUrl)

  const base64Str = sourceUrl.split('/').pop().split('?')[0]
  const pageUrl = `https://news.google.com/rss/articles/${base64Str}`

  const pageRes = await fetch(pageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    },
  })
  if (!pageRes.ok) throw new Error(`gnews page HTTP ${pageRes.status}`)
  const html = await pageRes.text()
  const signature = html.match(/data-n-a-sg="([^"]+)"/)?.[1]
  const timestamp = html.match(/data-n-a-ts="([^"]+)"/)?.[1]
  if (!signature || !timestamp) throw new Error('gnews: signature/timestamp ausentes')

  const payload = [
    'Fbv4je',
    `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${base64Str}",${timestamp},"${signature}"]`,
  ]
  const body = `f.req=${encodeURIComponent(JSON.stringify([[payload]]))}`

  const apiRes = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      Origin: 'https://news.google.com',
      Referer: 'https://news.google.com/',
    },
    body,
  })
  if (!apiRes.ok) throw new Error(`gnews batchexecute HTTP ${apiRes.status}`)
  const text = await apiRes.text()
  const parts = text.split('\n\n')
  if (parts.length < 2) throw new Error('gnews: formato batchexecute inesperado')

  const parsed = JSON.parse(parts[1])
  const batch = parsed.filter(
    (d) => (d[0] === 'wrb.fr' || d[0] === 'w779db') && d[1] === 'Fbv4je',
  )
  const innerStr = batch[0]?.[2] ?? parsed[0]?.[2]
  if (!innerStr) throw new Error('gnews: resposta sem URL')
  const inner = JSON.parse(innerStr)
  const decoded = inner[1]
  if (typeof decoded !== 'string' || !decoded.startsWith('http')) {
    throw new Error('gnews: URL decodificada inválida')
  }
  return normalizeUrl(decoded)
}

async function resolveArticleUrl(url) {
  try {
    if (isGoogleNewsArticleUrl(url)) {
      const real = await resolveGoogleNewsUrl(url)
      log('fonte resolvida', real)
      return real
    }
  } catch (err) {
    log('WARN: falha ao resolver Google News', String(err.message || err))
  }
  return normalizeUrl(url)
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
}

function decodeXml(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function parseRssItems(xml) {
  const items = []
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || []
  for (const block of blocks) {
    const title = decodeXml((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim())
    let link = decodeXml((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '').trim())
    if (!link) {
      link = block.match(/<link[^>]+href="([^"]+)"/i)?.[1] || ''
    }
    // Atom-style in some feeds
    if (!link) {
      link = block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1] || ''
    }
    const pubDate = (block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || '').trim()
    const sourceName =
      decodeXml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1] || '').trim()) ||
      undefined
    const sourceHome =
      block.match(/<source[^>]+url="([^"]+)"/i)?.[1] || undefined
    if (title && link) {
      items.push({
        title: title.replace(/\s+/g, ' ').trim(),
        // URL ainda pode ser wrapper Google News; resolvemos depois
        url: link.trim(),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        publisher: sourceName,
        sourceHome,
      })
    }
  }
  return items
}

async function fetchText(url, timeoutMs = 20000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'IAX-LAB-BlogBot/1.0 (+https://iaxlab.top/blog)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return await res.text()
  } finally {
    clearTimeout(t)
  }
}

const STRONG_AI =
  /intelig[eê]ncia artificial|artificial intelligence|chatgpt|openai|anthropic|google gemini|\bgemini ai\b|\bllm\b|machine learning|genai|ia generativa|generative ai|microsoft copilot|\bcopilot\b|\bclaude\b|\bgrok\b|deepseek|mistral ai|\bnvidia\b|open source model|foundation model|agentic|autopilot de ia|modelo de linguagem|large language model/i

/** "AI" solto em política/finanças gera falso positivo (ex.: AIPAC). */
function isRelevantAiNews(title, feedUrl) {
  const t = title || ''
  if (STRONG_AI.test(t)) return true
  // feeds já temáticos
  if (
    feedUrl.includes('artificial-intelligence') ||
    feedUrl.includes('ai-artificial') ||
    feedUrl.includes('techcrunch.com/category/artificial-intelligence')
  ) {
    // ainda rejeita títulos claramente off-topic
    if (/\bAIPAC\b|crypto-funded|election poll/i.test(t)) return false
    return true
  }
  // Google News PT: aceita se tiver sinais claros de IA em PT/EN
  if (feedUrl.includes('news.google.com')) {
    if (/\b(IA|AI)\b/.test(t) && /(tech|tecnologia|startup|modelo|agente|chatbot|openai|google|meta|microsoft|amazon)/i.test(t)) {
      return true
    }
    // query PT já é "inteligência artificial" — exige ao menos um termo forte ou "IA" + contexto
    if (/intelig[eê]ncia artificial/i.test(t)) return true
    if (/\bIA\b/.test(t) && !/\bAIPAC\b/i.test(t)) return true
  }
  return false
}

async function collectCandidates(index) {
  const seenUrl = new Set(index.publishedSourceUrls.map(normalizeUrl))
  const seenFp = new Set(index.publishedFingerprints)
  const out = []

  for (let feedIndex = 0; feedIndex < RSS_FEEDS.length; feedIndex++) {
    const feed = RSS_FEEDS[feedIndex]
    try {
      log('RSS', feed.slice(0, 80) + '…')
      const xml = await fetchText(feed)
      const items = parseRssItems(xml)
      for (const item of items) {
        const fp = fingerprintOf(item.url, item.title)
        if (seenUrl.has(item.url) || seenFp.has(fp)) continue
        if (out.some((x) => x.url === item.url || x.fingerprint === fp)) continue
        if (!isRelevantAiNews(item.title, feed)) continue
        out.push({ ...item, fingerprint: fp, feedPriority: feedIndex })
      }
    } catch (err) {
      log('RSS fail', feed, String(err.message || err))
    }
  }

  // prioriza feed PT (menor feedPriority), depois mais recente
  out.sort((a, b) => {
    if (a.feedPriority !== b.feedPriority) return a.feedPriority - b.feedPriority
    return new Date(b.publishedAt) - new Date(a.publishedAt)
  })
  return out
}

async function generateArticle(item) {
  if (!XAI_API_KEY) {
    // fallback sem API: coluna curta
    log('WARN: XAI_API_KEY ausente: usando template sem LLM')
    return {
      title: item.title,
      excerpt: `Coluna do Blog IA: o que a notícia “${item.title.slice(0, 80)}…” muda para quem lidera empresa no Brasil.`,
      body: [
        `Quando uma notícia de inteligência artificial aparece, o empresário costuma reagir em dois extremos: ignora ou compra a moda sem método. Esta coluna lê o fato com frieza e traduz em decisão de operação.`,
        ``,
        `## O que a notícia diz`,
        `${item.title}.`,
        ``,
        `## Por que isso importa na operação`,
        `IA gera valor quando encaixa em processo real: contrato, atendimento, vendas, backoffice, produto. Sem padrão, segurança e dono da rotina, a ferramenta vira slide ou risco. O ponto não é “usar IA”. É **onde** a IA reduz custo, tempo e erro.`,
        ``,
        `## O que eu olharia se fosse o dono da empresa`,
        `- Qual tarefa repetitiva isso ataca?\n- Quem no time opera com método?\n- Que dado sensível entra no fluxo?\n- Como medir ganho em 30 dias?`,
        ``,
        `## Fechamento`,
        `Acompanhe a fonte original. Se fizer sentido para o seu negócio, estruture uso com consultoria, treinamento ou desenvolvimento com IA. Na IAX LAB o foco é aplicação com método, não moda.`,
      ].join('\n'),
      sources: [
        {
          title: item.title,
          url: item.url,
          publisher: item.publisher || 'Fonte original',
        },
      ],
      tags: ['IA', 'coluna', 'notícias', SLOT].filter(Boolean),
      imagePrompt: `Wide cinematic horizontal cover 16:9 about artificial intelligence news: ${item.title}. Modern tech aesthetic, green neon accents, abstract neural network, no text, no logos, photorealistic editorial style.`,
    }
  }

  const system = `Você é colunista especialista em inteligência artificial da IAX LAB (Brasil).
Escreva como humano que fala com dono de empresa: claro, direto, opinião fundamentada.
Produza COLUNA completa (resenha + análise + o que fazer na operação), não resumo.

PROIBIDO (vícios de texto de IA):
- Travessão (—) e meia-risca (–). Use ponto, vírgula, dois-pontos ou parênteses.
- Frases de preenchimento: "é importante notar", "vale ressaltar", "em suma", "além disso", "no entanto", "por outro lado", "ainda assim", "em essência", "no final do dia", "neste cenário", "no cenário atual", "cada vez mais", "não se trata apenas", "isso nos leva a".
- Tom de brochure: "hype", "solução robusta", "ecossistema", "jornada", "empoderar", "revolucionar", "transformador", "sem costura", "cutting-edge".
- Listas ternárias forçadas do tipo "seja X, Y ou Z" e "não é só X, é também Y" em excesso.

REGRAS:
- Português brasileiro natural, como conversa séria de consultor.
- Não invente números, clientes ou fatos fora do título/contexto.
- body em markdown: parágrafos longos, ## subtítulos, **negrito**, listas com "- ".
- 900 a 1400 palavras no body.
- Subtítulos úteis (fatos, leitura, Brasil, riscos, como aplicar, fechamento).
- excerpt: até 240 caracteres, sem travessão.
- imagePrompt em inglês, capa 16:9, sem texto na imagem.
- JSON válido único, sem fence markdown.`

  const user = `Escreva a coluna do Blog IA sobre esta notícia:

Título: ${item.title}
URL: ${item.url}
Publisher: ${item.publisher || 'desconhecido'}
Data da fonte: ${item.publishedAt}

Retorne JSON:
{
  "title": "título editorial forte em PT-BR (pode reescrever)",
  "excerpt": "olho da coluna, curto",
  "body": "markdown longo da coluna (900-1400 palavras)",
  "sources": [{"title":"...","url":"...","publisher":"..."}],
  "tags": ["IA", "..."],
  "imagePrompt": "english prompt for horizontal 16:9 cover, no text"
}`

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || 'grok-4.3',
      temperature: 0.55,
      // colunas longas precisam de mais tokens de saída
      max_tokens: 4500,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`xAI chat failed ${res.status}: ${t.slice(0, 400)}`)
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const jsonText = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
  let parsed
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error(`Falha ao parsear JSON do modelo: ${raw.slice(0, 300)}`)
  }

  // Fonte canônica: sempre a URL real já resolvida (nunca Google News wrapper)
  const sources = [
    {
      title: item.title,
      url: item.url,
      publisher: item.publisher || 'Fonte original',
    },
  ]
  // extras do modelo, se forem http e não google news
  if (Array.isArray(parsed.sources)) {
    for (const s of parsed.sources) {
      const u = String(s?.url || '')
      if (!u.startsWith('http')) continue
      if (u.includes('news.google.com')) continue
      if (sources.some((x) => x.url === u)) continue
      sources.push({
        title: String(s.title || item.title),
        url: u,
        publisher: s.publisher ? String(s.publisher) : undefined,
      })
    }
  }

  return {
    title: String(parsed.title || item.title).trim(),
    excerpt: String(parsed.excerpt || item.title).trim().slice(0, 240),
    body: String(parsed.body || '').trim(),
    sources,
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : ['IA'],
    imagePrompt: String(
      parsed.imagePrompt ||
        `Horizontal 16:9 editorial AI news cover, abstract neural tech, green neon, no text: ${item.title}`,
    ),
  }
}

async function generateCover(imagePrompt, slug) {
  const outFile = join(COVERS_DIR, `${slug}.jpg`)
  const publicPath = `/blog/covers/${slug}.jpg`

  if (!XAI_API_KEY) {
    log('WARN: sem XAI_API_KEY — gerando capa SVG placeholder')
    return writePlaceholderCover(slug, imagePrompt)
  }

  // xAI Imagine — https://api.x.ai/v1/images/generations
  const model = process.env.XAI_IMAGE_MODEL || 'grok-imagine-image'
  const basePrompt = `${imagePrompt}. Wide cinematic horizontal 16:9 composition, no text, no watermarks, no logos.`
  const endpoints = [
    {
      url: 'https://api.x.ai/v1/images/generations',
      body: {
        model,
        prompt: basePrompt,
        n: 1,
        response_format: 'b64_json',
        aspect_ratio: '16:9',
      },
    },
    {
      url: 'https://api.x.ai/v1/images/generations',
      body: {
        model,
        prompt: basePrompt,
        n: 1,
        response_format: 'b64_json',
      },
    },
    {
      url: 'https://api.x.ai/v1/images/generations',
      body: {
        model,
        prompt: basePrompt,
        n: 1,
      },
    },
  ]

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ep.body),
      })
      if (!res.ok) {
        log('image API', res.status, (await res.text()).slice(0, 200))
        continue
      }
      const data = await res.json()
      const b64 = data.data?.[0]?.b64_json
      const url = data.data?.[0]?.url
      if (b64) {
        if (!DRY_RUN) {
          await mkdir(COVERS_DIR, { recursive: true })
          await writeFile(outFile, Buffer.from(b64, 'base64'))
        }
        log('capa gerada (b64)', publicPath)
        return publicPath
      }
      if (url) {
        const imgRes = await fetch(url)
        const buf = Buffer.from(await imgRes.arrayBuffer())
        if (!DRY_RUN) {
          await mkdir(COVERS_DIR, { recursive: true })
          await writeFile(outFile, buf)
        }
        log('capa gerada (url)', publicPath)
        return publicPath
      }
    } catch (err) {
      log('image attempt fail', String(err.message || err))
    }
  }

  log('WARN: image API indisponível — placeholder')
  return writePlaceholderCover(slug, imagePrompt)
}

async function writePlaceholderCover(slug, prompt) {
  const publicPath = `/blog/covers/${slug}.svg`
  const file = join(COVERS_DIR, `${slug}.svg`)
  const title = (prompt || 'IA News').slice(0, 80).replace(/[<>&]/g, '')
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1f18"/>
      <stop offset="55%" stop-color="#123528"/>
      <stop offset="100%" stop-color="#0c7a52"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <circle cx="1280" cy="180" r="220" fill="#14b87a" opacity="0.18"/>
  <circle cx="320" cy="720" r="280" fill="#14b87a" opacity="0.12"/>
  <text x="80" y="120" fill="#9dffce" font-family="system-ui,sans-serif" font-size="28" font-weight="700" letter-spacing="4">BLOG IA · IAX LAB</text>
  <text x="80" y="480" fill="#f6f5f2" font-family="system-ui,sans-serif" font-size="42" font-weight="600">${title.slice(0, 48)}</text>
</svg>`
  if (!DRY_RUN) {
    await mkdir(COVERS_DIR, { recursive: true })
    await writeFile(file, svg, 'utf8')
  }
  return publicPath
}

async function loadIndex() {
  try {
    const raw = await readFile(INDEX_PATH, 'utf8')
    const idx = JSON.parse(raw)
    return {
      updatedAt: idx.updatedAt || new Date().toISOString(),
      posts: Array.isArray(idx.posts) ? idx.posts : [],
      publishedFingerprints: Array.isArray(idx.publishedFingerprints)
        ? idx.publishedFingerprints
        : [],
      publishedSourceUrls: Array.isArray(idx.publishedSourceUrls)
        ? idx.publishedSourceUrls
        : [],
    }
  } catch {
    return {
      updatedAt: new Date().toISOString(),
      posts: [],
      publishedFingerprints: [],
      publishedSourceUrls: [],
    }
  }
}

async function main() {
  log('start', new Date().toISOString(), DRY_RUN ? '(dry-run)' : '')
  await mkdir(POSTS_DIR, { recursive: true })
  await mkdir(COVERS_DIR, { recursive: true })

  const index = await loadIndex()
  const candidates = await collectCandidates(index)
  log('candidatos novos', candidates.length)

  if (!candidates.length) {
    log('Nenhuma notícia nova — saindo sem publicar (ok)')
    process.exit(0)
  }

  const raw = candidates[0]
  // Resolve wrapper Google News -> URL real do publisher
  const resolvedUrl = await resolveArticleUrl(raw.url)
  const item = {
    ...raw,
    url: resolvedUrl,
    googleNewsUrl: isGoogleNewsArticleUrl(raw.url) ? raw.url : undefined,
  }
  log('escolhida', item.title, item.url)

  // Recusa publicar se ainda for link morto do Google News
  if (isGoogleNewsArticleUrl(item.url)) {
    log('FATAL: não conseguiu resolver fonte real; abortando para não publicar link quebrado')
    process.exit(1)
  }

  const article = await generateArticle(item)
  const baseSlug = slugify(article.title) || `ia-${item.fingerprint.slice(0, 8)}`
  let slug = baseSlug
  // avoid slug collision
  let n = 2
  while (index.posts.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${n++}`
  }

  const cover = await generateCover(article.imagePrompt, slug)
  const publishedAt = new Date().toISOString()

  const fullPost = {
    slug,
    title: article.title,
    excerpt: article.excerpt,
    cover,
    publishedAt,
    sourceUrl: item.url,
    tags: article.tags,
    body: article.body,
    sources: article.sources,
    fingerprint: item.fingerprint,
  }

  const meta = {
    slug: fullPost.slug,
    title: fullPost.title,
    excerpt: fullPost.excerpt,
    cover: fullPost.cover,
    publishedAt: fullPost.publishedAt,
    sourceUrl: fullPost.sourceUrl,
    tags: fullPost.tags,
  }

  index.posts = [meta, ...index.posts]
  index.publishedFingerprints = [item.fingerprint, ...index.publishedFingerprints]
  index.publishedSourceUrls = [item.url, ...index.publishedSourceUrls]
  index.updatedAt = publishedAt

  if (DRY_RUN) {
    log('DRY_RUN post', JSON.stringify(fullPost, null, 2).slice(0, 800))
    process.exit(0)
  }

  await writeFile(join(POSTS_DIR, `${slug}.json`), JSON.stringify(fullPost, null, 2) + '\n', 'utf8')
  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2) + '\n', 'utf8')
  log('publicado', `/blog/${slug}`)
  log('done')
}

main().catch((err) => {
  console.error('[ai-blog] FATAL', err)
  process.exit(1)
})

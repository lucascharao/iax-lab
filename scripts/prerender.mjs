#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)))
const dist = join(root, 'dist')
const siteUrl = 'https://iaxlab.top'
const index = JSON.parse(await readFile(join(root, 'public/blog/index.json'), 'utf8'))
const { render } = await import(pathToFileURL(join(root, '.ssr/entry-server.js')).href)

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function structuredData(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.cover}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Person', name: 'Lucas Charão', url: `${siteUrl}/` },
    publisher: {
      '@type': 'Organization', name: 'IAX LAB', url: `${siteUrl}/`,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon-512.png` },
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    inLanguage: 'pt-BR',
  }
}

function replaceMeta(html, name, content, property = false) {
  const attr = property ? 'property' : 'name'
  const tag = `<meta ${attr}="${name}" content="${escapeHtml(content)}" />`
  const expression = new RegExp(`<meta ${attr}="${name}"[^>]*>`, 'i')
  return expression.test(html) ? html.replace(expression, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}

function pageHtml(template, route, content, meta, schema, data) {
  let html = template.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  const canonical = `${siteUrl}${route === '/' ? '/' : route}`
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, `<link rel="canonical" href="${canonical}" />`)
  html = replaceMeta(html, 'description', meta.description)
  html = replaceMeta(html, 'og:title', meta.title, true)
  html = replaceMeta(html, 'og:description', meta.description, true)
  html = replaceMeta(html, 'og:url', canonical, true)
  html = replaceMeta(html, 'twitter:title', meta.title)
  html = replaceMeta(html, 'twitter:description', meta.description)
  if (schema) {
    html = html.replace(/\s*<script id="home-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i, '')
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(schema)}</script>\n  </head>`)
  }
  if (data) {
    html = html.replace(
      '</body>',
      `<script>window.__IAX_SSR_DATA__=${JSON.stringify(data).replace(/</g, '\\u003c')}</script>\n  </body>`,
    )
  }
  return html
}

async function writeRoute(route, html) {
  const target = route === '/' ? join(dist, 'index.html') : join(dist, route.slice(1), 'index.html')
  await mkdir(join(target, '..'), { recursive: true })
  await writeFile(target, html)
}

const template = await readFile(join(dist, 'index.html'), 'utf8')
const home = {
  title: 'Consultoria, Treinamento e Palestra de IA | IAX LAB',
  description: 'Consultoria, mentoria, treinamento, palestras e desenvolvimento para empresas aplicarem inteligência artificial com método, segurança e padrão.',
}
await writeRoute('/', pageHtml(template, '/', render('/', null), home, null, null))

const blogMeta = {
  title: 'Blog IA: análises para líderes de empresas | IAX LAB',
  description: 'Análises, contexto e decisões práticas sobre inteligência artificial para líderes e empresas no Brasil.',
}
const blogData = { blogIndex: index }
await writeRoute('/blog', pageHtml(template, '/blog', render('/blog', blogData), blogMeta, {
  '@context': 'https://schema.org', '@type': 'CollectionPage', name: blogMeta.title,
  url: `${siteUrl}/blog`, inLanguage: 'pt-BR',
}, blogData))

for (const postMeta of index.posts || []) {
  const post = JSON.parse(await readFile(join(root, 'public/blog/posts', `${postMeta.slug}.json`), 'utf8'))
  const route = `/blog/${post.slug}`
  const postData = { blogPost: post }
  await writeRoute(route, pageHtml(template, route, render(route, postData), {
    title: `${post.title} | Blog IA | IAX LAB`, description: post.excerpt,
  }, structuredData(post), postData))
}

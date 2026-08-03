#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)))
const siteUrl = 'https://iaxlab.top'
const index = JSON.parse(await readFile(join(root, 'public/blog/index.json'), 'utf8'))
const today = new Date().toISOString().slice(0, 10)
const posts = Array.isArray(index.posts) ? index.posts : []

const url = (loc, lastmod, changefreq, priority) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`

const entries = [
  url(`${siteUrl}/`, today, 'weekly', '1.0'),
  url(`${siteUrl}/blog`, index.updatedAt?.slice(0, 10) || today, 'daily', '0.9'),
  ...posts.map((post) => url(
    `${siteUrl}/blog/${encodeURIComponent(post.slug)}`,
    post.publishedAt?.slice(0, 10) || today,
    'monthly',
    '0.8',
  )),
]

await writeFile(
  join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`,
)

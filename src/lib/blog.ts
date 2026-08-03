import type { BlogIndex, BlogPost, BlogPostMeta } from '../types/blog'

const BASE = '/blog'

export async function fetchBlogIndex(): Promise<BlogIndex> {
  const res = await fetch(`${BASE}/index.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Não foi possível carregar o Blog IA')
  return res.json() as Promise<BlogIndex>
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`${BASE}/posts/${encodeURIComponent(slug)}.json`, {
    cache: 'no-store', })
  if (!res.ok) throw new Error('Post não encontrado')
  return res.json() as Promise<BlogPost>
}

export function formatPostDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo', }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Markdown mínimo → HTML seguro (sem HTML cru do autor). */
export function renderSimpleMarkdown(md: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let para: string[] = []
  let list: string[] = []

  const inline = (s: string) => {
    let t = escape(s)
    t = t.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>', )
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    return t
  }

  const flushPara = () => {
    if (!para.length) return
    const text = para.join(' ').trim()
    if (text) blocks.push(`<p>${inline(text)}</p>`)
    para = []
  }

  const flushList = () => {
    if (!list.length) return
    blocks.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`)
    list = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushPara()
      flushList()
      continue
    }
    if (line.startsWith('## ')) {
      flushPara()
      flushList()
      blocks.push(`<h2>${inline(line.slice(3).trim())}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      flushPara()
      flushList()
      blocks.push(`<h2>${inline(line.slice(2).trim())}</h2>`)
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushPara()
      list.push(line.slice(2).trim())
      continue
    }
    // numbered list "1. item"
    const num = line.match(/^\d+\.\s+(.+)$/)
    if (num) {
      flushPara()
      list.push(num[1].trim())
      continue
    }
    flushList()
    para.push(line.trim())
  }
  flushPara()
  flushList()
  return blocks.join('\n')
}

export function coverUrl(meta: BlogPostMeta): string {
  if (meta.cover.startsWith('http') || meta.cover.startsWith('/')) return meta.cover
  return `${BASE}/covers/${meta.cover}`
}

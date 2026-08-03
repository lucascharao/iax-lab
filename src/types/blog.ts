/** Schema de post do Blog IA  -  gerado pela automação diária. */
export interface BlogSource {
  title: string
  url: string
  publisher?: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  cover: string
  publishedAt: string
  /** URL canônica da notícia original (dedupe) */
  sourceUrl: string
  tags: string[]
}

export interface BlogPost extends BlogPostMeta {
  /** Corpo em Markdown simples (parágrafos, **bold**, links [txt](url)) */
  body: string
  sources: BlogSource[]
  /** Hash/id estável da fonte para anti-repetição */
  fingerprint: string
}

export interface BlogIndex {
  updatedAt: string
  posts: BlogPostMeta[]
  /** fingerprints já usados  -  nunca repetir */
  publishedFingerprints: string[]
  publishedSourceUrls: string[]
}

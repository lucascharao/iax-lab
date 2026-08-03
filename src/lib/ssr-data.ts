import type { BlogIndex, BlogPost } from '../types/blog'

export interface SsrData {
  blogIndex?: BlogIndex
  blogPost?: BlogPost
}

let currentData: SsrData | null = null

export function setSsrData(data: SsrData | null) {
  currentData = data
}

export function getSsrData() {
  if (currentData) return currentData
  return (globalThis as typeof globalThis & { __IAX_SSR_DATA__?: SsrData }).__IAX_SSR_DATA__ ?? null
}

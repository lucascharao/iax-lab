import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  coverUrl,
  fetchBlogPost,
  formatPostDate,
  renderSimpleMarkdown,
} from '../lib/blog'
import type { BlogPost as BlogPostType } from '../types/blog'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setPost(null)
    setError(null)
    fetchBlogPost(slug)
      .then((p) => {
        setPost(p)
        document.title = `${p.title} | Blog IA — IAX LAB`
      })
      .catch(() => setError('Esta notícia não foi encontrada.'))
  }, [slug])

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <article className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="container-page max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-mist hover:text-neon transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog IA
          </Link>

          {error && (
            <div className="surface p-8 text-center">
              <p className="text-mist mb-4">{error}</p>
              <Link to="/blog" className="btn btn-secondary">
                Ver todas as notícias
              </Link>
            </div>
          )}

          {!error && !post && (
            <div className="animate-pulse space-y-4">
              <div className="aspect-[16/9] rounded-2xl bg-line-soft" />
              <div className="h-8 w-3/4 bg-line-soft rounded" />
              <div className="h-4 w-full bg-line-soft rounded" />
              <div className="h-4 w-5/6 bg-line-soft rounded" />
            </div>
          )}

          {post && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-mute mb-4">
                <span className="chip-accent">Blog IA</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neon" />
                  <time dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                </span>
              </div>

              <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-[2.6rem] font-semibold tracking-tight leading-[1.15] mb-5">
                {post.title}
              </h1>

              <p className="lead text-lg mb-8">{post.excerpt}</p>

              <div className="rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(15,24,20,0.12)] ring-1 ring-black/5 mb-10 aspect-[16/9] bg-panel-2">
                <img
                  src={coverUrl(post)}
                  alt={`Capa: ${post.title}`}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              </div>

              <div
                className="blog-prose space-y-4 text-mist text-[1.05rem] leading-relaxed [&_h2]:font-display [&_h2]:text-ice [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_a]:text-neon [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ice [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4"
                dangerouslySetInnerHTML={{
                  __html: renderSimpleMarkdown(post.body),
                }}
              />

              {post.sources?.length > 0 && (
                <aside className="mt-12 surface p-6 sm:p-8">
                  <h2 className="font-display text-lg font-semibold mb-4">
                    Fontes e referências
                  </h2>
                  <ul className="space-y-3">
                    {post.sources.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-2 text-sm sm:text-base text-neon font-semibold hover:underline"
                        >
                          <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            {s.title}
                            {s.publisher ? (
                              <span className="block text-mute font-medium text-xs sm:text-sm mt-0.5">
                                {s.publisher}
                              </span>
                            ) : null}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs text-mute leading-relaxed">
                    Conteúdo editorial da IAX LAB com base em fontes públicas.
                    Links abrem no site original da notícia.
                  </p>
                </aside>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link to="/blog" className="btn btn-secondary">
                  Mais notícias de IA
                </Link>
                <Link to="/#contato" className="btn btn-primary">
                  Falar com a IAX LAB
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </article>
      <Footer />
    </main>
  )
}

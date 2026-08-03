import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  coverUrl, fetchBlogPost, formatPostDate, renderSimpleMarkdown,
} from '../lib/blog'
import type { BlogPost as BlogPostType } from '../types/blog'
import { getSsrData } from '../lib/ssr-data'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<BlogPostType | null>(() => getSsrData()?.blogPost ?? null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    if (post?.slug === slug) {
      document.title = `${post.title} | Blog IA | IAX LAB`
      return
    }
    setPost(null)
    setError(null)
    fetchBlogPost(slug)
      .then((p) => {
        setPost(p)
        document.title = `${p.title} | Blog IA | IAX LAB`
      })
      .catch(() => setError('Esta notícia não foi encontrada.'))
  }, [slug, post])

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <article className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        {/* Largura de coluna de revista / colunista */}
        <div className="container-page max-w-[42rem]">
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
                <span className="chip-accent">Coluna · Blog IA</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neon" />
                  <time dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl md:text-[1.65rem] font-semibold tracking-tight leading-snug mb-4">
                {post.title}
              </h1>

              <p className="text-mist text-base sm:text-[1.05rem] leading-relaxed mb-6 border-l-2 border-cta pl-4">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-line-soft">
                <img
                  src="/lucas.webp"
                  alt="Lucas Charão"
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-black/10"
                  width={44}
                  height={44}
                />
                <div>
                  <p className="font-display font-semibold text-ice text-[0.95rem]">
                    Lucas Charão
                  </p>
                  <p className="text-xs text-mute font-medium">
                    Colunista · especialista em IA para empresas · IAX LAB
                  </p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(15,24,20,0.12)] ring-1 ring-black/5 mb-10 sm:mb-12 aspect-[16/9] bg-panel-2">
                <img
                  src={coverUrl(post)}
                  alt={`Capa: ${post.title}`}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              </div>

              {/* Tipografia de coluna: corpo generoso, leitura longa */}
              <div
                className="blog-column text-ice/90 text-[1.125rem] sm:text-[1.2rem] leading-[1.8] sm:leading-[1.85]
                  [&_h2]:font-display [&_h2]:text-ice [&_h2]:text-[1.35rem] [&_h2]:sm:text-[1.55rem]
                  [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-snug
                  [&_p]:mb-5 sm:[&_p]:mb-6
                  [&_a]:text-neon [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2
                  [&_strong]:text-ice [&_strong]:font-bold
                  [&_ul]:my-5 [&_ul]:pl-5 [&_ul]:space-y-2.5 [&_ul]:list-disc
                  [&_li]:text-mist [&_li]:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderSimpleMarkdown(post.body), }}
              />

              {post.sources?.length > 0 && (
                <aside className="mt-14 surface p-6 sm:p-8">
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
                    Coluna editorial da IAX LAB com base em fontes públicas.
                    Opinião do colunista; fatos da notícia nas referências.
                  </p>
                </aside>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link to="/blog" className="btn btn-secondary">
                  Mais colunas de IA
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

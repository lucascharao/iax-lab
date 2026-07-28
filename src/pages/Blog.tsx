import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Newspaper } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { coverUrl, fetchBlogIndex, formatPostDate } from '../lib/blog'
import type { BlogPostMeta } from '../types/blog'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostMeta[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title =
      'Blog IA | Notícias de inteligência artificial — IAX LAB'
    fetchBlogIndex()
      .then((idx) => setPosts(idx.posts))
      .catch(() => setError('Não foi possível carregar as notícias agora.'))
  }, [])

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mb-10 sm:mb-14"
          >
            <p className="eyebrow">Blog IA</p>
            <h1 className="heading-lg text-[1.85rem] sm:text-4xl md:text-5xl mb-4">
              Notícias de inteligência artificial{' '}
              <span className="accent-text">atualizadas todo dia.</span>
            </h1>
            <p className="lead">
              Duas vezes ao dia (7h30 e 18h) publicamos uma notícia de IA com
              resumo, capa, data e links das fontes — sem repetir o mesmo tema.
            </p>
          </motion.div>

          {error && (
            <div className="surface p-6 text-mist max-w-xl">{error}</div>
          )}

          {!error && posts === null && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="surface overflow-hidden animate-pulse"
                >
                  <div className="aspect-[16/10] bg-line-soft" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-24 bg-line-soft rounded" />
                    <div className="h-5 w-full bg-line-soft rounded" />
                    <div className="h-4 w-4/5 bg-line-soft rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {posts && posts.length === 0 && (
            <div className="surface p-10 text-center max-w-lg mx-auto">
              <Newspaper className="w-10 h-10 text-neon mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">
                Em breve, as primeiras notícias
              </h2>
              <p className="text-mist text-sm leading-relaxed">
                A automação publica o primeiro post às 7h30 ou 18h (horário de
                Brasília). Volte em breve.
              </p>
            </div>
          )}

          {posts && posts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="card group flex flex-col h-full overflow-hidden !p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-panel-2">
                      <img
                        src={coverUrl(post)}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading={i < 3 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-mute mb-3">
                        <Calendar className="w-3.5 h-3.5 text-neon" />
                        <time dateTime={post.publishedAt}>
                          {formatPostDate(post.publishedAt)}
                        </time>
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight leading-snug group-hover:text-neon transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-mist text-sm leading-relaxed flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 text-sm font-bold text-neon inline-flex items-center gap-1">
                        Ler notícia
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { WA } from '../lib/whatsapp'

function sectionHref(hash: string, isHome: boolean) {
  return isHome ? hash : `/${hash}`
}

export default function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Soluções', href: sectionHref('#servicos', isHome) }, { label: 'Resultados', href: sectionHref('#resultados', isHome) }, { label: 'Eventos', href: sectionHref('#eventos', isHome) }, { label: 'Blog IA', href: '/blog' }, { label: 'Dúvidas', href: sectionHref('#faq', isHome) }, ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-white/95 backdrop-blur-xl border-b border-line-soft shadow-[0_8px_30px_rgba(15,24,20,0.06)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-page flex items-center justify-between h-[4.5rem] sm:h-[5rem]">
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 group"
          onClick={() => setOpen(false)}
          aria-label="IAX LAB: início"
        >
          <img
            src="/logo-iax.png"
            alt="IAX LAB: consultoria e treinamento de IA"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover shadow-sm ring-1 ring-black/10 group-hover:opacity-95 transition-opacity"
            width="56"
            height="56"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) =>
            l.href.startsWith('/') && !l.href.includes('#') ? (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname.startsWith('/blog')
                    ? 'text-neon'
                    : 'text-mist hover:text-ice'
                }`}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-mist hover:text-ice transition-colors"
              >
                {l.label}
              </a>
            ), )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !py-2 !px-3.5 sm:!py-2.5 sm:!px-4 text-xs sm:text-sm !min-h-0"
          >
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">Falar no WhatsApp</span>
          </a>
          <button
            type="button"
            className="lg:hidden w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-ice"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-line-soft bg-white overflow-hidden"
          >
            <div className="container-page py-3 flex flex-col">
              {links.map((l) =>
                l.href.startsWith('/') && !l.href.includes('#') ? (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3.5 text-base font-semibold text-ice border-b border-line-soft last:border-0"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3.5 text-base font-semibold text-ice border-b border-line-soft last:border-0"
                  >
                    {l.label}
                  </a>
                ), )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

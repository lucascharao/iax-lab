import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-white border-t border-line-soft py-8 sm:py-10">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <Link
            to="/"
            className="flex items-center"
            aria-label="IAX LAB — consultoria e treinamento de IA"
          >
            <img
              src="/logo-iax.png"
              alt="IAX LAB — inteligência artificial para empresas"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover shadow-md ring-1 ring-black/10"
              width="96"
              height="96"
            />
          </Link>
          <nav
            aria-label="Seções do site"
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-mist"
          >
            <a href="/#servicos" className="hover:text-neon transition-colors">
              Serviços de IA
            </a>
            <Link to="/blog" className="hover:text-neon transition-colors">
              Blog IA
            </Link>
            <a href="/#eventos" className="hover:text-neon transition-colors">
              Eventos
            </a>
            <a href="/#faq" className="hover:text-neon transition-colors">
              Dúvidas
            </a>
            <a href="/#contato" className="hover:text-neon transition-colors">
              Contato
            </a>
          </nav>
        </div>
        <p className="mt-5 text-center text-xs sm:text-sm font-medium text-mute">
          Consultoria de IA · Mentoria · Treinamento e Curso de IA · Palestra de IA ·
          Desenvolvimento com IA · Blog IA
        </p>
        <div className="mt-6 pt-5 border-t border-line-soft flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-mute">
          <p className="text-center md:text-left">
            Inteligência artificial com método — ensinar o time e desenvolver com IA
            quando a operação precisa.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} IAX LAB</p>
        </div>
      </div>
    </footer>
  )
}

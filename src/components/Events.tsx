import { motion } from 'framer-motion'
import SocialCards, { type CardItem } from './ui/card-fan-carousel'

const EVENT_CARDS: CardItem[] = [
  {
    imgUrl: '/events/palestra-qr.jpg',
    alt: 'Lucas Charão em palestra de IA com microfone em evento corporativo',
  },
  {
    imgUrl: '/events/podcast.jpg',
    alt: 'Podcast sobre inteligência artificial e conteúdo de IA para empresas',
    // landscape 1400×683 — contain evita cortar os rostos no card retrato
    objectFit: 'contain',
    objectPosition: 'center center',
  },
  {
    imgUrl: '/events/mentoria-aiox.jpg',
    alt: 'Mentoria e treinamento de IA hands-on com equipe',
  },
  {
    imgUrl: '/events/palestra-palco.jpg',
    alt: 'Palestra com IA em palco para público corporativo',
  },
  {
    imgUrl: '/events/networking-1.jpg',
    alt: 'Networking em evento de inteligência artificial corporativa',
  },
  {
    imgUrl: '/events/networking-2.jpg',
    alt: 'Conversa com líderes sobre consultoria e treinamento de IA',
  },
  {
    imgUrl: '/events/evento-extra.jpg',
    alt: 'Evento e bastidores de palestra de IA com Lucas Charão',
  },
  {
    imgUrl: '/events/evento-heic.png',
    alt: 'Registro de palestra e evento de IA com Lucas Charão',
  },
]

/** Galeria em leque (fan carousel) — eventos, palcos e bastidores. */
export default function Events() {
  return (
    <section id="eventos" className="section band-white border-y border-line-soft overflow-hidden">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="section-center max-w-2xl mx-auto mb-4 md:mb-6"
        >
          <p className="eyebrow">Palestras de IA e bastidores</p>
          <h2 className="heading-lg text-[1.75rem] sm:text-3xl md:text-5xl mb-4">
            Palestras de IA, podcasts e{' '}
            <span className="accent-text">mãos na operação.</span>
          </h2>
          <p className="lead">
            Passe o mouse ou use as setas para navegar — palestras com IA, mentorias,
            treinamento e conteúdo sobre inteligência artificial.
          </p>
        </motion.div>
      </div>

      <SocialCards cards={EVENT_CARDS} />
    </section>
  )
}

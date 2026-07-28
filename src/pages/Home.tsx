import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import PartnerMarquee from '../components/PartnerMarquee'
import Problem from '../components/Problem'
import Services from '../components/Services'
import Proof from '../components/Proof'
import Events from '../components/Events'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import { initSmoothScroll } from '../lib/scroll'

export default function Home() {
  useEffect(() => initSmoothScroll(), [])

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TrustBar />
      <PartnerMarquee />
      <Problem />
      <Services />
      <Proof />
      <Events />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}

import { GiantMarquee, BgColorShift, type BgEntry } from '@shared/lib/animation'
import { Hero } from './sections/Hero'
import { TrustLogos } from './sections/TrustLogos'
import { Marquee } from './sections/Marquee'
import { Categories } from './sections/Categories'
import { StatsBand } from './sections/StatsBand'
import { HowItWorks } from './sections/HowItWorks'
import { EventsSection } from './sections/EventsSection'
import { VenuesSection } from './sections/VenuesSection'
import { Features } from './sections/Features'
import { ProductPreview } from './sections/ProductPreview'
import { Testimonials } from './sections/Testimonials'
import { Pricing } from './sections/Pricing'
import { FAQ } from './sections/FAQ'
import { Contact } from './sections/Contact'
import { FinalCTA } from './sections/FinalCTA'

const BG_ENTRIES: BgEntry[] = [
  { selector: '#sect-hero', color: '#050511' },
  { selector: '#sect-categories', color: '#08081a' },
  { selector: '#sect-stats', color: '#0a0518' },
  { selector: '#sect-events', color: '#050514' },
  { selector: '#sect-how', color: '#0c0820' },
  { selector: '#sect-venues', color: '#08081a' },
  { selector: '#sect-features', color: '#050511' },
  { selector: '#sect-product', color: '#0d0520' },
  { selector: '#sect-testi', color: '#050518' },
  { selector: '#sect-pricing', color: '#0a0820' },
  { selector: '#sect-faq', color: '#050511' },
  { selector: '#sect-contact', color: '#0a0820' },
  { selector: '#sect-cta', color: '#050511' },
]

export function HomePage() {
  return (
    <div className="dark:text-cream text-white">
      <BgColorShift entries={BG_ENTRIES} />

      <div id="sect-hero">
        <Hero />
      </div>
      <TrustLogos />
      <Marquee />

      <div id="sect-categories">
        <Categories />
      </div>

      <GiantMarquee text="Tashkil et • Sotuv boshla • Daromad qil • Boshqar • O'sib bor" />

      <div id="sect-stats">
        <StatsBand />
      </div>

      <div id="sect-events">
        <EventsSection />
      </div>

      <div id="sect-how">
        <HowItWorks />
      </div>

      <GiantMarquee text="Maydon • Xizmat • Chipta • Vendor • Volontyor • Reyting" />

      <div id="sect-venues">
        <VenuesSection />
      </div>

      <div id="sect-features">
        <Features />
      </div>

      <div id="sect-product">
        <ProductPreview />
      </div>

      <div id="sect-testi">
        <Testimonials />
      </div>

      <GiantMarquee text="Bepul boshla • Pro o'sib bor • Biznes scale qil" />

      <div id="sect-pricing">
        <Pricing />
      </div>

      <div id="sect-faq">
        <FAQ />
      </div>

      <div id="sect-contact">
        <Contact />
      </div>

      <div id="sect-cta">
        <FinalCTA />
      </div>
    </div>
  )
}

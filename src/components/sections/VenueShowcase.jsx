import SectionLabel from '../ui/SectionLabel'
import { Check } from 'lucide-react'

const features = [
  'Curated collection of 120+ exclusive venues worldwide',
  'Dedicated senior event director for every project',
  'Access to luxury vendors and suppliers',
  'End-to-end logistics and on-site management',
  'Bespoke styling, florals, and entertainment',
]

const images = [
  'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
]

export default function VenueShowcase() {
  return (
    <section id="venues" className="py-28 bg-surface overflow-hidden">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <SectionLabel>Our Venues</SectionLabel>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2 mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              Spaces That{' '}
              <span className="italic text-gold-gradient">Inspire</span>
            </h2>
            <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-8">
              From Mayfair drawing rooms to clifftop estates in Santorini — our curated portfolio
              spans the globe's most coveted addresses. Every space is vetted for exclusivity,
              aesthetic, and operational excellence.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-gold/10 border border-brand-gold/30
                    flex items-center justify-center mt-0.5">
                    <Check size={11} className="text-brand-gold" />
                  </span>
                  <span className="text-on-surface-variant font-body text-sm leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <a href="#book" className="btn-primary">
              Explore Venues
            </a>
          </div>

          {/* Right — Image mosaic */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-xl shadow-card group ${i === 1 ? 'mt-8' : ''} ${i === 3 ? '-mt-8' : ''}`}
              >
                <img
                  src={src}
                  alt={`Venue ${i + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

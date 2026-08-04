import { ArrowRight, ChevronDown } from 'lucide-react'
import heroImage from '../../IMG_2008.jpg';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury event venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-max relative z-10 py-40">
        <div className="max-w-3xl">
          {/* Label */}
          <p className="section-label text-brand-gold mb-6">
            Luxury Event Management
          </p>

          {/* Headline */}
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}>
            Where Every{' '}
            <span className="relative italic">
              Detail
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold" />
            </span>
            {' '}Tells a Story
          </h1>

          <p className="text-white/70 text-lg font-body leading-relaxed mb-10 max-w-xl">
            Bespoke events crafted with precision for the world's most discerning clientele.
            From intimate galas to landmark occasions — we deliver the extraordinary.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a href="#book" className="btn-gold">
              Plan Your Event
              <ArrowRight size={16} />
            </a>
            <a href="#events" className="btn-ghost border-white/30 text-white hover:border-brand-gold hover:text-brand-gold">
              Explore Events
            </a>
          </div>

          {/* Trust line */}
          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Client"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-brand-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-white/60 text-xs font-body">
                Trusted by <span className="text-white font-semibold">500+</span> elite clients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#events"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-smooth"
      >
        <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  )
}

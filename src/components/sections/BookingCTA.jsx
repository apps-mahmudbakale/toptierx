import { ArrowRight } from 'lucide-react'

export default function BookingCTA() {
  return (
    <section id="book" className="py-28 bg-surface-container">
      <div className="container-max">
        <div className="relative overflow-hidden rounded-2xl bg-brand-black px-8 md:px-20 py-20 text-center shadow-card-hover">
          {/* Background accent circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />

          {/* Label */}
          <p className="section-label text-brand-gold mb-6">Begin Your Journey</p>

          {/* Headline */}
          <h2 className="font-headline text-4xl md:text-6xl font-bold text-white mb-6 relative z-10"
            style={{ letterSpacing: '-0.02em' }}>
            Your{' '}
            <span className="text-gold-gradient italic">Extraordinary</span>
            {' '}Event Awaits
          </h2>

          <p className="text-white/50 font-body text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Speak with our concierge team today and let us transform your vision into a moment
            that lives forever in memory.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:hello@toptierxperienz.com" className="btn-gold">
              Start Planning
              <ArrowRight size={16} />
            </a>
            <a href="tel:+442079460958" className="btn-ghost border-white/20 text-white hover:border-brand-gold hover:text-brand-gold">
              Call Concierge
            </a>
          </div>

          {/* Trust */}
          <p className="mt-10 text-white/25 text-xs font-body tracking-wide">
            Available 24 hours · Discretion guaranteed · Global service
          </p>
        </div>
      </div>
    </section>
  )
}

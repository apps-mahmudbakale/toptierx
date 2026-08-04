import { useState } from 'react'
import SectionLabel from '../ui/SectionLabel'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      "TopTier Xperienz transformed our annual gala into something that transcended expectation. Every guest left speechless. They didn't just manage an event — they created a memory.",
    name: 'Lady Arabella Whitmore',
    role: 'Patron, The Whitmore Foundation',
    event: 'Annual Charity Gala, The Ritz London',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
  },
  {
    quote:
      "The precision and elegance they brought to our product launch was extraordinary. Our stakeholders were genuinely moved. TopTier operates at a level I've never seen from any event agency.",
    name: 'James Ashford-Ellis',
    role: 'CEO, Meridian Wealth Partners',
    event: 'Product Launch, Four Seasons Mayfair',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80',
  },
  {
    quote:
      "Our wedding weekend in Tuscany was flawless — from the rehearsal dinner to the farewell brunch. They understood our vision immediately and elevated it beyond imagination.",
    name: 'Sofia & Marcus Delacroix',
    role: 'Private Clients',
    event: 'Destination Wedding, Villa Corsini, Tuscany',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80',
  },
]

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx(i => (i + 1) % testimonials.length)
  const t = testimonials[idx]

  return (
    <section id="testimonials" className="py-28 bg-brand-black">
      <div className="container-max">
        <div className="text-center mb-16">
          <SectionLabel light>Client Stories</SectionLabel>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mt-2"
            style={{ letterSpacing: '-0.02em' }}>
            Words From Our Clients
          </h2>
        </div>

        {/* Testimonial card */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card bg-white/5 border-white/10 p-10 md:p-14 text-center rounded-2xl shadow-card-hover">
            <Quote size={36} className="text-brand-gold mx-auto mb-8 opacity-60" />

            <blockquote className="font-headline text-xl md:text-2xl font-medium text-white/90 leading-relaxed mb-10 italic">
              "{t.quote}"
            </blockquote>

            <div className="flex flex-col items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-14 h-14 rounded-full border-2 border-brand-gold/30 object-cover"
              />
              <div>
                <p className="text-white font-body font-semibold text-base">{t.name}</p>
                <p className="text-white/40 text-sm font-body">{t.role}</p>
                <p className="text-brand-gold/70 text-xs font-body mt-1 tracking-wide" style={{ letterSpacing: '0.06em' }}>
                  {t.event}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/50
                hover:border-brand-gold/50 hover:text-brand-gold transition-smooth"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? 'w-6 h-2 bg-brand-gold' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/50
                hover:border-brand-gold/50 hover:text-brand-gold transition-smooth"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

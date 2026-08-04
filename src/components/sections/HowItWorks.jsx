import SectionLabel from '../ui/SectionLabel'

const steps = [
  {
    number: '01',
    title: 'Share Your Vision',
    description:
      'Tell us about your dream event — the occasion, scale, aesthetic, and any special requirements. Our concierge team is available 24/7.',
  },
  {
    number: '02',
    title: 'Bespoke Curation',
    description:
      'We craft a tailored proposal: venue selection, vendors, timeline, and styling — all aligned with your vision and curated for excellence.',
  },
  {
    number: '03',
    title: 'Flawless Execution',
    description:
      'On the day, our dedicated team orchestrates every detail so you can be fully present. We handle everything; you enjoy the extraordinary.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-28 bg-surface-container">
      <div className="container-max">
        <div className="text-center mb-16">
          <SectionLabel>The Process</SectionLabel>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2"
            style={{ letterSpacing: '-0.02em' }}>
            Crafted With Intention
          </h2>
          <p className="mt-4 text-on-surface-variant font-body text-lg max-w-xl mx-auto leading-relaxed">
            A seamless journey from first conversation to the final toast.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

          {steps.map(({ number, title, description }, i) => (
            <div key={number} className="relative flex flex-col items-center text-center group">
              {/* Number badge */}
              <div className="relative z-10 w-24 h-24 rounded-full border-2 border-brand-gold/30 flex items-center justify-center mb-8
                bg-surface group-hover:border-brand-gold transition-all duration-500 group-hover:shadow-gold-glow">
                <span className="font-headline text-3xl font-bold text-brand-gold">{number}</span>
              </div>

              <h3 className="font-headline text-xl font-semibold text-on-surface mb-3">
                {title}
              </h3>
              <p className="text-on-surface-variant font-body text-base leading-relaxed max-w-xs">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

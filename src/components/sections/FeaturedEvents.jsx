import { useContext } from 'react'
import { EventContext } from '../../context/EventContext'
import EventCard from '../ui/EventCard'
import SectionLabel from '../ui/SectionLabel'
import { ArrowRight } from 'lucide-react'

export default function FeaturedEvents() {
  const { events, loading, error } = useContext(EventContext)

  if (loading) {
    return (
      <section id="events" className="py-28 bg-surface">
        <div className="container-max">
          <div className="text-center">
            <p className="font-body text-on-surface-variant">Loading events...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="events" className="py-28 bg-surface">
        <div className="container-max">
          <div className="text-center">
            <p className="font-body text-error">Failed to load events: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section id="events" className="py-28 bg-surface">
        <div className="container-max">
          <div className="text-center">
            <p className="font-body text-on-surface-variant">No events available at this time.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="py-28 bg-surface">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <SectionLabel>Upcoming Events</SectionLabel>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2"
              style={{ letterSpacing: '-0.02em' }}>
              Curated Experiences
            </h2>
          </div>
          <a href="#" className="group flex items-center gap-2 text-sm font-body font-semibold text-on-surface-variant hover:text-brand-gold transition-smooth">
            View all events
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {events.map((event, i) => (
            <EventCard key={event.id} {...event} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

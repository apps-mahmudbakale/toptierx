import EventCard from '../ui/EventCard'
import SectionLabel from '../ui/SectionLabel'
import { ArrowRight } from 'lucide-react'

const events = [
  {
    id: 'gala-obsidian',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    category: 'Gala',
    date: 'Sep 12, 2026',
    title: 'The Obsidian Gala — An Evening of Timeless Elegance',
    venue: 'The Ritz London',
  },
  {
    id: 'summit-luxe',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: 'Networking',
    date: 'Oct 03, 2026',
    title: 'Summit Luxe — Where Visionaries Connect',
    venue: 'Four Seasons, Mayfair',
  },
  {
    id: 'soiree-privee',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    category: 'Private Dinner',
    date: 'Oct 21, 2026',
    title: 'Soirée Privée — An Exclusive Culinary Journey',
    venue: 'Sketch, London',
  },
]

export default function FeaturedEvents() {
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
            <EventCard key={i} {...event} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import Chip from '../components/ui/Chip'
import SectionLabel from '../components/ui/SectionLabel'

// Mock database for events
const eventsDB = {
  'gala-obsidian': {
    title: 'The Obsidian Gala — An Evening of Timeless Elegance',
    date: 'Sep 12, 2026',
    time: '19:00 - 02:00',
    venue: 'The Ritz London',
    capacity: '250 Guests',
    category: 'Gala',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80',
    description: `Immerse yourself in unparalleled luxury at The Obsidian Gala. Set within the iconic halls of The Ritz London, this exclusive evening brings together visionaries, tastemakers, and global luminaries for a night of curated performances, Michelin-starred gastronomy, and rare vintage tastings.

Dress code is strictly Black Tie. The evening commences with a champagne reception, followed by a multi-sensory dining experience crafted by our master chefs.`,
    itinerary: [
      { time: '19:00', desc: 'Champagne & Caviar Reception' },
      { time: '20:30', desc: 'Five-Course Tasting Menu' },
      { time: '22:30', desc: 'Private Performance & Dancing' },
      { time: '01:00', desc: 'Midnight Digestifs' }
    ]
  },
  'summit-luxe': {
    title: 'Summit Luxe — Where Visionaries Connect',
    date: 'Oct 03, 2026',
    time: '09:00 - 18:00',
    venue: 'Four Seasons, Mayfair',
    capacity: '150 Guests',
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
    description: `A transformative leadership summit designed exclusively for C-suite executives and founders. Summit Luxe goes beyond traditional networking, offering immersive masterclasses, closed-door strategy sessions, and curated one-on-one introductions.`,
    itinerary: [
      { time: '09:00', desc: 'Registration & Barista Breakfast' },
      { time: '10:00', desc: 'Opening Keynote' },
      { time: '13:00', desc: 'Networking Luncheon' },
      { time: '15:30', desc: 'Industry Roundtables' }
    ]
  },
  'soiree-privee': {
    title: 'Soirée Privée — An Exclusive Culinary Journey',
    date: 'Oct 21, 2026',
    time: '20:00 - 00:00',
    venue: 'Sketch, London',
    capacity: '40 Guests',
    category: 'Private Dinner',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80',
    description: `A highly intimate dining experience reserved for only 40 guests. Soirée Privée transforms Sketch into a private haven of culinary exploration. Each dish is paired with wines from some of the most inaccessible cellars in the world.`,
    itinerary: [
      { time: '20:00', desc: 'Welcome Cocktails' },
      { time: '20:45', desc: 'Seated Dinner Commences' },
      { time: '22:30', desc: 'Chef’s Toast & Dessert Art' },
    ]
  }
}

export default function EventDetails() {
  const { id } = useParams()
  const event = eventsDB[id]

  if (!event) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <h1 className="font-headline text-4xl mb-4 text-on-surface">Event not found</h1>
        <Link to="/" className="text-brand-gold hover:underline">Return to home</Link>
      </div>
    )
  }

  return (
    <main className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-end pb-16">
        <img 
          src={event.image} 
          alt={event.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        
        <div className="container-max relative z-10">
          <Chip variant="dark" className="mb-6">{event.category}</Chip>
          <h1 className="font-headline text-4xl md:text-6xl text-white font-bold leading-tight max-w-4xl mb-6">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/80 font-body text-sm md:text-base">
            <span className="flex items-center gap-2">
              <Calendar size={18} className="text-brand-gold" /> {event.date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} className="text-brand-gold" /> {event.venue}
            </span>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 bg-surface">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <SectionLabel>About The Event</SectionLabel>
              <h2 className="font-headline text-3xl font-semibold mt-2 mb-8 text-on-surface">
                Experience The Extraordinary
              </h2>
              <div className="prose prose-lg text-on-surface-variant font-body mb-16 whitespace-pre-line">
                {event.description}
              </div>

              <h3 className="font-headline text-2xl font-semibold mb-6 text-on-surface border-b border-outline-variant pb-4">
                Itinerary
              </h3>
              <ul className="space-y-6">
                {event.itinerary.map((item, idx) => (
                  <li key={idx} className="flex gap-6">
                    <span className="font-headline font-semibold text-brand-gold w-16 shrink-0">{item.time}</span>
                    <span className="font-body text-on-surface-variant">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar Sticky */}
            <div className="relative">
              <div className="sticky top-32 glass-card p-8 border-t-4 border-t-brand-gold">
                <h3 className="font-headline text-2xl font-semibold mb-6 text-on-surface">Event Details</h3>
                
                <div className="space-y-5 mb-8 font-body text-sm text-on-surface-variant">
                  <div className="flex items-start gap-4">
                    <Calendar size={20} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-on-surface">Date</p>
                      <p>{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock size={20} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-on-surface">Time</p>
                      <p>{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin size={20} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-on-surface">Venue</p>
                      <p>{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users size={20} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-on-surface">Capacity</p>
                      <p>{event.capacity}</p>
                    </div>
                  </div>
                </div>

                <Link to={`/event/${id}/tickets`} className="btn-primary w-full justify-center text-center">
                  Get Tickets
                  <ArrowRight size={16} />
                </Link>
                <p className="text-xs text-center text-on-surface-variant mt-4 font-body">
                  Secure your place. Limited availability.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

import { Calendar, MapPin, Ticket, User, Settings, CreditCard, LogOut, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import Chip from '../components/ui/Chip'

const upcomingEvents = [
  {
    id: 'gala-obsidian',
    title: 'The Obsidian Gala — An Evening of Timeless Elegance',
    date: 'Sep 12, 2026',
    time: '19:00',
    venue: 'The Ritz London',
    ticketType: 'VIP Experience',
    ticketId: 'VIP-7492-XQ',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  }
]

const pastEvents = [
  {
    id: 'summer-soiree',
    title: 'Midsummer Soirée',
    date: 'Jun 21, 2026',
    time: '20:00',
    venue: 'Kensington Roof Gardens',
    ticketType: 'General Access',
    image: 'https://images.unsplash.com/photo-1519671482749-fd098f382a89?w=800&q=80',
  }
]

export default function Dashboard() {
  return (
    <main className="pt-32 pb-20 bg-surface min-h-screen">
      <div className="container-max">
        
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>My Account</SectionLabel>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2">
            Welcome back, John
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 flex flex-col gap-2 sticky top-32">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-brand-gold/10 text-brand-gold font-body font-semibold transition-smooth">
                <Ticket size={18} />
                My Tickets
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-surface-hover hover:text-on-surface font-body font-medium transition-smooth">
                <User size={18} />
                Profile
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-surface-hover hover:text-on-surface font-body font-medium transition-smooth">
                <CreditCard size={18} />
                Payment Methods
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-surface-hover hover:text-on-surface font-body font-medium transition-smooth">
                <Settings size={18} />
                Settings
              </a>
              <div className="my-2 border-t border-outline-variant/30"></div>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-error hover:bg-error/10 font-body font-medium transition-smooth">
                <LogOut size={18} />
                Sign Out
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            
            {/* Upcoming Events */}
            <section>
              <h2 className="font-headline text-2xl font-semibold mb-6 text-on-surface border-b border-outline-variant pb-4">
                Upcoming Events
              </h2>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="glass-card overflow-hidden flex flex-col md:flex-row group">
                      <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <Chip variant="light">{event.ticketType}</Chip>
                            <span className="text-xs font-mono bg-surface-hover px-2 py-1 rounded text-on-surface-variant">
                              ID: {event.ticketId}
                            </span>
                          </div>
                          <Link to={`/event/${event.id}`}>
                            <h3 className="font-headline text-xl font-semibold text-on-surface mb-4 hover:text-brand-gold transition-colors">
                              {event.title}
                            </h3>
                          </Link>
                          <div className="flex flex-wrap gap-4 text-on-surface-variant text-sm font-body">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-brand-gold" />
                              {event.date} at {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-brand-gold" />
                              {event.venue}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                          <button className="text-brand-gold font-body text-sm font-semibold hover:underline flex items-center gap-2">
                            <Download size={14} /> Download Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <p className="text-on-surface-variant font-body mb-4">You have no upcoming events.</p>
                  <Link to="/" className="btn-primary">Browse Events</Link>
                </div>
              )}
            </section>

            {/* Past Events */}
            <section>
              <h2 className="font-headline text-2xl font-semibold mb-6 text-on-surface border-b border-outline-variant pb-4">
                Past Events
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastEvents.map((event) => (
                  <div key={event.id} className="glass-card p-6 flex gap-4 items-center opacity-80 hover:opacity-100 transition-opacity">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-headline font-semibold text-on-surface mb-1">{event.title}</h4>
                      <p className="font-body text-xs text-on-surface-variant mb-2">{event.date}</p>
                      <Chip variant="light">{event.ticketType}</Chip>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}

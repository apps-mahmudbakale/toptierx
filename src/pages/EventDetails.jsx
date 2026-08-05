import { useParams, Link } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { EventContext } from '../context/EventContext'
import { Calendar, MapPin, Clock, Users, ArrowRight, Loader } from 'lucide-react'
import Chip from '../components/ui/Chip'
import { neonService } from '../services/neonDb'

export default function EventDetails() {
  const { id } = useParams()
  const { getEventById } = useContext(EventContext)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // First try to get from context, if not found, fetch directly from database
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true)
        const numId = parseInt(id, 10)
        
        // Try to find in loaded events first
        const contextEvent = getEventById(id)
        if (contextEvent) {
          setEvent(contextEvent)
          setLoading(false)
          return
        }

        // If not found, fetch directly from database
        const dbEvent = await neonService.getEventById(numId)
        if (dbEvent) {
          setEvent(dbEvent)
        } else {
          setError('Event not found')
        }
      } catch (err) {
        console.error('Error loading event:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id, getEventById])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4">
        <Loader size={48} className="animate-spin text-brand-gold" />
        <p className="text-on-surface-variant">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <h1 className="font-headline text-4xl mb-4 text-on-surface">Event not found</h1>
        {error && <p className="text-error mb-4">{error}</p>}
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
              <Calendar size={16} />
              {event.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {event.time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              {event.venue}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} />
              {event.capacity}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-on-surface/2">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Event Overview</h2>
              <p className="text-on-surface-variant font-body leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Itinerary */}
            {event.itinerary && event.itinerary.length > 0 && (
              <div>
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">Event Itinerary</h2>
                <div className="space-y-4">
                  {event.itinerary.map((item, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="text-brand-gold font-headline font-bold text-lg min-w-fit">
                        {item.time}
                      </div>
                      <div className="pt-1 text-on-surface-variant font-body">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-32 space-y-6">
              <div>
                <p className="text-on-surface-variant text-sm font-body mb-2">Venue</p>
                <p className="font-headline font-semibold text-on-surface">{event.venue}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-body mb-2">Date & Time</p>
                <p className="font-headline font-semibold text-on-surface">{event.date}</p>
                <p className="font-body text-on-surface-variant">{event.time}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-body mb-2">Capacity</p>
                <p className="font-headline font-semibold text-on-surface">{event.capacity}</p>
              </div>
              <div className="border-t border-outline-variant/30 pt-6">
                <p className="text-on-surface-variant text-sm font-body mb-2">Ticket Price</p>
                {event.ticketCategories && event.ticketCategories.length > 0 ? (
                  <div>
                    <p className="font-headline text-3xl font-bold text-brand-gold">
                      ₦{Math.min(...event.ticketCategories.map(t => t.price || 0)).toLocaleString('en-NG')} - ₦{Math.max(...event.ticketCategories.map(t => t.price || 0)).toLocaleString('en-NG')}
                    </p>
                    <p className="text-on-surface-variant text-xs mt-2">Price range from {event.ticketCategories.length} ticket categories</p>
                  </div>
                ) : (
                  <p className="font-headline text-3xl font-bold text-brand-gold">₦{event.ticketPrice || 0}</p>
                )}
              </div>
              <Link 
                to={`/event/${event.id}/tickets`}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Get Tickets
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

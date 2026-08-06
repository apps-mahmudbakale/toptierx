import { useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { EventContext } from '../context/EventContext'
import { ArrowLeft, Check, ShieldCheck, Loader } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import { hyparrowService } from '../services/hyparrow'

export default function Ticketing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById } = useContext(EventContext)
  const event = getEventById(id)
  
  const [selectedTier, setSelectedTier] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  if (!event) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <h1 className="font-headline text-4xl mb-4 text-on-surface">Event not found</h1>
        <Link to="/" className="text-brand-gold hover:underline">Return to home</Link>
      </div>
    )
  }

  // Generate payment link identifier from event if not provided
  const paymentLinkIdentifier = event.paymentLinkIdentifier || `event-${event.id}-${Date.now()}`

  // Use ticket categories if available, otherwise create default
  const ticketTiers = event.ticketCategories && event.ticketCategories.length > 0 
    ? event.ticketCategories.map((cat, idx) => ({
        id: `tier-${idx}`,
        name: cat.name,
        price: cat.price,
        priceDisplay: `₦${cat.price.toLocaleString('en-NG')}`,
        features: [`${cat.name} tier for ${event.title}`],
        popular: idx === 0
      }))
    : [
        {
          id: 'general',
          name: 'General Access',
          price: event.ticketPrice || 100000,
          priceDisplay: `₦${(event.ticketPrice || 100000).toLocaleString('en-NG')}`,
          features: ['Access to main event areas', 'Complimentary welcome drinks', 'Standard seating'],
        }
      ]

  // Set first tier as selected by default
  if (!selectedTier && ticketTiers.length > 0) {
    setSelectedTier(ticketTiers[0].id)
  }

  const selectedTicket = ticketTiers.find(t => t.id === selectedTier)
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0

  const handleCheckout = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all guest information')
      return
    }

    if (!selectedTicket) {
      setError('Please select a ticket tier')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Initialize Hyparrow payment with payment link identifier
      hyparrowService.initialize({
        paymentLinkIdentifier: paymentLinkIdentifier,
        email: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        metadata: {
          eventId: event.id,
          eventTitle: event.title,
          ticketTier: selectedTicket.name,
          quantity: quantity,
          totalAmount: totalPrice
        },
        onSuccess: async (response) => {
          // Save booking after successful payment
          await saveBooking(response)
        },
        onClose: () => {
          setLoading(false)
          setError('Payment was not completed')
        },
        onError: (error) => {
          setLoading(false)
          setError(error.message || 'Payment failed')
        }
      })
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'An error occurred during checkout')
      setLoading(false)
    }
  }

  const saveBooking = async (paymentResponse) => {
    try {
      // Save booking to database - for now just redirect
      alert(`Payment successful! Booking confirmed for ${formData.email}`)
      navigate('/dashboard')
    } catch (err) {
      console.error('Error saving booking:', err)
      setError('Payment was successful but booking could not be saved')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <main className="pt-20 pb-20 relative min-h-screen">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 -z-10">
          {event.image && (
            <>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/40 to-transparent" />
            </>
          )}
          {!event.image && <div className="absolute inset-0 bg-surface" />}
        </div>

      <div className="container-max max-w-5xl relative z-10">
        
        {/* Back Link */}
        <Link to={`/event/${id}`} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-brand-gold transition-smooth mb-10 font-body text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Event Details
        </Link>

        <div className="text-center mb-16">
          <SectionLabel>Ticketing</SectionLabel>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
            {event.title}
          </h1>
          <p className="font-body text-on-surface-variant max-w-2xl mx-auto">
            Secure your attendance with our exclusive tier options. Availability is strictly limited to ensure an intimate atmosphere.
          </p>
        </div>

        <div className={`grid gap-6 mb-16 ${ticketTiers.length === 1 ? 'grid-cols-1 md:grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {ticketTiers.map((tier) => (
            <div 
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                selectedTier === tier.id 
                  ? 'border-brand-gold bg-white shadow-gold-glow scale-105 z-10' 
                  : 'border-outline-variant/30 bg-white/50 hover:bg-white hover:border-outline-variant'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full font-body">
                  Most Popular
                </div>
              )}
              
              <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-brand-gold mb-6 font-headline">{tier.priceDisplay}</div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 font-body text-sm text-on-surface-variant">
                    <Check size={16} className="text-brand-gold shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-full py-3 rounded-lg text-center font-body text-sm font-semibold transition-smooth ${
                selectedTier === tier.id 
                  ? 'bg-brand-black text-white' 
                  : 'bg-surface text-on-surface'
              }`}>
                {selectedTier === tier.id ? 'Selected' : 'Select'}
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto border-t-4 border-t-brand-black">
          <h2 className="font-headline text-2xl font-semibold mb-8 text-on-surface">Checkout & Payment</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-error text-sm font-body">{error}</p>
            </div>
          )}
          
          <form className="space-y-8" onSubmit={handleCheckout}>
            
            {/* Order Summary */}
            <div className="space-y-4 p-6 bg-surface rounded-xl border border-outline-variant/30">
              <h3 className="font-headline font-semibold text-on-surface mb-4">Order Summary</h3>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="font-body text-on-surface-variant">{selectedTicket?.name || 'Ticket'}</span>
                <span className="font-body font-semibold">₦{(selectedTicket?.price || 0).toLocaleString('en-NG')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <label className="font-body text-on-surface-variant">
                  Quantity:
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="ml-2 w-16 px-2 py-1 border border-outline-variant rounded font-body focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </label>
                <span className="font-body font-semibold">× {quantity}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-lg font-headline font-bold">
                <span>Total</span>
                <span className="text-brand-gold">₦{totalPrice.toLocaleString('en-NG')}</span>
              </div>
            </div>
            
            {/* Guest Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-headline font-semibold text-on-surface border-b border-outline-variant pb-2">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">First Name</label>
                  <input 
                    required 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 font-body focus:outline-none focus:border-brand-gold transition-colors" 
                    placeholder="John" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">Last Name</label>
                  <input 
                    required 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 font-body focus:outline-none focus:border-brand-gold transition-colors" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-semibold text-on-surface mb-2">Email Address</label>
                <input 
                  required 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-outline-variant py-2 font-body focus:outline-none focus:border-brand-gold transition-colors" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant font-body text-sm w-full md:w-auto">
                <ShieldCheck size={18} className="text-brand-gold" />
                Secure 256-bit Encrypted Checkout
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-gold w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader size={18} className="animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Pay Now ₦${totalPrice.toLocaleString('en-NG')}`
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
    </>
  )
}

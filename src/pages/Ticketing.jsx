import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ShieldCheck, CreditCard, Wallet } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'

const ticketTiers = [
  {
    id: 'general',
    name: 'General Access',
    price: '$500',
    features: ['Access to main event areas', 'Complimentary welcome drinks', 'Standard seating'],
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    price: '$1,200',
    features: ['Priority entrance', 'Exclusive VIP lounge access', 'Premium open bar', 'Front-row seating'],
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite Table (Groups of 4)',
    price: '$4,500',
    features: ['Private table service', 'Dedicated concierge', 'Meet & greet with hosts', 'Luxury gift bag'],
  }
]

export default function Ticketing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedTier, setSelectedTier] = useState('vip')
  const [paymentMethod, setPaymentMethod] = useState('paystack')

  const handleCheckout = (e) => {
    e.preventDefault()
    // Simulate API call and redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <main className="pt-32 pb-20 bg-surface min-h-screen">
      <div className="container-max max-w-5xl">
        
        {/* Back Link */}
        <Link to={`/event/${id}`} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-brand-gold transition-smooth mb-10 font-body text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Event Details
        </Link>

        <div className="text-center mb-16">
          <SectionLabel>Ticketing</SectionLabel>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
            Select Your Experience
          </h1>
          <p className="font-body text-on-surface-variant max-w-2xl mx-auto">
            Secure your attendance with our exclusive tier options. Availability is strictly limited to ensure an intimate atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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
              <div className="text-3xl font-bold text-brand-black mb-6 font-headline">{tier.price}</div>
              
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
          
          <form className="space-y-8" onSubmit={handleCheckout}>
            
            {/* Guest Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-headline font-semibold text-on-surface border-b border-outline-variant pb-2">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">First Name</label>
                  <input required type="text" className="w-full bg-transparent border-b border-outline-variant py-2 font-body focus:outline-none focus:border-brand-gold transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">Last Name</label>
                  <input required type="text" className="w-full bg-transparent border-b border-outline-variant py-2 font-body focus:outline-none focus:border-brand-gold transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-semibold text-on-surface mb-2">Email Address</label>
                <input required type="email" className="w-full bg-transparent border-b border-outline-variant py-2 font-body focus:outline-none focus:border-brand-gold transition-colors" placeholder="john@example.com" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-headline font-semibold text-on-surface border-b border-outline-variant pb-2">Payment Method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paystack Option */}
                <label 
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-smooth ${
                    paymentMethod === 'paystack' 
                      ? 'border-brand-gold bg-brand-gold/5' 
                      : 'border-outline-variant hover:border-brand-gold/50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paystack" 
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="w-4 h-4 text-brand-gold focus:ring-brand-gold"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <CreditCard size={20} />
                    </div>
                    <span className="font-body font-semibold text-on-surface">Paystack</span>
                  </div>
                </label>

                {/* Hyperpay Option */}
                <label 
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-smooth ${
                    paymentMethod === 'hyperpay' 
                      ? 'border-brand-gold bg-brand-gold/5' 
                      : 'border-outline-variant hover:border-brand-gold/50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="hyperpay" 
                    checked={paymentMethod === 'hyperpay'}
                    onChange={() => setPaymentMethod('hyperpay')}
                    className="w-4 h-4 text-brand-gold focus:ring-brand-gold"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Wallet size={20} />
                    </div>
                    <span className="font-body font-semibold text-on-surface">Hyperpay</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant font-body text-sm w-full md:w-auto">
                <ShieldCheck size={18} className="text-brand-gold" />
                Secure 256-bit Encrypted Checkout
              </div>
              <button type="submit" className="btn-primary w-full md:w-auto justify-center">
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  )
}

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoLight from '../../gofof.png'
import logoDark from '../../image.png'

const links = [
  { label: 'Events', href: '/#events' },
  { label: 'Venues', href: '/#venues' },
  { label: 'How It Works', href: '/#how' },
  { label: 'Testimonials', href: '/#testimonials' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-glass shadow-card border-b border-outline-variant/40'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={scrolled ? logoDark : logoLight}
            alt="TopTier Logo" 
            className="h-8 w-auto transition-all duration-500"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-body font-medium transition-smooth hover:text-brand-gold ${
                scrolled ? 'text-on-surface-variant' : 'text-white/80'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard" className={`text-sm font-body font-medium transition-smooth hover:text-brand-gold ${scrolled ? 'text-on-surface-variant' : 'text-white/80'}`}>
            Dashboard
          </Link>
          <a href="/#book" className="btn-primary text-sm">
            Book an Event
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-smooth ${scrolled ? 'text-on-surface' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-glass border-t border-outline-variant/30 px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="text-on-surface-variant font-body font-medium hover:text-brand-gold transition-smooth"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link 
            to="/dashboard" 
            className="text-on-surface-variant font-body font-medium hover:text-brand-gold transition-smooth"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <a href="/#book" className="btn-primary w-fit mt-2">Book an Event</a>
        </div>
      )}
    </header>
  )
}

import { Camera, MessageCircle, Briefcase, Mail } from 'lucide-react'
const navLinks = [
  { label: 'Events', href: '/#events' },
  { label: 'Venues', href: '/#venues' },
  { label: 'How It Works', href: '/#how' },
  { label: 'Testimonials', href: '/#testimonials' },
]

const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Settings']

const socials = [
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: MessageCircle, href: '#', label: 'X (Twitter)' },
  { icon: Briefcase, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container-max pt-20 pb-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-14 border-b border-white/10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-7 h-7 rounded-sm bg-brand-gold flex items-center justify-center">
                <span className="text-brand-black text-xs font-headline font-bold">T</span>
              </span>
              <span className="font-headline font-semibold text-xl">
                TopTier<span className="text-brand-gold">.</span>
              </span>
            </div>
            <p className="text-white/50 text-sm font-body leading-relaxed">
              Crafting extraordinary experiences for the world's most discerning clientele. Every event, a masterpiece.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="section-label text-white/30 mb-5">Navigation</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/60 text-sm font-body hover:text-brand-gold transition-smooth">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label text-white/30 mb-5">Contact</p>
            <ul className="flex flex-col gap-3 text-white/60 text-sm font-body">
              <li>hello@toptierxperienz.com</li>
              <li>+44 20 7946 0958</li>
              <li>1 Mayfair Place, London W1J 8AJ</li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="section-label text-white/30 mb-5">Follow Us</p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold/40 transition-smooth"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-body">
            © {new Date().getFullYear()} TopTier Xperienz Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map(l => (
              <a key={l} href="#" className="text-white/30 text-xs font-body hover:text-brand-gold transition-smooth">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LogOut, Menu, X, Home } from 'lucide-react'
import { useState } from 'react'

export default function DashboardNavbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-glass shadow-card border-b border-outline-variant/40">
      <div className="container-max flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-headline font-bold text-xl text-on-surface">
            TopTier<span className="text-brand-gold">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-body font-medium text-on-surface-variant hover:text-brand-gold transition-smooth"
          >
            <Home size={16} />
            Back to Site
          </Link>
          
          <div className="border-l border-outline-variant/30 h-6"></div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-body font-semibold text-on-surface">{user?.email}</p>
              <p className="text-xs font-body text-on-surface-variant capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-surface rounded-lg transition-smooth text-on-surface-variant hover:text-error"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg transition-smooth text-on-surface"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-glass border-t border-outline-variant/30 px-6 py-6 flex flex-col gap-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-body font-medium text-on-surface-variant hover:text-brand-gold transition-smooth"
            onClick={() => setOpen(false)}
          >
            <Home size={16} />
            Back to Site
          </Link>
          
          <div className="border-t border-outline-variant/30"></div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body font-semibold text-on-surface">{user?.email}</p>
              <p className="text-xs font-body text-on-surface-variant capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-surface rounded-lg transition-smooth text-on-surface-variant hover:text-error"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

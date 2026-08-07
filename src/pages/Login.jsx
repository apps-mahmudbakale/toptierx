import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Lock, Mail } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-black via-brand-black to-brand-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold text-white mb-2">
            TopTier<span className="text-brand-gold">.</span>
          </h1>
          <p className="text-white/60 font-body">Admin Dashboard</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 space-y-6">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Welcome Back
          </h2>

          {error && (
            <div className="p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-error text-sm font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-on-surface-variant" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@toptierxperienze.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold bg-surface/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-on-surface-variant" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-brand-gold bg-surface/50"
                  required
                />
              </div>
            </div>

            {/* Demo Credentials - Now from Neon Database */}
            <div className="bg-brand-gold/10 p-3 rounded-lg border border-brand-gold/20">
              <p className="text-xs font-body text-on-surface-variant mb-1">Demo Credentials (from Neon DB):</p>
              <p className="text-xs font-semibold text-on-surface">admin@toptierxperienze.com / Admin@123</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full justify-center mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-on-surface-variant font-body">
            Authenticating with Neon database
          </p>
        </div>
      </div>
    </main>
  )
}

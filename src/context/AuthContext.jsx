import { createContext, useState, useCallback, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('toptier_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('toptier_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      console.log('🔐 Authenticating user:', email)
      
      // Call Netlify function for secure password verification
      const endpoint = '/.netlify/functions/auth-login'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      console.log('📊 Auth response status:', response.status)

      const data = await response.json()

      if (!response.ok) {
        console.log('❌ Authentication failed:', data.error)
        return { success: false, error: data.error || 'Invalid email or password' }
      }

      if (!data.success || !data.user) {
        console.log('❌ No user data returned')
        return { success: false, error: 'Authentication failed' }
      }

      console.log('✅ User authenticated:', email)
      
      setUser(data.user)
      localStorage.setItem('toptier_user', JSON.stringify(data.user))
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('toptier_user')
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isAuthenticated,
      isAdmin,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

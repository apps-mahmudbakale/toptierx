import { createContext, useState, useCallback, useEffect } from 'react'

export const AuthContext = createContext()

// Default admin credentials (in production, use backend auth)
const DEFAULT_ADMIN = {
  email: 'admin@toptier.com',
  password: 'admin123'
}

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

  const login = useCallback((email, password) => {
    // For now, using local validation. In production, call backend API
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      const userData = {
        id: 'admin-1',
        email,
        name: 'Admin',
        role: 'admin'
      }
      setUser(userData)
      localStorage.setItem('toptier_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Invalid email or password' }
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

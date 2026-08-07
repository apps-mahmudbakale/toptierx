import { createContext, useState, useCallback, useEffect } from 'react'
import { sql } from '../services/db'

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
      
      // Query user from Neon database
      const result = await sql`
        SELECT id, email, password, role, created_at 
        FROM users 
        WHERE email = ${email}
      `

      if (result.length === 0) {
        console.log('❌ User not found:', email)
        return { success: false, error: 'Invalid email or password' }
      }

      const dbUser = result[0]
      
      // Simple password comparison (not ideal for production)
      // For production, implement backend authentication with proper bcrypt hashing
      if (password !== dbUser.password) {
        // Try comparing as plaintext for now
        console.log('❌ Password mismatch for user:', email)
        return { success: false, error: 'Invalid email or password' }
      }

      console.log('✅ User authenticated:', email)
      
      const userData = {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role || 'user',
        createdAt: dbUser.created_at
      }

      setUser(userData)
      localStorage.setItem('toptier_user', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login error:', error)
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

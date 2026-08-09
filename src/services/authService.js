import { sql } from './db'

export const authService = {
  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password (plain text)
   * @returns {Promise<Object>} User object if authenticated, null otherwise
   */
  async login(email, password) {
    try {
      console.log('🔐 Authenticating user:', email)

      // Check if we're in production (deployed) or local dev
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      
      // Use Netlify function for password verification
      const endpoint = isDev ? '/.netlify/functions/auth-login' : '/.netlify/functions/auth-login'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        console.log('❌ Authentication failed:', data.error)
        return null
      }

      if (data.success && data.user) {
        console.log('✅ User authenticated:', email)
        return data.user
      }

      return null
    } catch (error) {
      console.error('Error authenticating user:', error)
      return null
    }
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object if found
   */
  async getUserByEmail(email) {
    try {
      const result = await sql`
        SELECT id, email, role, created_at 
        FROM users 
        WHERE email = ${email}
      `

      if (result.length === 0) {
        return null
      }

      return result[0]
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  /**
   * Get all users (admin only)
   * @returns {Promise<Array>} Array of users
   */
  async getAllUsers() {
    try {
      const result = await sql`
        SELECT id, email, role, created_at 
        FROM users 
        ORDER BY created_at DESC
      `
      return result
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }
}

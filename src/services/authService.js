import { sql } from './db'
import bcrypt from 'bcrypt'

export const authService = {
  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password (plain text)
   * @returns {Promise<Object>} User object if authenticated, null otherwise
   */
  async login(email, password) {
    try {
      // Query user from Neon database
      const result = await sql`
        SELECT id, email, password, role, created_at 
        FROM users 
        WHERE email = ${email}
      `

      if (result.length === 0) {
        console.log('❌ User not found:', email)
        return null
      }

      const user = result[0]
      
      // Verify password with bcrypt
      // Note: In browser, we can't use bcrypt directly for hashing
      // This is a simplified comparison - for production, use a backend endpoint
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        console.log('❌ Password mismatch for user:', email)
        return null
      }

      console.log('✅ User authenticated:', email)
      
      // Return user data without password
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    } catch (error) {
      console.error('Error authenticating user:', error)
      throw error
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

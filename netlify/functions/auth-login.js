// Netlify serverless function for user authentication
// Handles password verification securely on the server side

import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'

const sql = neon(process.env.VITE_DATABASE_URL)

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔐 Authenticating user:', email)

    // Query user from database
    const result = await sql`
      SELECT id, email, password, role, created_at 
      FROM users 
      WHERE email = ${email}
    `

    if (result.length === 0) {
      console.log('❌ User not found:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const user = result[0]

    // Verify password with bcrypt
    console.log('🔍 Comparing password...')
    console.log('📝 Stored hash:', user.password.substring(0, 20) + '...')
    
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      console.log('❌ Password mismatch for user:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User authenticated:', email)

    // Return user data without password
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Authentication error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

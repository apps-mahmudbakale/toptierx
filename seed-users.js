import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const sql = neon(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL)

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding...')

    // Admin user
    const adminEmail = 'admin@toptierxperienze.com'
    const adminPassword = 'Admin@123'
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10)

    // Regular user
    const userEmail = 'user@toptierxperienze.com'
    const userPassword = 'User@123'
    const userHashedPassword = await bcrypt.hash(userPassword, 10)

    // Insert admin user
    try {
      const adminResult = await sql`
        INSERT INTO users (email, password, role) 
        VALUES (${adminEmail}, ${adminHashedPassword}, 'admin')
        ON CONFLICT (email) DO NOTHING
        RETURNING id, email, role
      `

      if (adminResult.length > 0) {
        console.log('✅ Admin user created:', adminResult[0])
      } else {
        console.log('ℹ️  Admin user already exists')
      }
    } catch (err) {
      console.error('Error creating admin user:', err)
    }

    // Insert regular user
    try {
      const userResult = await sql`
        INSERT INTO users (email, password, role) 
        VALUES (${userEmail}, ${userHashedPassword}, 'user')
        ON CONFLICT (email) DO NOTHING
        RETURNING id, email, role
      `

      if (userResult.length > 0) {
        console.log('✅ Regular user created:', userResult[0])
      } else {
        console.log('ℹ️  Regular user already exists')
      }
    } catch (err) {
      console.error('Error creating regular user:', err)
    }

    console.log('\n📋 Login Credentials:')
    console.log('-------------------')
    console.log('Admin:')
    console.log(`  Email: ${adminEmail}`)
    console.log(`  Password: ${adminPassword}`)
    console.log('\nRegular User:')
    console.log(`  Email: ${userEmail}`)
    console.log(`  Password: ${userPassword}`)
    console.log('-------------------\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()

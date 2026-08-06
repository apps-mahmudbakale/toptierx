import { pool } from './src/services/neonDb.js'
import bcrypt from 'bcrypt'

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
    const adminResult = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id, email, role',
      [adminEmail, adminHashedPassword, 'admin']
    )

    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user created:', adminResult.rows[0])
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    // Insert regular user
    const userResult = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id, email, role',
      [userEmail, userHashedPassword, 'user']
    )

    if (userResult.rows.length > 0) {
      console.log('✅ Regular user created:', userResult.rows[0])
    } else {
      console.log('ℹ️  Regular user already exists')
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

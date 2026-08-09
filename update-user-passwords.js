import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

async function updatePasswords() {
  try {
    const sql = neon(process.env.VITE_DATABASE_URL)
    
    console.log('🔄 Updating user passwords...')
    
    const adminHash = '$2b$10$PHGioGVS5HAA.MTQ1aoanuexhFmK2nNfBVGuNc5EseTdbuJ9KwNvW'
    const userHash = '$2b$10$TQ3sSCWL75PnYAeywItbzeZcJe20wqpalTOJauCvY72u0/KAlBrP.'
    
    // Update admin password
    await sql`
      UPDATE users 
      SET password = ${adminHash}
      WHERE email = 'admin@toptierxperienze.com'
    `
    console.log('✅ Updated admin@toptierxperienze.com password')
    
    // Update user password
    await sql`
      UPDATE users 
      SET password = ${userHash}
      WHERE email = 'user@toptierxperienze.com'
    `
    console.log('✅ Updated user@toptierxperienze.com password')
    
    console.log('\n✅ All passwords updated!')
    console.log('\nLogin credentials:')
    console.log('  Admin: admin@toptierxperienze.com / Admin@123')
    console.log('  User: user@toptierxperienze.com / User@123')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

updatePasswords()

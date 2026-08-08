import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

async function migrate() {
  try {
    const sql = neon(process.env.VITE_DATABASE_URL)
    
    console.log('🔄 Checking bookings table structure...')
    
    // Add customer_phone if it doesn't exist
    try {
      await sql`ALTER TABLE bookings ADD COLUMN customer_phone VARCHAR(20)`
      console.log('✅ Added customer_phone column')
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ customer_phone column already exists')
      } else {
        console.log('ℹ️ customer_phone:', e.message)
      }
    }
    
    // Add invoice_id if it doesn't exist
    try {
      await sql`ALTER TABLE bookings ADD COLUMN invoice_id VARCHAR(255)`
      console.log('✅ Added invoice_id column')
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ invoice_id column already exists')
      } else {
        console.log('ℹ️ invoice_id:', e.message)
      }
    }
    
    // Add payment_reference if it doesn't exist
    try {
      await sql`ALTER TABLE bookings ADD COLUMN payment_reference VARCHAR(255)`
      console.log('✅ Added payment_reference column')
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ payment_reference column already exists')
      } else {
        console.log('ℹ️ payment_reference:', e.message)
      }
    }
    
    // Check final schema
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position
    `
    
    console.log('\n📋 Bookings table schema:')
    result.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`)
    })
    
    console.log('\n✅ Migration complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()

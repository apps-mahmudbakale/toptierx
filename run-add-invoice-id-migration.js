import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

const sql = neon(process.env.VITE_DATABASE_URL)

async function runMigration() {
  try {
    console.log('🔄 Running migration: add invoice_id to bookings...')

    // Add invoice_id column
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS invoice_id VARCHAR(255)`
    console.log('✅ Added invoice_id column')

    // Add payment_reference column
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255)`
    console.log('✅ Added payment_reference column')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS bookings_invoice_id_idx ON bookings(invoice_id)`
    console.log('✅ Created invoice_id index')

    await sql`CREATE INDEX IF NOT EXISTS bookings_payment_reference_idx ON bookings(payment_reference)`
    console.log('✅ Created payment_reference index')

    console.log('✅ Migration complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()

import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

const sql = neon(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL)

const createTable = async () => {
  try {
    console.log('📋 Creating webhook_logs table...')

    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS webhook_logs (
        id SERIAL PRIMARY KEY,
        webhook_event VARCHAR(100) NOT NULL,
        event_type VARCHAR(100),
        invoice_id VARCHAR(255),
        status VARCHAR(50),
        payload JSONB,
        error TEXT,
        signature_valid BOOLEAN DEFAULT false,
        response_status INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('✅ Table created')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS webhook_logs_event_type_idx ON webhook_logs(event_type)`
    await sql`CREATE INDEX IF NOT EXISTS webhook_logs_invoice_id_idx ON webhook_logs(invoice_id)`
    await sql`CREATE INDEX IF NOT EXISTS webhook_logs_created_at_idx ON webhook_logs(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS webhook_logs_status_idx ON webhook_logs(status)`
    
    console.log('✅ Indexes created')
    console.log('✅ Webhook logs table setup complete!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTable()

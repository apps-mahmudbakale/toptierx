import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

if (!process.env.VITE_DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL environment variable is not set')
}

const sql = neon(process.env.VITE_DATABASE_URL)

async function runMigration() {
  try {
    console.log('Running migration: Adding payment_link_identifier column...')
    
    // Execute migrations individually
    console.log('Adding payment_link_identifier to events table...')
    await sql`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS payment_link_identifier VARCHAR(255)
    `
    console.log('✅ Added payment_link_identifier column')

    console.log('Adding payment columns to bookings table...')
    await sql`
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255)
    `
    console.log('✅ Added payment_reference column')

    await sql`
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50)
    `
    console.log('✅ Added payment_provider column')

    await sql`
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50)
    `
    console.log('✅ Added payment_status column')

    console.log('✅ All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration error:', error.message)
    process.exit(1)
  }
}

runMigration()

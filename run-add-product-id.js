import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const sql = neon(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL)

const migrate = async () => {
  try {
    console.log('📦 Running migration: add hyparrow_product_id to events table...')

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'db', 'add-hyparrow-product-id.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Execute migration
    const result = await sql.unsafe(migrationSQL)
    
    console.log('✅ Migration completed successfully')
    console.log('📊 Events table updated with hyparrow_product_id column')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

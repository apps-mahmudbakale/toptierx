import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const sql = neon(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL)

const migrate = async () => {
  try {
    console.log('🔧 Running migration: fix hyparrow_product_id column type...')

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'db', 'fix-hyparrow-product-id-type.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Execute migration
    const result = await sql.unsafe(migrationSQL)
    
    console.log('✅ Migration completed successfully')
    console.log('📊 hyparrow_product_id column type fixed to VARCHAR(255)')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

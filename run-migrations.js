import pg from 'pg'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.VITE_NEON_CONNECTION_STRING
})

async function runMigrations() {
  try {
    const client = await pool.connect()
    
    // Read migrations file
    const migrations = fs.readFileSync('./db/migrations.sql', 'utf8')
    
    // Split by semicolon and filter empty statements
    const statements = migrations
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    // Execute each statement
    for (const statement of statements) {
      console.log('Running migration:', statement.substring(0, 80) + '...')
      await client.query(statement)
      console.log('✓ Migration completed')
    }
    
    client.release()
    console.log('All migrations completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

runMigrations()

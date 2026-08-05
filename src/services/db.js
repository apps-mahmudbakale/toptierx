import { neon } from '@neondatabase/serverless'

if (!import.meta.env.VITE_DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL environment variable is not set')
}

export const sql = neon(import.meta.env.VITE_DATABASE_URL)

import express from 'express'
import cors from 'cors'
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg
const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize Neon connection pool
const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10
})

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    res.json({ status: 'ok', database: 'connected' })
  } catch (err) {
    console.error('Health check failed:', err.message)
    res.status(503).json({ status: 'error', error: err.message })
  }
})

// ===== EVENTS ENDPOINTS =====

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date DESC')
    // Convert snake_case to camelCase for frontend
    const events = result.rows.map(event => ({
      ...event,
      ticketPrice: event.ticket_price,
      ticketCategories: event.ticket_categories,
      ticket_price: undefined,
      ticket_categories: undefined
    }))
    res.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }
    const event = result.rows[0]
    // Convert snake_case to camelCase
    res.json({
      ...event,
      ticketPrice: event.ticket_price,
      ticketCategories: event.ticket_categories,
      ticket_price: undefined,
      ticket_categories: undefined
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

// Create event
app.post('/api/events', async (req, res) => {
  try {
    const { 
      title, category, date, time, venue, capacity, 
      ticketPrice, image, description, itinerary, ticketCategories 
    } = req.body

    const result = await pool.query(
      `INSERT INTO events 
       (title, category, date, time, venue, capacity, ticket_price, image, description, itinerary, ticket_categories) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        title, category, date, time, venue, capacity, 
        ticketPrice, image, description, 
        JSON.stringify(itinerary || []), 
        JSON.stringify(ticketCategories || [])
      ]
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

// Update event
app.patch('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      title, category, date, time, venue, capacity, 
      ticketPrice, image, description, itinerary, ticketCategories 
    } = req.body

    const result = await pool.query(
      `UPDATE events 
       SET title=$1, category=$2, date=$3, time=$4, venue=$5, capacity=$6, 
           ticket_price=$7, image=$8, description=$9, itinerary=$10, ticket_categories=$11,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$12 
       RETURNING *`,
      [
        title, category, date, time, venue, capacity, 
        ticketPrice, image, description, 
        JSON.stringify(itinerary || []), 
        JSON.stringify(ticketCategories || []),
        id
      ]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: 'Failed to update event' })
  }
})

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM events WHERE id=$1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({ error: 'Failed to delete event' })
  }
})

// ===== BOOKINGS ENDPOINTS =====

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY booking_date DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// Get bookings by event
app.get('/api/bookings/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params
    const result = await pool.query(
      'SELECT * FROM bookings WHERE event_id = $1 ORDER BY booking_date DESC',
      [eventId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { 
      eventId, eventTitle, customerName, customerEmail, 
      ticketCount, ticketPrice, totalAmount, status, notes 
    } = req.body

    const result = await pool.query(
      `INSERT INTO bookings 
       (event_id, event_title, customer_name, customer_email, ticket_count, ticket_price, total_amount, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [eventId, eventTitle, customerName, customerEmail, ticketCount, ticketPrice, totalAmount, status || 'confirmed', notes]
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// ===== ADMIN AUTH =====

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({
      user: {
        id: 'admin-1',
        email,
        name: 'Admin',
        role: 'admin'
      }
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Connected to Neon database')
})

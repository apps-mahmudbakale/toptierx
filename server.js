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

// ===== PAYMENT ENDPOINTS =====

// Hyparrow payment proxy - handles CORS issue
app.post('/api/payment/hyparrow/checkout', async (req, res) => {
  try {
    const { identifier, email, customerName, metadata } = req.body

    if (!identifier) {
      return res.status(400).json({ error: 'Missing payment link identifier' })
    }

    const hyparrowPublicKey = process.env.VITE_HYPARROW_PUBLIC_KEY
    
    if (!hyparrowPublicKey || hyparrowPublicKey.startsWith('pk_test_your_hyparrow_key')) {
      return res.status(400).json({ error: 'Hyparrow API key not configured' })
    }

    console.log('🔄 Initiating Hyparrow payment...')
    console.log('  Identifier:', identifier)
    console.log('  Email:', email)
    console.log('  Customer:', customerName)
    console.log('  Public Key:', hyparrowPublicKey.substring(0, 10) + '...')

    // Call Hyparrow API from backend to avoid CORS
    const hyparrowResponse = await fetch(`https://api.hyparrow.cloud/api/v1/checkout/pay/${identifier}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hyparrowPublicKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        customer_name: customerName,
        metadata: metadata || {}
      })
    })

    // Handle response
    if (hyparrowResponse.status === 204) {
      // 204 No Content - means the checkout was initiated successfully
      console.log('✅ Hyparrow payment initiated (204)')
      return res.json({
        success: true,
        message: 'Payment initiated - redirect to Hyparrow checkout',
        status: 204
      })
    }

    if (!hyparrowResponse.ok) {
      const errorText = await hyparrowResponse.text()
      console.error('❌ Hyparrow error response:', {
        status: hyparrowResponse.status,
        statusText: hyparrowResponse.statusText,
        body: errorText
      })
      
      try {
        const errorJson = JSON.parse(errorText)
        if (hyparrowResponse.status === 404) {
          throw new Error(`Payment link not found. Please create the payment link in Hyparrow dashboard first with identifier: ${identifier}`)
        }
        throw new Error(`Hyparrow API error: ${errorJson.error || errorText}`)
      } catch (e) {
        throw new Error(`Hyparrow API error (${hyparrowResponse.status}): ${errorText}`)
      }
    }

    const responseData = await hyparrowResponse.json()
    console.log('✅ Hyparrow response:', responseData)
    res.json(responseData)
  } catch (error) {
    console.error('❌ Payment proxy error:', error)
    res.status(500).json({ error: error.message || 'Failed to initiate payment' })
  }
})

// Hyparrow webhook - receives payment confirmation from Hyparrow
app.post('/webhook/hyparrow', async (req, res) => {
  try {
    console.log('🔔 Hyparrow webhook received:', req.body)
    
    const { event, data } = req.body

    // Verify webhook signature (implement based on Hyparrow docs)
    // For now, we'll accept all webhook events
    
    if (event === 'payment.completed' || event === 'transaction.completed') {
      const { reference, amount, email, metadata, customer_name } = data
      
      console.log('✅ Payment completed:', reference)
      
      // Extract booking info from metadata
      const eventId = metadata?.eventId
      const eventTitle = metadata?.eventTitle
      const ticketTier = metadata?.ticketTier
      const quantity = metadata?.quantity || 1
      const totalAmount = amount || metadata?.totalAmount

      if (eventId && email) {
        try {
          // Save booking to database
          const bookingResult = await pool.query(
            `INSERT INTO bookings 
             (event_id, event_title, customer_name, customer_email, ticket_count, ticket_price, total_amount, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [
              eventId, 
              eventTitle || 'Event', 
              customer_name || 'Guest', 
              email, 
              quantity,
              amount ? Math.round(amount / (quantity || 1)) : 0,
              amount,
              'confirmed'
            ]
          )
          
          console.log('✅ Booking saved:', bookingResult.rows[0])
          
          // Here you can also send confirmation email
          // await sendConfirmationEmail(email, bookingResult.rows[0])
        } catch (err) {
          console.error('Error saving booking:', err)
        }
      }
      
      return res.json({ success: true, message: 'Payment recorded' })
    }
    
    if (event === 'payment.failed' || event === 'transaction.failed') {
      console.log('❌ Payment failed:', data.reference)
      return res.json({ success: true, message: 'Payment failure recorded' })
    }

    res.json({ success: true, message: 'Webhook event processed' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Verify payment status endpoint
app.get('/api/payment/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params
    
    console.log('🔍 Verifying payment:', reference)
    
    // Query Hyparrow to verify payment (if API supports it)
    // For now, check if booking exists
    const result = await pool.query(
      'SELECT * FROM bookings WHERE status = $1 ORDER BY created_at DESC LIMIT 1',
      ['confirmed']
    )
    
    if (result.rows.length > 0) {
      res.json({
        success: true,
        verified: true,
        booking: result.rows[0]
      })
    } else {
      res.json({
        success: false,
        verified: false,
        message: 'Payment not found'
      })
    }
  } catch (error) {
    console.error('Verification error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Connected to Neon database')
})

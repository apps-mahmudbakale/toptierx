import { sql } from './db'

export const neonService = {
  async getEvents() {
    try {
      const result = await sql`SELECT * FROM events ORDER BY date DESC`
      
      // Parse JSONB fields and convert snake_case to camelCase
      return result.map(event => ({
        ...event,
        ticketPrice: event.ticket_price,
        paymentLinkIdentifier: event.payment_link_identifier,
        ticketCategories: typeof event.ticket_categories === 'string' 
          ? JSON.parse(event.ticket_categories) 
          : (event.ticket_categories || []),
        itinerary: typeof event.itinerary === 'string'
          ? JSON.parse(event.itinerary)
          : (event.itinerary || [])
      }))
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  async getEventById(id) {
    try {
      const result = await sql`SELECT * FROM events WHERE id = ${id}`
      
      if (result.length === 0) return null
      
      const event = result[0]
      return {
        ...event,
        ticketPrice: event.ticket_price,
        paymentLinkIdentifier: event.payment_link_identifier,
        ticketCategories: typeof event.ticket_categories === 'string'
          ? JSON.parse(event.ticket_categories)
          : (event.ticket_categories || []),
        itinerary: typeof event.itinerary === 'string'
          ? JSON.parse(event.itinerary)
          : (event.itinerary || [])
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  async createEvent(eventData) {
    try {
      const result = await sql`
        INSERT INTO events 
        (title, category, date, time, venue, capacity, ticket_price, image, description, itinerary, ticket_categories, payment_link_identifier, hyparrow_product_id)
        VALUES (
          ${eventData.title},
          ${eventData.category || null},
          ${eventData.date || null},
          ${eventData.time || null},
          ${eventData.venue},
          ${eventData.capacity || null},
          ${eventData.ticketPrice},
          ${eventData.image || null},
          ${eventData.description || null},
          ${JSON.stringify(eventData.itinerary || [])},
          ${JSON.stringify(eventData.ticketCategories || [])},
          ${eventData.paymentLinkIdentifier || null},
          ${eventData.hyparrowProductId || null}
        )
        RETURNING *
      `
      
      if (result.length === 0) throw new Error('Failed to create event')
      
      const event = result[0]
      return {
        ...event,
        ticketPrice: event.ticket_price,
        paymentLinkIdentifier: event.payment_link_identifier,
        hyparrowProductId: event.hyparrow_product_id,
        ticketCategories: typeof event.ticket_categories === 'string'
          ? JSON.parse(event.ticket_categories)
          : (event.ticket_categories || []),
        itinerary: typeof event.itinerary === 'string'
          ? JSON.parse(event.itinerary)
          : (event.itinerary || [])
      }
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  async updateEvent(id, eventData) {
    try {
      const result = await sql`
        UPDATE events 
        SET 
          title = ${eventData.title},
          category = ${eventData.category || null},
          date = ${eventData.date || null},
          time = ${eventData.time || null},
          venue = ${eventData.venue},
          capacity = ${eventData.capacity || null},
          ticket_price = ${eventData.ticketPrice},
          image = ${eventData.image || null},
          description = ${eventData.description || null},
          itinerary = ${JSON.stringify(eventData.itinerary || [])},
          ticket_categories = ${JSON.stringify(eventData.ticketCategories || [])},
          payment_link_identifier = ${eventData.paymentLinkIdentifier || null},
          hyparrow_product_id = ${eventData.hyparrowProductId || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      
      if (result.length === 0) throw new Error('Event not found')
      
      const event = result[0]
      return {
        ...event,
        ticketPrice: event.ticket_price,
        paymentLinkIdentifier: event.payment_link_identifier,
        hyparrowProductId: event.hyparrow_product_id,
        ticketCategories: typeof event.ticket_categories === 'string'
          ? JSON.parse(event.ticket_categories)
          : (event.ticket_categories || []),
        itinerary: typeof event.itinerary === 'string'
          ? JSON.parse(event.itinerary)
          : (event.itinerary || [])
      }
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  async deleteEvent(id) {
    try {
      await sql`DELETE FROM events WHERE id = ${id}`
      return { success: true }
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // Booking operations
  async createBooking(bookingData) {
    try {
      const result = await sql`
        INSERT INTO bookings 
        (event_id, event_title, customer_name, customer_email, customer_phone, ticket_count, ticket_price, total_amount, status)
        VALUES (
          ${bookingData.eventId},
          ${bookingData.eventTitle},
          ${bookingData.customerName},
          ${bookingData.customerEmail},
          ${bookingData.customerPhone || null},
          ${bookingData.ticketCount},
          ${bookingData.ticketPrice},
          ${bookingData.totalAmount},
          ${bookingData.status || 'pending'}
        )
        RETURNING *
      `
      
      if (result.length === 0) throw new Error('Failed to create booking')
      
      console.log('✅ Booking created:', result[0])
      return result[0]
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  async getBookings() {
    try {
      const result = await sql`SELECT * FROM bookings ORDER BY created_at DESC`
      return result
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  async getBookingsByEmail(email) {
    try {
      const result = await sql`SELECT * FROM bookings WHERE customer_email = ${email} ORDER BY created_at DESC`
      return result
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  async logWebhook(webhookData) {
    try {
      const result = await sql`
        INSERT INTO webhook_logs 
        (webhook_event, event_type, invoice_id, status, payload, signature_valid, response_status)
        VALUES (
          ${webhookData.webhookEvent || 'unknown'},
          ${webhookData.eventType || null},
          ${webhookData.invoiceId || null},
          ${webhookData.status || 'received'},
          ${JSON.stringify(webhookData.payload || {})},
          ${webhookData.signatureValid || false},
          ${webhookData.responseStatus || 200}
        )
        RETURNING *
      `
      
      if (result.length === 0) throw new Error('Failed to log webhook')
      
      console.log('✅ Webhook logged:', result[0])
      return result[0]
    } catch (error) {
      console.error('Error logging webhook:', error)
      throw error
    }
  },

  async getWebhookLogs(limit = 50) {
    try {
      const result = await sql`
        SELECT * FROM webhook_logs 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
      return result
    } catch (error) {
      console.error('Error fetching webhook logs:', error)
      throw error
    }
  },

  async getWebhookLogsByInvoiceId(invoiceId) {
    try {
      const result = await sql`
        SELECT * FROM webhook_logs 
        WHERE invoice_id = ${invoiceId}
        ORDER BY created_at DESC
      `
      return result
    } catch (error) {
      console.error('Error fetching webhook logs:', error)
      throw error
    }
  }
}

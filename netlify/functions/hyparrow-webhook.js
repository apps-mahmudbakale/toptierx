// Netlify serverless function to handle Hyparrow webhooks
// Deploy this and set Hyparrow webhook URL to: https://yourdomain.com/.netlify/functions/hyparrow-webhook

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.VITE_DATABASE_URL)

export const handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body)
    const { event: paymentEvent, data } = body

    console.log('🔔 Webhook received:', paymentEvent)
    console.log('📊 Data:', data)

    // Handle payment.completed event
    if (paymentEvent === 'payment.completed' || paymentEvent === 'transaction.completed') {
      const { reference, amount, email, metadata, customer_name } = data

      console.log('✅ Payment completed:', reference)

      // Extract booking info from metadata
      const eventId = metadata?.eventId
      const eventTitle = metadata?.eventTitle
      const ticketTier = metadata?.ticketTier
      const quantity = metadata?.quantity || 1
      const totalAmount = amount || metadata?.totalAmount

      if (!eventId || !email) {
        console.error('❌ Missing required fields in webhook')
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing eventId or email' })
        }
      }

      try {
        // Save booking to Neon database
        const result = await sql`
          INSERT INTO bookings 
          (event_id, event_title, customer_name, customer_email, ticket_count, ticket_price, total_amount, status)
          VALUES (
            ${eventId},
            ${eventTitle || 'Event'},
            ${customer_name || 'Guest'},
            ${email},
            ${quantity},
            ${amount ? Math.round(amount / (quantity || 1)) : 0},
            ${amount},
            'confirmed'
          )
          RETURNING *
        `

        console.log('✅ Booking saved to Neon:', result[0])

        // TODO: Send confirmation email
        // await sendConfirmationEmail(email, result[0])

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Booking saved',
            booking: result[0]
          })
        }
      } catch (err) {
        console.error('❌ Error saving booking:', err)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to save booking' })
        }
      }
    }

    // Handle payment.failed event
    if (paymentEvent === 'payment.failed' || paymentEvent === 'transaction.failed') {
      const { reference, reason } = data
      console.log('❌ Payment failed:', reference, reason)

      // TODO: Log failed payment
      // TODO: Send failure email

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Payment failure recorded'
        })
      }
    }

    // Unknown event type
    console.log('⚠️ Unknown webhook event:', paymentEvent)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Webhook received'
      })
    }
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

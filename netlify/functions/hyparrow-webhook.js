// Netlify serverless function to handle Hyparrow webhooks
// Deploy this and set Hyparrow webhook URL to: https://yourdomain.com/.netlify/functions/hyparrow-webhook

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.VITE_DATABASE_URL)

const logWebhook = async (webhookEvent, eventType, invoiceId, status, payload, signatureValid = true) => {
  try {
    await sql`
      INSERT INTO webhook_logs 
      (webhook_event, event_type, invoice_id, status, payload, signature_valid, response_status)
      VALUES (
        ${webhookEvent},
        ${eventType},
        ${invoiceId},
        ${status},
        ${JSON.stringify(payload)},
        ${signatureValid},
        ${200}
      )
    `
    console.log('✅ Webhook logged to database')
  } catch (err) {
    console.error('⚠️ Error logging webhook to database:', err)
  }
}

export const handler = async (event) => {
  // Handle GET requests (browser redirects from Hyparrow after payment)
  if (event.httpMethod === 'GET') {
    console.log('🔄 Webhook redirect from Hyparrow (GET request)')
    console.log('📊 Query params:', event.queryStringParameters)
    
    // Hyparrow redirects with query params like: ?status=success&reference=XXX&invoiceId=YYY
    const { status, reference, invoiceId } = event.queryStringParameters || {}
    
    console.log('✅ Payment status:', status)
    console.log('📌 Payment reference:', reference)
    console.log('📌 Invoice ID:', invoiceId)
    
    // Log the redirect
    await logWebhook(
      `payment.${status}`,
      'payment',
      invoiceId || reference,
      status,
      { status, reference, invoiceId },
      true
    )
    
    // If payment was successful, fetch invoice details and save booking
    if (status === 'success' || status === 'completed') {
      try {
        console.log('📄 Fetching invoice details from Hyparrow for ID:', invoiceId)
        
        // Fetch invoice from Hyparrow
        const invoiceResponse = await fetch(
          `https://api.hyparrow.cloud/api/v1/invoices/${invoiceId}`,
          {
            method: 'GET',
            headers: {
              'X-API-Key': process.env.VITE_HYPARROW_PUBLIC_KEY,
              'X-API-Secret': process.env.VITE_HYPARROW_SECRET_KEY
            }
          }
        )

        if (!invoiceResponse.ok) {
          console.error('❌ Failed to fetch invoice:', invoiceResponse.status)
          throw new Error(`Failed to fetch invoice: ${invoiceResponse.status}`)
        }

        const invoiceData = await invoiceResponse.json()
        console.log('✅ Invoice details received:', JSON.stringify(invoiceData, null, 2))

        // Extract customer details from invoice
        const customerName = invoiceData.customerName || invoiceData.customer_name || 'Guest'
        const customerEmail = invoiceData.customerEmail || invoiceData.customer_email || ''
        const eventTitle = invoiceData.title || 'Event'
        const totalAmount = invoiceData.amount || invoiceData.total || 0

        console.log('👤 Customer:', customerName, customerEmail)
        console.log('💰 Amount:', totalAmount)

        // Save booking with invoice details
        const bookingResult = await sql`
          INSERT INTO bookings 
          (event_title, customer_name, customer_email, ticket_count, total_amount, invoice_id, payment_reference, status)
          VALUES (
            ${eventTitle},
            ${customerName},
            ${customerEmail},
            ${1},
            ${totalAmount},
            ${invoiceId},
            ${reference},
            'confirmed'
          )
          RETURNING *
        `

        console.log('✅ Booking saved from invoice:', bookingResult[0])

        // Update webhook log with booking info
        await logWebhook(
          `payment.${status}`,
          'payment',
          invoiceId,
          'booking_saved',
          { ...invoiceData, bookingId: bookingResult[0].id },
          true
        )
      } catch (err) {
        console.error('❌ Error processing payment success:', err.message)
        await logWebhook(
          `payment.${status}`,
          'payment',
          invoiceId || reference,
          'error_processing',
          { error: err.message },
          true
        )
      }
    }
    
    // Redirect user back to ticketing page with status
    return {
      statusCode: 302,
      headers: {
        'Location': `https://toptierxperienz.com/ticketing?status=${status}&reference=${reference}&invoiceId=${invoiceId || ''}`
      }
    }
  }

  // Handle POST requests (webhook events from Hyparrow)
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

    // Log webhook to database
    await logWebhook(
      paymentEvent,
      paymentEvent?.split('.')?.[0], // event type: 'payment', 'transaction', etc
      data?.invoice_id || data?.reference,
      'received',
      body,
      true
    )

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
        await logWebhook(
          paymentEvent,
          'payment',
          data?.invoice_id || reference,
          'error_missing_fields',
          body,
          true
        )
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

        // Update webhook log status to success
        await logWebhook(
          paymentEvent,
          'payment',
          data?.invoice_id || reference,
          'completed_booking_saved',
          { ...body, bookingId: result[0].id },
          true
        )

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
        await logWebhook(
          paymentEvent,
          'payment',
          data?.invoice_id || reference,
          'error_saving_booking',
          { ...body, error: err.message },
          true
        )
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

      await logWebhook(
        paymentEvent,
        'payment',
        data?.invoice_id || reference,
        'failed',
        body,
        true
      )

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
    await logWebhook(
      paymentEvent,
      'unknown',
      data?.invoice_id || data?.reference,
      'unknown_event',
      body,
      true
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Webhook received'
      })
    }
  } catch (error) {
    console.error('❌ Webhook error:', error)
    
    // Log error
    try {
      await logWebhook(
        'error',
        'system',
        null,
        'error',
        { error: error.message },
        false
      )
    } catch (logErr) {
      console.error('Failed to log error to database:', logErr)
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

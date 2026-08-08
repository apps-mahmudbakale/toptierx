// Netlify serverless function to create/manage Hyparrow invoices
// Avoids CORS issues by making API calls from the server side

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json()
    const { action, bookingData, invoiceId } = body

    const publicKey = process.env.VITE_HYPARROW_PUBLIC_KEY
    const secretKey = process.env.VITE_HYPARROW_SECRET_KEY

    if (!publicKey || !secretKey) {
      return new Response(
        JSON.stringify({ error: 'Hyparrow API keys not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let response

    if (action === 'create') {
      // Create invoice for booking
      const invoiceData = {
        title: `${bookingData.event_title} - Ticket Invoice`,
        currency: 'NGN',
        customerName: bookingData.customer_name || 'Customer',
        customerEmail: bookingData.customer_email || '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 7 days from now
        tax_direction: 'customer',
        taxType: 'percentage',
        taxRate: 0, // No tax by default
        checkoutCallbackUrl: `${process.env.URL || 'https://toptierxperienz.com'}/.netlify/functions/hyparrow-webhook`,
        lineItems: [
          {
            description: `${bookingData.event_title} - ${bookingData.ticket_count} ticket(s)`,
            quantity: parseInt(bookingData.ticket_count) || 1,
            unitPrice: Math.round(parseFloat(bookingData.ticket_price) * 100) // Convert to cents
          }
        ]
      }

      // Add booking ID as metadata for tracking
      if (bookingData.booking_id) {
        invoiceData.metadata = {
          bookingId: bookingData.booking_id
        }
      }

      console.log('📄 Creating Hyparrow invoice:', JSON.stringify(invoiceData, null, 2))

      response = await fetch('https://api.hyparrow.cloud/api/v1/invoices/', {
        method: 'POST',
        headers: {
          'X-API-Key': publicKey,
          'X-API-Secret': secretKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Hyparrow invoice creation error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          requestData: invoiceData
        })
        throw new Error(`Hyparrow API error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ Hyparrow invoice created:', result)

      return new Response(
        JSON.stringify({
          success: true,
          invoice: result,
          invoiceId: result.id || result.invoice_id,
          invoiceUrl: result.checkoutUrl || result.invoice_url
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else if (action === 'get') {
      // Get invoice details
      console.log('📄 Fetching Hyparrow invoice:', invoiceId)

      response = await fetch(`https://api.hyparrow.cloud/api/v1/invoices/${invoiceId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': publicKey,
          'X-API-Secret': secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Invoice fetched:', invoiceId)

      return new Response(JSON.stringify({ success: true, invoice: result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else if (action === 'cancel') {
      // Cancel invoice
      console.log('❌ Cancelling Hyparrow invoice:', invoiceId)

      response = await fetch(`https://api.hyparrow.cloud/api/v1/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': publicKey,
          'X-API-Secret': secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to cancel invoice: ${response.status}`)
      }

      console.log('✅ Invoice cancelled:', invoiceId)

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

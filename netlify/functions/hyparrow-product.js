// Netlify serverless function to create Hyparrow products
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
    const { action, eventData, productId, updateData } = body

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
      // Create product
      const productData = {
        name: eventData.title,
        description: eventData.description || `Event: ${eventData.title}`,
        type: 'digital',
        price: String(eventData.ticketPrice || 0),
        currency: 'NGN',
        stock: parseInt(eventData.capacity) || 0,
        sku: `EVENT-${eventData.id || Date.now()}`,
        category: eventData.category || 'Events',
        isActive: true,
        fileUrl: eventData.image || '',
        variants: []
      }

      // Add ticket category variants if available
      if (eventData.ticketCategories && eventData.ticketCategories.length > 0) {
        productData.variants = eventData.ticketCategories.map((category) => ({
          name: category.name,
          sku: `${productData.sku}-${category.name.toUpperCase().replace(/\s+/g, '-')}`,
          price: String(category.price || 0),
          stockQty: parseInt(eventData.capacity) || 0
        }))
      }

      console.log('🛍️ Creating Hyparrow product:', productData)

      response = await fetch('https://api.hyparrow.cloud/api/v1/products/', {
        method: 'POST',
        headers: {
          'X-API-Key': publicKey,
          'X-API-Secret': secretKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Hyparrow product creation error:', {
          status: response.status,
          body: errorText
        })
        throw new Error(`Failed to create product: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Hyparrow product created:', result)

      return new Response(
        JSON.stringify({
          success: true,
          product: result,
          productId: result.id || result.product_id
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else if (action === 'update') {
      // Update product
      console.log('📦 Updating Hyparrow product:', productId)

      response = await fetch(
        `https://api.hyparrow.cloud/api/v1/products/${productId}`,
        {
          method: 'PUT',
          headers: {
            'X-API-Key': publicKey,
            'X-API-Secret': secretKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Hyparrow product updated:', productId)

      return new Response(JSON.stringify({ success: true, product: result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else if (action === 'delete') {
      // Delete product
      console.log('🗑️ Deleting Hyparrow product:', productId)

      response = await fetch(
        `https://api.hyparrow.cloud/api/v1/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'X-API-Key': publicKey,
            'X-API-Secret': secretKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`)
      }

      console.log('✅ Hyparrow product deleted:', productId)

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

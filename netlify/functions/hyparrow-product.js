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
      // Create or update product
      const productData = {
        name: `${eventData.title}`,
        type: 'physical',
        price: eventData.ticketPrice ? String(eventData.ticketPrice) : '0',
        currency: 'NGN'
      }

      // Add optional fields
      if (eventData.description) {
        productData.description = eventData.description
      }
      if (eventData.capacity) {
        productData.stock = parseInt(eventData.capacity)
      }
      if (eventData.category) {
        productData.category = eventData.category
      }
      if (eventData.image) {
        productData.fileUrl = eventData.image
      }
      
      productData.isActive = true

      // Only add SKU if we have an ID
      if (eventData.id) {
        productData.sku = `EVENT-${eventData.id}`
      }

      // Only add variants if they exist and are valid
      if (Array.isArray(eventData.ticketCategories) && eventData.ticketCategories.length > 0) {
        productData.variants = eventData.ticketCategories
          .filter(cat => cat.name && cat.price)
          .map((category) => ({
            name: category.name,
            price: String(category.price),
            ...(eventData.capacity && { stockQty: parseInt(eventData.capacity) })
          }))
      }

      console.log('🛍️ Product operation:', JSON.stringify(productData, null, 2))

      console.log('Product ID:', productData.product);

      // Check if we have an existing product ID to update
      const hyparrowProductId = eventData.hyparrowProductId
      console.log('📦 Existing product ID:', hyparrowProductId)

      let response

      if (hyparrowProductId && hyparrowProductId !== 'LOCAL' && !hyparrowProductId.startsWith('LOCAL-')) {
        // Update existing product
        console.log('📝 Updating existing product:', hyparrowProductId)
        
        response = await fetch(`https://api.hyparrow.cloud/api/v1/products/${hyparrowProductId}`, {
          method: 'PUT',
          headers: {
            'X-API-Key': publicKey,
            'X-API-Secret': secretKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Hyparrow product update error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          })
          throw new Error(`Hyparrow API error ${response.status}: ${errorText}`)
        }

        const result = await response.json()
        console.log('✅ Hyparrow product updated:', result)

        return new Response(
          JSON.stringify({
            success: true,
            product: result,
            productId: result.id || result.product_id || hyparrowProductId,
            action: 'updated'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      } else {
        // Create new product - add timestamp to name to ensure uniqueness
        const timestamp = Date.now()
        productData.name = `${eventData.title} (${timestamp})`
        
        console.log('✨ Creating new product')
        
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
            statusText: response.statusText,
            body: errorText
          })
          throw new Error(`Hyparrow API error ${response.status}: ${errorText}`)
        }

        const result = await response.json()
        console.log('✅ Hyparrow product created:', result)

        return new Response(
          JSON.stringify({
            success: true,
            product: result,
            productId: result.id || result.product_id,
            action: 'created'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
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

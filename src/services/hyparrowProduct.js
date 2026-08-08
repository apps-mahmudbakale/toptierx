// Hyparrow Product Service
// Creates products in Hyparrow when events are created

export const hyparrowProductService = {
  /**
   * Create a product in Hyparrow for an event
   * @param {Object} eventData - Event details
   * @returns {Promise<Object>} Product created response
   */
  async createProduct(eventData) {
    try {
      const publicKey = import.meta.env.VITE_HYPARROW_PUBLIC_KEY
      const secretKey = import.meta.env.VITE_HYPARROW_SECRET_KEY

      if (!publicKey || !secretKey) {
        throw new Error('Hyparrow API keys not configured')
      }

      // Prepare product data from event
      const productData = {
        name: eventData.title,
        description: eventData.description || `Event: ${eventData.title}`,
        type: 'digital', // Digital product for events
        price: String(eventData.ticketPrice || 0),
        currency: 'NGN',
        stock: parseInt(eventData.capacity) || 0,
        sku: `EVENT-${eventData.id || Date.now()}`,
        category: eventData.category || 'Events',
        isActive: true,
        fileUrl: eventData.image || '', // Event image as file URL
        variants: []
      }

      // Add ticket category variants if available
      if (eventData.ticketCategories && eventData.ticketCategories.length > 0) {
        productData.variants = eventData.ticketCategories.map((category, index) => ({
          name: category.name,
          sku: `${productData.sku}-${category.name.toUpperCase().replace(/\s+/g, '-')}`,
          price: String(category.price || 0),
          stockQty: parseInt(eventData.capacity) || 0
        }))
      }

      console.log('🛍️ Creating Hyparrow product:', productData)

      // Call Hyparrow API
      const response = await fetch('https://api.hyparrow.cloud/api/v1/products/', {
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

      return {
        success: true,
        product: result,
        productId: result.id || result.product_id
      }
    } catch (error) {
      console.error('Error creating Hyparrow product:', error)
      // Don't throw - product creation is optional
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Get product from Hyparrow
   * @param {string} productId - Product ID in Hyparrow
   * @returns {Promise<Object>} Product details
   */
  async getProduct(productId) {
    try {
      const publicKey = import.meta.env.VITE_HYPARROW_PUBLIC_KEY
      const secretKey = import.meta.env.VITE_HYPARROW_SECRET_KEY

      if (!publicKey || !secretKey) {
        throw new Error('Hyparrow API keys not configured')
      }

      const response = await fetch(
        `https://api.hyparrow.cloud/api/v1/products/${productId}`,
        {
          method: 'GET',
          headers: {
            'X-API-Key': publicKey,
            'X-API-Secret': secretKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching Hyparrow product:', error)
      return null
    }
  },

  /**
   * Update product in Hyparrow
   * @param {string} productId - Product ID in Hyparrow
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(productId, updateData) {
    try {
      const publicKey = import.meta.env.VITE_HYPARROW_PUBLIC_KEY
      const secretKey = import.meta.env.VITE_HYPARROW_SECRET_KEY

      if (!publicKey || !secretKey) {
        throw new Error('Hyparrow API keys not configured')
      }

      const response = await fetch(
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

      console.log('✅ Hyparrow product updated:', productId)
      return await response.json()
    } catch (error) {
      console.error('Error updating Hyparrow product:', error)
      return null
    }
  },

  /**
   * Delete product from Hyparrow
   * @param {string} productId - Product ID in Hyparrow
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(productId) {
    try {
      const publicKey = import.meta.env.VITE_HYPARROW_PUBLIC_KEY
      const secretKey = import.meta.env.VITE_HYPARROW_SECRET_KEY

      if (!publicKey || !secretKey) {
        throw new Error('Hyparrow API keys not configured')
      }

      const response = await fetch(
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
      return true
    } catch (error) {
      console.error('Error deleting Hyparrow product:', error)
      return false
    }
  }
}

// Hyparrow Product Service
// Creates products in Hyparrow via Netlify serverless function
// This avoids CORS issues by making API calls from the server side

export const hyparrowProductService = {
  /**
   * Create a product in Hyparrow for an event
   * @param {Object} eventData - Event details
   * @returns {Promise<Object>} Product created response
   */
  async createProduct(eventData) {
    try {
      console.log('🛍️ Creating Hyparrow product for event:', eventData.title)

      // Call Netlify function instead of Hyparrow API directly (avoids CORS)
      const response = await fetch('/.netlify/functions/hyparrow-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          eventData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Product creation failed:', errorData)
        throw new Error(errorData.error || `Failed to create product: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Hyparrow product created:', result)

      return {
        success: true,
        product: result.product,
        productId: result.productId
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
      // Note: This would need a GET function endpoint if needed
      console.log('Fetching product:', productId)
      return null
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
      console.log('📦 Updating Hyparrow product:', productId)

      const response = await fetch('/.netlify/functions/hyparrow-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          productId,
          updateData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Product update failed:', errorData)
        throw new Error(errorData.error || `Failed to update product: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Hyparrow product updated:', productId)

      return result.product
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
      console.log('🗑️ Deleting Hyparrow product:', productId)

      const response = await fetch('/.netlify/functions/hyparrow-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'delete',
          productId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Product deletion failed:', errorData)
        throw new Error(errorData.error || `Failed to delete product: ${response.status}`)
      }

      console.log('✅ Hyparrow product deleted:', productId)
      return true
    } catch (error) {
      console.error('Error deleting Hyparrow product:', error)
      return false
    }
  }
}

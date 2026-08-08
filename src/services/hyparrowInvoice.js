// Hyparrow Invoice Service
// Creates invoices when tickets are booked

export const hyparrowInvoiceService = {
  /**
   * Create an invoice in Hyparrow for a ticket booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Invoice created response
   */
  async createInvoice(bookingData) {
    try {
      console.log('📄 Creating Hyparrow invoice for booking:', bookingData.event_title)

      // Determine if we're in production (deployed) or local dev
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      
      let endpoint = '/.netlify/functions/hyparrow-invoice'
      
      // In local dev, functions aren't available, so skip invoice creation
      if (isDev) {
        console.warn('⚠️ Skipping invoice creation in local dev (Netlify Functions not available locally)')
        const mockId = `LOCAL-${Date.now()}`
        return {
          success: true,
          invoiceId: mockId,
          checkoutUrl: `https://checkout.hyparrow.com/pay/${mockId}`,
          message: 'Invoice creation skipped in local dev'
        }
      }

      // Call Netlify function to create invoice (avoids CORS)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          bookingData
        })
      })

      const result = await response.json()
      console.log('📦 Server response:', JSON.stringify(result, null, 2))

      if (!response.ok) {
        console.error('❌ Invoice creation failed:', result)
        throw new Error(result.error || `Failed to create invoice: ${response.status}`)
      }

      console.log('✅ Hyparrow invoice created')

      return {
        success: true,
        invoice: result.invoice,
        invoiceId: result.invoiceId,
        checkoutUrl: result.checkoutUrl
      }
    } catch (error) {
      console.error('Error creating Hyparrow invoice:', error)
      // Don't throw - invoice creation is optional
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Get invoice from Hyparrow
   * @param {string} invoiceId - Invoice ID in Hyparrow
   * @returns {Promise<Object>} Invoice details
   */
  async getInvoice(invoiceId) {
    try {
      console.log('Fetching invoice:', invoiceId)

      const response = await fetch('/.netlify/functions/hyparrow-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get',
          invoiceId
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching Hyparrow invoice:', error)
      return null
    }
  },

  /**
   * Cancel invoice in Hyparrow
   * @param {string} invoiceId - Invoice ID in Hyparrow
   * @returns {Promise<boolean>} Success status
   */
  async cancelInvoice(invoiceId) {
    try {
      console.log('❌ Cancelling Hyparrow invoice:', invoiceId)

      const response = await fetch('/.netlify/functions/hyparrow-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'cancel',
          invoiceId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Invoice cancellation failed:', errorData)
        throw new Error(errorData.error || `Failed to cancel invoice: ${response.status}`)
      }

      console.log('✅ Hyparrow invoice cancelled:', invoiceId)
      return true
    } catch (error) {
      console.error('Error cancelling Hyparrow invoice:', error)
      return false
    }
  }
}

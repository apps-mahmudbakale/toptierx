// Hyparrow payment service
// Hyparrow (hyparrow.com) integration for online payments
// Uses payment link identifier with POST /checkout/pay/{identifier}

export const hyparrowService = {
  /**
   * Initialize Hyparrow payment using payment link identifier
   * @param {Object} config - Payment configuration
   * @param {string} config.paymentLinkIdentifier - Hyparrow payment link identifier
   * @param {string} config.email - Customer email
   * @param {string} config.customerName - Customer full name
   * @param {Object} config.metadata - Additional metadata
   * @param {Function} config.onSuccess - Callback on successful payment
   * @param {Function} config.onClose - Callback when user closes modal
   * @param {Function} config.onError - Callback on payment error
   */
  initialize(config) {
    if (!config.paymentLinkIdentifier) {
      throw new Error('Missing payment link identifier')
    }

    try {
      // Store payment info for verification
      sessionStorage.setItem('_hyparrowPayment', JSON.stringify({
        identifier: config.paymentLinkIdentifier,
        email: config.email,
        customerName: config.customerName,
        metadata: config.metadata
      }))

      // Call Hyparrow POST endpoint with payment link identifier
      this.initiatePayment({
        identifier: config.paymentLinkIdentifier,
        email: config.email,
        customerName: config.customerName,
        metadata: config.metadata
      })
        .then((response) => {
          console.log('Payment initiated:', response)
          
          // Hyparrow may return a checkout URL or redirect directly
          if (response.checkout_url) {
            window.location.href = response.checkout_url
          } else if (response.payment_url) {
            window.location.href = response.payment_url
          } else {
            // Success callback if no redirect needed
            config.onSuccess && config.onSuccess(response)
          }
        })
        .catch((error) => {
          console.error('Hyparrow payment error:', error)
          config.onError && config.onError(error)
        })

      // Store callbacks
      window._hyparrowCallbacks = {
        onSuccess: config.onSuccess,
        onClose: config.onClose,
        onError: config.onError
      }
    } catch (error) {
      console.error('Hyparrow initialization error:', error)
      config.onError && config.onError(error)
    }
  },

  /**
   * Initiate payment with Hyparrow using payment link identifier
   * @param {Object} data - Payment data
   * @returns {Promise<Object>} Payment response
   */
  async initiatePayment(data) {
    try {
      const publicKey = import.meta.env.VITE_HYPARROW_PUBLIC_KEY
      
      if (!publicKey || publicKey.startsWith('pk_test_your_hyparrow_key') || publicKey === '') {
        throw new Error('Hyparrow public key not configured in .env')
      }

      // Call backend proxy to avoid CORS issues
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/payment/hyparrow/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: data.identifier,
          email: data.email,
          customerName: data.customerName,
          metadata: data.metadata || {}
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to initiate payment')
      }

      const result = await response.json()
      
      // If status 204, we need to redirect to checkout
      if (result.status === 204) {
        // Show message that payment is being processed
        console.log('Payment initiated - redirecting to Hyparrow checkout...')
        // In production, you may need to handle redirect differently
        // For now, the backend will handle the redirect
      }

      return result
    } catch (error) {
      console.error('Error initiating Hyparrow payment:', error)
      throw error
    }
  },

  /**
   * Generate unique transaction reference (not used with payment link identifier)
   * @returns {string} Reference in format: har-{timestamp}-{random}
   */
  generateReference() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `har-${timestamp}-${random}`
  },

  /**
   * Format amount from NGN to kobo
   * @param {number} amount - Amount in NGN
   * @returns {number} Amount in kobo
   */
  formatAmount(amount) {
    return Math.round(amount * 100) // Convert NGN to kobo
  },

  /**
   * Verify payment result from Hyparrow redirect
   * @param {Object} queryParams - URL query parameters
   * @returns {Object} Verification result
   */
  verifyPaymentResult(queryParams) {
    try {
      const status = queryParams.status || 'unknown'
      const reference = queryParams.reference || queryParams.ref
      
      const paymentInfo = sessionStorage.getItem('_hyparrowPayment')
      if (paymentInfo) {
        sessionStorage.removeItem('_hyparrowPayment')
        return {
          reference,
          status,
          verified: status === 'success' || status === 'completed',
          payment: JSON.parse(paymentInfo)
        }
      }
      
      return { reference, status, verified: false }
    } catch (error) {
      console.error('Error verifying payment result:', error)
      return { verified: false, error: error.message }
    }
  }
}

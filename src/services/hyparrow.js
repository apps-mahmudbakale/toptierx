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

      // Call POST /checkout/pay/{identifier} endpoint
      const response = await fetch(`https://api.hyparrow.com/checkout/pay/${data.identifier}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          customer_name: data.customerName,
          metadata: data.metadata || {}
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to initiate payment')
      }

      return await response.json()
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

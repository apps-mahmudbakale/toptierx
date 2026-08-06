// Paystack payment service
// Uses Paystack inline script loaded in index.html

export const paystackService = {
  /**
   * Initialize Paystack payment
   * @param {Object} config - Payment configuration
   * @param {string} config.email - Customer email
   * @param {number} config.amount - Amount in kobo (NGN * 100)
   * @param {string} config.reference - Unique transaction reference
   * @param {string} config.eventTitle - Event title for display
   * @param {Function} config.onSuccess - Callback on successful payment
   * @param {Function} config.onClose - Callback when user closes modal
   */
  initialize(config) {
    if (!window.PaystackPop) {
      console.error('Paystack script not loaded')
      throw new Error('Paystack is not available')
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: config.email,
      amount: config.amount, // Amount in kobo
      currency: 'NGN',
      ref: config.reference,
      onClose: () => {
        console.log('Payment cancelled')
        config.onClose && config.onClose()
      },
      onSuccess: (response) => {
        console.log('Payment successful:', response)
        config.onSuccess && config.onSuccess(response)
      }
    })

    handler.openIframe()
  },

  /**
   * Generate unique transaction reference
   * @returns {string} Reference in format: toptier-{timestamp}-{random}
   */
  generateReference() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `toptier-${timestamp}-${random}`
  },

  /**
   * Verify payment with backend
   * @param {string} reference - Transaction reference to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifyPayment(reference) {
    try {
      // Call backend to verify with Paystack
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  },

  /**
   * Format amount to kobo (Paystack expects amount in kobo)
   * @param {number} amountInNGN - Amount in NGN
   * @returns {number} Amount in kobo
   */
  formatAmount(amountInNGN) {
    return Math.round(amountInNGN * 100)
  }
}

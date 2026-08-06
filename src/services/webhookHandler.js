// Webhook handler for Hyparrow payment verification
// This service handles webhook calls from Hyparrow to verify payments

import crypto from 'crypto'

export const webhookHandler = {
  /**
   * Verify Hyparrow webhook signature
   * @param {string} payload - Raw request body as string
   * @param {string} signature - Signature from x-hyparrow-signature header
   * @param {string} secret - Hyparrow webhook secret from .env
   * @returns {boolean} True if signature is valid
   */
  verifySignature(payload, signature, secret) {
    try {
      const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(hash)
      )
    } catch (error) {
      console.error('Signature verification failed:', error)
      return false
    }
  },

  /**
   * Process payment.completed webhook from Hyparrow
   * @param {Object} event - Webhook event data
   * @returns {Object} Processing result
   */
  async processPaymentCompleted(event) {
    try {
      const {
        id: transactionId,
        reference,
        status,
        amount,
        currency,
        customer,
        metadata
      } = event.data

      // Validate required fields
      if (!reference || status !== 'completed') {
        throw new Error('Invalid payment event')
      }

      return {
        success: true,
        transactionId,
        reference,
        status,
        amount,
        currency,
        customer,
        metadata,
        processedAt: new Date().toISOString(),
        action: 'payment_verified'
      }
    } catch (error) {
      console.error('Error processing payment webhook:', error)
      throw error
    }
  },

  /**
   * Process payment.failed webhook from Hyparrow
   * @param {Object} event - Webhook event data
   * @returns {Object} Processing result
   */
  async processPaymentFailed(event) {
    try {
      const {
        id: transactionId,
        reference,
        reason
      } = event.data

      console.warn(`Payment failed: ${reference}`, reason)

      return {
        success: false,
        transactionId,
        reference,
        reason,
        processedAt: new Date().toISOString(),
        action: 'payment_failed'
      }
    } catch (error) {
      console.error('Error processing payment failed webhook:', error)
      throw error
    }
  },

  /**
   * Process payment.refunded webhook from Hyparrow
   * @param {Object} event - Webhook event data
   * @returns {Object} Processing result
   */
  async processPaymentRefunded(event) {
    try {
      const {
        id: transactionId,
        original_transaction_id,
        reference,
        amount,
        reason
      } = event.data

      return {
        success: true,
        transactionId,
        originalTransactionId: original_transaction_id,
        reference,
        amount,
        reason,
        processedAt: new Date().toISOString(),
        action: 'payment_refunded'
      }
    } catch (error) {
      console.error('Error processing refund webhook:', error)
      throw error
    }
  },

  /**
   * Main webhook handler
   * @param {Object} req - HTTP request
   * @param {Object} res - HTTP response
   * @returns {Promise<void>}
   */
  async handleWebhook(req, res) {
    try {
      // Verify signature
      const signature = req.headers['x-hyparrow-signature']
      const secret = process.env.HYPARROW_WEBHOOK_SECRET

      if (!signature || !secret) {
        return res.status(401).json({
          error: 'Missing signature or webhook secret'
        })
      }

      const isValid = this.verifySignature(
        JSON.stringify(req.body),
        signature,
        secret
      )

      if (!isValid) {
        console.warn('Invalid webhook signature')
        return res.status(403).json({
          error: 'Invalid signature'
        })
      }

      // Process webhook based on event type
      const { type, data } = req.body

      let result
      switch (type) {
        case 'payment.completed':
          result = await this.processPaymentCompleted({ data })
          break
        
        case 'payment.failed':
          result = await this.processPaymentFailed({ data })
          break
        
        case 'payment.refunded':
          result = await this.processPaymentRefunded({ data })
          break
        
        default:
          console.log(`Unhandled webhook type: ${type}`)
          return res.status(200).json({
            received: true,
            message: `Event type ${type} received but not processed`
          })
      }

      // Log successful webhook processing
      console.log(`Webhook processed: ${type}`, result)

      // Return success response
      res.status(200).json({
        received: true,
        ...result
      })

    } catch (error) {
      console.error('Webhook handler error:', error)
      res.status(500).json({
        error: error.message || 'Internal server error'
      })
    }
  }
}

/**
 * Example Express endpoint for receiving webhooks:
 * 
 * app.post('/webhook/hyparrow', webhookHandler.handleWebhook)
 * 
 * This endpoint should:
 * 1. Receive POST requests from Hyparrow
 * 2. Verify the webhook signature
 * 3. Process the payment event
 * 4. Update booking status in database
 * 5. Send confirmation emails
 * 
 * Environment variables required:
 * - HYPARROW_WEBHOOK_SECRET: Secret key from Hyparrow dashboard
 */

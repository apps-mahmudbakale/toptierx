// Booking webhook handler - saves verified bookings after payment
// This handles the webhook response from Hyparrow and creates booking records

export const bookingWebhookHandler = {
  /**
   * Save booking after payment verification
   * This would typically be called from a backend webhook endpoint
   * @param {Object} paymentData - Verified payment data from Hyparrow webhook
   * @param {Object} neonService - Database service
   * @returns {Promise<Object>} Created booking record
   */
  async saveVerifiedBooking(paymentData, neonService) {
    try {
      const {
        reference,
        customer,
        metadata,
        amount,
        status
      } = paymentData

      if (status !== 'completed') {
        throw new Error('Payment not completed, cannot save booking')
      }

      if (!metadata || !metadata.eventId) {
        throw new Error('Missing event ID in payment metadata')
      }

      // Create booking in database
      const bookingData = {
        event_id: metadata.eventId,
        event_title: metadata.eventTitle,
        customer_name: customer.name || metadata.customerName,
        customer_email: customer.email,
        ticket_count: metadata.quantity || 1,
        ticket_price: metadata.ticketPrice || 0,
        total_amount: amount / 100, // Convert from cents to main currency
        payment_reference: reference,
        payment_provider: 'hyparrow',
        payment_status: 'completed',
        status: 'confirmed',
        notes: JSON.stringify({
          ticketTier: metadata.ticketTier,
          paymentMethod: metadata.paymentMethod || 'hyparrow',
          webhookVerified: true,
          verifiedAt: new Date().toISOString()
        })
      }

      // Save to database using SQL
      const result = await neonService.sql`
        INSERT INTO bookings (
          event_id,
          event_title,
          customer_name,
          customer_email,
          ticket_count,
          ticket_price,
          total_amount,
          payment_reference,
          payment_provider,
          payment_status,
          status,
          notes
        )
        VALUES (
          ${bookingData.event_id},
          ${bookingData.event_title},
          ${bookingData.customer_name},
          ${bookingData.customer_email},
          ${bookingData.ticket_count},
          ${bookingData.ticket_price},
          ${bookingData.total_amount},
          ${bookingData.payment_reference},
          ${bookingData.payment_provider},
          ${bookingData.payment_status},
          ${bookingData.status},
          ${bookingData.notes}
        )
        RETURNING *
      `

      if (!result || result.length === 0) {
        throw new Error('Failed to save booking')
      }

      console.log('Booking saved successfully:', result[0])
      return result[0]

    } catch (error) {
      console.error('Error saving verified booking:', error)
      throw error
    }
  },

  /**
   * Update booking status after webhook verification
   * @param {string} reference - Payment reference
   * @param {string} newStatus - New status (verified, failed, refunded)
   * @param {Object} neonService - Database service
   * @returns {Promise<Object>} Updated booking record
   */
  async updateBookingStatus(reference, newStatus, neonService) {
    try {
      const result = await neonService.sql`
        UPDATE bookings
        SET 
          payment_status = ${newStatus},
          status = ${newStatus === 'completed' ? 'confirmed' : 'pending'}
        WHERE payment_reference = ${reference}
        RETURNING *
      `

      if (!result || result.length === 0) {
        throw new Error('Booking not found')
      }

      console.log('Booking status updated:', result[0])
      return result[0]

    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  },

  /**
   * Handle failed payment - mark booking as failed
   * @param {string} reference - Payment reference
   * @param {string} reason - Failure reason
   * @param {Object} neonService - Database service
   * @returns {Promise<Object>} Updated booking record
   */
  async handleFailedPayment(reference, reason, neonService) {
    try {
      const result = await neonService.sql`
        UPDATE bookings
        SET 
          payment_status = 'failed',
          status = 'cancelled',
          notes = json_build_object(
            'failureReason', ${reason},
            'failedAt', now()
          )
        WHERE payment_reference = ${reference}
        RETURNING *
      `

      if (!result || result.length === 0) {
        throw new Error('Booking not found')
      }

      console.log('Booking marked as failed:', result[0])
      return result[0]

    } catch (error) {
      console.error('Error handling failed payment:', error)
      throw error
    }
  },

  /**
   * Handle refund - mark booking as refunded
   * @param {string} originalReference - Original payment reference
   * @param {string} refundReference - Refund transaction reference
   * @param {number} refundAmount - Amount refunded
   * @param {string} reason - Refund reason
   * @param {Object} neonService - Database service
   * @returns {Promise<Object>} Updated booking record
   */
  async handleRefund(originalReference, refundReference, refundAmount, reason, neonService) {
    try {
      const result = await neonService.sql`
        UPDATE bookings
        SET 
          payment_status = 'refunded',
          status = 'refunded',
          notes = json_build_object(
            'refundReference', ${refundReference},
            'refundAmount', ${refundAmount},
            'refundReason', ${reason},
            'refundedAt', now()
          )
        WHERE payment_reference = ${originalReference}
        RETURNING *
      `

      if (!result || result.length === 0) {
        throw new Error('Booking not found')
      }

      console.log('Booking refunded:', result[0])
      return result[0]

    } catch (error) {
      console.error('Error handling refund:', error)
      throw error
    }
  }
}

/**
 * EXAMPLE BACKEND ENDPOINT (Node.js Express)
 * 
 * Import statements:
 * import { webhookHandler } from './webhookHandler.js'
 * import { bookingWebhookHandler } from './bookingWebhookHandler.js'
 * import { emailService } from './emailService.js'
 * import { neonDb } from './neonDb.js'
 * 
 * Express endpoint:
 * app.post('/webhook/hyparrow', async (req, res) => {
 *   try {
 *     // 1. Verify webhook signature
 *     const signature = req.headers['x-hyparrow-signature']
 *     const isValid = webhookHandler.verifySignature(
 *       JSON.stringify(req.body),
 *       signature,
 *       process.env.HYPARROW_WEBHOOK_SECRET
 *     )
 * 
 *     if (!isValid) {
 *       return res.status(403).json({ error: 'Invalid signature' })
 *     }
 * 
 *     const { type, data } = req.body
 * 
 *     // 2. Process different webhook types
 *     if (type === 'payment.completed') {
 *       // Verify and process the payment
 *       const result = await webhookHandler.processPaymentCompleted({ data })
 * 
 *       // 3. Save booking
 *       const booking = await bookingWebhookHandler.saveVerifiedBooking(
 *         {
 *           reference: data.reference,
 *           customer: data.customer,
 *           metadata: data.metadata,
 *           amount: data.amount,
 *           status: 'completed'
 *         },
 *         neonDb
 *       )
 * 
 *       // 4. Send confirmation emails
 *       await emailService.sendBookingConfirmation({
 *         customerEmail: booking.customer_email,
 *         customerName: booking.customer_name,
 *         eventTitle: booking.event_title,
 *         eventDate: data.metadata.eventDate,
 *         eventTime: data.metadata.eventTime,
 *         eventVenue: data.metadata.eventVenue,
 *         ticketTier: data.metadata.ticketTier,
 *         quantity: data.metadata.quantity,
 *         totalAmount: booking.total_amount,
 *         reference: data.reference
 *       })
 * 
 *       await emailService.sendPaymentReceipt({
 *         customerEmail: booking.customer_email,
 *         customerName: booking.customer_name,
 *         eventTitle: booking.event_title,
 *         totalAmount: booking.total_amount,
 *         reference: data.reference,
 *         paymentMethod: 'Hyparrow'
 *       })
 * 
 *       return res.status(200).json({
 *         received: true,
 *         booking: booking.id,
 *         message: 'Booking created and emails sent'
 *       })
 *     }
 * 
 *     else if (type === 'payment.failed') {
 *       // Handle failed payment
 *       const result = await webhookHandler.processPaymentFailed({ data })
 *       await bookingWebhookHandler.handleFailedPayment(
 *         data.reference,
 *         result.reason,
 *         neonDb
 *       )
 * 
 *       return res.status(200).json({
 *         received: true,
 *         message: 'Failed payment processed'
 *       })
 *     }
 * 
 *     else if (type === 'payment.refunded') {
 *       // Handle refund
 *       const result = await webhookHandler.processPaymentRefunded({ data })
 *       await bookingWebhookHandler.handleRefund(
 *         data.original_transaction_id,
 *         result.transactionId,
 *         result.amount,
 *         result.reason,
 *         neonDb
 *       )
 * 
 *       return res.status(200).json({
 *         received: true,
 *         message: 'Refund processed'
 *       })
 *     }
 * 
 *     // Unknown event type
 *     return res.status(200).json({
 *       received: true,
 *       message: `Event ${type} received`
 *     })
 * 
 *   } catch (error) {
 *     console.error('Webhook error:', error)
 *     return res.status(500).json({ error: error.message })
 *   }
 * })
 */

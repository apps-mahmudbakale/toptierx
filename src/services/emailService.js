// Email notification service
// Sends booking confirmations and event details to customers

export const emailService = {
  /**
   * Send booking confirmation email
   * @param {Object} bookingData - Booking information
   * @param {string} bookingData.customerEmail - Customer email
   * @param {string} bookingData.customerName - Customer name
   * @param {string} bookingData.eventTitle - Event title
   * @param {string} bookingData.eventDate - Event date
   * @param {string} bookingData.eventTime - Event time
   * @param {string} bookingData.eventVenue - Event venue
   * @param {string} bookingData.ticketTier - Ticket tier selected
   * @param {number} bookingData.quantity - Number of tickets
   * @param {number} bookingData.totalAmount - Total amount paid
   * @param {string} bookingData.reference - Payment reference
   * @returns {Promise<Object>} Email send response
   */
  async sendBookingConfirmation(bookingData) {
    try {
      const emailContent = this.generateBookingEmailHTML(bookingData)
      
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: bookingData.customerEmail,
          subject: `Booking Confirmed: ${bookingData.eventTitle}`,
          html: emailContent,
          replyTo: 'support@toptierxperienz.com',
          metadata: {
            bookingReference: bookingData.reference,
            eventId: bookingData.eventId,
            type: 'booking_confirmation'
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send email')
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending booking confirmation email:', error)
      throw error
    }
  },

  /**
   * Send payment receipt email
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Email send response
   */
  async sendPaymentReceipt(paymentData) {
    try {
      const emailContent = this.generatePaymentReceiptHTML(paymentData)
      
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: paymentData.customerEmail,
          subject: `Payment Receipt: ${paymentData.eventTitle}`,
          html: emailContent,
          replyTo: 'support@toptierxperienz.com',
          metadata: {
            paymentReference: paymentData.reference,
            eventId: paymentData.eventId,
            type: 'payment_receipt'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send payment receipt')
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending payment receipt email:', error)
      throw error
    }
  },

  /**
   * Generate booking confirmation HTML email
   * @param {Object} data - Booking data
   * @returns {string} HTML email content
   */
  generateBookingEmailHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .booking-details { background: white; padding: 20px; border-left: 4px solid #d4af37; margin-bottom: 20px; border-radius: 4px; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #666; font-weight: 500; }
            .detail-value { color: #1a1a1a; font-weight: 600; }
            .highlight { color: #d4af37; font-size: 24px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 15px; }
            .qr-section { text-align: center; padding: 20px; background: white; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Booking Confirmed</h1>
              <p style="margin: 10px 0 0 0;">Your attendance at TopTier Xperienz is secured</p>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; margin-top: 0;">Dear ${data.customerName},</p>
              
              <p>Thank you for booking your ticket to <strong>${data.eventTitle}</strong>. Your reservation has been confirmed and payment has been processed successfully.</p>
              
              <div class="section">
                <div class="section-title">Event Details</div>
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="detail-label">Event</span>
                    <span class="detail-value">${data.eventTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${data.eventDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">${data.eventTime || 'TBD'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Venue</span>
                    <span class="detail-value">${data.eventVenue}</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Booking Summary</div>
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="detail-label">Ticket Tier</span>
                    <span class="detail-value">${data.ticketTier}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Quantity</span>
                    <span class="detail-value">${data.quantity} ticket(s)</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Total Paid</span>
                    <span class="highlight">₦${data.totalAmount.toLocaleString('en-NG')}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reference</span>
                    <span class="detail-value">${data.reference}</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  <strong>What's Next:</strong> Your booking confirmation and tickets will be sent to this email. 
                  Please keep this email safe and present the booking reference at the event entrance.
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://toptierxperienz.com/bookings/${data.reference}" class="button">View Booking</a>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>If you have any questions, please contact our support team at <strong>support@toptierxperienz.com</strong></p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 TopTier Xperienz. All rights reserved.</p>
              <p>This is a booking confirmation for the luxury event management platform.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  /**
   * Generate payment receipt HTML email
   * @param {Object} data - Payment data
   * @returns {string} HTML email content
   */
  generatePaymentReceiptHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
            .receipt-section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 4px; border-left: 4px solid #d4af37; }
            .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; }
            .receipt-label { color: #666; font-weight: 500; }
            .receipt-value { color: #1a1a1a; font-weight: 600; }
            .amount-due { font-size: 32px; color: #d4af37; font-weight: bold; text-align: right; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .status { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
            .status-text { color: #2e7d32; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Receipt</h1>
              <p style="margin: 10px 0 0 0;">Transaction Confirmed</p>
            </div>
            
            <div class="content">
              <div class="status">
                <p class="status-text">✓ Payment Successfully Processed</p>
              </div>

              <p>Hello ${data.customerName},</p>
              
              <p>Thank you for your payment. Below is your receipt for the transaction.</p>

              <div class="receipt-section">
                <h3 style="margin-top: 0; color: #1a1a1a;">Payment Details</h3>
                <div class="receipt-row">
                  <span class="receipt-label">Event</span>
                  <span class="receipt-value">${data.eventTitle}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Payment Method</span>
                  <span class="receipt-value">${data.paymentMethod || 'Hyparrow'}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Reference Number</span>
                  <span class="receipt-value">${data.reference}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Date & Time</span>
                  <span class="receipt-value">${new Date().toLocaleString('en-NG')}</span>
                </div>
              </div>

              <div class="receipt-section">
                <div class="receipt-row" style="padding-bottom: 15px; border-bottom: 2px solid #eee;">
                  <span class="receipt-label">Amount Paid</span>
                  <span class="amount-due">₦${data.totalAmount.toLocaleString('en-NG')}</span>
                </div>
              </div>

              <p style="color: #666; font-size: 14px;">
                This receipt confirms that your payment has been successfully processed. 
                Your booking confirmation will follow shortly with all event details and ticket information.
              </p>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">For questions or concerns, contact <strong>support@toptierxperienz.com</strong></p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 TopTier Xperienz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

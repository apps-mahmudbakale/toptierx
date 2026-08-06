# Email Notifications & Webhook Verification Setup

## Overview

This guide covers the email notification system and webhook verification for Hyparrow payments in TopTier Xperienz.

## 📧 Email Notification System

### Email Service (`src/services/emailService.js`)

The email service handles sending booking confirmations and payment receipts to customers.

#### Features
- ✅ Professional HTML email templates
- ✅ Booking confirmation emails with event details
- ✅ Payment receipt emails
- ✅ Customer metadata tracking
- ✅ Reply-to address configuration

#### Methods

**1. Send Booking Confirmation**
```javascript
await emailService.sendBookingConfirmation({
  customerEmail: 'guest@example.com',
  customerName: 'John Doe',
  eventTitle: 'The Obsidian Gala',
  eventDate: 'Sep 12, 2026',
  eventTime: '19:00',
  eventVenue: 'The Ritz London',
  ticketTier: 'VIP',
  quantity: 2,
  totalAmount: 500000,
  reference: 'har-1234567890-5678'
})
```

**2. Send Payment Receipt**
```javascript
await emailService.sendPaymentReceipt({
  customerEmail: 'guest@example.com',
  customerName: 'John Doe',
  eventTitle: 'The Obsidian Gala',
  totalAmount: 500000,
  reference: 'har-1234567890-5678',
  paymentMethod: 'Hyparrow'
})
```

#### Email Templates

Both emails include:
- Professional luxury branding (gold and dark theme)
- Event details section
- Booking summary or payment details
- Transaction reference
- Call-to-action buttons
- Support contact information
- Company footer

### Setup Email Service

#### Option 1: Using Resend (Recommended)

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up and verify domain
   - Get API key

2. **Update .env**
   ```
   VITE_EMAIL_API_KEY=re_your_resend_key_here
   VITE_EMAIL_SERVICE_URL=https://api.resend.com/emails
   VITE_EMAIL_FROM=noreply@toptierxperienz.com
   ```

3. **Backend Endpoint** (Node.js Express)
   ```javascript
   import Resend from 'resend'
   
   const resend = new Resend(process.env.VITE_EMAIL_API_KEY)
   
   app.post('/api/emails/send', async (req, res) => {
     try {
       const { to, subject, html, replyTo } = req.body
       
       const response = await resend.emails.send({
         from: process.env.VITE_EMAIL_FROM,
         to,
         subject,
         html,
         replyTo
       })
       
       res.json({ success: true, id: response.id })
     } catch (error) {
       res.status(500).json({ error: error.message })
     }
   })
   ```

#### Option 2: Using Nodemailer (Gmail/SMTP)

```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

app.post('/api/emails/send', async (req, res) => {
  try {
    const { to, subject, html, replyTo } = req.body
    
    const response = await transporter.sendMail({
      from: process.env.VITE_EMAIL_FROM,
      to,
      subject,
      html,
      replyTo
    })
    
    res.json({ success: true, messageId: response.messageId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

#### Option 3: Using SendGrid

```javascript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/api/emails/send', async (req, res) => {
  try {
    const { to, subject, html, replyTo } = req.body
    
    const response = await sgMail.send({
      to,
      from: process.env.VITE_EMAIL_FROM,
      subject,
      html,
      replyTo
    })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## 🔐 Webhook Verification

### Webhook Handler (`src/services/webhookHandler.js`)

Handles incoming webhooks from Hyparrow to verify payments.

#### Features
- ✅ HMAC-SHA256 signature verification
- ✅ Process multiple event types (payment.completed, payment.failed, payment.refunded)
- ✅ Timing-safe comparison for security
- ✅ Error handling and logging

#### Webhook Events

**1. Payment Completed**
```json
{
  "type": "payment.completed",
  "data": {
    "id": "txn_abc123",
    "reference": "har-1234567890-5678",
    "status": "completed",
    "amount": 50000000,
    "currency": "NGN",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "metadata": {
      "eventId": 3,
      "eventTitle": "The Obsidian Gala",
      "ticketTier": "VIP",
      "quantity": 2
    }
  }
}
```

**2. Payment Failed**
```json
{
  "type": "payment.failed",
  "data": {
    "id": "txn_def456",
    "reference": "har-0987654321-4321",
    "reason": "Card declined"
  }
}
```

**3. Payment Refunded**
```json
{
  "type": "payment.refunded",
  "data": {
    "id": "ref_ghi789",
    "original_transaction_id": "txn_abc123",
    "reference": "har-1234567890-5678",
    "amount": 50000000,
    "reason": "Customer request"
  }
}
```

### Booking Webhook Handler (`src/services/bookingWebhookHandler.js`)

Saves and manages bookings after webhook verification.

#### Methods

**1. Save Verified Booking**
```javascript
const booking = await bookingWebhookHandler.saveVerifiedBooking(
  {
    reference: 'har-123456',
    customer: { name: 'John', email: 'john@example.com' },
    metadata: { eventId: 3, quantity: 2 },
    amount: 50000000,
    status: 'completed'
  },
  neonDb
)
```

**2. Update Booking Status**
```javascript
await bookingWebhookHandler.updateBookingStatus(
  'har-123456',
  'completed',
  neonDb
)
```

**3. Handle Failed Payment**
```javascript
await bookingWebhookHandler.handleFailedPayment(
  'har-123456',
  'Card declined',
  neonDb
)
```

**4. Handle Refund**
```javascript
await bookingWebhookHandler.handleRefund(
  'har-123456',
  'ref-789',
  50000000,
  'Customer request',
  neonDb
)
```

## 🔌 Backend Setup

### Express.js Webhook Endpoint

Create a file `server/routes/webhooks.js`:

```javascript
import express from 'express'
import { webhookHandler } from '../services/webhookHandler.js'
import { bookingWebhookHandler } from '../services/bookingWebhookHandler.js'
import { emailService } from '../services/emailService.js'
import { neonDb } from '../services/neonDb.js'

const router = express.Router()

router.post('/hyparrow', async (req, res) => {
  try {
    // 1. Verify signature
    const signature = req.headers['x-hyparrow-signature']
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' })
    }

    const isValid = webhookHandler.verifySignature(
      JSON.stringify(req.body),
      signature,
      process.env.HYPARROW_WEBHOOK_SECRET
    )

    if (!isValid) {
      console.warn('Invalid webhook signature from Hyparrow')
      return res.status(403).json({ error: 'Invalid signature' })
    }

    const { type, data } = req.body

    // 2. Process payment.completed
    if (type === 'payment.completed') {
      // Verify payment
      const verification = await webhookHandler.processPaymentCompleted({ data })

      // Save booking
      const booking = await bookingWebhookHandler.saveVerifiedBooking(
        {
          reference: data.reference,
          customer: data.customer,
          metadata: data.metadata,
          amount: data.amount,
          status: 'completed'
        },
        neonDb
      )

      // Send confirmation email
      await emailService.sendBookingConfirmation({
        customerEmail: booking.customer_email,
        customerName: booking.customer_name,
        eventTitle: booking.event_title,
        eventDate: data.metadata.eventDate,
        eventTime: data.metadata.eventTime,
        eventVenue: data.metadata.eventVenue,
        ticketTier: data.metadata.ticketTier,
        quantity: data.metadata.quantity,
        totalAmount: booking.total_amount,
        reference: data.reference
      })

      // Send payment receipt
      await emailService.sendPaymentReceipt({
        customerEmail: booking.customer_email,
        customerName: booking.customer_name,
        eventTitle: booking.event_title,
        totalAmount: booking.total_amount,
        reference: data.reference,
        paymentMethod: 'Hyparrow'
      })

      return res.status(200).json({
        received: true,
        booking: booking.id,
        message: 'Booking created and emails sent'
      })
    }

    // 3. Process payment.failed
    if (type === 'payment.failed') {
      const result = await webhookHandler.processPaymentFailed({ data })
      await bookingWebhookHandler.handleFailedPayment(
        data.reference,
        result.reason,
        neonDb
      )

      return res.status(200).json({
        received: true,
        message: 'Failed payment processed'
      })
    }

    // 4. Process payment.refunded
    if (type === 'payment.refunded') {
      const result = await webhookHandler.processPaymentRefunded({ data })
      await bookingWebhookHandler.handleRefund(
        data.original_transaction_id,
        result.transactionId,
        result.amount,
        result.reason,
        neonDb
      )

      return res.status(200).json({
        received: true,
        message: 'Refund processed'
      })
    }

    return res.status(200).json({
      received: true,
      message: `Event type ${type} received but not processed`
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: error.message })
  }
})

export default router
```

Register in main server file:

```javascript
import webhookRoutes from './routes/webhooks.js'

app.use('/webhook', webhookRoutes)
```

## 📋 Payment Link Identifier

The payment link identifier is stored in the events table and used to initialize payments.

### Adding to Event Form

In Dashboard.jsx, the payment link identifier field is now included:

```jsx
<input
  type="text"
  name="paymentLinkIdentifier"
  value={formData.paymentLinkIdentifier}
  onChange={handleInputChange}
  placeholder="e.g., link_abc123xyz"
/>
```

### Getting from Hyparrow Dashboard

1. Go to https://dashboard.hyparrow.com
2. Navigate to **Payment Links** section
3. Create a payment link for your event
4. Copy the identifier (format: `link_xxxxx`)
5. Paste in the Dashboard event form

## 🔄 Complete Payment Flow

```
1. Customer fills ticketing form
2. Clicks "Pay Now"
3. Redirected to Hyparrow with payment link identifier
4. Customer completes payment on Hyparrow
5. Hyparrow sends webhook to your backend
6. Backend verifies signature
7. Backend saves booking to Neon
8. Backend sends confirmation emails
9. Customer receives booking confirmation + receipt
```

## 🔐 Security

- ✅ HMAC-SHA256 signature verification
- ✅ Timing-safe string comparison
- ✅ Webhook secret stored in environment variables
- ✅ Payment reference validation
- ✅ Email service API key in .env
- ✅ No sensitive data in logs

## 🧪 Testing Webhooks Locally

Use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel (forward local:3000 to public URL)
ngrok http 3000
```

Then in Hyparrow dashboard:
1. Webhook URL: `https://your-ngrok-url.ngrok.io/webhook/hyparrow`
2. Webhook Secret: Copy from environment variables

## 📝 Environment Variables

```env
# Email Service (Resend)
VITE_EMAIL_API_KEY=re_your_api_key_here
VITE_EMAIL_SERVICE_URL=https://api.resend.com/emails
VITE_EMAIL_FROM=noreply@toptierxperienz.com

# Hyparrow Webhook (Server-side only)
HYPARROW_WEBHOOK_SECRET=whsec_your_secret_here

# Hyparrow Payment Keys
VITE_HYPARROW_PUBLIC_KEY=pk_test_xxxxx
VITE_HYPARROW_SECRET_KEY=sk_test_xxxxx
```

## 📧 Email Templates

Both booking confirmation and payment receipt emails include:
- Professional luxury design
- Event/payment details
- Transaction reference
- Customer information
- Call-to-action links
- Support contact
- Company branding

Customizable by editing `emailService.js` methods:
- `generateBookingEmailHTML()`
- `generatePaymentReceiptHTML()`

## 🚀 Deployment

When deploying to production:

1. **Update email service**
   - Set real API keys
   - Update sender email
   - Configure domain

2. **Configure webhooks**
   - Set webhook URL in Hyparrow dashboard
   - Set webhook secret in environment
   - Test webhook delivery

3. **Verify SSL/TLS**
   - Ensure production URL uses HTTPS
   - Keep certificates updated

4. **Monitor webhooks**
   - Log all webhook events
   - Monitor failed deliveries
   - Set up alerts

## 📞 Support

- Resend: https://resend.com/docs
- Hyparrow: https://docs.hyparrow.com
- Nodemailer: https://nodemailer.com

---

**Email and webhook system is production-ready!** ✅

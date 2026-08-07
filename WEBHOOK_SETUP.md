# Hyparrow Webhook Setup Guide

## Current Implementation

Your app currently uses a **client-side booking save** approach:
```
Payment completed → User redirected with ?status=success → Frontend saves booking
```

This works but has limitations (user might close browser, no server verification).

## Webhook Approach (Recommended for Production)

With webhooks, Hyparrow sends payment confirmation directly to your server:
```
Payment completed → Hyparrow sends webhook → Server saves booking → Email sent
```

## Setup Steps

### 1. Deploy Netlify Function

The webhook handler is in: `netlify/functions/hyparrow-webhook.js`

This function:
- Receives webhook from Hyparrow
- Verifies payment event
- Saves booking to Neon database
- Returns confirmation to Hyparrow

### 2. Deploy to Netlify

When you deploy to Netlify, the function will be automatically available at:
```
https://yourdomain.com/.netlify/functions/hyparrow-webhook
```

### 3. Configure Hyparrow Webhook

1. Go to [Hyparrow Dashboard](https://dashboard.hyparrow.com)
2. Settings → Webhooks (or Integrations)
3. Add webhook endpoint: `https://yourdomain.com/.netlify/functions/hyparrow-webhook`
4. Subscribe to events:
   - `payment.completed`
   - `payment.failed`
   - `transaction.completed`
   - `transaction.failed`
5. Save webhook

### 4. Test Webhook

**Local Testing:**
- Use ngrok to expose local server
- Or wait and test on live deployment

**Live Testing:**
- Make a test payment through Hyparrow
- Check Hyparrow webhook logs
- Check Netlify function logs
- Verify booking appears in Neon database

## Webhook Flow Diagram

```
User Payment Flow with Webhook:
├─ User goes to /event/3/tickets
├─ Fills booking form
├─ Clicks "Pay Now"
├─ Redirected to Hyparrow checkout
│
├─ User completes payment on Hyparrow ← PAYMENT PROCESSED
│
├─ Hyparrow Process:
│  ├─ Records payment
│  ├─ Sends webhook: POST /.netlify/functions/hyparrow-webhook
│  └─ Gets confirmation: { success: true }
│
├─ Your Function Process:
│  ├─ Receives payment.completed event
│  ├─ Extracts booking info
│  ├─ Saves booking to Neon
│  ├─ (Optional) Sends confirmation email
│  └─ Logs success
│
└─ User Redirect:
   ├─ Hyparrow redirects back to app
   ├─ Frontend checks booking status (already saved by webhook!)
   ├─ Shows success screen
   └─ Booking already in database ✅
```

## Webhook Event Format

### Payment Completed
```json
{
  "event": "payment.completed",
  "data": {
    "reference": "har-123456",
    "amount": 350000,
    "email": "customer@example.com",
    "customer_name": "John Doe",
    "metadata": {
      "eventId": 1,
      "eventTitle": "Luxury Gala",
      "ticketTier": "VIP",
      "quantity": 2,
      "totalAmount": 350000
    }
  }
}
```

### Payment Failed
```json
{
  "event": "payment.failed",
  "data": {
    "reference": "har-123456",
    "reason": "card_declined",
    "email": "customer@example.com"
  }
}
```

## Environment Variables

Make sure these are set on Netlify:
```
VITE_DATABASE_URL = your_neon_connection_string
```

The function will use this to connect to Neon and save bookings.

## Verification

### Check Function Logs
1. Go to Netlify dashboard
2. Functions tab
3. Select `hyparrow-webhook`
4. View real-time logs

### Check Hyparrow Webhook Logs
1. Go to Hyparrow dashboard
2. Settings → Webhooks
3. Click your webhook
4. View delivery attempts and responses

### Query Bookings
```sql
-- In Neon console
SELECT * FROM bookings ORDER BY created_at DESC;
```

## Advantages of Webhooks

✅ **Reliable** - Payment confirmed on server before saving
✅ **Verified** - Server verifies webhook is from Hyparrow (optional)
✅ **Email Confirmations** - Can send emails from server
✅ **No User Intervention** - Booking saves even if user closes browser
✅ **Error Handling** - Server can retry on failure
✅ **Audit Trail** - Server logs all payments
✅ **Scalable** - Handles high payment volume

## Optional: Webhook Signature Verification

For enhanced security, verify webhook signature:

```javascript
// In hyparrow-webhook.js
import crypto from 'crypto'

const verifyWebhookSignature = (body, signature, secret) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature)
  )
}

// In handler:
const signature = event.headers['x-hyparrow-signature']
if (!verifyWebhookSignature(event.body, signature, process.env.HYPARROW_WEBHOOK_SECRET)) {
  return {
    statusCode: 401,
    body: JSON.stringify({ error: 'Invalid signature' })
  }
}
```

## Troubleshooting

**Webhook not being called:**
- Check Hyparrow webhook URL is correct
- Check Hyparrow webhook is enabled
- Check payment actually completed

**Booking not saved:**
- Check Neon connection string in env vars
- Check function logs for errors
- Verify bookings table exists

**Function returns 500 error:**
- Check function logs
- Verify DATABASE_URL is set
- Check event data format

## Migration from Client-Side to Webhook

1. Deploy webhook function (already done: `netlify/functions/hyparrow-webhook.js`)
2. Configure webhook in Hyparrow dashboard
3. Test with a payment
4. Verify booking appears in database
5. (Optional) Remove client-side booking save code

## Files Involved

- `netlify/functions/hyparrow-webhook.js` - Webhook handler
- `src/services/neonDb.js` - Database access (via sql connection)
- `src/pages/Ticketing.jsx` - Frontend still detects redirect, but booking already saved by webhook
- `WEBHOOK_SETUP.md` - This guide

## Next Steps

1. ✅ Webhook function created
2. ⏳ Deploy to Netlify
3. ⏳ Configure webhook in Hyparrow
4. ⏳ Test payment
5. ⏳ (Optional) Add signature verification
6. ⏳ (Optional) Add email confirmations
7. ⏳ (Optional) Add webhook retries

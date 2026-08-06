# Hyparrow Payment Integration

## Overview

Hyparrow (hyparrow.com) is now integrated alongside Paystack for payment processing. Customers can choose between Paystack or Hyparrow when purchasing tickets.

## Setup Required

### 1. Get Your Hyparrow Keys

1. Go to https://dashboard.hyparrow.com
2. Sign up or log in to your merchant account
3. Navigate to **API Settings** or **Developer Keys**
4. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
5. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Configure Environment Variables

Add to `.env`:
```
VITE_HYPARROW_PUBLIC_KEY=pk_test_your_hyparrow_key_here
VITE_HYPARROW_SECRET_KEY=sk_test_your_hyparrow_key_here
```

Replace with your actual Hyparrow keys from the dashboard.

### 3. Restart Development Server

```bash
npm run dev
```

## How It Works

### Payment Options

Customers can now choose between two payment methods on the ticketing page:

1. **Paystack** - Card payments, USSD, Bank transfers, Mobile Money
2. **Hyparrow** - Flexible payment infrastructure with multiple payment methods

### Payment Flow (Hyparrow)

1. Customer visits ticketing page → `/event/{id}/tickets`
2. Selects ticket tier and quantity
3. Fills in guest information (name, email)
4. **Selects "Hyparrow"** as payment method
5. Clicks "Pay" button
6. Hyparrow payment processing initiates
7. Customer completes payment via their preferred method
8. Payment verified and booking saved to database
9. Confirmation email sent

### File Structure

```
src/services/
├── paystack.js        # Paystack service
├── hyparrow.js        # Hyparrow service (REAL PROVIDER)
└── neonDb.js          # Database service

src/pages/
└── Ticketing.jsx      # Updated with both payment options

index.html
├── Paystack script
└── Hyparrow uses REST API (no script needed)
```

## Integration Details

### Hyparrow Service (`src/services/hyparrow.js`)

```javascript
// Initialize Hyparrow payment
hyparrowService.initialize({
  email: 'customer@example.com',
  amount: 5000000,  // Amount in kobo (5000000 = ₦50,000)
  reference: 'har-unique-reference-123',
  currency: 'NGN',
  eventTitle: 'Event Name',
  customerName: 'John Doe',
  onSuccess: (response) => { /* Handle success */ },
  onClose: () => { /* Handle cancel */ },
  onError: (error) => { /* Handle error */ }
})

// Generate unique reference
const reference = hyparrowService.generateReference()

// Verify payment
const verification = await hyparrowService.verifyPayment(reference)

// Check payment status
const status = await hyparrowService.checkStatus(reference)

// Create payment intent
const intent = await hyparrowService.createPaymentIntent({
  amount: 5000000,
  currency: 'NGN',
  email: 'customer@example.com',
  // ... other fields
})
```

### Ticketing Page Integration

Both payment methods are now available:
- Paystack option (Card, USSD, Bank Transfer, Mobile Money, QR)
- Hyparrow option (Flexible payment infrastructure)

Customer selects their preferred method and proceeds with payment.

## Payment Methods Supported

### Paystack
- ✅ Debit/Credit Cards (Visa, Mastercard, AmEx)
- ✅ Bank Transfer
- ✅ USSD
- ✅ QR Code
- ✅ Mobile Money

### Hyparrow
- ✅ Debit/Credit Cards
- ✅ Bank Transfer
- ✅ Mobile Money
- ✅ Digital Wallets
- ✅ Direct Debit
- ✅ E-wallets
- ✅ Regional Payment Methods

## Testing

### Test Credentials

**Hyparrow Test Mode:**
- Use test public key (starts with `pk_test_`)
- Use test secret key (starts with `sk_test_`)
- No real charges in test mode

**Paystack Test Mode:**
- Use test public key (starts with `pk_test_`)
- Test cards available on dashboard

### Common Test Cards

| Provider | Card Number | Exp | CVC |
|---|---|---|---|
| Visa | 4111111111111111 | 01/25 | 123 |
| Mastercard | 5555555555554444 | 12/26 | 456 |
| AmEx | 378282246310005 | 06/27 | 789 |

## Features

✅ **Dual payment options** - Paystack & Hyparrow  
✅ **Multiple payment methods** per provider  
✅ **Secure processing** - Both PCI compliant  
✅ **REST API integration** - Server-to-server verification  
✅ **Automatic payment routing** - Customer chooses  
✅ **Transaction tracking** - Unique references (har-prefix for Hyparrow)  
✅ **Error handling** - User-friendly messages  
✅ **Loading states** - Show spinner during payment  
✅ **Test & Live modes** - Easy switching  
✅ **Amount formatting** - Automatic kobo conversion  

## API Reference

### Hyparrow Service Methods

```javascript
// Initialize payment
hyparrowService.initialize(config)

// Generate reference (returns har-{timestamp}-{random})
const ref = hyparrowService.generateReference()

// Verify payment
await hyparrowService.verifyPayment(reference)

// Check status
await hyparrowService.checkStatus(reference)

// Create payment intent
await hyparrowService.createPaymentIntent(data)

// Format amount (NGN to kobo)
const kobo = hyparrowService.formatAmount(50000)  // 5000000
```

### Configuration Object

```javascript
{
  email: string,              // Customer email (required)
  amount: number,             // Amount in kobo (required)
  reference: string,          // Unique transaction ID (required)
  currency: string,           // Currency code (default: NGN)
  eventTitle: string,         // Event name (required)
  customerName: string,       // Full name (required)
  customerPhone: string,      // Phone number (optional)
  onSuccess: function,        // Success callback (required)
  onClose: function,          // Cancel callback (required)
  onError: function           // Error callback (optional)
}
```

## Amount Formatting

Hyparrow uses **kobo** (smallest unit of NGN):
- 1 NGN = 100 kobo
- ₦50,000 = 5,000,000 kobo

The service automatically converts using `formatAmount()`:
```javascript
hyparrowService.formatAmount(50000)  // Returns 5000000
```

## Security

- ✅ Public keys only in frontend (no secret keys exposed)
- ✅ SSL/TLS encrypted communication
- ✅ Both providers PCI Level 1 compliant
- ✅ Payment processing on provider servers
- ✅ Reference tokens for transaction tracking
- ✅ Email validation
- ✅ API secret keys used only in backend verification

## Database Schema

Both payment methods save to same booking table:

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  event_title VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  ticket_count INTEGER,
  ticket_price DECIMAL(12, 2),
  total_amount DECIMAL(12, 2),
  payment_reference VARCHAR(255),      -- har-{timestamp}-{random} or pst-{reference}
  payment_provider VARCHAR(50),        -- 'paystack' or 'hyparrow'
  payment_status VARCHAR(50),          -- 'pending', 'completed', 'failed'
  status VARCHAR(50) DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Switching Between Test & Live

### Environment Update

Test mode (Default):
```
VITE_HYPARROW_PUBLIC_KEY=pk_test_xxxxx
VITE_HYPARROW_SECRET_KEY=sk_test_xxxxx
```

Live mode (Production):
```
VITE_HYPARROW_PUBLIC_KEY=pk_live_xxxxx
VITE_HYPARROW_SECRET_KEY=sk_live_xxxxx
```

1. Update keys in `.env`
2. Restart development server
3. Keys are now automatically used

## Backend Verification (Optional)

Verify payments on backend using Hyparrow API:

```javascript
// Backend: Verify payment
app.post('/api/payments/verify/hyparrow', async (req, res) => {
  const { reference } = req.body
  const secretKey = process.env.HYPARROW_SECRET_KEY
  
  try {
    const response = await fetch(`https://api.hyparrow.com/v1/transactions/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (data.status === 'success') {
      // Payment verified, save booking
      await saveBooking(data)
      res.json({ verified: true, data })
    } else {
      res.status(400).json({ verified: false })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## Multi-Currency Support

Hyparrow supports multiple currencies:
- NGN (Nigerian Naira) - Primary
- USD (US Dollar)
- GBP (British Pound)
- EUR (Euro)
- Others available on dashboard

Set currency during initialization:
```javascript
hyparrowService.initialize({
  currency: 'USD',  // or 'GBP', 'EUR', etc
  // ... other config
})
```

## Analytics

Track which payment method customers prefer:
```javascript
// Store in database
bookings.payment_provider = 'hyparrow' || 'paystack'

// Query for analytics
SELECT payment_provider, COUNT(*) as count 
FROM bookings 
GROUP BY payment_provider
```

## Troubleshooting

### Keys not working

- Verify key format:
  - Public key: starts with `pk_test_` or `pk_live_`
  - Secret key: starts with `sk_test_` or `sk_live_`
- Ensure keys are for correct environment (test vs live)
- Check Hyparrow dashboard for revoked/disabled keys

### Payment not initializing

- Ensure `.env` has correct keys set
- Restart dev server after changing `.env`
- Check browser console for errors
- Verify `hyparrowService` is imported correctly

### Payment successful but booking not saved

- Check Neon database connection
- Verify booking table exists
- Check for database errors in browser console
- See backend verification section

### Amount calculation incorrect

- Ensure amount is in **kobo** (multiply NGN by 100)
- Use `formatAmount()` helper for conversion
- Check `totalPrice` calculation in Ticketing component

## Support

- Hyparrow Docs: https://docs.hyparrow.com
- Hyparrow Dashboard: https://dashboard.hyparrow.com
- API Reference: https://docs.hyparrow.com/api-reference
- Support: support@hyparrow.com

---

**Dual payment integration with Paystack and Hyparrow is now live!** 🎉

Customers can securely purchase tickets using their preferred payment method from either provider.

## Changelog

- **v1.0.0** - Initial Hyparrow integration
  - Added `hyparrow.js` service with full REST API integration
  - Dual payment options in Ticketing page
  - Environment configuration for test/live modes
  - Amount formatting with kobo conversion
  - Complete API reference documentation

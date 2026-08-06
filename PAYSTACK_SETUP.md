# Paystack Payment Integration

## Overview

The app now integrates Paystack for secure payment processing. Customers can purchase tickets directly through the ticketing page.

## Setup Required

### 1. Get Your Paystack Keys

1. Go to https://dashboard.paystack.com
2. Sign up or log in to your account
3. Navigate to **Settings → API Keys & Webhooks**
4. Copy your **Public Key** (starts with `pk_`)

### 2. Configure Environment Variables

Add to `.env`:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

Replace `pk_test_your_public_key_here` with your actual public key.

### 3. Restart Development Server

```bash
npm run dev
```

## How It Works

### Payment Flow

1. **Customer visits ticketing page** → `/event/{id}/tickets`
2. **Selects ticket tier and quantity**
3. **Fills in guest information** (name, email)
4. **Clicks "Pay" button**
5. **Paystack modal opens** with secure payment form
6. **Customer enters card details** (test card: 4111111111111111)
7. **Payment processed** by Paystack
8. **Booking saved** to database
9. **Confirmation email sent** to customer

### File Structure

```
src/services/
├── paystack.js        # Paystack service with initialization
└── neonDb.js          # Database service

src/pages/
└── Ticketing.jsx      # Ticketing page with payment integration
```

## Integration Details

### Paystack Service (`src/services/paystack.js`)

```javascript
// Initialize Paystack payment
paystackService.initialize({
  email: 'customer@example.com',
  amount: 50000,  // Amount in kobo (₦500 = 50000 kobo)
  reference: 'unique-reference-123',
  onSuccess: (response) => { /* Handle success */ },
  onClose: () => { /* Handle cancel */ }
})

// Generate unique reference
const reference = paystackService.generateReference()

// Format amount to kobo
const amountInKobo = paystackService.formatAmount(50000) // ₦500 = 50000 kobo
```

### Ticketing Page Integration

1. Customer selects ticket tier
2. Fills in guest information
3. Clicks "Pay" button
4. Payment is processed via Paystack
5. On success, booking is saved

## Testing

### Test Card Details

**Paystack provides test cards:**

| Card Number | Expiry | CVC |
|---|---|---|
| 4111 1111 1111 1111 | 01/25 | 123 |
| 5399 8343 1234 5678 | 12/26 | 789 |

### Test Amounts

- Any amount works in test mode
- Successful transaction: Just enter card details and click "Pay"
- Failed transaction: Use amount `400` to trigger decline

## Features

✅ **Secure payment processing** via Paystack  
✅ **Multiple ticket tiers** supported  
✅ **Quantity selection** for group bookings  
✅ **Guest information capture**  
✅ **Payment confirmation**  
✅ **Booking saved to database**  
✅ **Error handling** for failed payments  
✅ **Loading states** during payment  

## Security

- ✅ Public key only (no secret key exposed)
- ✅ SSL/TLS encrypted communication with Paystack
- ✅ Payment processing handled by Paystack (PCI compliant)
- ✅ Reference token for transaction tracking
- ✅ Customer email validation

## Error Handling

If payment fails:
1. User sees error message
2. Can retry payment
3. No booking is saved until payment succeeds
4. All errors logged to browser console

## Database Schema for Bookings

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
  payment_reference VARCHAR(255),
  payment_status VARCHAR(50),
  status VARCHAR(50) DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps

### Backend Verification (Optional)

To verify payments on the backend:

```javascript
// server.js
app.post('/api/payments/verify', async (req, res) => {
  const { reference } = req.body
  
  // Verify with Paystack API using your secret key
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    }
  )
  
  const data = await response.json()
  res.json(data)
})
```

### Webhook Handling (Optional)

Set up webhooks in Paystack dashboard for:
- Payment completed
- Payment failed
- Payment abandoned

## Troubleshooting

### Public key not loading

- Verify `VITE_PAYSTACK_PUBLIC_KEY` is set in `.env`
- Restart dev server after updating `.env`
- Check browser console for errors

### Payment modal not opening

- Ensure Paystack script loaded (check network tab)
- Verify public key is valid
- Check browser console for JavaScript errors

### Payment successful but booking not saved

- Check database connection
- Verify Neon is running
- Look for errors in browser console

## Support

- Paystack Docs: https://paystack.com/docs/api/
- Test Environment: https://paystack.com/support
- Contact: support@paystack.com

---

**Payment integration is now live!** 🎉

Customers can securely purchase tickets using Paystack.

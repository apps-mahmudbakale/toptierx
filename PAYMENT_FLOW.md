# Payment Flow Documentation (Serverless)

## Overview
This is a completely serverless payment system with no backend server needed. It uses:
- **Frontend:** React + Vite
- **Database:** Neon PostgreSQL (serverless)
- **Payment:** Hyparrow payment links
- **No backend server required**

## Architecture

### Frontend (Ticketing Page)
- User selects ticket tier and quantity
- Fills in guest information (required)
- Clicks "Pay Now" button
- Booking data stored in `sessionStorage`
- Redirected to Hyparrow checkout with return URL

### Database (Neon Serverless)
- Direct connection from frontend to Neon
- `bookings` table stores confirmed bookings
- No backend needed

### Payment Provider
- Hyparrow payment links handle payment processing
- Redirect user back to app after payment

## Payment Flow Steps

### 1. User Fills Booking Form
```
User enters: First Name, Last Name, Email
Selects: Ticket tier and quantity
```

### 2. Payment Initiation
```
User clicks "Pay Now"
  ↓
Booking data stored in sessionStorage: {
  eventId, eventTitle, customerName, customerEmail,
  ticketCount, ticketPrice, totalAmount
}
  ↓
Redirects to Hyparrow checkout:
https://checkout.hyparrow.cloud/pay/{identifier}?return_url={app_url}
```

### 3. Payment on Hyparrow
```
User completes payment on Hyparrow
  ↓
Hyparrow redirects back to app with success status:
{app_url}/event/{id}/tickets?status=success&reference={ref}
```

### 4. Booking Confirmation
```
Frontend detects `status=success` parameter
  ↓
Retrieves booking data from sessionStorage
  ↓
Saves booking directly to Neon database via neonService
  ↓
Shows payment success screen
  ↓
Booking is confirmed in database
```

## Setup Instructions

### 1. Create Payment Link (Hyparrow)
1. Go to [Hyparrow Dashboard](https://dashboard.hyparrow.com)
2. Create → Payment Link
3. Set amount, description, etc.
4. Copy the **identifier** (UUID format)

### 2. Add Payment Link to Event
1. Go to Dashboard in app
2. Create or edit event
3. Paste payment link identifier in "Payment Link Identifier" field
4. Save event

### 3. Run Frontend Only
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

That's it! No backend server needed.

## Database Schema

### Bookings Table
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
  status VARCHAR(50),           -- 'confirmed', 'pending'
  booking_date TIMESTAMP,
  created_at TIMESTAMP
);
```

## Testing Payment Flow

### 1. Create Event with Payment Link
- Go to Dashboard
- Create event
- Add valid Hyparrow payment link identifier
- Save

### 2. Go to Ticketing Page
- Click on event
- Go to "Get Tickets" button

### 3. Fill Booking Form
- First Name: John
- Last Name: Doe
- Email: john@example.com
- Select ticket tier
- Click "Pay Now"

### 4. Complete Payment
- You'll be redirected to Hyparrow checkout
- Complete payment (use test card if in test mode)
- After payment, you'll be redirected back

### 5. Success Screen
- See payment success confirmation
- Booking is saved to Neon database
- User can view booking summary

## URL Parameters

### Return URL Format
After payment, Hyparrow redirects to:
```
{app_url}/event/{id}/tickets?status=success&reference={payment_ref}
```

Parameters:
- `status`: `success` or `failed`
- `reference`: Payment reference ID from Hyparrow

## Frontend Services

### neonService.createBooking(bookingData)
Saves booking to Neon database directly from frontend.

```javascript
const booking = await neonService.createBooking({
  eventId: 1,
  eventTitle: 'Event Name',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  ticketCount: 2,
  ticketPrice: 175000,
  totalAmount: 350000,
  status: 'confirmed'
})
```

## Security Notes

⚠️ **Frontend Database Access:**
- This app connects to Neon directly from frontend
- Use Neon's connection pooling
- Consider connection limits for production

⚠️ **Payment Amounts:**
- Always verify on backend in production
- Currently relies on client-side amounts (not ideal)
- For production, add backend validation

⚠️ **Email Validation:**
- Implement email verification for bookings
- Consider Resend or SendGrid for confirmation emails

## Advantages

✅ **No backend server needed** - Save on infrastructure
✅ **Serverless Neon** - Scales automatically
✅ **Simple payment flow** - Direct to Hyparrow checkout
✅ **Fast deployment** - Just frontend
✅ **Low cost** - No server costs

## Limitations

⚠️ **No webhook support** - Can't verify payment server-side
⚠️ **No payment retry** - User must redo form if payment fails
⚠️ **Frontend validation only** - Not ideal for large amounts
⚠️ **Session storage** - Booking data lost if browser closed

## Production Recommendations

For production use, consider:

1. **Add backend server** - For payment verification and webhooks
2. **Implement signature verification** - Verify payment with Hyparrow API
3. **Add email service** - Send confirmation emails via Resend/SendGrid
4. **Set up monitoring** - Track bookings and payment failures
5. **Implement retry logic** - Allow users to retry failed payments
6. **Add admin dashboard** - Manage bookings and refunds

## Debugging

### Check Browser Console
```javascript
// View pending booking data
console.log(sessionStorage.getItem('_pendingBooking'))

// Check payment success detection
console.log('URL params:', new URLSearchParams(window.location.search))
```

### Check Database
```sql
-- View all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- View bookings for specific event
SELECT * FROM bookings WHERE event_id = 1;

-- View bookings for specific email
SELECT * FROM bookings WHERE customer_email = 'john@example.com';
```

## Next Steps

1. ✅ Payment initiation (implemented)
2. ✅ Payment success detection (implemented)  
3. ✅ Booking save to Neon (implemented)
4. ✅ Success screen (implemented)
5. ⏳ Email confirmation service (optional)
6. ⏳ Admin booking management (optional)
7. ⏳ Add backend for production use (optional)

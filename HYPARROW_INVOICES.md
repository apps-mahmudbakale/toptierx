# Hyparrow Invoice Integration

## Overview

When a customer completes ticket payment, the system automatically creates an invoice in Hyparrow. This provides:
- Professional invoice records
- Payment tracking
- Customer receipts via Hyparrow
- Invoice links for payment confirmation

## Invoice Creation Flow

```
Customer Books Ticket
  ↓
Fills Form (name, email, quantity)
  ↓
Clicks "Pay Now"
  ↓
Invoice Created in Hyparrow ✅ (BEFORE payment)
  ↓
Redirected to Hyparrow Checkout
  ↓
Payment Successful
  ↓
Booking Saved to Neon ✅
  ↓
Success Page Shown
```

## Features

✅ **Automatic Creation** - Invoice created after payment confirmation
✅ **Customer Details** - Name, email from booking form
✅ **Event Details** - Event title, ticket count, price
✅ **Line Items** - Ticket description with quantity and unit price
✅ **Auto Due Date** - 7 days from invoice creation
✅ **Tax Support** - Optional tax rate (default 0%)
✅ **Webhook URL** - Payment callback to your webhook handler
✅ **Metadata** - Booking ID for tracking

## Service API

### `hyparrowInvoiceService.createInvoice(bookingData)`

Creates an invoice for a booking. Called automatically after payment.

**Parameters:**
```javascript
{
  booking_id: 123,                    // Database booking ID
  event_title: "Luxury Gala",         // Event name
  customer_name: "Ada Obi",           // Full name
  customer_email: "ada@example.com",  // Email
  ticket_count: 2,                    // Number of tickets
  ticket_price: 150000,               // Price per ticket
  total_amount: 300000                // Total (qty × price)
}
```

**Returns:**
```javascript
{
  success: true,
  invoice: { ... },                   // Full invoice object
  invoiceId: "inv_123",               // Invoice ID
  invoiceUrl: "https://..."           // Checkout/payment URL
}
```

### `hyparrowInvoiceService.getInvoice(invoiceId)`

Fetches invoice details from Hyparrow.

### `hyparrowInvoiceService.cancelInvoice(invoiceId)`

Cancels an invoice (for refunded bookings).

## Netlify Function

**File:** `netlify/functions/hyparrow-invoice.js`

Handles all invoice operations via Hyparrow API:
- `action: 'create'` - Create invoice
- `action: 'get'` - Get invoice details  
- `action: 'cancel'` - Cancel invoice

## Invoice Fields

Each invoice includes:

| Field | Value | Example |
|-------|-------|---------|
| title | Event name + "Ticket Invoice" | "Luxury Gala - Ticket Invoice" |
| currency | NGN | NGN |
| customerName | Guest name | "Ada Obi" |
| customerEmail | Guest email | "ada@example.com" |
| dueDate | 7 days from creation | "2026-07-22" |
| tax_direction | "customer" (tax on customer) | "customer" |
| taxType | "percentage" | "percentage" |
| taxRate | 0 (no tax) | 0 |
| checkoutCallbackUrl | Webhook URL | "https://toptierxperienz.com/.netlify/functions/hyparrow-webhook" |
| lineItems | Array of items | [{ description, quantity, unitPrice }] |
| metadata | Booking ID | { bookingId: 123 } |

## Example Invoice Created

```json
{
  "title": "Luxury Gala - Ticket Invoice",
  "currency": "NGN",
  "customerName": "Ada Obi",
  "customerEmail": "ada@example.com",
  "dueDate": "2026-07-22",
  "tax_direction": "customer",
  "taxType": "percentage",
  "taxRate": 0,
  "checkoutCallbackUrl": "https://toptierxperienz.com/.netlify/functions/hyparrow-webhook",
  "lineItems": [
    {
      "description": "Luxury Gala - 2 ticket(s)",
      "quantity": 2,
      "unitPrice": 15000000  // in cents: 150000 * 100
    }
  ],
  "metadata": {
    "bookingId": 123
  }
}
```

## Files Involved

### Frontend
- **`src/services/hyparrowInvoice.js`** - Invoice service
  - `createInvoice()` - Create invoice
  - `getInvoice()` - Fetch invoice details
  - `cancelInvoice()` - Cancel invoice

- **`src/pages/Ticketing.jsx`** - Updated to create invoice after payment
  - Calls `hyparrowInvoiceService.createInvoice()` after booking saved

### Backend
- **`netlify/functions/hyparrow-invoice.js`** - Serverless handler
  - POST create action
  - GET retrieve action
  - DELETE cancel action

### API Endpoints
- `POST https://api.hyparrow.cloud/api/v1/invoices/` - Create invoice
- `GET https://api.hyparrow.cloud/api/v1/invoices/{id}` - Get invoice
- `DELETE https://api.hyparrow.cloud/api/v1/invoices/{id}` - Cancel invoice

## Workflow Integration

### Ticket Booking Flow:
1. Customer fills form (name, email, ticket tier, quantity)
2. **Invoice created in Hyparrow** ← NEW (BEFORE payment)
3. Gets checkout/invoice URL from Hyparrow
4. Redirected to payment via Hyparrow checkout
5. Customer completes payment
6. Redirected back with `?status=success`
7. Booking saved to Neon database
8. Success page displayed

### Error Handling:
- If invoice creation fails, user sees error message
- User can retry by clicking "Pay Now" again
- Booking not saved until after payment success

## Price Conversion

Prices are converted to cents for Hyparrow API:
```javascript
unitPrice: Math.round(parseFloat(bookingData.ticket_price) * 100)
// Example: 150000 → 15000000 (cents)
```

## Due Date

Automatically set to 7 days from invoice creation:
```javascript
dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]
// Result: "2026-07-22"
```

## Tax Configuration

Currently set to 0% (no tax). To add tax:

Edit `netlify/functions/hyparrow-invoice.js`:
```javascript
taxRate: 7.5,  // 7.5% tax
```

Tax is applied to line items and added to total.

## Testing

1. **Create a test event** in dashboard
2. **Go to ticketing page** `/event/{id}/tickets`
3. **Select tier** and **fill guest info**
4. **Click "Pay Now"**
5. **Complete payment** in Hyparrow checkout
6. **Booking saved** ✅ Neon
7. **Invoice created** ✅ Hyparrow
8. **Success page** shown

Check Hyparrow dashboard to see created invoices.

## Future Enhancements

- [ ] Email invoice to customer automatically
- [ ] Add invoice number tracking
- [ ] Support for refund invoices
- [ ] Multiple line items per booking
- [ ] Custom tax rates per event
- [ ] Invoice PDF generation
- [ ] Partial payment invoices

## Troubleshooting

### Invoice Not Created
- Check Netlify function logs
- Verify Hyparrow API keys in environment
- Check customer email is valid

### Duplicate Slug Error
- Hyparrow has duplicate invoice title
- Solution: Add timestamp or unique ID to title

### Payment Callback Issues
- Verify webhook URL in Hyparrow dashboard
- Check Netlify function `hyparrow-webhook.js` exists
- Test webhook signature verification

## Environment Variables Required

```env
VITE_HYPARROW_PUBLIC_KEY=pk_live_xxxxx
VITE_HYPARROW_SECRET_KEY=sk_live_xxxxx
```

These are passed to Netlify functions via environment secrets.

## References

- [Hyparrow Invoice API](https://docs.hyparrow.com/api/invoices)
- [Hyparrow Checkout](https://docs.hyparrow.com/checkout)
- [Hyparrow Webhooks](https://docs.hyparrow.com/webhooks)

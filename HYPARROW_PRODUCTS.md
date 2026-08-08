# Hyparrow Product Integration

## Overview

When you create an event in the dashboard, it now automatically:
1. Creates a product in Hyparrow with event details
2. Stores the Hyparrow product ID in Neon database
3. Links events to Hyparrow for inventory management

## Setup Steps

### 1. Run Migration

Add the `hyparrow_product_id` column to the events table:

```bash
node run-add-product-id.js
```

This creates the column in Neon to store Hyparrow product IDs.

### 2. Configure Environment Variables

Ensure you have Hyparrow API keys in `.env`:

```
VITE_HYPARROW_PUBLIC_KEY=pk_live_xxxxx
VITE_HYPARROW_SECRET_KEY=sk_live_xxxxx
```

### 3. Create an Event

1. Go to Dashboard
2. Click "Add Event"
3. Fill in event details:
   - Title
   - Category
   - Date & Time
   - Venue
   - Capacity (becomes product stock)
   - Ticket Price
   - Description
   - Ticket Categories (become product variants)
4. Click "Save Event"

The system will:
- ✅ Create product in Hyparrow
- ✅ Store Hyparrow product ID
- ✅ Create event in Neon
- ✅ Link them together

## How It Works

### Event Creation Flow

```
1. User creates event in Dashboard
   ↓
2. EventContext.addEvent() is called
   ↓
3. hyparrowProductService.createProduct() creates Hyparrow product
   ↓
4. Hyparrow returns product ID
   ↓
5. neonService.createEvent() saves event with product ID
   ↓
6. Event appears on frontend with Hyparrow product linked
```

### Product Creation in Hyparrow

The product is created with:
- **Name:** Event title
- **Description:** Event description
- **Type:** digital (Hyparrow digital product)
- **Price:** Ticket price
- **Currency:** NGN
- **Stock:** Event capacity
- **SKU:** EVENT-{eventId}
- **Category:** Event category
- **FileURL:** Event image
- **Variants:** Ticket categories (if any)

### Example Product Created

```json
{
  "name": "Luxury Gala",
  "description": "An evening of timeless elegance",
  "type": "digital",
  "price": "150000.00",
  "currency": "NGN",
  "stock": 100,
  "sku": "EVENT-1",
  "category": "Events",
  "fileUrl": "https://toptierxperienz.com/event-image.jpg",
  "isActive": true,
  "variants": [
    { "name": "VIP", "price": "250000.00", "stockQty": 30 },
    { "name": "General", "price": "150000.00", "stockQty": 70 }
  ]
}
```

## Files Involved

- **`src/services/hyparrowProduct.js`** - Product creation service
  - `createProduct()` - Create product in Hyparrow
  - `getProduct()` - Fetch product details
  - `updateProduct()` - Update product
  - `deleteProduct()` - Delete product

- **`src/context/EventContext.jsx`** - Updated to create products
  - `addEvent()` - Now calls Hyparrow first
  - `deleteEvent()` - Deletes from both Hyparrow and Neon

- **`src/services/neonDb.js`** - Updated schema
  - `hyparrow_product_id` column added to events table
  - `createEvent()` - Saves product ID
  - `updateEvent()` - Updates product ID

- **`db/add-hyparrow-product-id.sql`** - Migration file
- **`run-add-product-id.js`** - Migration runner

## Database Changes

### Events Table
```sql
ALTER TABLE events 
ADD COLUMN hyparrow_product_id VARCHAR(255);

CREATE INDEX events_hyparrow_product_id_idx 
ON events(hyparrow_product_id);
```

## API Endpoints Used

### Create Product
```
POST https://api.hyparrow.cloud/api/v1/products/
Headers:
  - X-API-Key: {VITE_HYPARROW_PUBLIC_KEY}
  - X-API-Secret: {VITE_HYPARROW_SECRET_KEY}
  - Content-Type: application/json
```

### Get Product
```
GET https://api.hyparrow.cloud/api/v1/products/{productId}
```

### Update Product
```
PUT https://api.hyparrow.cloud/api/v1/products/{productId}
```

### Delete Product
```
DELETE https://api.hyparrow.cloud/api/v1/products/{productId}
```

## Troubleshooting

### Products Not Created
- Check Hyparrow API keys in .env
- Check browser console for errors
- Verify Hyparrow API is accessible

### Missing hyparrow_product_id Column
- Run migration: `node run-add-product-id.js`
- Verify Neon connection string

### Event Creation Fails
- Check product creation errors in logs
- Verify event data is complete
- Check Neon connection

## Logging

The system logs all Hyparrow operations:

```javascript
// Creation
🛍️ Creating Hyparrow product: {...}
✅ Hyparrow product created: {...}

// Deletion  
🗑️ Deleting Hyparrow product...
✅ Event and Hyparrow product deleted successfully
```

## Features

✅ **Automatic Product Creation** - When creating events
✅ **Inventory Sync** - Stock based on capacity
✅ **Variants** - Ticket categories as product variants
✅ **Auto-linking** - Events linked to Hyparrow products
✅ **Cleanup** - Products deleted when events deleted
✅ **Error Handling** - Graceful degradation if creation fails

## Future Enhancements

- [ ] Update products when events change
- [ ] Sync inventory from Hyparrow
- [ ] Create payment links from products
- [ ] Generate invoices from orders
- [ ] Dashboard stats from Hyparrow
- [ ] Bulk product creation

## Notes

⚠️ **Product creation is optional** - If it fails, events still get created
⚠️ **API Keys required** - Configure Hyparrow keys in .env
⚠️ **Currency fixed to NGN** - Currently hardcoded, can be made configurable
✅ **Automatic cleanup** - Products deleted with events

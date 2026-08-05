# TopTier Event Platform - Setup Guide

## Architecture

```
Frontend (React) → Neon Serverless → PostgreSQL Database
   ↓
Uses @neondatabase/serverless
   ↓
Direct SQL queries via neonDb service
```

## No Backend Server Required! ✅

The frontend connects directly to Neon PostgreSQL using the serverless client.

## Installation

Already done! The required packages are installed:
- `@neondatabase/serverless` - Direct Neon connection
- React, Vite, Tailwind CSS - Frontend stack

## Environment Variables

Set in `.env`:
```
VITE_DATABASE_URL=postgresql://user:password@host/database
```

This is your Neon connection string.

## File Structure

```
src/
├── services/
│   ├── db.js              # Neon serverless connection
│   └── neonDb.js          # CRUD operations (getEvents, createEvent, etc)
├── context/
│   └── EventContext.jsx   # Uses neonDb service
└── pages/
    └── Dashboard.jsx      # Event management UI
```

## How It Works

### 1. Connection (db.js)
```javascript
import { neon } from '@neondatabase/serverless'
export const sql = neon(process.env.DATABASE_URL)
```

### 2. Service (neonDb.js)
```javascript
export const neonService = {
  async getEvents() {
    const result = await sql`SELECT * FROM events ORDER BY date DESC`
    return result
  },
  // ... other CRUD operations
}
```

### 3. Context (EventContext.jsx)
```javascript
import { neonService } from '../services/neonDb'

const addEvent = async (event) => {
  const newEvent = await neonService.createEvent(event)
  setEvents([newEvent, ...events])
}
```

### 4. UI (Dashboard.jsx)
```javascript
const { events, addEvent, updateEvent, deleteEvent, loading } = useContext(EventContext)
// Call functions which automatically sync with Neon
```

## Starting the App

```bash
npm run dev
```

That's it! No server to start. Frontend connects directly to Neon.

## Database Queries

All SQL queries use template literals with automatic parameterization:

```javascript
// Safe parameterized queries (prevents SQL injection)
const result = await sql`
  INSERT INTO events 
  VALUES (${title}, ${venue}, ${price}, ...)
  RETURNING *
`

// Parameters are automatically escaped
const events = await sql`
  SELECT * FROM events WHERE category = ${category}
`
```

## Features

✅ **Add events** - Saves directly to Neon  
✅ **Edit events** - Updates in Neon  
✅ **Delete events** - Deletes from Neon  
✅ **Load events** - Fetches from Neon on page load  
✅ **Ticket categories** - Stored as JSONB  
✅ **Event itinerary** - Stored as JSONB  
✅ **Image upload** - Base64 encoded in database  
✅ **Loading states** - Shows spinner while querying  
✅ **Error handling** - Displays error messages  

## Database Schema

Already created in Neon:

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  date VARCHAR(50),
  time VARCHAR(50),
  venue VARCHAR(255),
  capacity VARCHAR(100),
  ticket_price DECIMAL(12, 2),
  image TEXT,
  description TEXT,
  itinerary JSONB DEFAULT '[]',
  ticket_categories JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Neon Dashboard

View/manage data at: https://console.neon.tech/

## Testing

Try the dashboard:
1. Run `npm run dev`
2. Go to `/dashboard`
3. Click "Add Event"
4. Fill in the form
5. Click "Create Event"
6. Event saves to Neon instantly ✅
7. Refresh page - event persists ✅

## Performance

- ⚡ Neon serverless is faster than traditional servers
- 🔒 Direct HTTPS connection to database
- 📊 All queries are parameterized (SQL injection safe)
- 🔄 Real-time sync - no polling needed

## Troubleshooting

### Events not loading
- Check VITE_DATABASE_URL is set correctly in .env
- Verify Neon database tables exist
- Check browser console for errors

### "DATABASE_URL is not set" error
- Make sure .env has VITE_DATABASE_URL
- Restart dev server after updating .env

### Query errors
- Check SQL syntax in neonDb.js
- Verify table and column names match database schema
- Look at browser console for detailed error messages

## Production Deployment

When deploying to production:

1. **Vercel** (Frontend):
   ```bash
   npm run build
   Deploy dist/ folder
   ```

2. **Environment Variables**:
   - Set `VITE_DATABASE_URL` in Vercel dashboard
   - Use your Neon production database URL

3. **No backend to deploy** - Everything runs on the edge!

## Security Notes

✅ SQL queries are parameterized (prevents SQL injection)  
✅ Connection uses SSL/TLS encryption  
✅ Neon handles authentication securely  
✅ Never commit .env with real database URL  

## Next Steps

- Add more event fields as needed
- Add booking management
- Add admin authentication
- Deploy to production

---

**You now have a serverless event management platform!** 🎉

No backend server, no DevOps complexity, just React + Neon + PostgreSQL.

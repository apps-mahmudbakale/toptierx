# Database Setup Guide - No Backend Server Required

## Overview

The application works **without a backend server**. Data is stored in the browser's localStorage and can be optionally synced to Neon PostgreSQL.

## Current Setup: localStorage (No Server Needed)

### How It Works

1. **Primary Storage**: Browser localStorage
2. **Persistent**: Events persist across page refreshes and browser sessions
3. **Fast**: No network latency
4. **No Setup Required**: Works immediately after `npm run dev`

### What's Stored

- Event title, venue, date, time
- Ticket categories with prices
- Event itinerary
- Images (as base64 encoded data)
- Bookings

### Limitations

- Data is **local to this browser only**
- Different browser/device = different data
- 5-10MB limit depending on browser
- No real-time sync between devices

## Optional: Sync with Neon PostgreSQL

To sync events to Neon database, you **need to run the backend server**:

```bash
npm run server
```

### Backend Server Setup

1. **Start backend**: `npm run server`
2. **Starts on**: `http://localhost:3000`
3. **Connects to**: Neon PostgreSQL via NEON_CONNECTION_STRING
4. **Syncs**: Events saved to database

### Why Backend is Optional

- Frontend works perfectly without it
- localStorage is the primary storage
- Backend acts as optional persistent layer
- Can be added later when needed for multi-device sync

## Neon Database Schema

If using backend server, these tables exist:

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

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  ticket_count INTEGER,
  ticket_price DECIMAL(12, 2),
  total_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## How to Migrate Data to Neon (Optional)

If you want to sync localStorage events to database:

1. **Start backend server**: `npm run server`
2. **Events will be fetched from Neon** on page load
3. **New events save to Neon**
4. **Delete events from Neon**

## Environment Variables

### Required (if using backend):
```
NEON_CONNECTION_STRING=postgresql://user:password@host/database
VITE_NEON_CONNECTION_STRING=postgresql://user:password@host/database
```

### Optional (not needed for localStorage):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Development Workflow

### Without Backend (Recommended for Development)
```bash
npm run dev
# Works immediately, no database setup
# Data persists in browser
```

### With Backend (For Production)
```bash
npm run dev      # Frontend on port 5173
npm run server   # Backend on port 3000
# Data syncs to Neon database
```

### Both Together
```bash
npm run dev:all  # Runs both dev and server
```

## Troubleshooting

### Events Not Saving
- Check browser console for errors
- Verify localStorage isn't full (DevTools → Application → Local Storage)
- Try clearing site data and refresh

### Backend Connection Issues
- Verify `npm run server` is running on port 3000
- Check `.env` file has valid Neon connection string
- Ensure Neon database tables exist (run migrations)

### Clear All Data
```javascript
// In browser console:
localStorage.removeItem('toptier_events')
```

## Storage Locations

### LocalStorage (Browser)
- **Path**: `localStorage['toptier_events']`
- **View**: DevTools → Application → Local Storage → https://localhost:5173
- **Size**: Typically 50KB-500KB per 100 events

### Neon Database (Optional)
- **Host**: ep-fragrant-pine-aylbq6iu.us-east-2.aws.neon.tech
- **Database**: neondb
- **Tables**: events, bookings, users

## Next Steps

1. **Currently**: Using localStorage - events persist in browser
2. **Later**: Add backend server to sync to Neon for multi-device access
3. **Production**: Deploy frontend to Vercel, backend to Heroku/Railway

---

**TL;DR**: The app works perfectly without a backend server. Data lives in your browser. Add backend later if you need cloud sync.

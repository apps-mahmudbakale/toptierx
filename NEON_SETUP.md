# Neon Database Setup Guide

Your TopTier application is now configured to use **Neon DB** (PostgreSQL) as the backend database.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs both frontend and backend dependencies:
- Frontend: React, Vite, Tailwind CSS
- Backend: Express, PostgreSQL (pg), CORS

### 2. Create Database Schema

1. Go to your Neon console: https://console.neon.tech
2. Navigate to your database SQL Editor
3. Copy and paste the contents of `db/migrations.sql`
4. Execute the SQL to create tables

**Or use psql command line:**

```bash
psql postgresql://neondb_owner:nmkC6xYVRjOJEp9AiXg39w@ep-fragrant-pine-aylbq6iu-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require -f db/migrations.sql
```

### 3. Start the Application

**Option A: Run frontend only** (for testing UI)
```bash
npm run dev
# Runs on http://localhost:5173
```

**Option B: Run both frontend + backend**
```bash
npm run dev:all
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

**Option C: Run backend separately**
```bash
npm run server
# Runs on http://localhost:3000
```

### 4. Environment Configuration

The `.env` file is already configured with:
- `VITE_BACKEND_TYPE=neon` - Uses Neon DB
- `VITE_NEON_CONNECTION_STRING` - Your connection string
- `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD` - Admin credentials

## Database Schema

### events table
```sql
- id (PRIMARY KEY)
- title (VARCHAR)
- category (VARCHAR)
- date (VARCHAR)
- time (VARCHAR)
- venue (VARCHAR)
- capacity (VARCHAR)
- ticket_price (DECIMAL)
- image (TEXT/base64)
- description (TEXT)
- itinerary (JSONB - array of {time, desc})
- ticket_categories (JSONB - array of {name, price})
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### bookings table
```sql
- id (PRIMARY KEY)
- event_id (FOREIGN KEY → events)
- event_title (VARCHAR)
- customer_name (VARCHAR)
- customer_email (VARCHAR)
- ticket_count (INTEGER)
- ticket_price (DECIMAL)
- total_amount (DECIMAL)
- status (VARCHAR - confirmed/pending)
- notes (TEXT)
- booking_date (TIMESTAMP)
- created_at (TIMESTAMP)
```

### users table
```sql
- id (PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- role (VARCHAR)
- created_at (TIMESTAMP)
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/event/:eventId` - Get bookings for event
- `POST /api/bookings` - Create booking

### Auth
- `POST /api/auth/login` - Admin login

## Connection Details

**Database:** Neon (PostgreSQL)  
**Host:** ep-fragrant-pine-aylbq6iu-pooler.c-5.us-east-2.aws.neon.tech  
**Database:** neondb  
**Region:** us-east-2 (AWS)  
**SSL:** Required  

## Frontend to Backend Communication

The frontend is currently set to use **local storage** for demo purposes. To switch to real Neon integration:

1. Update `src/services/backendService.js` to call your backend
2. Update `src/context/EventContext.jsx` to use API calls instead of local state
3. Update `src/context/BookingContext.jsx` similarly

### Example API Integration (EventContext):

```javascript
const loadEvents = async () => {
  const response = await fetch('http://localhost:3000/api/events')
  const data = await response.json()
  setEvents(data)
}

const addEvent = async (event) => {
  const response = await fetch('http://localhost:3000/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  })
  const newEvent = await response.json()
  setEvents([...events, newEvent])
}
```

## Troubleshooting

### Connection Failed
- Check connection string in `.env`
- Verify Neon credentials
- Ensure SSL is enabled
- Check firewall/network restrictions

### Table Creation Failed
- Verify you're in correct database in Neon console
- Check SQL syntax in migrations.sql
- Run migrations manually through Neon console

### Backend Not Connecting
- Verify Node.js is installed
- Check PORT 3000 is available
- Run `npm install` to ensure dependencies are installed
- Check `.env` file is in root directory

### CORS Errors
- Backend is configured to allow localhost:5173
- Update `CORS_ORIGIN` if running on different URL
- Check browser console for exact error

## Next Steps

1. ✅ **Database Created** - Schema set up in Neon
2. ⏳ **Frontend Integration** - Connect UI to backend APIs
3. ⏳ **Authentication** - Implement secure login with JWT
4. ⏳ **Payment Integration** - Connect Paystack/Hyperpay
5. ⏳ **Production Deployment** - Deploy to cloud

## Support

For issues with:
- **Neon Database**: https://neon.tech/docs
- **Express Backend**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/

Or check `BACKEND_SETUP.md` for more details.


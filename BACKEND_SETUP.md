# Backend Setup Guide

This guide helps you integrate your TopTier application with either **Neon DB** or **Xano** as your backend.

Currently, the app uses **local storage** with React Context for demo purposes. Follow the steps below to connect to a production backend.

---

## Table of Contents

1. [Neon DB Setup](#neon-db-setup)
2. [Xano Setup](#xano-setup)
3. [Environment Variables](#environment-variables)
4. [Authentication](#authentication)
5. [Data Persistence](#data-persistence)
6. [Image Upload](#image-upload)

---

## Neon DB Setup

### Prerequisites

- Neon account (https://neon.tech)
- Node.js backend (Express, Next.js, etc.)
- PostgreSQL client

### Steps

1. **Create a Neon Project**
   - Log in to Neon console
   - Create a new database
   - Note your connection string

2. **Create Database Schema**

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  date VARCHAR(50),
  time VARCHAR(50),
  venue VARCHAR(255),
  capacity VARCHAR(100),
  ticket_price DECIMAL(10, 2),
  image LONGTEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Set Up Backend API**

Create your backend API (Express example):

```javascript
// server.js
import express from 'express'
import { Pool } from 'pg'
import cors from 'cors'

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING
})

const app = express()
app.use(cors())
app.use(express.json())

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date DESC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add event
app.post('/api/events', async (req, res) => {
  const { title, category, date, time, venue, capacity, ticket_price, image, description } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO events (title, category, date, time, venue, capacity, ticket_price, image, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, category, date, time, venue, capacity, ticket_price, image, description]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update event
app.patch('/api/events/:id', async (req, res) => {
  const { id } = req.params
  const { title, category, date, time, venue, capacity, ticket_price, image, description } = req.body
  try {
    const result = await pool.query(
      'UPDATE events SET title=$1, category=$2, date=$3, time=$4, venue=$5, capacity=$6, ticket_price=$7, image=$8, description=$9 WHERE id=$10 RETURNING *',
      [title, category, date, time, venue, capacity, ticket_price, image, description, id]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM events WHERE id=$1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => console.log('Server running on port 3000'))
```

4. **Configure Environment Variables**

Create a `.env` file:

```env
VITE_BACKEND_TYPE=neon
VITE_NEON_CONNECTION_STRING=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/dbname
VITE_API_URL=http://localhost:3000
```

---

## Xano Setup

### Prerequisites

- Xano account (https://xano.com)
- API workspace configured
- Collection for events

### Steps

1. **Create Collections in Xano**

   - Create an `events` collection with fields:
     - title (text)
     - category (text)
     - date (text)
     - time (text)
     - venue (text)
     - capacity (text)
     - ticketPrice (number)
     - image (url/file)
     - description (longtext)

2. **Set Up API Endpoints**

   Xano auto-generates REST endpoints for your collections:
   - `GET /api/events` - List all events
   - `POST /api/events` - Create event
   - `PATCH /api/events/[id]` - Update event
   - `DELETE /api/events/[id]` - Delete event

3. **Configure Environment Variables**

```env
VITE_BACKEND_TYPE=xano
VITE_XANO_API_URL=https://xano.yourapp.com/api
VITE_XANO_AUTH_TOKEN=your_auth_token
```

4. **Test Your Endpoints**

Use Xano's test tool or curl:

```bash
curl -X GET https://xano.yourapp.com/api/events \
  -H "Authorization: Bearer your_auth_token"
```

---

## Environment Variables

Create a `.env` file in the project root. See `.env.example` for all available options.

```env
# Backend Type
VITE_BACKEND_TYPE=neon  # or 'xano' or 'local'

# Neon DB
VITE_NEON_CONNECTION_STRING=postgresql://...

# Xano
VITE_XANO_API_URL=https://xano.yourapp.com/api
VITE_XANO_AUTH_TOKEN=token

# Admin Credentials
VITE_ADMIN_EMAIL=admin@toptier.com
VITE_ADMIN_PASSWORD=admin123

# Image Upload
VITE_IMAGE_UPLOAD_TYPE=local  # or 'cloudinary'
```

---

## Authentication

Currently, the app uses hardcoded demo credentials. For production:

1. **Implement Backend Authentication**

```javascript
// Example: Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    )
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const user = result.rows[0]
    // Compare passwords (use bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    res.json({ user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

2. **Update AuthContext**

Modify `src/context/AuthContext.jsx` to call your backend login endpoint instead of hardcoded validation.

---

## Data Persistence

### Current (Demo) Implementation

- Events stored in React Context
- Data persists only during session
- Resets on page refresh

### With Backend

1. **Load events on app start**

```javascript
// In EventProvider useEffect
useEffect(() => {
  const loadEvents = async () => {
    const service = getBackendService()
    const data = await service.getEvents()
    setEvents(data)
  }
  loadEvents()
}, [])
```

2. **Sync operations**

```javascript
const addEvent = async (event) => {
  const service = getBackendService()
  const newEvent = await service.addEvent(event)
  setEvents([...events, newEvent])
  return newEvent
}
```

---

## Image Upload

### Local (Base64) - Current

- Images stored as base64 in database
- Suitable for small images
- Max 5MB per image

### Cloudinary - Recommended

1. **Sign up**: https://cloudinary.com
2. **Get credentials** from dashboard
3. **Update `handleImageUpload`** in `src/utils/imageUpload.js`:

```javascript
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  
  const data = await response.json()
  return data.secure_url
}
```

---

## Deployment

### Frontend

Deploy to Vercel, Netlify, or similar:

```bash
npm run build
# Upload dist folder to your hosting
```

### Backend (if using Neon)

Deploy to Railway, Render, Heroku, or your preferred platform:

```bash
# Example with Railway
railway up
```

### Environment Variables on Production

Set all environment variables in your hosting platform's configuration.

---

## Troubleshooting

### "Connection failed"

- Check your connection string
- Ensure backend is running
- Check CORS settings

### "Images not loading"

- Verify image URLs are accessible
- Check file upload size limits
- Ensure Cloudinary credentials are correct

### "Auth failed"

- Verify user exists in database
- Check password hashing
- Verify JWT token expiration

---

## Support

For issues with:
- **Neon**: https://neon.tech/docs
- **Xano**: https://xano.com/docs
- **This app**: Check GitHub issues or contact support


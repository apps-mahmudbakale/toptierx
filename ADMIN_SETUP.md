# Admin Dashboard Setup Guide

## Quick Start

Your TopTier admin dashboard is now fully functional with authentication, event management, image uploads, and ticket pricing.

---

## Login Credentials (Demo)

**Email**: `admin@toptier.com`  
**Password**: `admin123`

Access the dashboard at: `/dashboard`

---

## Features

### ✅ Authentication
- Login page with demo credentials
- Session persistence using localStorage
- Protected dashboard routes
- Logout functionality

### ✅ Event Management
- **Add Events**: Create new events with full details
- **Edit Events**: Modify existing event information
- **Delete Events**: Remove events with confirmation
- **Event Table**: View all events with quick actions

### ✅ Ticket Pricing
- Set ticket price per event
- Display pricing on event details page
- Calculate revenue potential in dashboard stats
- Price validation in forms

### ✅ Image Uploads
- **Local Upload**: Images stored as base64
- **Image Preview**: See uploaded images before saving
- **Validation**: File type and size checking (max 5MB)
- **Error Handling**: Clear error messages for upload issues

### ✅ Dashboard Navigation
- Separate navbar for dashboard (`DashboardNavbar`)
- Quick link back to main site
- User info display (email + role)
- One-click logout

### ✅ Statistics
- Total events count
- Average ticket price
- Total revenue potential (calculated from capacity × price)

---

## File Structure

```
src/
├── context/
│   ├── AuthContext.jsx          # Authentication state
│   └── EventContext.jsx         # Events state with pricing
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Dashboard.jsx           # Admin dashboard
│   ├── EventDetails.jsx        # Event details with pricing
│   └── Home.jsx, Ticketing.jsx # Public pages
├── components/layout/
│   ├── Navbar.jsx              # Main navbar
│   └── DashboardNavbar.jsx      # Dashboard navbar
├── services/
│   └── backendService.js        # Neon/Xano integration
└── utils/
    └── imageUpload.js          # Image upload handler
```

---

## Usage

### Adding an Event

1. Go to `/dashboard`
2. Click "Add Event"
3. Fill in the form:
   - **Title** (required)
   - **Category** (optional)
   - **Date** (e.g., "Sep 12, 2026")
   - **Time** (e.g., "19:00 - 02:00")
   - **Venue** (required)
   - **Capacity** (e.g., "250 Guests")
   - **Ticket Price** (required, in USD)
   - **Image** (upload or URL)
   - **Description** (event details)
4. Click "Create Event"

### Uploading Images

- Click the upload area or drag & drop
- Supported formats: PNG, JPG
- Maximum size: 5MB
- Preview appears before saving

### Editing Events

1. Find the event in the table
2. Click the **Edit** button (pencil icon)
3. Modify any fields
4. Click "Update Event"

### Deleting Events

1. Find the event in the table
2. Click the **Delete** button (trash icon)
3. Confirm deletion

---

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
# Current setup (local storage)
VITE_BACKEND_TYPE=local

# For production, use Neon or Xano (see BACKEND_SETUP.md)
# VITE_BACKEND_TYPE=neon
# VITE_BACKEND_TYPE=xano
```

---

## Customization

### Change Demo Credentials

Edit `src/context/AuthContext.jsx`:

```javascript
const DEFAULT_ADMIN = {
  email: 'your-email@example.com',
  password: 'your-password'
}
```

### Customize Dashboard Colors

- Primary gold: `#D4AF37` (class: `text-brand-gold`)
- Dark background: `#111111` (class: `bg-brand-black`)
- Edit in `tailwind.config.js` or component classes

### Add More Admin Fields

1. Update form in `Dashboard.jsx`
2. Add field to `EventContext.jsx` initial state
3. Update `backendService.js` query

---

## Backend Integration

Currently using **local React Context** for demo. To connect to production:

### Option 1: Neon DB (PostgreSQL)

See `BACKEND_SETUP.md` for complete setup:
- Create database schema
- Set up backend API (Express)
- Configure environment variables
- Deploy backend

### Option 2: Xano (No-Code Backend)

See `BACKEND_SETUP.md` for complete setup:
- Create collections in Xano
- Auto-generated REST API
- Configure environment variables
- Enable authentication

---

## Security Best Practices

⚠️ **For Production**:

1. **Never hardcode credentials** - Use backend authentication
2. **Hash passwords** - Use bcrypt or similar
3. **Validate inputs** - Check all form data on backend
4. **Use HTTPS** - Always encrypt data in transit
5. **Implement JWT** - Use tokens for session management
6. **Rate limiting** - Protect against brute force
7. **CORS configuration** - Restrict API access
8. **File uploads** - Validate file types and scan for malware
9. **Database security** - Use connection strings with passwords
10. **Admin role verification** - Always check auth status on routes

---

## Troubleshooting

### Login not working

- Check credentials (admin@toptier.com / admin123)
- Clear browser cache/localStorage
- Check browser console for errors

### Images not uploading

- Check file size (max 5MB)
- Verify file format (PNG, JPG)
- Check browser console for error messages

### Dashboard not showing events

- Events only appear after creation
- Refresh page if new events don't show
- Check that events were saved (look in localStorage in DevTools)

### Changes not persisting

- Currently using localStorage (resets on new incognito window)
- Set up backend integration to persist data across sessions

---

## Next Steps

1. ✅ **Admin Dashboard** - Complete
2. ⏳ **Backend Integration** - Set up Neon or Xano (see BACKEND_SETUP.md)
3. ⏳ **Email Notifications** - Add booking confirmations
4. ⏳ **Payment Processing** - Integrate Stripe/PayPal
5. ⏳ **Booking System** - Track ticket sales

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review BACKEND_SETUP.md for backend configuration
- Check browser console (F12) for error messages
- Contact: support@toptier.com


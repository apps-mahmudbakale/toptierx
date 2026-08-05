# TopTier Xperienz — Admin Dashboard & Event Management Platform

A premium, full-stack event management platform featuring a public-facing luxury event showcase and a secure admin dashboard for event creation, ticket pricing, and image uploads.

---

## 🚀 Features

### Public Site
- **Hero Section** with luxury event imagery
- **Featured Events** display with dynamic pricing
- **Event Details** pages with comprehensive information
- **Ticketing System** for booking events
- **Responsive Design** optimized for all devices

### Admin Dashboard
- 🔐 **Secure Login** (email/password authentication)
- ➕ **Event Management** (create, read, update, delete)
- 💰 **Ticket Pricing** per event with revenue calculations
- 🖼️ **Image Upload** with validation and preview
- 📊 **Dashboard Statistics** (total events, average price, revenue potential)
- 📱 **Responsive Admin UI** with glassmorphism design

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Router**: React Router v6
- **Icons**: Lucide React
- **Backend-Ready**: Neon DB or Xano integration (see docs)

---

## 📋 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd toptier

# Install dependencies
npm install

# Create .env file (optional, see .env.example)
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🔐 Admin Dashboard

### Access
- **URL**: `/dashboard`
- **Demo Email**: `admin@toptier.com`
- **Demo Password**: `admin123`

### Quick Start
1. Go to `/dashboard`
2. Log in with demo credentials
3. Click "Add Event" to create your first event
4. Fill in event details and upload an image
5. Set ticket price
6. View all events in the management table

---

## 📂 Project Structure

```
toptier/
├── src/
│   ├── context/              # Global state management
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── EventContext.jsx  # Events & pricing state
│   ├── pages/                # Page components
│   │   ├── Login.jsx         # Admin login
│   │   ├── Dashboard.jsx     # Admin dashboard
│   │   ├── Home.jsx          # Public homepage
│   │   ├── EventDetails.jsx  # Event details page
│   │   └── Ticketing.jsx     # Booking page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Public navbar
│   │   │   └── DashboardNavbar.jsx # Admin navbar
│   │   ├── sections/         # Homepage sections
│   │   └── ui/               # Reusable UI components
│   ├── services/
│   │   └── backendService.js # Neon/Xano integration
│   ├── utils/
│   │   └── imageUpload.js    # Image upload handler
│   └── App.jsx               # Main app component
├── DESIGN.md                 # Design system documentation
├── ADMIN_SETUP.md            # Admin dashboard guide
├── BACKEND_SETUP.md          # Backend integration guide
└── package.json
```

---

## 🔑 Key Features Explained

### Authentication
- Secure login page with validation
- Demo credentials for testing (change in `AuthContext.jsx` for production)
- Session persistence using localStorage
- Protected dashboard routes

### Event Management
- **Create**: Add new events with full details
- **Read**: View all events in a management table
- **Update**: Edit existing event information
- **Delete**: Remove events with confirmation

### Image Uploads
- **Base64 Storage**: Images stored in local state (for demo)
- **File Validation**: Checks file type and size (max 5MB)
- **Preview**: See images before saving
- **Error Handling**: Clear error messages

### Ticket Pricing
- Set price per ticket
- Display on event cards and details
- Calculate revenue potential in statistics
- Form validation for pricing

---

## 🎨 Design System

The app uses a premium luxury design system:
- **Primary Color**: Black (`#111111`)
- **Accent Color**: Gold (`#D4AF37`)
- **Typography**: Playfair Display (headlines) + Inter (body)
- **Components**: Glassmorphism with backdrop blur effects
- **Spacing**: 8px rhythm system

See `DESIGN.md` for complete design documentation.

---

## 🗄️ Backend Integration

### Current Setup (Demo)
Currently uses **React Context + localStorage** for demo purposes.

### Production Setup Options

#### Option 1: Neon DB (PostgreSQL)
```env
VITE_BACKEND_TYPE=neon
VITE_NEON_CONNECTION_STRING=postgresql://user:password@...
```
See `BACKEND_SETUP.md` for complete setup.

#### Option 2: Xano (No-Code Backend)
```env
VITE_BACKEND_TYPE=xano
VITE_XANO_API_URL=https://xano.yourapp.com/api
VITE_XANO_AUTH_TOKEN=your_token
```
See `BACKEND_SETUP.md` for complete setup.

---

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
# Backend configuration
VITE_BACKEND_TYPE=local          # or 'neon' or 'xano'

# Neon DB (if using Neon)
VITE_NEON_CONNECTION_STRING=postgresql://...

# Xano (if using Xano)
VITE_XANO_API_URL=https://xano.yourapp.com/api
VITE_XANO_AUTH_TOKEN=your_token

# Admin credentials (change for production!)
VITE_ADMIN_EMAIL=admin@toptier.com
VITE_ADMIN_PASSWORD=admin123
```

See `.env.example` for all available options.

---

## 🚀 Deployment

### Frontend
Deploy the `dist/` folder to Vercel, Netlify, or your hosting:

```bash
npm run build
# Upload dist/ folder
```

### Backend
If using Neon DB, deploy your backend API to Railway, Render, or Heroku.

See `BACKEND_SETUP.md` for detailed deployment instructions.

---

## 📚 Documentation

- **`DESIGN.md`** - Complete design system with colors, typography, spacing
- **`ADMIN_SETUP.md`** - Admin dashboard features and usage guide
- **`BACKEND_SETUP.md`** - Backend integration with Neon DB and Xano

---

## 🔒 Security Best Practices

⚠️ **For Production**:

- [ ] Never hardcode credentials
- [ ] Use backend authentication (OAuth, JWT)
- [ ] Hash all passwords (bcrypt)
- [ ] Validate inputs on backend
- [ ] Enable HTTPS only
- [ ] Implement rate limiting
- [ ] Configure CORS properly
- [ ] Scan uploads for malware
- [ ] Use environment variables
- [ ] Regular security audits

See `BACKEND_SETUP.md` for security details.

---

## 🐛 Troubleshooting

### Login Issues
- Verify credentials: `admin@toptier.com` / `admin123`
- Clear browser cache
- Check browser console for errors

### Image Upload Failed
- Check file format (PNG, JPG only)
- Ensure file size < 5MB
- Check browser console for details

### Events Not Showing
- Refresh the page
- Check localStorage in DevTools
- Events only persist when backend is configured

### Changes Not Persisting
- Currently using localStorage (session-based)
- Set up backend integration for permanent storage

---

## 📞 Support

For issues or questions:
1. Check the relevant documentation (ADMIN_SETUP.md, BACKEND_SETUP.md)
2. Review the troubleshooting section above
3. Check browser console (F12) for error messages
4. Contact: support@toptier.com

---

## 📄 License

MIT License - feel free to use and modify.

---

## 🎯 Roadmap

- [x] Public event showcase
- [x] Admin dashboard with authentication
- [x] Event management (CRUD)
- [x] Ticket pricing system
- [x] Image uploads
- [ ] Backend integration (Neon/Xano)
- [ ] Payment processing (Stripe)
- [ ] Email notifications
- [ ] Booking system
- [ ] Analytics dashboard
- [ ] Multi-user admin support

---

**Built with ❤️ for luxury event management**

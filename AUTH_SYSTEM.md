# Authentication System - Neon Database

## Overview
The authentication system now uses Neon PostgreSQL database for user management. No hardcoded credentials.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Architecture

### Login Flow
```
User enters email & password on Login page
  ↓
AuthContext calls login(email, password)
  ↓
Query Neon database for user with that email
  ↓
Compare password (plaintext - see security note)
  ↓
If match: create session and store in localStorage
  ↓
Redirect to Dashboard
```

### Files Involved

1. **src/context/AuthContext.jsx** - Authentication logic
   - `login(email, password)` - Queries Neon, verifies user
   - `logout()` - Clears session
   - Stores user in localStorage

2. **src/pages/Login.jsx** - Login form
   - Email and password input
   - Calls AuthContext.login()
   - Shows demo credentials

3. **src/services/authService.js** - Optional auth utilities
   - `login(email, password)` - Backend auth function
   - `getUserByEmail(email)` - Get user from database
   - `getAllUsers()` - Get all users (admin)

## Registered Users

### Admin User
- Email: `admin@toptierxperienze.com`
- Password: `Admin@123`
- Role: `admin`

### Regular User
- Email: `user@toptierxperienze.com`
- Password: `User@123`
- Role: `user`

## How It Works

### 1. User Registration (Initial)
Users are pre-registered in Neon database:
```sql
INSERT INTO users (email, password, role)
VALUES (
  'admin@toptierxperienze.com',
  'Admin@123',  -- Should be hashed with bcrypt
  'admin'
);
```

Users can be registered using:
```bash
npm run seed:users
```

### 2. User Login
```javascript
const { success, user } = await authContext.login(
  'admin@toptierxperienze.com',
  'Admin@123'
)

if (success) {
  // User logged in
  // { id: 1, email: '...', role: 'admin' }
}
```

### 3. Session Management
```javascript
// Check if logged in
const { isAuthenticated, user } = useContext(AuthContext)

if (isAuthenticated) {
  // User is logged in
  console.log(user.email)
}

// Logout
const { logout } = useContext(AuthContext)
logout()
```

## Security Notes

⚠️ **Current Implementation:**
- Passwords stored as plaintext in database (NOT SECURE)
- Password comparison is plaintext string match
- Only suitable for demo/development

✅ **Production Recommendations:**

1. **Hash Passwords with bcrypt:**
   ```javascript
   // When registering user
   const hashedPassword = await bcrypt.hash(password, 10)
   ```

2. **Use Backend Authentication:**
   - Frontend sends email/password to backend
   - Backend compares with bcrypt
   - Backend returns JWT token
   - Frontend uses token for subsequent requests

3. **Implement JWT Tokens:**
   - Instead of storing user in localStorage
   - Use JWT tokens that expire
   - More secure for API calls

4. **Add Password Reset:**
   - Forgot password functionality
   - Email verification

5. **Add Session Timeout:**
   - Log out inactive users
   - Re-authenticate for sensitive operations

## Database Queries

### View All Users
```sql
SELECT id, email, role, created_at FROM users ORDER BY created_at DESC;
```

### Update User Password
```sql
UPDATE users 
SET password = 'NewHashedPassword'
WHERE email = 'admin@toptierxperienze.com';
```

### Delete User
```sql
DELETE FROM users WHERE email = 'user@example.com';
```

## Testing Login

### Test with Admin Account
1. Go to `/login`
2. Email: `admin@toptierxperienze.com`
3. Password: `Admin@123`
4. Click "Sign In"
5. Should redirect to `/dashboard`

### Test with Regular User
1. Go to `/login`
2. Email: `user@toptierxperienze.com`
3. Password: `User@123`
4. Click "Sign In"
5. Should redirect to `/dashboard`

### Test Logout
1. Click logout button in Dashboard
2. Should redirect to home page
3. Login page should work again

## Access Control

### Admin Dashboard
- Only accessible to authenticated users
- ProtectedRoute component checks `isAuthenticated`
- Redirects to login if not authenticated

### Admin Functions
- Create events
- Update events
- Delete events
- View bookings

### Role-Based Features (TODO)
- Add more granular permissions
- Different roles: admin, manager, viewer
- Restrict certain operations by role

## Debugging

### Check Authentication State
```javascript
// In browser console
const user = localStorage.getItem('toptier_user')
console.log(JSON.parse(user))
```

### Check Database Users
```sql
-- In Neon console
SELECT * FROM users;
```

### Enable Debug Logs
The AuthContext logs authentication attempts:
- `🔐 Authenticating user: email`
- `✅ User authenticated: email`
- `❌ User not found: email`
- `❌ Password mismatch for user: email`

## Next Steps

1. ✅ Users table created in Neon
2. ✅ Default users registered
3. ✅ Login queries Neon database
4. ⏳ Hash passwords with bcrypt (production)
5. ⏳ Implement backend authentication
6. ⏳ Add JWT tokens
7. ⏳ Implement password reset
8. ⏳ Add email verification
9. ⏳ Implement role-based access control

## Related Files

- `src/context/AuthContext.jsx` - Main auth logic
- `src/pages/Login.jsx` - Login page
- `src/services/authService.js` - Auth utilities
- `src/components/ProtectedRoute.jsx` - Route protection
- `db/migrations.sql` - Database schema
- `seed-users.js` - User registration script

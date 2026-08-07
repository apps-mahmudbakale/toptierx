# Deployment Guide - TopTier Xperienz

## Netlify Deployment

### Issue: 404 on Dynamic Routes
When accessing `/event/3` on Netlify, you get a 404 error. This is because Netlify doesn't know how to handle React Router routes.

### Solution: SPA Redirect Configuration

The app includes two configuration methods:

#### Method 1: `netlify.toml` (Recommended)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This file is already in the root directory.

#### Method 2: `public/_redirects`
```
/* /index.html 200
```

This file is automatically copied to `dist/` during build.

### Deployment Steps

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Push to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Fix SPA routing for Netlify"
   git push origin main
   ```

3. **Deploy to Netlify**
   - Connect your repo to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Netlify will automatically detect `netlify.toml` and apply settings

4. **Test Routes**
   - Home: `https://yourdomain.com/`
   - Event: `https://yourdomain.com/event/3` ✅
   - Ticketing: `https://yourdomain.com/event/3/tickets` ✅
   - Dashboard: `https://yourdomain.com/dashboard` ✅
   - Login: `https://yourdomain.com/login` ✅

### If Still Getting 404

1. **Clear Netlify Cache**
   - Go to Site settings → Deployments
   - Click "Trigger deploy" (don't select a branch)
   - Select "Clear cache and deploy site"

2. **Verify Files**
   - Check `dist/_redirects` file exists in build
   - Check `netlify.toml` in root

3. **Check Deploy Log**
   - Go to Deploys tab
   - Click on latest deploy
   - Check for any errors

### Environment Variables

Add these to Netlify Site Settings → Environment variables:

```
VITE_DATABASE_URL = your_neon_connection_string
VITE_HYPARROW_PUBLIC_KEY = pk_live_xxxxx
VITE_HYPARROW_SECRET_KEY = sk_live_xxxxx
VITE_BACKEND_URL = https://yourdomain.com  (optional)
```

### Files Included

- ✅ `netlify.toml` - Netlify configuration
- ✅ `public/_redirects` - Redirect rules (auto-copied to dist)
- ✅ `dist/index.html` - Entry point for all routes
- ✅ `vite.config.js` - Vite build configuration

### Troubleshooting

**Problem: Still getting 404**
- Solution: Clear browser cache (Ctrl+Shift+Delete)
- Solution: Clear Netlify cache and redeploy
- Solution: Check that `_redirects` file is in dist folder

**Problem: Styles not loading**
- Solution: Check assets are in `/assets` folder
- Solution: Verify base path in vite.config.js

**Problem: Images not displaying**
- Solution: Verify image paths are correct
- Solution: Check CORS headers for external images

**Problem: Database not connecting**
- Solution: Verify Neon connection string is in env vars
- Solution: Check IP whitelist in Neon console

## Other Hosting Platforms

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Build: `npm run build`
4. Output: `dist`
5. Vercel automatically handles SPA routing ✅

### GitHub Pages
1. Update `vite.config.js`:
   ```javascript
   export default {
     base: '/toptier/',  // your repo name
   }
   ```
2. Deploy to `gh-pages` branch
3. Access at: `https://username.github.io/toptier`

### Docker/Self-hosted
1. Build: `npm run build`
2. Copy `dist/` to web server
3. Configure web server to serve `index.html` for all routes

   **Nginx:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

   **Apache:**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Pre-deployment Checklist

- [ ] All environment variables set
- [ ] Build passes: `npm run build`
- [ ] No console errors in dev: `npm run dev`
- [ ] Events load from Neon
- [ ] Login works with Neon users
- [ ] Bookings save to Neon
- [ ] Payment flow works
- [ ] Routes work locally
- [ ] Images load correctly
- [ ] Responsive on mobile

## Post-deployment Checklist

- [ ] Home page loads
- [ ] Events display
- [ ] Event details page works (`/event/3`)
- [ ] Ticketing page works (`/event/3/tickets`)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Bookings display
- [ ] No 404 errors on dynamic routes
- [ ] Styles and images load correctly
- [ ] Payment redirects work

## Monitoring

- Monitor Netlify analytics
- Check error logs in Netlify
- Monitor Neon database connection
- Track payment transactions
- Monitor user login attempts

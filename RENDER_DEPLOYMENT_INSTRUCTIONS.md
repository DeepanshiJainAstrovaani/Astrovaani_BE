# Render Deployment Instructions for AstroVaani Backend

## Issue Fixed
- ✅ Resolved `buffer-equal-constant-time` compatibility issue with Node.js
- ✅ Pinned Node.js version to 20.18.0 for Render deployment
- ✅ Added explicit `buffer-equal-constant-time` dependency

## Deployment Steps

### 1. Push Latest Changes
Your latest code is now pushed to GitHub with the fixes.

### 2. Trigger Render Deployment

**Option A: Automatic Deployment (if connected to GitHub)**
- Render will automatically detect the new commits and redeploy
- Monitor the deployment at: https://dashboard.render.com

**Option B: Manual Deployment**
1. Go to https://dashboard.render.com
2. Select your service: `astrovaani-backend`
3. Click "Manual Deploy" → "Deploy latest commit"

### 3. Configure Environment Variables in Render

Make sure these environment variables are set in Render Dashboard:

**Required Variables:**
```
MONGODB_URI=mongodb+srv://testuser:test1122@testastro.yb6oqe6.mongodb.net/astro
PORT=5000
NODE_ENV=production
```

**Optional Variables (if using these features):**
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_TO_WHATSAPP_NUMBER=+1234567890
TWILIO_FROM_WHATSAPP_NUMBER=+1234567890

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

JWT_SECRET=your_jwt_secret_key_here
```

### 4. Monitor Deployment

Watch the build logs in Render dashboard. You should see:
```
==> Running 'npm install'
==> Running 'npm start'
==> Server running on port 5000
==> MongoDB connected successfully
```

### 5. Test Your Deployed API

Once deployed, test these endpoints (replace with your actual Render URL):

```bash
# Get your Render URL from dashboard (e.g., https://astrovaani-backend.onrender.com)
RENDER_URL="https://your-app-name.onrender.com"

# Test health endpoint
curl $RENDER_URL/api/

# Test vendors
curl $RENDER_URL/api/vendors

# Test blogs
curl $RENDER_URL/api/blogs

# Test horoscope
curl $RENDER_URL/api/horoscope/aries
```

### 6. Update Frontend API URL

Once your backend is deployed successfully, update your React Native app:

```typescript
// In Astrovaani_FE/api.ts or .env
export const BASE_URL = 'https://your-app-name.onrender.com/api';
```

## Troubleshooting

### If Deployment Still Fails:

1. **Check Node Version in Render Dashboard:**
   - Go to your service → Settings
   - Verify "Node Version" is set to `20.18.0`

2. **Clear Build Cache:**
   - Go to Settings → "Clear build cache"
   - Then manually deploy again

3. **Check Logs:**
   - Click on "Logs" tab
   - Look for specific error messages

4. **Verify Environment Variables:**
   - Go to Environment tab
   - Make sure `MONGODB_URI` is set correctly
   - Test MongoDB connection separately

### Common Issues:

**Issue: Module not found**
```bash
# Solution: Clear cache and redeploy
```

**Issue: MongoDB connection failed**
```bash
# Solution: Check MONGODB_URI in environment variables
# Make sure MongoDB Atlas allows connections from 0.0.0.0/0
```

**Issue: Port already in use**
```bash
# Solution: Render automatically assigns PORT, don't hardcode it
# Use: const PORT = process.env.PORT || 5000;
```

## Files Changed

- ✅ `package.json` - Updated dependencies and Node version
- ✅ `.node-version` - Specifies Node.js 20.18.0
- ✅ `render.yaml` - Proper Render configuration
- ✅ `package-lock.json` - Updated lock file

## Support

If you encounter any issues:
1. Check Render logs first
2. Verify all environment variables are set
3. Test MongoDB connection separately
4. Check if your Render free tier instance is sleeping (wakes up on first request)

## Free Tier Limitations

Render free tier has these limitations:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month (essentially unlimited)

For production, consider upgrading to a paid plan.

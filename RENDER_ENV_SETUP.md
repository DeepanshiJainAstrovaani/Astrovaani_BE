# How to Set Environment Variables in Render

## Critical: MongoDB Connection Fix

The error you're seeing:
```
MongoDB connection error: connect ECONNREFUSED ::1:27017
```

This happens because the `MONGODB_URI` environment variable is **NOT SET** in Render.

## Step-by-Step Solution

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Select Your Service
- Click on your service: **astrovaani-backend** (or whatever you named it)

### 3. Go to Environment Tab
- Click on **"Environment"** in the left sidebar
- You'll see a list of environment variables

### 4. Add MONGODB_URI Variable

Click **"Add Environment Variable"** and add:

**Key:** `MONGODB_URI`
**Value:** `mongodb+srv://testuser:test1122@testastro.yb6oqe6.mongodb.net/astro`

### 5. Add Other Required Variables

Make sure these are also set:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` *(Render uses port 10000 by default)* |

### 6. Optional Variables

If you're using these features, add them too:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
JWT_SECRET=your_jwt_secret_key
```

### 7. Save and Redeploy

After adding environment variables:
1. Click **"Save Changes"**
2. Render will automatically redeploy your service
3. Monitor the logs - you should now see:
   ```
   ✅ Connected to MongoDB database
   📊 Database: astro
   ✅ Server is running on http://localhost:10000
   ```

## Verify Configuration

In the Render logs, you should see:
```
🔧 MongoDB Configuration:
   URI: mongodb+srv://testuser:***@testastro.yb6oqe6.mongodb.net/astro
   Environment: production
```

If you see:
```
⚠️ WARNING: MONGODB_URI environment variable is not set!
```

Then the environment variable wasn't properly configured.

## Important Notes

### ⚠️ Security Best Practices

1. **NEVER** commit `.env` files to Git
2. **NEVER** hardcode credentials in `render.yaml`
3. **ALWAYS** set sensitive values in Render Dashboard
4. Use `sync: false` for secret environment variables in `render.yaml`

### MongoDB Atlas Whitelist

Make sure MongoDB Atlas allows connections from Render:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
5. Click **"Confirm"**

This allows Render's servers to connect to your MongoDB Atlas cluster.

## Troubleshooting

### Issue: Still seeing localhost connection error

**Solution:**
1. Double-check the environment variable name is exactly `MONGODB_URI` (case-sensitive)
2. Make sure there are no extra spaces in the value
3. Click "Save Changes" in Render
4. Wait for automatic redeployment

### Issue: Connection timeout

**Solution:**
1. Check MongoDB Atlas Network Access settings
2. Make sure `0.0.0.0/0` is whitelisted
3. Verify the MongoDB URI is correct
4. Check if your MongoDB Atlas cluster is active

### Issue: Authentication failed

**Solution:**
1. Verify username and password in the connection string
2. Check if the database user exists in MongoDB Atlas
3. Make sure the user has read/write permissions

## Testing After Deployment

Once deployed successfully, test with:

```bash
# Replace with your actual Render URL
RENDER_URL="https://astrovaani-backend.onrender.com"

# Test health check
curl $RENDER_URL/api/

# Test vendors
curl $RENDER_URL/api/vendors

# Test blogs  
curl $RENDER_URL/api/blogs
```

## Quick Reference

**Render Dashboard:** https://dashboard.render.com
**MongoDB Atlas:** https://cloud.mongodb.com

Your current MongoDB Atlas connection:
- **Cluster:** testastro.yb6oqe6.mongodb.net
- **Database:** astro
- **Username:** testuser

Make sure to set `MONGODB_URI` in Render Dashboard with the full connection string!

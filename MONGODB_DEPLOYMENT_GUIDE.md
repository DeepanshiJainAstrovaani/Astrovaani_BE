# MongoDB Atlas Setup and Deployment Guide

## 🚀 Quick Start

### Phase 1: MongoDB Atlas Setup (5-10 minutes)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)
   - Verify your email

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose **M0 FREE** tier
   - Select **AWS** as cloud provider
   - Choose region closest to you (e.g., `us-east-1` for USA)
   - Cluster name: `AstrovaaniCluster` (or any name)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Authentication Method: **Password**
   - Username: `astrovaani_user`
   - Password: Generate a secure password (SAVE THIS!)
   - Database User Privileges: **Read and write to any database**
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access From Anywhere" (or add `0.0.0.0/0`)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: **Node.js**
   - Version: **5.5 or later**
   - Copy the connection string:
     ```
     mongodb+srv://astrovaani_user:<password>@astrovaanicluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `.../astrovaani?retryWrites...`

---

### Phase 2: Update Backend Configuration

1. **Update `.env` file**

Create/update `Astrovaani_BE/.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://astrovaani_user:YOUR_PASSWORD@astrovaanicluster.xxxxx.mongodb.net/astrovaani?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# Twilio Configuration (replace with your actual values)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_TO_WHATSAPP_NUMBER=+1234567890
TWILIO_FROM_WHATSAPP_NUMBER=+1234567890

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_PZemRssxP5pgKP
RAZORPAY_SECRET=yG7wNLRGVxk0BaP07FNqwfb7

# API Base URL
API_BASE_URL=http://localhost:5000/api
```

2. **Install Dependencies**

```bash
cd Astrovaani_BE
npm install
```

3. **Test Locally**

```bash
npm start
```

You should see:
```
✅ Connected to MongoDB database
📊 Database: astrovaani
🔗 Mongoose connected to MongoDB
✅ Server is running on http://localhost:5000
```

4. **Test API Endpoints**

```bash
# Test health endpoint
curl http://localhost:5000/

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/whatsapp/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8168095773"}'

# Test vendors endpoint
curl http://localhost:5000/api/vendors
```

---

### Phase 3: Deploy to Render

1. **Push Code to GitHub** (if not already)

```bash
cd Astrovaani_BE
git init
git add .
git commit -m "Migrated to MongoDB"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/astrovaani-backend.git
git push -u origin main
```

2. **Create Render Web Service**
   - Go to https://dashboard.render.com/
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose `Astrovaani_BE` folder (if monorepo)

3. **Configure Render Service**

   - **Name**: `astrovaani-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Add Environment Variables**

   Go to "Environment" tab and add all variables from your `.env` file:

   ```
   MONGODB_URI=mongodb+srv://...
   PORT=5000
   NODE_ENV=production
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_TO_WHATSAPP_NUMBER=...
   TWILIO_FROM_WHATSAPP_NUMBER=...
   JWT_SECRET=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_SECRET=...
   API_BASE_URL=https://astrovaani-be.onrender.com/api
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)
   - Check logs for successful connection

6. **Test Deployed API**

```bash
curl https://astrovaani-be.onrender.com/api/auth/whatsapp/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8168095773"}'
```

---

### Phase 4: Update Frontend

1. **Update Frontend `.env`**

`Astrovaani_FE/.env`:

```env
BASE_URL=https://astrovaani-be.onrender.com/api
```

2. **Restart Expo**

```bash
cd Astrovaani_FE
npx expo start --clear
```

3. **Test Login Flow**
   - Open your app
   - Enter mobile number
   - Verify OTP (use hardcoded `123456`)
   - Should successfully login!

---

## 🔍 Troubleshooting

### Issue 1: "MongooseServerSelectionError"

**Problem**: Cannot connect to MongoDB

**Solutions**:
- Check if IP is whitelisted (allow `0.0.0.0/0`)
- Verify connection string has correct password
- Ensure database user exists
- Check if cluster is active

### Issue 2: "ValidationError"

**Problem**: Data validation failing

**Solutions**:
- Check frontend is sending correct data types
- Ensure required fields are present
- Verify ObjectId format for foreign keys

### Issue 3: "CastError: Cast to ObjectId failed"

**Problem**: Invalid ID format

**Solutions**:
- Frontend might be sending integer IDs
- Use MongoDB ObjectId strings (24 hex characters)
- Update frontend to handle new ID format

### Issue 4: "401 Unauthorized"

**Problem**: JWT token issues

**Solutions**:
- Ensure JWT_SECRET is same across deployments
- Check token expiration
- Verify Authorization header format

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] Dependencies installed (`npm install`)
- [ ] Server runs locally
- [ ] API endpoints work locally
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables added to Render
- [ ] Render deployment successful
- [ ] Deployed API responds correctly
- [ ] Frontend `.env` updated
- [ ] Frontend connects to deployed API
- [ ] Login flow works end-to-end

---

## 📊 Migration Summary

### What Changed:

| Before (MySQL) | After (MongoDB) |
|----------------|-----------------|
| `mysql2` package | `mongoose` package |
| SQL queries | Mongoose methods |
| Integer IDs | ObjectId strings |
| Callbacks | Async/await |
| `db.query()` | `Model.find()` |
| Foreign keys | ObjectId references |
| Auto-increment | UUID-like ObjectIds |

### What Stayed the Same:

✅ API endpoints (same URLs)
✅ Request/response formats
✅ Authentication flow
✅ Business logic
✅ Frontend code (except BASE_URL)

---

## 🎉 Success!

Your app is now running on:
- **Backend**: MongoDB Atlas (free, cloud-hosted)
- **API**: Render (free, auto-deploys)
- **Frontend**: Expo (local development)

**No more database hosting issues!** 🚀

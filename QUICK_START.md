# 🚀 Quick Start Guide - MongoDB Version

## ⚡ Super Fast Setup (30 minutes)

### Step 1: MongoDB Atlas (10 min)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (FREE, no credit card)
3. Create cluster (M0 FREE tier)
4. Create user: `astrovaani_user` + password
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string:
   ```
   mongodb+srv://astrovaani_user:PASSWORD@cluster.mongodb.net/astrovaani
   ```

### Step 2: Update Backend (2 min)
Edit `Astrovaani_BE/.env`:
```env
MONGODB_URI=mongodb+srv://astrovaani_user:YOUR_PASSWORD@cluster.mongodb.net/astrovaani?retryWrites=true&w=majority
```

### Step 3: Test Locally (5 min)
```bash
cd Astrovaani_BE
npm install
npm start
```

Should see:
```
✅ Connected to MongoDB database
📊 Database: astrovaani
✅ Server is running on http://localhost:5000
```

### Step 4: Test API (2 min)
```bash
# Login
curl -X POST http://localhost:5000/api/auth/whatsapp/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8168095773"}'

# Verify OTP (use 123456)
curl -X POST http://localhost:5000/api/auth/whatsapp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8168095773","otp":"123456"}'
```

### Step 5: Deploy to Render (10 min)
1. Go to https://dashboard.render.com/
2. New Web Service → Connect GitHub
3. Add environment variable: `MONGODB_URI`
4. Deploy!

### Step 6: Update Frontend (1 min)
Edit `Astrovaani_FE/.env`:
```env
BASE_URL=https://astrovaani-be.onrender.com/api
```

Restart Expo:
```bash
cd Astrovaani_FE
npx expo start --clear
```

---

## ✅ That's It!

Your app is now running with MongoDB! 🎉

**Need help?** Check:
- `MONGODB_DEPLOYMENT_GUIDE.md` - Full instructions
- `CONVERSION_COMPLETE.md` - What changed

---

## 🔥 Common Commands

```bash
# Start backend
cd Astrovaani_BE && npm start

# Start frontend
cd Astrovaani_FE && npx expo start --clear

# Test API
curl http://localhost:5000/api/vendors

# Check MongoDB connection
# (Look for "✅ Connected to MongoDB database" in logs)
```

---

## 🎯 Important URLs

- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Render Dashboard**: https://dashboard.render.com/
- **Local API**: http://localhost:5000/api
- **Deployed API**: https://astrovaani-be.onrender.com/api

---

**All done!** You're ready to go live! 🚀

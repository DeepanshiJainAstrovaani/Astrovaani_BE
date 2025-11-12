# Update IconicSolution API Key on Render

## ✅ New Unrestricted API Key
```
adfa9f878d294ed7880405f25b3f17e4
```

## 📋 Steps to Update on Render:

### 1. Go to Render Dashboard
```
https://dashboard.render.com
```

### 2. Select Your Service
- Find and click on: **astrovaani-backend**

### 3. Navigate to Environment Tab
- Click **Environment** in the left sidebar

### 4. Add/Update the API Key
Look for `ICONIC_API_KEY` environment variable:

**If it exists:**
- Click the **Edit** button next to it
- Update value to: `adfa9f878d294ed7880405f25b3f17e4`
- Click **Save**

**If it doesn't exist:**
- Click **Add Environment Variable**
- Key: `ICONIC_API_KEY`
- Value: `adfa9f878d294ed7880405f25b3f17e4`
- Click **Save**

### 5. Redeploy (Automatic)
Render will automatically redeploy your service when you save the environment variable.

### 6. Wait for Deployment
- Wait 1-2 minutes for deployment to complete
- Check the **Logs** tab to confirm deployment succeeded

### 7. Verify Other Environment Variables
Make sure these are also set in Render:

```env
MONGODB_URI=mongodb+srv://testuser:test1122@testastro.yb6oqe6.mongodb.net/astro
PORT=5000
NODE_ENV=production
SITE_BASE_URL=https://astrovaani.com
ENABLE_EMAIL=false
JWT_SECRET=39d3927dbe3c8290a6f5833ad3d1151251e80d60e072eff1cf16b32fd4150b86
RAZORPAY_KEY_ID=rzp_live_PZemRssxP5pgKP
RAZORPAY_SECRET=yG7wNLRGVxk0BaP07FNqwfb7
```

## ✅ Testing After Update

Once deployed, test the WhatsApp notification:

1. **Open frontend:** http://localhost:3000/admin/vendors
2. **Click on a vendor** to edit
3. **Click "Notify Vendor"** button
4. **Check WhatsApp** - vendor should receive the interview scheduling message!

## 🔍 Troubleshooting

If WhatsApp doesn't send:

1. **Check Render Logs:**
   - Go to Logs tab in Render
   - Look for WhatsApp API response messages

2. **Verify API Key is Active:**
   - Check IconicSolution dashboard
   - Ensure the key is enabled

3. **Check Vendor Phone Number:**
   - Verify vendor has a valid phone/whatsapp number
   - Number should be in format: 10 digits (India)

## 📊 Success Indicators

In Render logs, you should see:
```
📱 Sending WhatsApp via IconicSolution
   Mobile: 91XXXXXXXXXX
   API KEY: adfa...17e4
✅ WhatsApp API response: { status: 'success', ... }
✅ WhatsApp sent successfully!
```

---

**Note:** This is an unrestricted API key for testing. Once everything works, consider generating an IP-restricted key for better security in production.

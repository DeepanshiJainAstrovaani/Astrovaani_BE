# CyberPanel Node.js Application Deployment Guide

## Step 1: Create Node.js Application in CyberPanel

1. **Login to CyberPanel**
   - Go to `https://your-server-ip:8090`
   - Login with your admin credentials

2. **Create Node.js Application**
   - Go to "Applications" → "Node.js"
   - Click "Create App"
   - Fill in details:
     - **Domain**: `astrovaani.com`
     - **App Name**: `astrovaani-backend`
     - **Entry Point**: `server.js`
     - **Startup File**: `server.js`
     - **Node Version**: Select latest (18.x or higher)

## Step 2: Upload Your Application Files

### Option A: Using File Manager (Recommended)
1. Go to "File Manager" in CyberPanel
2. Navigate to your domain folder: `/home/astrovaani.com/public_html/`
3. Create a new folder: `backend` or `api`
4. Upload all your Node.js files to this folder:
   - `server.js`
   - `package.json`
   - `config/` folder
   - `controllers/` folder
   - `models/` folder
   - `routes/` folder
   - `middleware/` folder
   - `utils/` folder
   - `.env` file (with updated credentials)

### Option B: Using SFTP/SCP
```bash
# From your local machine
scp -r ./Astrovaani_BE/* root@your-server-ip:/home/astrovaani.com/public_html/backend/
```

## Step 3: Install Dependencies

1. **Access Terminal via CyberPanel**
   - Go to "File Manager"
   - Navigate to your app directory
   - Click "Terminal" or use SSH

2. **Install Node.js dependencies**
```bash
cd /home/astrovaani.com/public_html/backend
npm install
```

## Step 4: Configure Environment Variables

Make sure your `.env` file has the correct database credentials:

```env
# CyberPanel Database Configuration
DB_HOST=localhost
DB_USER=astr_astrovaani_user
DB_PASSWORD=astr_astrovaani_user  # This is your actual password
DB_NAME=astr_astrovaani2
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production

# Your existing Twilio credentials (replace with your actual values)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_TO_WHATSAPP_NUMBER=+1234567890
TWILIO_FROM_WHATSAPP_NUMBER=+1234567890

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Add your Razorpay credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# API Base URL
API_BASE_URL=https://astrovaani.com/api
```

## Step 5: Test Database Connection

```bash
cd /home/astrovaani.com/public_html/backend
node test-db-connection.js
```

If successful, you should see:
- ✅ Connected to MySQL database successfully!
- ✅ Check Tables: 7 tables found
- ✅ Count Vendors: 4 records (sample data)

## Step 6: Start Your Application

### Option A: Using CyberPanel Node.js Manager
1. Go to "Applications" → "Node.js"
2. Find your app and click "Start"

### Option B: Using PM2 (Recommended for production)
```bash
cd /home/astrovaani.com/public_html/backend

# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "astrovaani-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Step 7: Configure Reverse Proxy

1. **Create Subdomain/Path**
   - Go to "Websites" → "Create Website"
   - Or use existing domain: `astrovaani.com`

2. **Configure Nginx Reverse Proxy**
   - Go to "Websites" → "List Websites"
   - Click on your domain
   - Go to "Rewrite Rules" or "Nginx Conf"
   - Add this configuration:

```nginx
location /api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Step 8: Configure SSL Certificate

1. **Get SSL Certificate**
   - Go to "SSL" → "Manage SSL"
   - Select your domain
   - Click "Issue SSL" (Let's Encrypt)

## Step 9: Test Your API

Once deployed, test these endpoints:

```bash
# Test basic endpoint
curl https://astrovaani.com/api/

# Test vendors endpoint
curl https://astrovaani.com/api/vendors

# Test blogs endpoint
curl https://astrovaani.com/api/blogs

# Test horoscope endpoint
curl https://astrovaani.com/api/horoscope/aries
```

## Step 10: Update Frontend API URL

Update your React Native app's API configuration:

```typescript
// In Astrovaani_FE/api.ts
export const BASE_URL = `https://astrovaani.com/api`;
```

## Useful Commands

### PM2 Management:
```bash
pm2 status                    # Check status
pm2 logs astrovaani-backend   # View logs
pm2 restart astrovaani-backend # Restart app
pm2 stop astrovaani-backend   # Stop app
pm2 delete astrovaani-backend # Remove app
```

### Application Updates:
```bash
cd /home/astrovaani.com/public_html/backend
git pull origin main  # if using git
npm install           # if new dependencies
pm2 restart astrovaani-backend
```

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check `.env` file credentials
   - Verify database user permissions
   - Test connection: `node test-db-connection.js`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes: `pkill -f node`

3. **Permission Denied**
   - Check file permissions: `chmod -R 755 /home/astrovaani.com/public_html/backend`
   - Change ownership: `chown -R astrovaani:astrovaani /home/astrovaani.com/public_html/backend`

4. **Module Not Found**
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Check Logs:
```bash
# PM2 logs
pm2 logs astrovaani-backend

# System logs
tail -f /usr/local/lsws/logs/error.log
tail -f /usr/local/lsws/logs/access.log
```

## Final Checklist

- ✅ Database created and populated
- ✅ Node.js application uploaded
- ✅ Dependencies installed
- ✅ Environment variables configured
- ✅ Database connection tested
- ✅ Application started with PM2
- ✅ Reverse proxy configured
- ✅ SSL certificate installed
- ✅ API endpoints tested
- ✅ Frontend API URL updated

Your backend should now be live at: `https://astrovaani.com/api/`

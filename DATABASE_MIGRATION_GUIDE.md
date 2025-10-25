# Database Migration: Local to CyberPanel

## Step 1: Export Your Local Database (astr_astrovaani)

### Option A: Using phpMyAdmin (Recommended)
1. Open your local phpMyAdmin
2. Select database: `astr_astrovaani` 
3. Click "Export" tab
4. Select "Quick" export method
5. Format: SQL
6. Click "Go" to download the SQL file

### Option B: Using MySQL Command Line
```bash
mysqldump -u root -p astr_astrovaani > astr_astrovaani_backup.sql
```

## Step 2: Clean the SQL File for CyberPanel

Open the exported SQL file and remove/modify these lines:
- Remove lines starting with `LOCK TABLES`
- Remove lines starting with `UNLOCK TABLES`
- Remove lines with `SET @@SESSION.SQL_LOG_BIN`
- Replace any `TYPE=InnoDB` with `ENGINE=InnoDB`
- Remove any `DEFINER=` statements

## Step 3: Import to CyberPanel Database

1. **Login to CyberPanel phpMyAdmin**
   - Go to your CyberPanel → Databases → phpMyAdmin
   - Login with: `astr_astrovaani_user` / `astr_astrovaani_user`

2. **Select the CyberPanel database**
   - Click on `astr_astrovaani2` database

3. **Import the SQL file**
   - Click "Import" tab
   - Choose your cleaned SQL file
   - Click "Go"

## Step 4: Update Environment Variables

Update your `.env` file for CyberPanel deployment:

```env
# CyberPanel Database Configuration
DB_HOST=localhost
DB_USER=astr_astrovaani_user
DB_PASSWORD=astr_astrovaani_user
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

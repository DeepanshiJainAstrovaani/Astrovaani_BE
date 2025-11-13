# MySQL → MongoDB Sync Setup Guide

## Overview
This sync keeps MongoDB in sync with MySQL production database, allowing you to use MySQL as source of truth while serving data from MongoDB for better performance.

## Database Structure

### MySQL (Source of Truth)
- **Database:** `astr_astrovaani`
- **Table:** `community` (contains all vendor data - 88 records)
- **Connection:** localhost on production server

### MongoDB (Performance Layer)
- **Database:** `astro`
- **Collection:** `community` (synced from MySQL)
- **Connection:** MongoDB Atlas (cloud)

## Why This Architecture?

1. ✅ **MySQL as Source:** Your PHP application writes to MySQL
2. ✅ **MongoDB for API:** Node.js backend reads from MongoDB (faster queries)
3. ✅ **Auto-Sync:** Every 3 hours, data syncs from MySQL → MongoDB
4. ✅ **Future-Proof:** New vendors added to MySQL will auto-sync to MongoDB

## Current Status

### ✅ Fixed Issues:
- Vendor model now correctly uses `community` collection (not empty `vendors` collection)
- Test confirmed: 88 vendors accessible from MongoDB
- Sync script reads from MySQL `community` table

### 📋 Field Mapping (MySQL → MongoDB):

```javascript
MySQL community table → MongoDB community collection
├─ id                 → id
├─ name               → name
├─ email              → email
├─ phone              → phone
├─ whatsapp           → whatsapp
├─ gender             → gender
├─ age                → age
├─ photo              → photo
├─ photo2/3/4/5       → photo2/3/4/5
├─ category           → category
├─ skills             → skills
├─ experience         → experience
├─ language           → language
├─ city/state/pincode → city/state/pincode
├─ priceperminute     → priceperminute
├─ rating             → rating
├─ status             → status
├─ interviewerid      → interviewerid
├─ interviewcode      → interviewcode
└─ schedules          → schedules (preserved, not overwritten)
```

## Setup Instructions

### 1. On Production Server (Where MySQL is Accessible)

#### Option A: Run Once Manually
```bash
cd /path/to/Astrovaani_BE
node sync-mysql-to-mongodb.js
```

#### Option B: Run on Schedule (Every 3 Hours)
```bash
# Install PM2 if not already installed
npm install -g pm2

# Start the scheduler
pm2 start scheduler.js --name "astro-sync"

# View logs
pm2 logs astro-sync

# Check status
pm2 status

# Enable auto-restart on server reboot
pm2 startup
pm2 save
```

### 2. Environment Variables (.env)

```env
# MySQL (Production Database)
MYSQL_HOST=localhost
MYSQL_USER=astr_astrovaani
MYSQL_PASSWORD=Astrovaani@123
MYSQL_DATABASE=astr_astrovaani

# MongoDB (Cloud Database)
MONGODB_URI=mongodb+srv://testuser:test1122@testastro.yb6oqe6.mongodb.net/astro

# Sync Settings
SYNC_CRON_SCHEDULE=0 */3 * * *    # Every 3 hours
SYNC_ON_STARTUP=false              # Run sync when scheduler starts
```

## How It Works

### 1. Initial State
- **MongoDB:** 88 vendors in `community` collection (from previous import)
- **MySQL:** 88+ vendors in `community` table (production data)

### 2. Sync Process
```
┌─────────────────┐
│  MySQL Server   │
│  (Production)   │
│                 │
│  community      │◄─── PHP app writes here
│  (88+ vendors)  │
└────────┬────────┘
         │
         │ Every 3 hours
         │ (or manual trigger)
         ▼
┌─────────────────┐
│ Sync Script     │
│ • Reads MySQL   │
│ • Updates Mongo │
│ • Logs changes  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB Atlas   │
│ (Cloud)         │
│                 │
│  community      │◄─── Node.js API reads here
│  (synced)       │
└─────────────────┘
```

### 3. Sync Behavior
- **New vendors:** Added to MongoDB
- **Updated vendors:** MongoDB updated with MySQL data
- **Deleted vendors:** Currently NOT deleted (safety)
- **Schedules:** Preserved in MongoDB (not overwritten)
- **Interview codes:** Synced from MySQL

## Testing

### 1. Test MongoDB Access (Local)
```bash
node test-vendor-collection.js
```

Expected output:
```
✅ MongoDB Connected
📋 Collection Name: community
📊 Total Vendors: 88
```

### 2. Test MySQL Connection (Production Server Only)
```bash
node analyze-mysql-structure.js
```

### 3. Test Sync (Production Server Only)
```bash
node sync-mysql-to-mongodb.js
```

Expected output:
```
🔄 MySQL → MongoDB Sync Started
📊 Starting Vendor Sync...
   Found 88 vendors in MySQL
   ✅ Updated: Vendor Name
   ...
✅ Vendor sync completed: 88 synced, 0 failed
```

## Troubleshooting

### MySQL Connection Refused
**Cause:** MySQL is only accessible on production server, not from your local machine.

**Solution:** Run sync script on the production server where MySQL is running.

### MongoDB Connection Error
**Cause:** Invalid connection string or network issue.

**Solution:** 
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)

### Vendors Not Syncing
**Cause:** Field mismatch or schema validation error.

**Solution:**
- Check sync logs for specific errors
- Verify MySQL table structure matches expected fields
- Run `node analyze-mysql-structure.js` to see actual fields

### Schedules Being Overwritten
**Cause:** Sync script overwrites existing schedules.

**Fix:** Sync script already preserves existing schedules:
```javascript
schedules: existingVendor ? existingVendor.schedules : []
```

## Sync Frequency Options

### Change Sync Schedule
Edit `.env`:
```env
# Every 1 hour
SYNC_CRON_SCHEDULE=0 */1 * * *

# Every 6 hours
SYNC_CRON_SCHEDULE=0 */6 * * *

# Daily at 2 AM
SYNC_CRON_SCHEDULE=0 2 * * *

# Every 30 minutes
SYNC_CRON_SCHEDULE=*/30 * * * *
```

Then restart scheduler:
```bash
pm2 restart astro-sync
```

## Manual Sync (Anytime)

If you need to sync immediately:
```bash
node sync-mysql-to-mongodb.js
```

## Monitoring

### Check Sync Status
```bash
pm2 logs astro-sync --lines 50
```

### View Sync History
Logs are stored in:
- Console output (captured by PM2)
- Application logs (if configured)

## Security Notes

1. ✅ MySQL credentials in `.env` (not committed to git)
2. ✅ MongoDB connection string in `.env` (not committed to git)
3. ✅ Production server access required for MySQL
4. ⚠️ Consider MongoDB Atlas IP whitelist for additional security

## Next Steps

1. **Deploy sync to production server:**
   - Copy `Astrovaani_BE` folder to server
   - Install dependencies: `npm install`
   - Configure `.env` with production MySQL host
   - Start scheduler: `pm2 start scheduler.js`

2. **Test end-to-end:**
   - Add a test vendor in MySQL (via PHP app)
   - Wait 3 hours (or run manual sync)
   - Verify vendor appears in MongoDB
   - Verify vendor appears in admin panel

3. **Monitor sync:**
   - Check PM2 logs regularly
   - Set up alerts for sync failures
   - Verify data consistency weekly

## FAQ

### Q: Can I run sync from my local machine?
**A:** No, MySQL is only accessible on the production server. You must run sync on the server where MySQL is hosted.

### Q: Will sync delete vendors from MongoDB?
**A:** No, currently sync only adds/updates vendors. Deletions must be done manually for safety.

### Q: What happens if MySQL and MongoDB data conflict?
**A:** MySQL is the source of truth. Sync overwrites MongoDB data (except schedules which are preserved).

### Q: Can I disable auto-sync?
**A:** Yes, stop the scheduler:
```bash
pm2 stop astro-sync
pm2 delete astro-sync
```

### Q: How do I know sync is working?
**A:** Check PM2 logs:
```bash
pm2 logs astro-sync
```
Look for "✅ Vendor sync completed" messages.

---

## Quick Reference

### Start Sync Scheduler
```bash
pm2 start scheduler.js --name astro-sync
pm2 save
```

### Stop Sync Scheduler
```bash
pm2 stop astro-sync
```

### Manual Sync Now
```bash
node sync-mysql-to-mongodb.js
```

### View Logs
```bash
pm2 logs astro-sync
```

### Test Access
```bash
node test-vendor-collection.js
```

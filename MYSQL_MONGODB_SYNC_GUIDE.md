# 🔄 MySQL → MongoDB Auto-Sync System

## 📋 Overview

This system automatically syncs data from your **MySQL database** (used by PHP backend) to **MongoDB** (used by Node.js backend) every 3 hours.

---

## 🎯 What It Does

### ✅ **Syncs:**
1. **Vendors** (from `community` table → `vendors` collection)
2. **Blogs** (from `blogs` table → `blogs` collection)

### 🔄 **Sync Logic:**
- **Creates** new records if they don't exist in MongoDB
- **Updates** existing records with latest data from MySQL
- **Preserves** MongoDB-specific data (like `schedules` for vendors)
- **Runs automatically** every 3 hours

---

## 📁 Files Created

```
Astrovaani_BE/
├── sync-mysql-to-mongodb.js     # Main sync script
├── scheduler.js                  # Cron job scheduler
└── .env                          # MySQL credentials added
```

---

## 🔧 Setup Instructions

### 1️⃣ **Install Dependencies**

```bash
cd e:/Astrovaani/Astrovaani_BE
npm install mysql2 node-cron cron-parser
```

### 2️⃣ **Configure Environment Variables**

Already added to `.env`:
```env
# MySQL Database (for syncing from PHP production DB)
MYSQL_HOST=localhost
MYSQL_USER=astr_astrovaani
MYSQL_PASSWORD=Astrovaani@123
MYSQL_DATABASE=astr_astrovaani

# Sync scheduler settings
SYNC_CRON_SCHEDULE=0 */3 * * *   # Every 3 hours
SYNC_ON_STARTUP=false             # Don't run on startup
```

### 3️⃣ **Test Manual Sync**

```bash
# Run sync once manually
npm run sync
```

**Expected Output:**
```
🔄 Starting MySQL → MongoDB Sync
⏰ Start Time: 2025-11-13T10:00:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔌 Connecting to MySQL...
✅ MySQL connected
🔌 Connecting to MongoDB...
✅ MongoDB connected

📊 Starting Vendor Sync...
   Found 45 vendors in MySQL
   ✅ Updated: John Doe (john@example.com)
   ➕ Created: Jane Smith (jane@example.com)
   ...
✅ Vendor sync completed: 45 synced, 0 failed

📝 Starting Blog Sync...
   Found 23 blogs in MySQL
   ✅ Updated: Astrology Tips for 2025
   ➕ Created: Understanding Vedic Charts
   ...
✅ Blog sync completed: 23 synced, 0 failed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Sync Completed Successfully!
⏰ End Time: 2025-11-13T10:00:45.000Z
⏱️  Duration: 45.23 seconds

📊 Summary:
   Vendors: 45 synced, 0 failed
   Blogs: 23 synced, 0 failed

👋 Database connections closed
✅ Script completed
```

### 4️⃣ **Start Auto-Sync Scheduler**

```bash
# Run scheduler in background
npm run scheduler
```

**Or using PM2 (recommended for production):**
```bash
pm2 start scheduler.js --name mysql-sync
pm2 save
```

---

## ⏰ Sync Schedule

### Default Schedule: **Every 3 Hours**

Runs at:
- 00:00 (midnight)
- 03:00
- 06:00
- 09:00
- 12:00
- 15:00
- 18:00
- 21:00

### 🔧 Custom Schedule

Change in `.env`:
```env
# Every hour
SYNC_CRON_SCHEDULE=0 * * * *

# Every 6 hours
SYNC_CRON_SCHEDULE=0 */6 * * *

# Every day at midnight
SYNC_CRON_SCHEDULE=0 0 * * *

# Every 30 minutes
SYNC_CRON_SCHEDULE=*/30 * * * *
```

---

## 🗺️ Data Mapping

### **Vendors (community → vendors)**

| MySQL (`community`) | MongoDB (`vendors`) |
|---------------------|---------------------|
| id | _id (auto) |
| name | name |
| email | email |
| password | password |
| phone | phone |
| whatsapp | whatsapp |
| address | address |
| city | city |
| state | state |
| pincode | pincode |
| photo | photo |
| photo2, photo3, etc | photo2, photo3, etc |
| category | category |
| skills (CSV) | skills (array) |
| experience | experience |
| qualification | qualification |
| language (CSV) | language (array) |
| priceperminute | priceperminute |
| rating | rating |
| reviews | reviews |
| status | status |
| joindate | joindate |
| approved | approved |
| rejected | rejected |
| description | description |
| availability | availability |
| interviewerid | interviewerid |
| interviewcode | interviewcode |
| N/A | **schedules** (preserved!) |

### **Blogs (blogs → blogs)**

| MySQL (`blogs`) | MongoDB (`blogs`) |
|-----------------|-------------------|
| id | _id (auto) |
| title | title |
| slug | slug |
| content | content |
| excerpt | excerpt |
| author | author |
| category | category |
| tags (CSV) | tags (array) |
| featured_image | featuredImage |
| status | status |
| views | views |
| published_at | publishedAt |
| created_at | createdAt |
| updated_at | updatedAt |

---

## 🚀 Deployment Options

### **Option 1: Run on Local Server** (Recommended if MySQL is localhost)

```bash
# Start scheduler
npm run scheduler

# Or with PM2
pm2 start scheduler.js --name mysql-sync
pm2 logs mysql-sync
```

### **Option 2: Run on Render.com**

**Note:** Requires MySQL to be accessible from internet

1. Add environment variables on Render
2. Add to `render.yaml`:
```yaml
services:
  - type: worker
    name: mysql-sync-scheduler
    env: node
    buildCommand: npm install
    startCommand: npm run scheduler
```

### **Option 3: Run as Separate Service**

Deploy scheduler as standalone service that only runs sync jobs.

---

## 🛠️ Commands

```bash
# Manual sync (one-time)
npm run sync

# Start auto-sync scheduler
npm run scheduler

# With PM2
pm2 start scheduler.js --name mysql-sync
pm2 stop mysql-sync
pm2 restart mysql-sync
pm2 logs mysql-sync
pm2 delete mysql-sync
```

---

## 📊 Monitoring

### **Check Logs:**
```bash
# If using npm
# (Check terminal output)

# If using PM2
pm2 logs mysql-sync
pm2 logs mysql-sync --lines 100
```

### **Check Sync Status:**
The scheduler logs:
- ✅ Each successful sync
- ❌ Any failures
- 📊 Summary stats
- ⏰ Timestamps

---

## ⚠️ Important Notes

### **1. MySQL Connection**
- MySQL must be accessible from where Node.js runs
- If MySQL is `localhost`, run scheduler on same server
- If MySQL is remote, ensure firewall allows connection

### **2. Data Preservation**
- **Schedules are preserved!** MongoDB vendor schedules won't be overwritten
- Existing MongoDB data is updated, not deleted
- Only fields from MySQL are synced

### **3. Performance**
- Sync takes ~30-60 seconds for typical database
- Runs during low-traffic hours by default
- Uses connection pooling for efficiency

### **4. Error Handling**
- Failed records are logged but don't stop sync
- Summary shows success/failure counts
- Database connections auto-close on error

---

## 🐛 Troubleshooting

### **Issue: MySQL Connection Failed**
```
❌ Database connection error: connect ECONNREFUSED
```

**Solution:**
1. Check MySQL is running: `mysql -u astr_astrovaani -p`
2. Verify credentials in `.env`
3. Check firewall/port 3306 access

### **Issue: MongoDB Connection Failed**
```
❌ MongoDB connection error
```

**Solution:**
1. Verify `MONGODB_URI` in `.env`
2. Check MongoDB Atlas whitelist (add 0.0.0.0/0 for testing)
3. Verify network connectivity

### **Issue: Sync Running But No Data**
```
Found 0 vendors in MySQL
```

**Solution:**
1. Verify table names (`community`, `blogs`)
2. Check MySQL database name
3. Run query manually: `SELECT COUNT(*) FROM community;`

---

## 🎯 Production Checklist

- [ ] MySQL credentials configured
- [ ] MongoDB URI configured
- [ ] Dependencies installed (`mysql2`, `node-cron`, `cron-parser`)
- [ ] Test manual sync: `npm run sync`
- [ ] Verify data synced correctly in MongoDB
- [ ] Start scheduler: `pm2 start scheduler.js --name mysql-sync`
- [ ] Check logs: `pm2 logs mysql-sync`
- [ ] Set up monitoring alerts
- [ ] Document sync schedule for team

---

## 📈 Future Enhancements

- [ ] Add support for more tables (bookings, payments, etc.)
- [ ] Bi-directional sync (MongoDB → MySQL)
- [ ] Conflict resolution strategies
- [ ] Webhook notifications on sync completion
- [ ] Dashboard for sync monitoring
- [ ] Incremental sync (only changed records)

---

## 🔒 Security

- **Never commit `.env` file** (already in `.gitignore`)
- **Use strong MySQL passwords**
- **Limit MySQL user permissions** (SELECT only if possible)
- **Use SSL for MySQL connections** (production)
- **Encrypt MongoDB connection string**

---

## 📞 Support

**Issues?** Check:
1. Database connectivity
2. Credentials in `.env`
3. Firewall rules
4. Logs: `pm2 logs mysql-sync`

---

## ✅ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Test sync
npm run sync

# 3. Start scheduler
npm run scheduler

# 4. Monitor
# Watch terminal for logs every 3 hours
```

**That's it! Your databases will stay in sync automatically!** 🎉

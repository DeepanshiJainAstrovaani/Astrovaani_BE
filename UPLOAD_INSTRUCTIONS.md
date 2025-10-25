# 📁 Files to Upload to CyberPanel

## Upload Location: `/home/astrovaani.com/public_html/backend/`

### ✅ Essential Files (Upload These):

1. **server.js** - Main application file
2. **package.json** - Dependencies list
3. **.env** - Environment variables (database config)
4. **test-db-connection.js** - Database connection tester

### ✅ Directories to Upload:

1. **config/** - Database configuration
   - `db.js`

2. **controllers/** - API logic (8 files)
   - `authController.js`
   - `blogController.js`
   - `bookingController.js`
   - `contactController.js`
   - `horoscopeController.js`
   - `horoscopeDetailsController.js`
   - `paymentController.js`
   - `vendorController.js`

3. **models/** - Database models (6 files)
   - `authModel.js`
   - `blogModel.js`
   - `bookingModel.js`
   - `contactModel.js`
   - `horoscopeModel.js`
   - `vendorModel.js`

4. **routes/** - API routes (7 files)
   - `authRoutes.js`
   - `blogRoutes.js`
   - `bookingRoutes.js`
   - `contactRoutes.js`
   - `horoscopeRoutes.js`
   - `paymentRoutes.js`
   - `vendorRoutes.js`

5. **middleware/** - Authentication middleware (1 file)
   - `authMiddleware.js`

6. **utils/** - Helper functions (1 file)
   - `zodiacUtils.js`

### ✅ Optional Files:
- **ecosystem.config.js** - PM2 configuration

---

## 📋 Upload Instructions:

### Method 1: CyberPanel File Manager (Recommended)
1. **Login to CyberPanel**: `https://your-server-ip:8090`
2. **Go to File Manager**
3. **Navigate to**: `/home/astrovaani.com/public_html/`
4. **Create folder**: `backend`
5. **Upload all files and folders** to the `backend` directory

### Method 2: SFTP/FileZilla
1. **Connect via SFTP** to your server
2. **Navigate to**: `/home/astrovaani.com/public_html/`
3. **Create folder**: `backend`
4. **Upload all files and folders**

---

## 🔧 After Upload Commands:

### 1. Install Dependencies:
```bash
cd /home/astrovaani.com/public_html/backend
npm install
```

### 2. Test Database Connection:
```bash
node test-db-connection.js
```

### 3. Start Application:
```bash
# Test run
node server.js

# Production with PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 🎯 Your Current Status:
- ✅ **Database**: Ready to import (`astr_astrovaani2`)
- ✅ **Files**: Ready for upload (all essential files present)
- ✅ **Configuration**: `.env` file configured correctly

## 🚀 Next Action:
**Start with STEP 1**: Export your local database from phpMyAdmin

# AstroVaani Backend API

## Quick Deployment Guide

### 1. Prepare MySQL Database on Railway

Visit https://railway.app and create a new MySQL project.

Export your local database from phpMyAdmin or DBeaver.

Clean SQL file:
- Remove LOCK TABLES, UNLOCK TABLES, SHOW WARNINGS, and SET statements.
- Ensure ENGINE=InnoDB is used (not TYPE=InnoDB).
- Avoid TEXT or LONGTEXT columns as UNIQUE KEY without a defined length.

Import SQL using DBeaver or CLI:
```bash
mysql -h yourhost -P port -u root -p railway < yourfile.sql
```

### 2. Deploy Backend to Railwaytabase on Railway

Visit https://railway.app and create a new MySQL project.

Export your local database from phpMyAdmin or DBeaver.

Clean SQL file:

Remove LOCK TABLES, UNLOCK TABLES, SHOW WARNINGS, and SET statements.

Ensure ENGINE=InnoDB is used (not TYPE=InnoDB).

Avoid TEXT or LONGTEXT columns as UNIQUE KEY without a defined length.

Import SQL using DBeaver or CLI:

mysql -h yourhost -P port -u root -p railway < yourfile.sql

2. Connect Backend to Railway MySQL

In .env:

MYSQL_HOST=turntable.proxy.rlwy.net
MYSQL_PORT=52416
MYSQL_DATABASE=railway
MYSQL_USER=root
MYSQL_PASSWORD=your_password

3. Deploy Node.js Backend on Render

Go to https://render.com and create a new web service.

Connect GitHub repo or upload code.

Set Start Command: node server.js

Set environment variables:

MYSQL_HOST

MYSQL_PORT

MYSQL_USER

MYSQL_PASSWORD

MYSQL_DATABASE

## ✅ SUCCESSFULLY DEPLOYED ON CYBERPANEL

The deployed backend URL is:

**http://api.astrovaani.com:5000**

### Available API Endpoints:
- `http://api.astrovaani.com:5000/` - API Status
- `http://api.astrovaani.com:5000/api/horoscope` - Horoscope data
- `http://api.astrovaani.com:5000/api/vendors` - Vendor services
- `http://api.astrovaani.com:5000/api/contacts` - Contact management
- `http://api.astrovaani.com:5000/api/blogs` - Blog content
- `http://api.astrovaani.com:5000/api/auth` - Authentication
- `http://api.astrovaani.com:5000/api/booking` - Booking system
- `http://api.astrovaani.com:5000/api/payment` - Payment processing

### Server Details:
- **Server**: CyberPanel/AlmaLinux
- **Process Manager**: PM2
- **Database**: MySQL (Connected ✅)
- **SSL**: Available
- **External Access**: Working ✅

### For Mobile App Integration:
```javascript
const API_BASE_URL = 'http://api.astrovaani.com:5000';
```

### Server Management Commands:
```bash
# Access server
cd /home/api.astrovaani.com/public_html/Astrovaani_BE/

# Check PM2 status
pm2 status

# View logs
pm2 logs

# Restart API
pm2 restart astrovaani-backend
```
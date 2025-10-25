# 🚀 Complete CyberPanel Deployment Checklist

## Current Situation:
- ✅ **Local Database**: `astr_astrovaani` (has your data)
- ✅ **CyberPanel Database**: `astr_astrovaani2` (empty, ready for import)
- ✅ **Database User**: `astr_astrovaani_user` / `astr_astrovaani_user`

---

## STEP 1: Export Local Database
1. Open your **local phpMyAdmin**
2. Select database: `astr_astrovaani`
3. Click "Export" → "Quick" → "SQL" → "Go"
4. Save file as: `astr_astrovaani_export.sql`

---

## STEP 2: Import to CyberPanel
1. **CyberPanel phpMyAdmin**: Login with `astr_astrovaani_user`/`astr_astrovaani_user`
2. Select database: `astr_astrovaani2`
3. Click "Import" → Choose `astr_astrovaani_export.sql` → "Go"
4. ✅ Verify tables are imported

---

## STEP 3: Upload Files to CyberPanel

### Files to Upload to `/home/astrovaani.com/public_html/backend/`:

**Essential Files:**
- ✅ `server.js`
- ✅ `package.json`
- ✅ `.env` (already configured correctly)
- ✅ `test-db-connection.js`

**Folders to Upload:**
- ✅ `config/` (database connection)
- ✅ `controllers/` (API logic)
- ✅ `models/` (database models)
- ✅ `routes/` (API routes)
- ✅ `middleware/` (authentication, etc.)
- ✅ `utils/` (helper functions)

**Optional Files:**
- ✅ `ecosystem.config.js` (PM2 configuration)

---

## STEP 4: Install Dependencies on Server
```bash
cd /home/astrovaani.com/public_html/backend
npm install
```

---

## STEP 5: Test Database Connection
```bash
node test-db-connection.js
```
**Expected Output:**
- ✅ Connected to MySQL database successfully!
- ✅ Check Tables: X tables found
- ✅ Count Vendors: X records

---

## STEP 6: Start Application
```bash
# Option A: Simple start (for testing)
node server.js

# Option B: Production with PM2
npm install -g pm2
pm2 start server.js --name "astrovaani-backend"
pm2 save
pm2 startup
```

---

## STEP 7: Configure Reverse Proxy

**In CyberPanel:**
1. Go to "Websites" → "List Websites" → "astrovaani.com"
2. Click "Rewrite Rules" or "vHost Conf"
3. Add this configuration:

```nginx
location /api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## STEP 8: Test API Endpoints

```bash
# Test from server terminal
curl http://localhost:5000/api/
curl http://localhost:5000/api/vendors

# Test from outside (after reverse proxy)
curl https://astrovaani.com/api/
curl https://astrovaani.com/api/vendors
```

---

## STEP 9: Update Frontend API URL

**In your React Native app (`Astrovaani_FE/api.ts`):**
```typescript
// Replace this:
export const BASE_URL = `http://192.168.1.4:5000/api`;

// With this:
export const BASE_URL = `https://astrovaani.com/api`;
```

---

## Troubleshooting

### Database Connection Issues:
```bash
# Check MySQL service
systemctl status mysql

# Test connection manually
mysql -u astr_astrovaani_user -p astr_astrovaani2
```

### Application Issues:
```bash
# Check if port is in use
netstat -tlnp | grep :5000

# Check PM2 status
pm2 status
pm2 logs astrovaani-backend
```

### Permission Issues:
```bash
# Fix file permissions
chmod -R 755 /home/astrovaani.com/public_html/backend
chown -R astrovaani:astrovaani /home/astrovaani.com/public_html/backend
```

---

## Final Verification Checklist

- [ ] Database exported from local
- [ ] Database imported to CyberPanel
- [ ] All files uploaded to server
- [ ] Dependencies installed (`npm install`)
- [ ] Database connection test passed
- [ ] Application started successfully
- [ ] Reverse proxy configured
- [ ] API endpoints responding
- [ ] Frontend API URL updated
- [ ] SSL certificate configured (optional)

---

## Your Database Configuration (Confirmed):
```env
DB_HOST=localhost
DB_USER=astr_astrovaani_user
DB_PASSWORD=astr_astrovaani_user
DB_NAME=astr_astrovaani2
DB_PORT=3306
```

---

## Expected Final URLs:
- **API Base**: `https://astrovaani.com/api/`
- **Vendors**: `https://astrovaani.com/api/vendors`
- **Blogs**: `https://astrovaani.com/api/blogs`
- **Horoscope**: `https://astrovaani.com/api/horoscope/aries`

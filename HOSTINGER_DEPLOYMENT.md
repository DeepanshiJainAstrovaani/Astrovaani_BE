# Astrovaani Backend - Hostinger VPS Deployment Guide

## Prerequisites
1. Hostinger VPS with Ubuntu/Debian
2. Domain or subdomain pointed to your VPS IP
3. SSH access to your VPS

## Step-by-Step Deployment

### 1. Connect to Your Hostinger VPS
```bash
ssh root@your-server-ip
```

### 2. Create Application Directory
```bash
mkdir -p /var/www/astrovaani-backend
cd /var/www/astrovaani-backend
```

### 3. Upload Your Code
You can use one of these methods:

#### Option A: Using Git (Recommended)
```bash
git clone https://your-repository-url.git .
```

#### Option B: Using SCP from your local machine
```bash
# Run this from your local machine (in the Astrovaani_BE directory)
scp -r . root@your-server-ip:/var/www/astrovaani-backend/
```

#### Option C: Using FileZilla or similar FTP client
- Connect to your server using SFTP
- Upload all files to `/var/www/astrovaani-backend/`

### 4. Run the Deployment Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. Configure Environment Variables
```bash
nano .env
```
Update the following variables with your actual values:
- `DB_HOST`: Your MySQL host (usually localhost)
- `DB_USER`: Your MySQL username
- `DB_PASSWORD`: Your MySQL password
- `DB_NAME`: Your database name
- `RAZORPAY_KEY_ID`: Your Razorpay key
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret
- `TWILIO_*`: Your Twilio credentials

### 6. Set Up MySQL Database
```bash
sudo mysql -u root -p
```

Create database and user:
```sql
CREATE DATABASE astrovaani_db;
CREATE USER 'astrovaani_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON astrovaani_db.* TO 'astrovaani_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 7. Import Your Database Schema
If you have an SQL dump file:
```bash
mysql -u astrovaani_user -p astrovaani_db < your_database_dump.sql
```

### 8. Configure Nginx (Reverse Proxy)
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/astrovaani-backend
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com; # Replace with your domain
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/astrovaani-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Set Up SSL Certificate (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 10. Start Your Application
```bash
cd /var/www/astrovaani-backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Useful PM2 Commands
- `pm2 status` - Check application status
- `pm2 logs astrovaani-backend` - View logs
- `pm2 restart astrovaani-backend` - Restart application
- `pm2 stop astrovaani-backend` - Stop application
- `pm2 delete astrovaani-backend` - Delete application from PM2

## Firewall Configuration
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Testing Your Deployment
Once deployed, your API will be available at:
- HTTP: `http://your-domain.com/api/`
- HTTPS: `https://your-domain.com/api/` (if SSL is configured)

Test endpoints:
- `GET http://your-domain.com/api/vendors` - Should return vendors list
- `GET http://your-domain.com/api/blogs` - Should return blogs list

## Updating Your Application
When you need to update your code:
```bash
cd /var/www/astrovaani-backend
git pull origin main  # if using git
npm install  # if new dependencies were added
pm2 restart astrovaani-backend
```

## Troubleshooting
1. **Check PM2 logs**: `pm2 logs astrovaani-backend`
2. **Check Nginx logs**: `sudo tail -f /var/log/nginx/error.log`
3. **Check if port 5000 is running**: `netstat -tlnp | grep :5000`
4. **Check database connection**: Test your database credentials

## Update Frontend API URL
Once your backend is deployed, update your frontend API configuration to point to your new backend URL:
- In your React Native app, update the API base URL to `https://your-domain.com/api/`

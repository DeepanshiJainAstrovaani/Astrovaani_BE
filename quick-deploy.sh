#!/bin/bash

# Quick deployment script for Hostinger
# Make sure to run this script as root or with sudo privileges

echo "=== Astrovaani Backend Deployment Script ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root or with sudo"
  exit 1
fi

# Variables (you can modify these)
APP_DIR="/var/www/astrovaani-backend"
APP_USER="www-data"
DB_NAME="astrovaani_db"
DOMAIN_NAME="your-domain.com"  # Change this to your actual domain

echo "Starting deployment process..."

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2
echo "Installing PM2..."
npm install -g pm2

# Install MySQL
echo "Installing MySQL..."
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Create logs directory
mkdir -p $APP_DIR/logs
chown -R $APP_USER:$APP_USER $APP_DIR

# Navigate to app directory
cd $APP_DIR

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install --production

# Set up environment file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file with your database credentials!"
fi

# Set up database
echo "Setting up MySQL database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
echo "Database created. Please run the database_setup.sql file manually:"
echo "mysql -u root -p $DB_NAME < database_setup.sql"

# Configure firewall
echo "Configuring firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Start the application
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo ""
echo "=== Deployment Complete! ==="
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano $APP_DIR/.env"
echo "2. Import database: mysql -u root -p $DB_NAME < $APP_DIR/database_setup.sql"
echo "3. Configure your domain to point to this server"
echo "4. Optional: Set up SSL with certbot"
echo ""
echo "Your API should be available at: http://$DOMAIN_NAME/api/"
echo ""
echo "Useful commands:"
echo "- Check status: pm2 status"
echo "- View logs: pm2 logs astrovaani-backend"
echo "- Restart app: pm2 restart astrovaani-backend"

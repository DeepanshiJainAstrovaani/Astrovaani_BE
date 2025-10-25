#!/bin/bash

# Deployment script for Hostinger VPS
echo "Starting deployment to Hostinger VPS..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (if not already installed)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install MySQL (if not already installed)
if ! command -v mysql &> /dev/null; then
    echo "Installing MySQL..."
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
fi

# Navigate to application directory
cd /var/www/astrovaani-backend

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit .env file with your actual credentials"
fi

# Start application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "Deployment completed!"
echo "Your backend should be running on port 5000"
echo "Don't forget to:"
echo "1. Configure your .env file with actual credentials"
echo "2. Set up your MySQL database"
echo "3. Configure your domain/subdomain to point to your server"
echo "4. Set up SSL certificate (recommended)"

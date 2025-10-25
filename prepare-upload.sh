#!/bin/bash

# CyberPanel Upload Helper Script
# This script helps you identify and organize files for upload

echo "=== AstroVaani Backend Files for CyberPanel Upload ==="
echo ""

# Create a deployment directory
mkdir -p deployment_package

echo "📁 Essential Files to Upload:"
echo ""

# Core files
if [ -f "server.js" ]; then
    cp server.js deployment_package/
    echo "✅ server.js"
else
    echo "❌ server.js (MISSING - REQUIRED)"
fi

if [ -f "package.json" ]; then
    cp package.json deployment_package/
    echo "✅ package.json"
else
    echo "❌ package.json (MISSING - REQUIRED)"
fi

if [ -f ".env" ]; then
    cp .env deployment_package/
    echo "✅ .env"
else
    echo "❌ .env (MISSING - REQUIRED)"
fi

if [ -f "test-db-connection.js" ]; then
    cp test-db-connection.js deployment_package/
    echo "✅ test-db-connection.js"
fi

if [ -f "ecosystem.config.js" ]; then
    cp ecosystem.config.js deployment_package/
    echo "✅ ecosystem.config.js"
fi

echo ""
echo "📁 Directories to Upload:"

# Core directories
for dir in config controllers models routes middleware utils; do
    if [ -d "$dir" ]; then
        cp -r "$dir" deployment_package/
        echo "✅ $dir/ ($(ls $dir | wc -l) files)"
    else
        echo "❌ $dir/ (MISSING)"
    fi
done

echo ""
echo "📦 Deployment package created in: ./deployment_package/"
echo ""
echo "🔍 Files ready for upload:"
ls -la deployment_package/
echo ""
echo "📋 Next Steps:"
echo "1. Zip the deployment_package folder"
echo "2. Upload to CyberPanel File Manager"
echo "3. Extract to: /home/astrovaani.com/public_html/backend/"

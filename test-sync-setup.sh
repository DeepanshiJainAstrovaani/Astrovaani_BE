#!/bin/bash

echo "=================================="
echo "🔄 MySQL → MongoDB Sync Test"
echo "=================================="
echo ""

# Check if we're on the production server (MySQL accessible)
echo "📋 Step 1: Testing MySQL Connection..."
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    
    const [result] = await conn.query('SELECT COUNT(*) as count FROM community');
    console.log('✅ MySQL Connected');
    console.log('   Vendors in MySQL: ' + result[0].count);
    await conn.end();
    process.exit(0);
  } catch (error) {
    console.log('❌ MySQL Connection Failed: ' + error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 This is expected if running locally.');
      console.log('   Run this test on the production server where MySQL is hosted.');
    }
    process.exit(1);
  }
})();
"

if [ $? -eq 0 ]; then
  echo ""
  echo "📋 Step 2: Testing MongoDB Connection..."
  node test-vendor-collection.js
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "✅ All Tests Passed!"
    echo "=================================="
    echo ""
    echo "🚀 Ready to sync!"
    echo ""
    echo "Run sync manually:"
    echo "   npm run sync"
    echo ""
    echo "Or start auto-sync (every 3 hours):"
    echo "   npm run scheduler"
    echo ""
  fi
else
  echo ""
  echo "=================================="
  echo "⚠️  MySQL Not Accessible"
  echo "=================================="
  echo ""
  echo "This is normal if you're running locally."
  echo "To run sync, you need to:"
  echo ""
  echo "1. Copy files to production server:"
  echo "   scp -r Astrovaani_BE user@server:/path/to/"
  echo ""
  echo "2. On production server, run:"
  echo "   cd /path/to/Astrovaani_BE"
  echo "   npm install"
  echo "   npm run sync"
  echo ""
  echo "3. For auto-sync every 3 hours:"
  echo "   npm install -g pm2"
  echo "   pm2 start scheduler.js --name astro-sync"
  echo "   pm2 save"
  echo ""
fi

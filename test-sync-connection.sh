#!/bin/bash

echo "🧪 Testing MySQL → MongoDB Sync System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣ Checking MySQL connectivity..."
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'astr_astrovaani',
  password: process.env.MYSQL_PASSWORD || 'Astrovaani@123',
  database: process.env.MYSQL_DATABASE || 'astr_astrovaani'
};

mysql.createConnection(config)
  .then(conn => {
    console.log('   ✅ MySQL connection successful');
    return conn.query('SELECT COUNT(*) as count FROM community');
  })
  .then(([rows]) => {
    console.log('   📊 Found ' + rows[0].count + ' vendors in MySQL');
    process.exit(0);
  })
  .catch(err => {
    console.log('   ❌ MySQL connection failed:', err.message);
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
  echo ""
  echo "2️⃣ Checking MongoDB connectivity..."
  node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('   ✅ MongoDB connection successful');
  return mongoose.connection.db.collection('vendors').countDocuments();
}).then(count => {
  console.log('   📊 Found ' + count + ' vendors in MongoDB');
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.log('   ❌ MongoDB connection failed:', err.message);
  process.exit(1);
});
"
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ All connectivity tests passed!"
  echo ""
  echo "🚀 Ready to run sync!"
  echo ""
  echo "Commands:"
  echo "  npm run sync       # Run sync once"
  echo "  npm run scheduler  # Start auto-sync (every 3h)"
  echo ""
else
  echo ""
  echo "❌ Tests failed. Please check your configuration."
fi

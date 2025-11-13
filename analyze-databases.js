require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// MySQL Configuration
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'astr_astrovaani',
  password: process.env.MYSQL_PASSWORD || 'Astrovaani@123',
  database: process.env.MYSQL_DATABASE || 'astr_astrovaani'
};

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

async function analyzeDatabases() {
  let mysqlConn;
  
  try {
    console.log('🔍 Analyzing MySQL Database...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Connect to MySQL
    mysqlConn = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ MySQL Connected\n');
    
    // List all tables
    const [tables] = await mysqlConn.query('SHOW TABLES');
    console.log('📋 MySQL Tables:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    // Check if 'vendors' table exists
    const vendorsTableExists = tables.some(table => 
      Object.values(table)[0].toLowerCase() === 'vendors'
    );
    
    // Check if 'community' table exists
    const communityTableExists = tables.some(table => 
      Object.values(table)[0].toLowerCase() === 'community'
    );
    
    console.log('\n🔍 Vendor Data Location:');
    
    if (vendorsTableExists) {
      console.log('   ✅ Found "vendors" table');
      const [vendorCount] = await mysqlConn.query('SELECT COUNT(*) as count FROM vendors');
      const [vendorColumns] = await mysqlConn.query('DESCRIBE vendors');
      console.log(`   📊 Records: ${vendorCount[0].count}`);
      console.log('   📋 Columns:');
      vendorColumns.forEach(col => {
        console.log(`      - ${col.Field} (${col.Type})`);
      });
      
      // Show sample record
      const [sampleVendor] = await mysqlConn.query('SELECT * FROM vendors LIMIT 1');
      if (sampleVendor.length > 0) {
        console.log('\n   📄 Sample Record:');
        console.log('      Keys:', Object.keys(sampleVendor[0]).join(', '));
      }
    }
    
    if (communityTableExists) {
      console.log('\n   ✅ Found "community" table');
      const [communityCount] = await mysqlConn.query('SELECT COUNT(*) as count FROM community');
      const [communityColumns] = await mysqlConn.query('DESCRIBE community');
      console.log(`   📊 Records: ${communityCount[0].count}`);
      console.log('   📋 Columns:');
      communityColumns.forEach(col => {
        console.log(`      - ${col.Field} (${col.Type})`);
      });
      
      // Show sample record
      const [sampleCommunity] = await mysqlConn.query('SELECT * FROM community LIMIT 1');
      if (sampleCommunity.length > 0) {
        console.log('\n   📄 Sample Record:');
        console.log('      Keys:', Object.keys(sampleCommunity[0]).join(', '));
      }
    }
    
    if (!vendorsTableExists && !communityTableExists) {
      console.log('   ⚠️  Neither "vendors" nor "community" table found!');
      console.log('   💡 Please check which table contains vendor data');
    }
    
    // Check for blogs table
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const blogsTableExists = tables.some(table => 
      Object.values(table)[0].toLowerCase() === 'blogs'
    );
    
    if (blogsTableExists) {
      console.log('✅ Found "blogs" table');
      const [blogsCount] = await mysqlConn.query('SELECT COUNT(*) as count FROM blogs');
      const [blogsColumns] = await mysqlConn.query('DESCRIBE blogs');
      console.log(`📊 Records: ${blogsCount[0].count}`);
      console.log('📋 Columns:');
      blogsColumns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });
    } else {
      console.log('⚠️  "blogs" table not found');
    }
    
    await mysqlConn.end();
    
    // Now check MongoDB
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 Analyzing MongoDB Database...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected\n');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 MongoDB Collections:');
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });
    
    // Check vendors collection
    const vendorsCollection = collections.find(col => col.name === 'vendors');
    if (vendorsCollection) {
      console.log('\n✅ Found "vendors" collection');
      const count = await mongoose.connection.db.collection('vendors').countDocuments();
      console.log(`📊 Documents: ${count}`);
      
      // Get sample document
      const sampleDoc = await mongoose.connection.db.collection('vendors').findOne();
      if (sampleDoc) {
        console.log('📋 Fields:');
        Object.keys(sampleDoc).forEach(key => {
          const value = sampleDoc[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`   - ${key} (${type})`);
        });
      }
    } else {
      console.log('\n⚠️  "vendors" collection not found in MongoDB');
    }
    
    // Check blogs collection
    const blogsCollection = collections.find(col => col.name === 'blogs');
    if (blogsCollection) {
      console.log('\n✅ Found "blogs" collection');
      const count = await mongoose.connection.db.collection('blogs').countDocuments();
      console.log(`📊 Documents: ${count}`);
      
      // Get sample document
      const sampleDoc = await mongoose.connection.db.collection('blogs').findOne();
      if (sampleDoc) {
        console.log('📋 Fields:');
        Object.keys(sampleDoc).forEach(key => {
          const value = sampleDoc[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`   - ${key} (${type})`);
        });
      }
    } else {
      console.log('\n⚠️  "blogs" collection not found in MongoDB');
    }
    
    await mongoose.connection.close();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Analysis Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Recommendations
    console.log('💡 Recommendations:');
    if (communityTableExists && !vendorsTableExists) {
      console.log('   → Sync from MySQL "community" table → MongoDB "vendors" collection');
    } else if (vendorsTableExists) {
      console.log('   → Sync from MySQL "vendors" table → MongoDB "vendors" collection');
    }
    
    if (blogsTableExists) {
      console.log('   → Sync from MySQL "blogs" table → MongoDB "blogs" collection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    if (mongoose.connection) await mongoose.connection.close();
  }
}

analyzeDatabases()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

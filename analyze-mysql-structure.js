require('dotenv').config();
const mysql = require('mysql2/promise');

async function analyzeMySQLStructure() {
  let connection;
  try {
    console.log('🔍 Analyzing MySQL Database Structure...\n');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    
    console.log('✅ MySQL Connected\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Available Tables:');
    tables.forEach((table, i) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${i + 1}. ${tableName}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Analyze vendors table
    console.log('📊 VENDORS TABLE ANALYSIS\n');
    
    const [vendorsCount] = await connection.query('SELECT COUNT(*) as count FROM vendors');
    console.log(`   Total Vendors: ${vendorsCount[0].count}`);
    
    const [vendorsColumns] = await connection.query('DESCRIBE vendors');
    console.log('\n   Columns:');
    vendorsColumns.forEach((col, i) => {
      console.log(`      ${i + 1}. ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    const [vendorsSample] = await connection.query('SELECT * FROM vendors LIMIT 2');
    console.log('\n   Sample Data (first 2 rows):');
    if (vendorsSample.length > 0) {
      console.log(JSON.stringify(vendorsSample, null, 2));
    } else {
      console.log('      (No data)');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Analyze community table
    console.log('📊 COMMUNITY TABLE ANALYSIS\n');
    
    const [communityCount] = await connection.query('SELECT COUNT(*) as count FROM community');
    console.log(`   Total Community Records: ${communityCount[0].count}`);
    
    const [communityColumns] = await connection.query('DESCRIBE community');
    console.log('\n   Columns:');
    communityColumns.forEach((col, i) => {
      console.log(`      ${i + 1}. ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    const [communitySample] = await connection.query('SELECT * FROM community LIMIT 2');
    console.log('\n   Sample Data (first 2 rows):');
    if (communitySample.length > 0) {
      console.log(JSON.stringify(communitySample, null, 2));
    } else {
      console.log('      (No data)');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Analyze blog table
    console.log('📊 BLOG TABLE ANALYSIS\n');
    
    const [blogCount] = await connection.query('SELECT COUNT(*) as count FROM blog');
    console.log(`   Total Blogs: ${blogCount[0].count}`);
    
    const [blogColumns] = await connection.query('DESCRIBE blog');
    console.log('\n   Columns:');
    blogColumns.forEach((col, i) => {
      console.log(`      ${i + 1}. ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    const [blogSample] = await connection.query('SELECT * FROM blog LIMIT 2');
    console.log('\n   Sample Data (first 2 rows):');
    if (blogSample.length > 0) {
      console.log(JSON.stringify(blogSample, null, 2));
    } else {
      console.log('      (No data)');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ MySQL Analysis Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection Refused:');
      console.log('   - MySQL server might not be running on localhost');
      console.log('   - Update MYSQL_HOST in .env to point to your production server');
      console.log('   - Or run this script on the server where MySQL is accessible');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Access Denied:');
      console.log('   - Check MYSQL_USER and MYSQL_PASSWORD in .env');
      console.log('   - Verify the user has access to the database');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

analyzeMySQLStructure();

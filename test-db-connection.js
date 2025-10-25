require('dotenv').config();
const mysql = require('mysql');

// Test database connection
const testConnection = () => {
  console.log('🔍 Testing database connection...\n');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
  };

  console.log('Connection Config:');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`User: ${dbConfig.user}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`Port: ${dbConfig.port}\n`);

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('❌ Connection failed:', err.message);
      console.error('Error Code:', err.code);
      process.exit(1);
    }
    
    console.log('✅ Connected to MySQL database successfully!\n');
    
    // Test queries
    const testQueries = [
      { name: 'Check Tables', query: 'SHOW TABLES' },
      { name: 'Count Vendors', query: 'SELECT COUNT(*) as count FROM community' },
      { name: 'Count Blogs', query: 'SELECT COUNT(*) as count FROM blog' },
      { name: 'Count Users', query: 'SELECT COUNT(*) as count FROM users' },
      { name: 'Check Recent Bookings', query: 'SELECT COUNT(*) as count FROM booking WHERE created_at >= CURDATE()' }
    ];

    let completedQueries = 0;
    
    testQueries.forEach((test, index) => {
      connection.query(test.query, (error, results) => {
        if (error) {
          console.log(`❌ ${test.name}: ${error.message}`);
        } else {
          if (test.name === 'Check Tables') {
            console.log(`✅ ${test.name}: ${results.length} tables found`);
            console.log('   Tables:', results.map(row => Object.values(row)[0]).join(', '));
          } else {
            console.log(`✅ ${test.name}: ${results[0].count} records`);
          }
        }
        
        completedQueries++;
        if (completedQueries === testQueries.length) {
          console.log('\n🎉 Database test completed successfully!');
          connection.end();
          process.exit(0);
        }
      });
    });
  });
};

// Run the test
testConnection();

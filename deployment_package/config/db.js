const mysql = require('mysql');
require('dotenv').config();

// Database connection configuration for CyberPanel
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

// Create connection
const db = mysql.createConnection(dbConfig);

// Handle connection errors
db.on('error', function(err) {
  console.log('Database connection error: ', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect...');
    // Reconnect logic can be added here if needed
  } else {
    throw err;
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
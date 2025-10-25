const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';

// Log configuration (but hide password)
console.log('🔧 MongoDB Configuration:');
console.log(`   URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':***@')}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  WARNING: MONGODB_URI environment variable is not set!');
      console.warn('   Using default: mongodb://localhost:27017/astrovaani');
    }
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB database');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Full error:', err);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = { connectDB, mongoose };
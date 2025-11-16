require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminAuthRoutes = require('./routes/adminAuth');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins (you can restrict to your frontend URL later)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // Allow requests from your Expo app
app.use(express.json()); // Parse JSON data in requests

// Serve uploaded images
app.use('/community', express.static(path.join(__dirname, 'community')));

// Connect to MongoDB
connectDB();

//Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin-auth', adminAuthRoutes); // Admin authentication routes

// Start the server - Listen on all network interfaces (0.0.0.0) for mobile device access
const HOST = '0.0.0.0'; // Listen on all interfaces
app.listen(port, HOST, () => {
  console.log(`🚀 Server is running at:`);
  console.log(`   Local:   http://localhost:${port}`);
  console.log(`   Network: http://192.168.1.7:${port}`);
  console.log(`   Ethernet: http://10.85.30.206:${port}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});


// Online api
app.get('/', (req, res) => {
  res.send('🧘‍♀️ AstroVaani API is running');
});
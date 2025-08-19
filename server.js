require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const db = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your Expo app
app.use(express.json()); // Parse JSON data in requests

//Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Online api
app.get('/', (req, res) => {
  res.send('🧘‍♀️ AstroVaani API is running');
});
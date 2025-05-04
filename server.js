require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const db = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const blogRoutes = require('./routes/blogRoutes');

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
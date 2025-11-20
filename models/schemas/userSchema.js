const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    select: false // Don't return OTP in queries by default
  },
  otpExpiry: {
    type: Date,
    select: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster lookups
userSchema.index({ mobile: 1 });

// Use mongoose.models to check if model already exists (prevents OverwriteModelError)
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;

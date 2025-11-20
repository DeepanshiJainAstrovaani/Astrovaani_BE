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
  },
  // Push notification device tokens
  deviceTokens: [{
    token: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web', 'expo'],
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }],
  // Notification preferences
  notificationPreferences: {
    enabled: {
      type: Boolean,
      default: true
    },
    categories: {
      daily: { type: Boolean, default: true },
      weekly: { type: Boolean, default: true },
      monthly: { type: Boolean, default: true },
      special: { type: Boolean, default: true },
      promotional: { type: Boolean, default: true }
    },
    zodiacOnly: {
      type: Boolean,
      default: false // If true, only send notifications matching user's zodiac
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster lookups
userSchema.index({ mobile: 1 });

// Use mongoose.models to check if model already exists (prevents OverwriteModelError)
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;

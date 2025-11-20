const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  tokenType: {
    type: String,
    enum: ['expo', 'fcm', 'apns'],
    default: 'expo',
    required: true
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: true
  },
  deviceInfo: {
    deviceName: String,
    osVersion: String,
    appVersion: String,
    deviceId: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
deviceTokenSchema.index({ userId: 1, isActive: 1 });
deviceTokenSchema.index({ token: 1 });

module.exports = mongoose.model('DeviceToken', deviceTokenSchema);

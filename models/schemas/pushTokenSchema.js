const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  deviceType: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: true
  },
  deviceInfo: {
    brand: String,
    model: String,
    osVersion: String,
    appVersion: String
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
pushTokenSchema.index({ userId: 1, isActive: 1 });
pushTokenSchema.index({ token: 1 });

module.exports = mongoose.model('PushToken', pushTokenSchema);

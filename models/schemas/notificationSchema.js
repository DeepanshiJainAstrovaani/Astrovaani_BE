const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  // Target audience
  targetType: {
    type: String,
    enum: ['all', 'specific', 'segment'],
    default: 'all'
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }],
  targetSegment: {
    type: String,
    enum: ['new_users', 'active_users', 'inactive_users', 'premium_users', 'all']
  },
  // Notification data
  data: {
    type: Map,
    of: String,
    default: {}
  },
  imageUrl: String,
  
  // Scheduling
  scheduledFor: Date,
  sentAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft'
  },
  
  // Delivery stats
  stats: {
    totalTargeted: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    receipts: [{
      userId: mongoose.Schema.Types.ObjectId,
      status: { type: String, enum: ['success', 'error'] },
      message: String,
      sentAt: Date
    }]
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  priority: {
    type: String,
    enum: ['default', 'normal', 'high'],
    default: 'default'
  },
  sound: {
    type: String,
    default: 'default'
  },
  badge: Number,
  
  // Click action
  clickAction: {
    type: String,
    screen: String,
    params: Map
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ createdBy: 1, createdAt: -1 });
notificationSchema.index({ targetType: 1 });

// Export as PushNotification to avoid conflict with existing Notification model
module.exports = mongoose.model('PushNotification', notificationSchema);

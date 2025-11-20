const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  type: { type: String, enum: ['whatsapp', 'email', 'other'], required: true },
  payload: { type: Object },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  providerResponse: { type: Object },
  providerDetails: { type: Array }, // Store multiple attempt details
  error: { type: mongoose.Schema.Types.Mixed }, // Allow String or Object/Array
  createdAt: { type: Date, default: Date.now }
});

// Renamed to MessageNotification to avoid conflict with PushNotification model
// Use mongoose.models to check if model already exists (prevents OverwriteModelError)
module.exports = mongoose.models.MessageNotification || mongoose.model('MessageNotification', notificationSchema);

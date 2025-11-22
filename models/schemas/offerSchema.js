const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerCode: {
    type: String,
    unique: true,
    required: true
  },
  vendor: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: false,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  offerText: {
    type: String,
    required: true
  },
  chat: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
    default: 'No'
  },
  call: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
    default: 'No'
  },
  amount: {
    type: String,
    required: true
  },
  timing: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  validFor: {
    type: String,
    required: true
  },
  applicability: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

module.exports = Offer;

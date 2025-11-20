const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerCode: {
    type: String,
    unique: true
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  chatCall: {
    type: String,
    enum: ['Chat', 'Call'],
    required: true,
    default: 'Chat'
  },
  validFor: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  timing: {
    type: String,
    required: true
  },
  promoText1: {
    type: String,
    default: ''
  },
  promoText2: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate offer code before saving
offerSchema.pre('save', async function(next) {
  if (!this.offerCode) {
    const count = await mongoose.model('Offer').countDocuments();
    const nextNum = (count + 1).toString().padStart(4, '0');
    this.offerCode = `OFF-${nextNum}`;
  }
  next();
});

// Use mongoose.models to prevent OverwriteModelError
const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

module.exports = Offer;

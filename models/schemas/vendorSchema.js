const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true,
    maxlength: 100
  },
  photo: {
    type: String,
    trim: true
  },
  // Additional photos
  photo2: { type: String, trim: true },
  photo3: { type: String, trim: true },
  photo4: { type: String, trim: true },
  photo5: { type: String, trim: true },

  // Contact & personal details
  phone: { type: String, trim: true },
  whatsapp: { type: String, trim: true },
  email: { type: String, trim: true },
  gender: { type: String, trim: true },
  age: { type: String, trim: true },

  // Location
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  pincode: { type: String, trim: true },

  // Bank details
  accountholder: { type: String, trim: true },
  accountno: { type: String, trim: true },
  ifsc: { type: String, trim: true },

  // Other commonly used fields
  about: { type: String, trim: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  skills: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  priceperminute: {
    type: Number,
    min: 0
  },
  '15minrate': {
    type: Number,
    min: 0
  },
  '25minrate': {
    type: Number,
    min: 0
  },
  '30minrate': {
    type: Number,
    min: 0
  },
  '45minrate': {
    type: Number,
    min: 0
  },
  '1hourrate': {
    type: Number,
    min: 0
  },
  '90minrate': {
    type: Number,
    min: 0
  },
  // Scheduling slots
  schedules: [
    {
      scheduledAt: { type: Date },
      duration: { type: Number },
      status: { type: String, trim: true, default: 'proposed' }, // proposed | confirmed | canceled
      meetLink: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  image_url: {
    type: String,
    trim: true
  },
  status: { type: String, trim: true },
  is_available: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Interview metadata
  interviewerid: { type: String, trim: true },
  interviewcode: { type: String, trim: true },
  onboardingstatus: { type: String, trim: true }, // New field for tracking onboarding status
  
  // Interview feedback fields
  interviewRating: { type: String, trim: true }, // Rating given during interview (1-5)
  interviewNotes: { type: String, trim: true }, // Notes from the interview
  interviewStatus: { type: String, trim: true, default: 'completed' }, // completed | no-show | rescheduled
  interviewCompletedAt: { type: Date }, // Timestamp when interview feedback was saved
  
  // Agreement fields
  agreementStatus: { type: String, trim: true }, // pending | approved | rejected
  agreementSentAt: { type: Date }, // When agreement notification was sent
  agreementRejectionReason: { type: String, trim: true }, // Reason for rejection
  agreementRejectedAt: { type: Date }, // When agreement was rejected
  agreementUploadedAt: { type: Date }, // When vendor uploaded signed agreement
  agreementApprovedAt: { type: Date }, // When admin approved the agreement

  pricingtype: {
    type: String,
    enum: ['FREE', 'PAID'],
    default: 'PAID',
    trim: true
  }
}, {
  timestamps: true,
  collection: 'community', // Use 'community' as collection name to match your MySQL table
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
vendorSchema.index({ category: 1 });
vendorSchema.index({ is_available: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema, 'community');

module.exports = Vendor;

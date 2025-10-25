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
  is_available: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
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

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Vendor ID is required']
  },
  bookingtype: {
    type: String,
    enum: ['call', 'chat', 'video'],
    default: 'call',
    trim: true
  },
  booking_date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  booking_time: {
    type: String,
    required: [true, 'Booking time is required'],
    trim: true
  },
  duration: {
    type: Number,
    min: 0,
    default: 30, // in minutes
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    min: 0
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  payment_id: {
    type: String,
    trim: true
  },
  booking_notes: {
    type: String,
    trim: true
  },
  vendor_notes: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'booking'
});

// Indexes for faster queries
bookingSchema.index({ user_id: 1 });
bookingSchema.index({ vendor_id: 1 });
bookingSchema.index({ booking_date: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

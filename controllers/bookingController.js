// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) {
      filters.status = status;
    }
    const bookings = await bookingModel.getAllBookings(filters);
    res.status(200).json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};
const bookingModel = require('../models/bookingModel');
const mongoose = require('mongoose');

exports.createBooking = async (req, res) => {
  try {
    // Get IDs from request
    const userId = req.body.userid || req.body.user_id;
    const vendorId = req.body.vendorid || req.body.vendor_id;
    
    // Validate required fields
    if (!userId || !vendorId) {
      return res.status(400).json({ error: 'Missing required fields: user_id and vendor_id' });
    }

    console.log('🔵 Booking Request - userId:', userId);
    console.log('🔵 Booking Request - vendorId:', vendorId);

    // Validate MongoDB ObjectIds
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   console.log('🔴 Booking Request - Invalid user_id:', userId);
    //   return res.status(400).json({ 
    //     error: 'Invalid user_id format', 
    //     message: `User ID "${userId}" is not valid. Please login first to get a valid user ID.` 
    //   });
    // }

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      console.log('🔴 Booking Request - Invalid vendor_id:', vendorId);
      return res.status(400).json({ 
        error: 'Invalid vendor_id format', 
        message: 'Vendor ID must be a valid MongoDB ObjectId.' 
      });
    }

    console.log('🟢 Booking Request - Valid ObjectIds');

    // Get booking time - use birthtime if booking_time not provided
    const bookingTime = req.body.booking_time || req.body.birthtime || '';
    
    if (!bookingTime) {
      return res.status(400).json({ 
        error: 'Booking time is required',
        message: 'Please provide a booking time or birth time'
      });
    }

    const bookingData = {
      user_id: userId,
      vendor_id: vendorId,
      bookingtype: req.body.bookingtype || 'call',
      booking_date: req.body.booking_date || req.body.birthdate || new Date(),
      booking_time: bookingTime,
      duration: req.body.duration,
      total_amount: req.body.price || req.body.total_amount || 0,
      status: 'pending',
      payment_status: 'pending',
      booking_notes: req.body.booking_notes || req.body.notes
    };

    const booking = await bookingModel.createBooking(bookingData);
    
    console.log('✅ Booking created successfully:', booking._id);
    
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking,
      bookingId: booking._id
    });
  } catch (error) {
    console.error('🔴 Error creating booking:', error);
    return res.status(500).json({ 
      error: 'Failed to create booking', 
      message: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid booking ID format' });
    }
    
    const booking = await bookingModel.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.status(200).json({ booking });
  } catch (error) {
    console.error('🔴 Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking', message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const filters = {};
    if (status) {
      filters.status = status;
    }
    
    const bookings = await bookingModel.getBookingsByUser(userId, filters);
    
    res.status(200).json({ 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    console.error('🔴 Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};

exports.getVendorBookings = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ error: 'Invalid vendor ID format' });
    }
    
    const filters = {};
    if (status) {
      filters.status = status;
    }
    
    const bookings = await bookingModel.getBookingsByVendor(vendorId, filters);
    
    res.status(200).json({ 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    console.error('🔴 Error fetching vendor bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, vendor_notes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid booking ID format' });
    }
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const booking = await bookingModel.updateBookingStatus(id, status);
    
    // Update vendor notes if provided
    if (vendor_notes && booking) {
      booking.vendor_notes = vendor_notes;
      await booking.save();
    }
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log(`✅ Booking ${id} status updated to: ${status}`);
    
    res.status(200).json({ 
      message: 'Booking status updated successfully',
      booking 
    });
  } catch (error) {
    console.error('🔴 Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status', message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_id } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid booking ID format' });
    }
    
    if (!payment_status) {
      return res.status(400).json({ error: 'Payment status is required' });
    }
    
    const validPaymentStatuses = ['pending', 'completed', 'failed'];
    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({ error: 'Invalid payment status value' });
    }
    
    const booking = await bookingModel.updatePaymentStatus(id, payment_status, payment_id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Auto-confirm booking if payment is completed
    if (payment_status === 'completed' && booking.status === 'pending') {
      await bookingModel.updateBookingStatus(id, 'confirmed');
      booking.status = 'confirmed';
    }
    
    console.log(`✅ Booking ${id} payment status updated to: ${payment_status}`);
    
    res.status(200).json({ 
      message: 'Payment status updated successfully',
      booking 
    });
  } catch (error) {
    console.error('🔴 Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status', message: error.message });
  }
};

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
      payment_status: 'pending'
    };

    const booking = await bookingModel.createBooking(bookingData);
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking,
      bookingId: booking._id
    });
  } catch (error) {
    console.error('Error creating booking:', error);
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

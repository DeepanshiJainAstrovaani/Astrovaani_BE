const bookingModel = require('../models/bookingModel');

exports.createBooking = async (req, res) => {
  try {
    const bookingData = {
      user_id: req.body.userid || req.body.user_id,
      vendor_id: req.body.vendorid || req.body.vendor_id,
      bookingtype: req.body.bookingtype,
      booking_date: req.body.booking_date || new Date(),
      booking_time: req.body.booking_time,
      duration: req.body.duration,
      total_amount: req.body.price || req.body.total_amount,
      status: 'pending',
      payment_status: 'pending'
    };

    if (!bookingData.user_id || !bookingData.vendor_id) {
      return res.status(400).json({ error: 'Missing required fields: user_id and vendor_id' });
    }

    const booking = await bookingModel.createBooking(bookingData);
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking', message: error.message });
  }
};

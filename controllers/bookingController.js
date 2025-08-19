const bookingModel = require('../models/bookingModel');

exports.createBooking = (req, res) => {
  const bookingData = {
    userid: req.body.userid,
    vendorid: req.body.vendorid,
    bookingtype: req.body.bookingtype,
    duration: req.body.duration,
    price: req.body.price,
    status: 'pending',
    timestamp: new Date()
  };

  if (!bookingData.userid || !bookingData.vendorid || !bookingData.bookingtype || !bookingData.duration || !bookingData.price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  bookingModel.createBooking(bookingData, (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
    res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
  });
};

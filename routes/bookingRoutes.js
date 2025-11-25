const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// POST /api/booking - Create new booking
router.post('/', bookingController.createBooking);

// GET /api/booking/:id - Get booking by ID
router.get('/:id', bookingController.getBooking);


// GET /api/booking - Get all bookings (admin)
router.get('/', bookingController.getAllBookings);

// GET /api/booking/user/:userId - Get all bookings for a user
router.get('/user/:userId', bookingController.getUserBookings);

// GET /api/booking/vendor/:vendorId - Get all bookings for a vendor
router.get('/vendor/:vendorId', bookingController.getVendorBookings);

// PATCH /api/booking/:id/status - Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// PATCH /api/booking/:id/payment - Update payment status
router.patch('/:id/payment', bookingController.updatePaymentStatus);

module.exports = router;
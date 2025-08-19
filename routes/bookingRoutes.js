const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// POST /api/booking
router.post('/', bookingController.createBooking);

module.exports = router;
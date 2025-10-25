// routes/payment.js
const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

// POST /api/payment/create-order
router.post('/create-order', paymentController.createOrder);

// POST /api/payment/verify
router.post('/verify', paymentController.verifyPayment);

module.exports = router;

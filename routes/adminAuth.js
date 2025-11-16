const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminAuth = require('../middleware/adminAuth');

// Public routes (no authentication required)
router.post('/send-otp', adminAuthController.sendOTP);
router.post('/verify-otp', adminAuthController.verifyOTP);

// Protected routes (authentication required)
router.get('/profile', adminAuth, adminAuthController.getProfile);
router.post('/logout', adminAuth, adminAuthController.logout);

module.exports = router;

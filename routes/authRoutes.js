
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// JoinUs OTP verification endpoint
router.post('/verify-otp', async (req, res) => {
	try {
		const { mobile, otp } = req.body;
		const result = await require('../models/authModel').verifyWhatsAppOTP(mobile, otp);
		if (!result.success) {
			return res.status(400).json(result);
		}
		res.json(result);
	} catch (error) {
		console.error('JoinUs OTP verification error:', error);
		return res.status(500).json({ success: false, message: 'Verification failed' });
	}
});


// Login OTP
router.post('/whatsapp/login', authController.initiateWhatsAppLogin);
router.post('/whatsapp/verify', authController.verifyWhatsAppOTP);

// JoinUs OTP (for vendor registration)
router.post('/whatsapp/joinus', async (req, res) => {
	try {
		const { mobile } = req.body;
		// Validate mobile
		if (!/^[0-9]{10}$/.test(mobile)) {
			return res.status(400).json({ success: false, message: 'Invalid mobile number' });
		}
		// Use the JoinUs OTP template
		const result = await require('../models/authModel').initiateWhatsAppLogin(mobile, 'verify_otp_joinus');
		res.json(result);
	} catch (error) {
		console.error('WhatsApp JoinUs OTP error:', error);
		return res.status(500).json({ success: false, message: 'Failed to send JoinUs OTP' });
	}
});

module.exports = router;
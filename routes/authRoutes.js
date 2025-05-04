const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/whatsapp/login', authController.initiateWhatsAppLogin);
router.post('/whatsapp/verify', authController.verifyWhatsAppOTP);

module.exports = router;
/**
 * User Routes
 * 
 * Routes for user device registration and notification preferences
 */

const express = require('express');
const router = express.Router();
const deviceTokenController = require('../controllers/deviceTokenController');

// Device token registration
router.post('/register-device', deviceTokenController.registerDevice);
router.post('/unregister-device', deviceTokenController.unregisterDevice);

// Notification preferences
router.post('/notification-preferences', deviceTokenController.updateNotificationPreferences);

// Get user devices
router.get('/:userId/devices', deviceTokenController.getUserDevices);

module.exports = router;

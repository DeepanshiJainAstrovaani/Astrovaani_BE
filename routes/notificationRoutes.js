const express = require('express');
const router = express.Router();
const multiPlatformController = require('../controllers/multiPlatformNotificationController');
const authMiddleware = require('../middleware/authMiddleware'); // Customer auth
const adminAuth = require('../middleware/adminAuth'); // Admin auth

// Customer routes (for mobile app) - Supports Expo, FCM, and APNs
router.post('/register-token', authMiddleware, multiPlatformController.registerToken);
router.post('/deactivate-token', authMiddleware, multiPlatformController.deactivateToken);

// Admin routes (for admin dashboard)
router.post('/send', adminAuth, multiPlatformController.sendNotification);
router.get('/', adminAuth, multiPlatformController.getNotifications);
router.get('/stats', adminAuth, multiPlatformController.getNotificationStats);
router.get('/:id', adminAuth, multiPlatformController.getNotificationById);
router.delete('/:id', adminAuth, multiPlatformController.deleteNotification);

module.exports = router;

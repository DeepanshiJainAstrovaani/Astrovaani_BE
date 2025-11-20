const express = require('express');
const router = express.Router();
const multiPlatformController = require('../controllers/multiPlatformNotificationController');
const { authenticateCustomer } = require('../middleware/authMiddleware'); // Customer auth
const { authenticateAdmin } = require('../middleware/adminAuthMiddleware'); // Admin auth

// Customer routes (for mobile app) - Supports Expo, FCM, and APNs
router.post('/register-token', authenticateCustomer, multiPlatformController.registerToken);
router.post('/deactivate-token', authenticateCustomer, multiPlatformController.deactivateToken);

// Admin routes (for admin dashboard)
router.post('/send', authenticateAdmin, multiPlatformController.sendNotification);
router.get('/', authenticateAdmin, multiPlatformController.getNotifications);
router.get('/stats', authenticateAdmin, multiPlatformController.getNotificationStats);
router.get('/:id', authenticateAdmin, multiPlatformController.getNotificationById);
router.delete('/:id', authenticateAdmin, multiPlatformController.deleteNotification);

module.exports = router;

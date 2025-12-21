const express = require('express');
const router = express.Router();
const multiPlatformController = require('../controllers/multiPlatformNotificationController');
const authMiddleware = require('../middleware/authMiddleware'); // Customer auth
const adminAuth = require('../middleware/adminAuth'); // Admin auth
const upload = require('../config/multerConfig'); // Multer for file uploads

// Public token registration (for mobile apps - no auth required, userId in body)
router.post('/register-device-token', multiPlatformController.registerDeviceToken);

// Customer routes (for mobile app) - Supports Expo, FCM, and APNs
router.post('/register-token', authMiddleware, multiPlatformController.registerToken);
router.post('/deactivate-token', authMiddleware, multiPlatformController.deactivateToken);

// Admin routes (for admin dashboard)
router.post('/upload-image', adminAuth, upload.single('image'), multiPlatformController.uploadNotificationImage);
router.post('/send', adminAuth, multiPlatformController.sendNotification);
router.get('/', adminAuth, multiPlatformController.getNotifications);
router.get('/stats', adminAuth, multiPlatformController.getNotificationStats);
router.get('/:id', adminAuth, multiPlatformController.getNotificationById);
router.delete('/:id', adminAuth, multiPlatformController.deleteNotification);

module.exports = router;

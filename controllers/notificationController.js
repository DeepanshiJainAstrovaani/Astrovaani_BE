const { Expo } = require('expo-server-sdk');
const DeviceToken = require('../models/schemas/deviceTokenSchema');
const Notification = require('../models/schemas/notificationSchema');
const Customer = require('../models/schemas/customerSchema');

// Create a new Expo SDK client
const expo = new Expo();

// Register/Update device token
exports.registerToken = async (req, res) => {
  try {
    const { token, platform, deviceInfo } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Validate Expo push token
    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Expo push token format' 
      });
    }

    // Check if token already exists
    let deviceToken = await DeviceToken.findOne({ token });

    if (deviceToken) {
      // Update existing token
      deviceToken.userId = userId;
      deviceToken.platform = platform;
      deviceToken.deviceInfo = deviceInfo;
      deviceToken.isActive = true;
      deviceToken.lastUsed = new Date();
      await deviceToken.save();
    } else {
      // Create new token
      deviceToken = await DeviceToken.create({
        userId,
        token,
        platform,
        deviceInfo,
        isActive: true
      });
    }

    res.json({ 
      success: true, 
      message: 'Device token registered successfully',
      data: deviceToken
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register device token',
      error: error.message 
    });
  }
};

// Deactivate device token (on logout)
exports.deactivateToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    await DeviceToken.updateOne(
      { token },
      { isActive: false }
    );

    res.json({ 
      success: true, 
      message: 'Device token deactivated successfully' 
    });
  } catch (error) {
    console.error('Error deactivating token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to deactivate token',
      error: error.message 
    });
  }
};

// Send push notification (called by admin)
exports.sendNotification = async (req, res) => {
  try {
    const { 
      title, 
      body, 
      targetType, 
      targetUsers, 
      targetSegment,
      data,
      imageUrl,
      scheduledFor,
      priority,
      sound,
      clickAction
    } = req.body;

    // Validation
    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and body are required' 
      });
    }

    // Create notification record
    const notification = await Notification.create({
      title,
      body,
      targetType: targetType || 'all',
      targetUsers: targetUsers || [],
      targetSegment,
      data: data || {},
      imageUrl,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status: scheduledFor ? 'scheduled' : 'draft',
      createdBy: req.admin?.id,
      priority: priority || 'default',
      sound: sound || 'default',
      clickAction
    });

    // If not scheduled, send immediately
    if (!scheduledFor) {
      await sendPushNotification(notification);
    }

    res.json({ 
      success: true, 
      message: scheduledFor ? 'Notification scheduled successfully' : 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification',
      error: error.message 
    });
  }
};

// Helper function to actually send push notifications
async function sendPushNotification(notification) {
  try {
    notification.status = 'sending';
    await notification.save();

    // Get target users
    let targetUserIds = [];
    
    if (notification.targetType === 'all') {
      const allUsers = await Customer.find({ isActive: true }).select('_id');
      targetUserIds = allUsers.map(u => u._id);
    } else if (notification.targetType === 'specific') {
      targetUserIds = notification.targetUsers;
    } else if (notification.targetType === 'segment') {
      // Implement segment logic based on targetSegment
      targetUserIds = await getUsersBySegment(notification.targetSegment);
    }

    // Get all active device tokens for target users
    const deviceTokens = await DeviceToken.find({
      userId: { $in: targetUserIds },
      isActive: true
    });

    if (deviceTokens.length === 0) {
      notification.status = 'sent';
      notification.stats.totalTargeted = 0;
      notification.sentAt = new Date();
      await notification.save();
      return;
    }

    // Create messages array
    const messages = deviceTokens.map(device => ({
      to: device.token,
      sound: notification.sound,
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      priority: notification.priority,
      ...(notification.badge && { badge: notification.badge }),
      ...(notification.imageUrl && { image: notification.imageUrl })
    }));

    // Split messages into chunks (Expo recommends max 100 per request)
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    // Send chunks
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }

    // Process tickets and update stats
    let successCount = 0;
    let failureCount = 0;
    const receipts = [];

    tickets.forEach((ticket, index) => {
      if (ticket.status === 'ok') {
        successCount++;
        receipts.push({
          userId: deviceTokens[index].userId,
          status: 'success',
          sentAt: new Date()
        });
      } else {
        failureCount++;
        receipts.push({
          userId: deviceTokens[index].userId,
          status: 'error',
          message: ticket.message || 'Unknown error',
          sentAt: new Date()
        });
      }
    });

    // Update notification stats
    notification.status = 'sent';
    notification.sentAt = new Date();
    notification.stats = {
      totalTargeted: deviceTokens.length,
      successCount,
      failureCount,
      receipts
    };
    await notification.save();

    console.log(`✅ Notification sent: ${successCount} success, ${failureCount} failures`);
    
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    notification.status = 'failed';
    await notification.save();
  }
}

// Helper function to get users by segment
async function getUsersBySegment(segment) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  switch (segment) {
    case 'new_users':
      const newUsers = await Customer.find({
        createdAt: { $gte: thirtyDaysAgo }
      }).select('_id');
      return newUsers.map(u => u._id);
      
    case 'active_users':
      const activeUsers = await Customer.find({
        lastLoginAt: { $gte: thirtyDaysAgo }
      }).select('_id');
      return activeUsers.map(u => u._id);
      
    case 'inactive_users':
      const inactiveUsers = await Customer.find({
        lastLoginAt: { $lt: thirtyDaysAgo }
      }).select('_id');
      return inactiveUsers.map(u => u._id);
      
    default:
      const allUsers = await Customer.find({ isActive: true }).select('_id');
      return allUsers.map(u => u._id);
  }
}

// Get all notifications (for admin)
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get notifications',
      error: error.message 
    });
  }
};

// Get notification details
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findById(id)
      .populate('createdBy', 'name email')
      .populate('targetUsers', 'name email phone');

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error getting notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get notification',
      error: error.message 
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Notification deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete notification',
      error: error.message 
    });
  }
};

// Get notification stats (for dashboard)
exports.getNotificationStats = async (req, res) => {
  try {
    const totalSent = await Notification.countDocuments({ status: 'sent' });
    const totalScheduled = await Notification.countDocuments({ status: 'scheduled' });
    const totalFailed = await Notification.countDocuments({ status: 'failed' });
    
    const recentNotifications = await Notification.find({ status: 'sent' })
      .sort({ sentAt: -1 })
      .limit(5)
      .select('title stats sentAt');

    // Calculate total delivered
    const allSent = await Notification.find({ status: 'sent' });
    const totalDelivered = allSent.reduce((sum, n) => sum + (n.stats.successCount || 0), 0);

    res.json({
      success: true,
      data: {
        totalSent,
        totalScheduled,
        totalFailed,
        totalDelivered,
        recentNotifications
      }
    });
  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get notification stats',
      error: error.message 
    });
  }
};

module.exports.sendPushNotification = sendPushNotification;

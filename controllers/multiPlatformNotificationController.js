const { Expo } = require('expo-server-sdk');
const { admin, bucket } = require('../config/firebaseConfig');
const { apnProvider } = require('../config/apnsConfig');
const apn = require('node-apn');
const DeviceToken = require('../models/schemas/deviceTokenSchema');
const PushNotification = require('../models/schemas/notificationSchema'); // Renamed to avoid conflict
const User = require('../models/schemas/userSchema'); // Changed from customerSchema to userSchema

// Create Expo SDK client
const expo = new Expo();

// Register/Update device token (supports Expo, FCM, APNs)
exports.registerToken = async (req, res) => {
  try {
    const { token, tokenType, platform, deviceInfo } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    if (!tokenType) {
      return res.status(400).json({ success: false, message: 'Token type is required (expo, fcm, or apns)' });
    }

    // Validate token based on type
    if (tokenType === 'expo' && !Expo.isExpoPushToken(token)) {
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
      deviceToken.tokenType = tokenType;
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
        tokenType,
        platform,
        deviceInfo,
        isActive: true
      });
    }

    res.json({ 
      success: true, 
      message: `${tokenType.toUpperCase()} device token registered successfully`,
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
    console.log('📬 ========== NEW NOTIFICATION REQUEST ==========');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    console.log('👤 Admin ID:', req.admin?.id || req.user?.id);
    
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
      console.log('❌ Validation failed: Missing title or body');
      return res.status(400).json({ 
        success: false, 
        message: 'Title and body are required' 
      });
    }

    console.log('✅ Validation passed');
    console.log('📋 Creating notification record...');

    // Create notification record
    const notification = await PushNotification.create({
      title,
      body,
      targetType: targetType || 'all',
      targetUsers: targetUsers || [],
      targetSegment,
      data: data || {},
      imageUrl,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status: scheduledFor ? 'scheduled' : 'draft',
      createdBy: req.admin?.id || req.user?.id,
      priority: priority || 'default',
      sound: sound || 'default',
      clickAction
    });

    console.log('✅ Notification record created:', notification._id);
    console.log('🎯 Target type:', notification.targetType);

    // If not scheduled, send immediately
    if (!scheduledFor) {
      console.log('🚀 Sending notification immediately...');
      await sendMultiPlatformNotification(notification);
    } else {
      console.log('⏰ Notification scheduled for:', scheduledFor);
    }

    console.log('✅ ========== NOTIFICATION REQUEST COMPLETE ==========\n');
    
    res.json({ 
      success: true, 
      message: scheduledFor ? 'Notification scheduled successfully' : 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ ========== NOTIFICATION ERROR ==========');
    console.error('Error sending notification:', error);
    console.error('Stack:', error.stack);
    console.error('==========================================\n');
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification',
      error: error.message 
    });
  }
};

// Main function to send notifications across all platforms
async function sendMultiPlatformNotification(notification) {
  try {
    console.log('\n📤 ========== SENDING NOTIFICATION ==========');
    console.log('📋 Notification ID:', notification._id);
    console.log('📌 Title:', notification.title);
    console.log('📝 Body:', notification.body);
    
    notification.status = 'sending';
    await notification.save();
    console.log('✅ Status updated to: sending');

    // Get target users
    let targetUserIds = [];
    
    console.log('🎯 Target type:', notification.targetType);
    
    if (notification.targetType === 'all') {
      console.log('👥 Fetching all active users...');
      const allUsers = await User.find({ isActive: true }).select('_id');
      targetUserIds = allUsers.map(u => u._id);
      console.log(`✅ Found ${targetUserIds.length} active users`);
    } else if (notification.targetType === 'specific') {
      targetUserIds = notification.targetUsers;
      console.log(`👥 Targeting ${targetUserIds.length} specific users`);
    } else if (notification.targetType === 'segment') {
      console.log('📊 Fetching users by segment:', notification.targetSegment);
      targetUserIds = await getUsersBySegment(notification.targetSegment);
      console.log(`✅ Found ${targetUserIds.length} users in segment`);
    }

    // Get all active device tokens for target users
    console.log('📱 Fetching device tokens for target users...');
    const deviceTokens = await DeviceToken.find({
      userId: { $in: targetUserIds },
      isActive: true
    });
    
    console.log(`✅ Found ${deviceTokens.length} active device tokens`);

    if (deviceTokens.length === 0) {
      console.log('⚠️  No active device tokens found!');
      console.log('📊 Updating notification stats...');
      notification.status = 'sent';
      notification.stats.totalTargeted = 0;
      notification.sentAt = new Date();
      await notification.save();
      console.log('✅ Notification marked as sent (0 devices)');
      console.log('==========================================\n');
      return;
    }

    // Separate tokens by type
    const expoTokens = deviceTokens.filter(t => t.tokenType === 'expo');
    const fcmTokens = deviceTokens.filter(t => t.tokenType === 'fcm');
    const apnsTokens = deviceTokens.filter(t => t.tokenType === 'apns');

    console.log('📊 Token distribution:');
    console.log(`   - Expo: ${expoTokens.length}`);
    console.log(`   - FCM: ${fcmTokens.length}`);
    console.log(`   - APNs: ${apnsTokens.length}`);

    let totalSuccess = 0;
    let totalFailed = 0;

    // Send via Expo
    if (expoTokens.length > 0) {
      console.log(`\n📱 Sending via Expo to ${expoTokens.length} devices...`);
      const { success, failed } = await sendViaExpo(expoTokens, notification);
      totalSuccess += success;
      totalFailed += failed;
      console.log(`✅ Expo results: ${success} success, ${failed} failed`);
    } else {
      console.log('⏭️  Skipping Expo (no tokens)');
    }

    // Send via FCM
    if (fcmTokens.length > 0) {
      console.log(`\n🔥 Sending via FCM to ${fcmTokens.length} devices...`);
      const { success, failed } = await sendViaFCM(fcmTokens, notification);
      totalSuccess += success;
      totalFailed += failed;
      console.log(`✅ FCM results: ${success} success, ${failed} failed`);
    } else {
      console.log('⏭️  Skipping FCM (no tokens)');
    }

    // Send via APNs
    if (apnsTokens.length > 0) {
      console.log(`\n🍎 Sending via APNs to ${apnsTokens.length} devices...`);
      const { success, failed } = await sendViaAPNs(apnsTokens, notification);
      totalSuccess += success;
      totalFailed += failed;
      console.log(`✅ APNs results: ${success} success, ${failed} failed`);
    } else {
      console.log('⏭️  Skipping APNs (no tokens)');
    }

    // Update notification stats
    console.log('\n📊 Updating notification stats...');
    notification.status = 'sent';
    notification.sentAt = new Date();
    notification.stats = {
      totalTargeted: deviceTokens.length,
      successCount: totalSuccess,
      failureCount: totalFailed
    };
    await notification.save();

    console.log('✅ ========== NOTIFICATION COMPLETE ==========');
    console.log(`📊 Final Stats:`);
    console.log(`   Total Targeted: ${deviceTokens.length}`);
    console.log(`   Success: ${totalSuccess}`);
    console.log(`   Failed: ${totalFailed}`);
    console.log(`   Expo: ${expoTokens.length}, FCM: ${fcmTokens.length}, APNs: ${apnsTokens.length}`);
    console.log('==========================================\n');
    
  } catch (error) {
    console.error('❌ ========== ERROR IN SEND FUNCTION ==========');
    console.error('Error in sendMultiPlatformNotification:', error);
    console.error('Stack:', error.stack);
    console.error('==========================================\n');
    notification.status = 'failed';
    await notification.save();
  }
}

// Send via Expo Push Notifications
async function sendViaExpo(deviceTokens, notification) {
  try {
    console.log('  📱 Preparing Expo messages...');
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

    console.log(`  📦 Chunking ${messages.length} messages...`);
    const chunks = expo.chunkPushNotifications(messages);
    console.log(`  ✅ Created ${chunks.length} chunks`);
    
    const tickets = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        console.log(`  🚀 Sending chunk ${i + 1}/${chunks.length} (${chunk.length} messages)...`);
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log(`  ✅ Chunk ${i + 1} sent successfully`);
      } catch (error) {
        console.error(`  ❌ Error sending Expo chunk ${i + 1}:`, error.message);
      }
    }

    let success = 0;
    let failed = 0;

    tickets.forEach((ticket, index) => {
      if (ticket.status === 'ok') {
        success++;
      } else {
        failed++;
        console.log(`  ❌ Ticket ${index + 1} failed:`, ticket.message || ticket.details);
      }
    });

    console.log(`  � Expo summary: ${success} success, ${failed} failed out of ${tickets.length} total`);
    return { success, failed };
  } catch (error) {
    console.error('  ❌ Error in sendViaExpo:', error.message);
    console.error('  Stack:', error.stack);
    return { success: 0, failed: deviceTokens.length };
  }
}

// Send via Firebase Cloud Messaging (FCM)
async function sendViaFCM(deviceTokens, notification) {
  try {
    if (!admin) {
      console.warn('⚠️  Firebase Admin not initialized. Skipping FCM notifications.');
      return { success: 0, failed: deviceTokens.length };
    }

    const tokens = deviceTokens.map(d => d.token);
    
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.imageUrl && { imageUrl: notification.imageUrl })
      },
      data: notification.data || {},
      android: {
        priority: notification.priority === 'high' ? 'high' : 'normal',
        notification: {
          sound: notification.sound || 'default',
          clickAction: notification.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: notification.sound || 'default',
            badge: notification.badge || 0
          }
        }
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    
    console.log(`🔥 FCM: ${response.successCount} sent, ${response.failureCount} failed`);
    return { success: response.successCount, failed: response.failureCount };
  } catch (error) {
    console.error('Error sending via FCM:', error);
    return { success: 0, failed: deviceTokens.length };
  }
}

// Send via Apple Push Notification Service (APNs)
async function sendViaAPNs(deviceTokens, notification) {
  try {
    if (!apnProvider) {
      console.warn('⚠️  APNs Provider not initialized. Skipping APNs notifications.');
      return { success: 0, failed: deviceTokens.length };
    }

    const tokens = deviceTokens.map(d => d.token);
    
    const apnNotification = new apn.Notification({
      alert: {
        title: notification.title,
        body: notification.body
      },
      topic: process.env.APNS_BUNDLE_ID || 'com.yourapp.bundleid', // Your app's bundle ID
      sound: notification.sound || 'default',
      badge: notification.badge || 0,
      payload: notification.data || {},
      ...(notification.imageUrl && { 'mutable-content': 1, mediaUrl: notification.imageUrl })
    });

    const result = await apnProvider.send(apnNotification, tokens);
    
    const success = result.sent.length;
    const failed = result.failed.length;

    console.log(`🍎 APNs: ${success} sent, ${failed} failed`);
    
    // Log failed tokens for debugging
    if (failed > 0) {
      result.failed.forEach(failure => {
        console.error(`APNs failed for ${failure.device}: ${failure.response.reason}`);
      });
    }

    return { success, failed };
  } catch (error) {
    console.error('Error sending via APNs:', error);
    return { success: 0, failed: deviceTokens.length };
  }
}

// Helper function to get users by segment
async function getUsersBySegment(segment) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  switch (segment) {
    case 'new_users':
      const newUsers = await User.find({
        createdAt: { $gte: thirtyDaysAgo }
      }).select('_id');
      return newUsers.map(u => u._id);
      
    case 'active_users':
      const activeUsers = await User.find({
        lastLoginAt: { $gte: thirtyDaysAgo }
      }).select('_id');
      return activeUsers.map(u => u._id);
      
    case 'inactive_users':
      const inactiveUsers = await User.find({
        lastLoginAt: { $lt: thirtyDaysAgo }
      }).select('_id');
      return inactiveUsers.map(u => u._id);
      
    default:
      const allUsers = await User.find({ isActive: true }).select('_id');
      return allUsers.map(u => u._id);
  }
}

// Get all notifications (for admin)
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const notifications = await PushNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');

    const total = await PushNotification.countDocuments(query);

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
    
    const notification = await PushNotification.findById(id)
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
    
    const notification = await PushNotification.findByIdAndDelete(id);

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
    const totalSent = await PushNotification.countDocuments({ status: 'sent' });
    const totalScheduled = await PushNotification.countDocuments({ status: 'scheduled' });
    const totalFailed = await PushNotification.countDocuments({ status: 'failed' });
    
    const recentNotifications = await PushNotification.find({ status: 'sent' })
      .sort({ sentAt: -1 })
      .limit(5)
      .select('title stats sentAt');

    // Calculate total delivered
    const allSent = await PushNotification.find({ status: 'sent' });
    const totalDelivered = allSent.reduce((sum, n) => sum + (n.stats.successCount || 0), 0);

    // Get device token statistics
    const tokenStats = await DeviceToken.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$tokenType', count: { $sum: 1 } } }
    ]);

    const deviceBreakdown = {
      expo: 0,
      fcm: 0,
      apns: 0
    };

    tokenStats.forEach(stat => {
      deviceBreakdown[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        totalSent,
        totalScheduled,
        totalFailed,
        totalDelivered,
        deviceBreakdown,
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

// Upload image for notification
exports.uploadNotificationImage = async (req, res) => {
  try {
    console.log('📸 ========== IMAGE UPLOAD REQUEST ==========');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    console.log('📝 File info:', {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Check if Firebase Storage is available
    if (!bucket) {
      console.log('⚠️  Firebase Storage not configured, saving locally');
      
      // Fallback: Save to local uploads folder
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'notifications');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `notification-${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(uploadsDir, filename);
      
      fs.writeFileSync(filepath, req.file.buffer);
      
      // Return local URL (adjust based on your server setup)
      const imageUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/notifications/${filename}`;
      
      console.log('✅ Image saved locally:', imageUrl);
      console.log('==========================================\n');
      
      return res.json({
        success: true,
        message: 'Image uploaded successfully (local storage)',
        imageUrl: imageUrl
      });
    }

    // Upload to Firebase Storage
    const filename = `notifications/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    console.log('☁️  Uploading to Firebase Storage:', filename);

    // Create a write stream
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: require('crypto').randomBytes(16).toString('hex')
        }
      }
    });

    // Handle upload errors
    stream.on('error', (error) => {
      console.error('❌ Firebase upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image to Firebase Storage',
        error: error.message
      });
    });

    // Handle successful upload
    stream.on('finish', async () => {
      try {
        // Make the file public
        await file.makePublic();

        // Get public URL
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        console.log('✅ Image uploaded to Firebase:', imageUrl);
        console.log('==========================================\n');

        res.json({
          success: true,
          message: 'Image uploaded successfully',
          imageUrl: imageUrl
        });
      } catch (error) {
        console.error('❌ Error making file public:', error);
        res.status(500).json({
          success: false,
          message: 'Image uploaded but failed to make public',
          error: error.message
        });
      }
    });

    // Write the buffer to the stream
    stream.end(req.file.buffer);

  } catch (error) {
    console.error('❌ ========== IMAGE UPLOAD ERROR ==========');
    console.error('Error uploading image:', error);
    console.error('Stack:', error.stack);
    console.error('==========================================\n');
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
};

module.exports.sendMultiPlatformNotification = sendMultiPlatformNotification;

/**
 * Device Token Registration Controller
 * 
 * Handles device token registration for push notifications
 */

const User = require('../models/schemas/userSchema');

/**
 * Register a device token for push notifications
 * 
 * @route POST /api/users/register-device
 * @body {userId, deviceToken, platform}
 */
exports.registerDevice = async (req, res) => {
  try {
    const { userId, mobile, deviceToken, platform } = req.body;

    // Validate input
    if (!deviceToken || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Device token and platform are required'
      });
    }

    if (!userId && !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Either userId or mobile is required'
      });
    }

    // Validate platform
    const validPlatforms = ['ios', 'android', 'web', 'expo'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`
      });
    }

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (mobile) {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if token already exists
    const existingTokenIndex = user.deviceTokens.findIndex(
      dt => dt.token === deviceToken
    );

    if (existingTokenIndex !== -1) {
      // Update existing token
      user.deviceTokens[existingTokenIndex].active = true;
      user.deviceTokens[existingTokenIndex].lastUsed = new Date();
      user.deviceTokens[existingTokenIndex].platform = platform;
    } else {
      // Add new token
      user.deviceTokens.push({
        token: deviceToken,
        platform,
        active: true,
        registeredAt: new Date(),
        lastUsed: new Date()
      });
    }

    await user.save();

    console.log(`✅ Device registered for user ${user.mobile} (${platform})`);

    res.json({
      success: true,
      message: 'Device registered successfully',
      data: {
        userId: user._id,
        mobile: user.mobile,
        deviceTokenCount: user.deviceTokens.filter(dt => dt.active).length,
        platform
      }
    });

  } catch (error) {
    console.error('❌ Device registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register device',
      error: error.message
    });
  }
};

/**
 * Unregister a device token
 * 
 * @route POST /api/users/unregister-device
 * @body {userId, deviceToken}
 */
exports.unregisterDevice = async (req, res) => {
  try {
    const { userId, mobile, deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    if (!userId && !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Either userId or mobile is required'
      });
    }

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (mobile) {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Deactivate token
    const tokenIndex = user.deviceTokens.findIndex(dt => dt.token === deviceToken);
    
    if (tokenIndex !== -1) {
      user.deviceTokens[tokenIndex].active = false;
      await user.save();

      console.log(`✅ Device unregistered for user ${user.mobile}`);

      res.json({
        success: true,
        message: 'Device unregistered successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Device token not found'
      });
    }

  } catch (error) {
    console.error('❌ Device unregistration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister device',
      error: error.message
    });
  }
};

/**
 * Update notification preferences
 * 
 * @route POST /api/users/notification-preferences
 * @body {userId, preferences}
 */
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { userId, mobile, preferences } = req.body;

    if (!userId && !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Either userId or mobile is required'
      });
    }

    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: 'Preferences object is required'
      });
    }

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (mobile) {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...preferences
    };

    await user.save();

    console.log(`✅ Notification preferences updated for user ${user.mobile}`);

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: {
        preferences: user.notificationPreferences
      }
    });

  } catch (error) {
    console.error('❌ Preferences update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
};

/**
 * Get user's device tokens
 * 
 * @route GET /api/users/:userId/devices
 */
exports.getUserDevices = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const activeDevices = user.deviceTokens.filter(dt => dt.active);

    res.json({
      success: true,
      data: {
        totalDevices: user.deviceTokens.length,
        activeDevices: activeDevices.length,
        devices: activeDevices.map(dt => ({
          platform: dt.platform,
          registeredAt: dt.registeredAt,
          lastUsed: dt.lastUsed
        }))
      }
    });

  } catch (error) {
    console.error('❌ Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user devices',
      error: error.message
    });
  }
};

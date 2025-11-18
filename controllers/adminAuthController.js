const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { sendWhatsApp } = require('../utils/whatsappService');

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign(
    { id: adminId, type: 'admin' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to admin
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    // Check if admin exists
    let admin = await Admin.findOne({ phoneNumber: phoneNumber });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found. Please contact super admin.'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact super admin.'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Send OTP via WhatsApp using IconicSolution API
    // MATCH CUSTOMER BACKEND FORMAT (sends just OTP, not full message)
    const message = otp;  // Just the OTP number like customer backend

    try {
      console.log(`📱 Sending OTP to ${phoneNumber}`);
      console.log(`🔑 OTP: ${otp}`);
      console.log(`📤 Message format: Just OTP number (${message})`);
      console.log(`🔧 Using sendWhatsApp function from whatsappService`);
      const result = await sendWhatsApp(phoneNumber, message, {
        templateName: 'sendotp'  // Use sendotp template
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send WhatsApp message');
      }

      console.log(`✅ OTP sent successfully via ${result.provider}`);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your WhatsApp'
      });
    } catch (whatsappError) {
      console.error('❌ WhatsApp send error:', whatsappError);

      // Return error if WhatsApp fails
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate inputs
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ phoneNumber: phoneNumber }).select('+otp +otpExpiry');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Check if OTP exists
    if (!admin.otp) {
      return res.status(400).json({
        success: false,
        message: 'Please request a new OTP'
      });
    }

    // Check if OTP is expired
    if (new Date() > admin.otpExpiry) {
      admin.otp = undefined;
      admin.otpExpiry = undefined;
      await admin.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one'
      });
    }

    // Verify OTP
    if (admin.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again'
      });
    }

    // OTP is valid - clear it and update last login
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken(admin._id);

    // Return success with token and admin data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        phoneNumber: admin.phoneNumber,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Get admin profile (protected route)
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-otp -otpExpiry');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        phoneNumber: admin.phoneNumber,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Logout (optional - mainly handled on frontend)
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

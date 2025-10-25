const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

exports.initiateWhatsAppLogin = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid mobile number' 
      });
    }

    const result = await authModel.initiateWhatsAppLogin(mobile);
    res.json(result);
  } catch (error) {
    console.error('WhatsApp login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP' 
    });
  }
};

exports.verifyWhatsAppOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    
    const result = await authModel.verifyWhatsAppOTP(mobile, otp);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { mobile: result.user.mobile, userId: result.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: result.user 
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Verification failed' 
    });
  }
};
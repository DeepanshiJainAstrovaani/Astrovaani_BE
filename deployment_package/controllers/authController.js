const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

exports.initiateWhatsAppLogin = (req, res) => {
  const { mobile } = req.body;
  
  if (!/^[0-9]{10}$/.test(mobile)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid mobile number' 
    });
  }

  authModel.initiateWhatsAppLogin(mobile, (err, result) => {
    if (err) {
      console.error('WhatsApp login error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP' 
      });
    }
    res.json(result);
  });
};

exports.verifyWhatsAppOTP = (req, res) => {
  const { mobile, otp } = req.body;
  
  authModel.verifyWhatsAppOTP(mobile, otp, (err, result) => {
    if (err) {
      console.error('OTP verification error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Verification failed' 
      });
    }
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { mobile: result.user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: result.user 
    });
  });
};
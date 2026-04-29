const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

exports.initiateWhatsAppLogin = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    console.log('🔵 Login Request - Received mobile:', mobile);
    console.log('🔵 Login Request - Full body:', req.body);
    
    if (!/^[0-9]{10}$/.test(mobile)) {
      console.log('🔴 Login Request - Invalid mobile format');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid mobile number' 
      });
    }

    console.log('🟢 Login Request - Calling authModel.initiateWhatsAppLogin');
    const result = await authModel.initiateWhatsAppLogin(mobile);
    console.log('🟢 Login Request - Result:', result);
    res.json(result);
  } catch (error) {
    console.error('🔴 WhatsApp login error:', error);
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
    
    // Handle vendor login
    if (result.vendor) {
      const token = jwt.sign(
        { mobile: result.vendor.whatsapp || result.vendor.phone, vendorId: result.vendor.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const vendorResponse = {
        ...result.vendor,
        _id: result.vendor._id || result.vendor.id,
        id: result.vendor.id || result.vendor._id
      };

      console.log('✅ Verify OTP - Returning vendor:', vendorResponse);

      return res.json({
        success: true,
        token,
        vendor: vendorResponse,
        isNewVendor: result.isNewVendor
      });
    }
    
    // Handle user login
    const token = jwt.sign(
      { mobile: result.user.mobile, userId: result.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Ensure user object has both _id and id fields
    const userResponse = {
      ...result.user,
      _id: result.user._id || result.user.id,
      id: result.user.id || result.user._id
    };
    
    console.log('✅ Verify OTP - Returning user:', userResponse);
    
    res.json({ 
      success: true, 
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Verification failed' 
    });
  }
};
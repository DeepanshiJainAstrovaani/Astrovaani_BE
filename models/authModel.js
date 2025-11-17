const User = require('./schemas/userSchema');
const { sendWhatsApp } = require('../utils/whatsappService');
require('dotenv').config();

// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.initiateWhatsAppLogin = async (mobile) => {
    try {
        const otp = generateOTP();

        // Check if user exists
        let user = await User.findOne({ mobile }).select('+otp');

        if (user) {
            // Update existing user
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                mobile,
                otp,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
            });
        }

        // Send OTP via WhatsApp
        await sendWhatsAppOTP(mobile, otp);

        return { success: true, message: 'OTP sent successfully via WhatsApp' };
    } catch (error) {
        console.error('Error in initiateWhatsAppLogin:', error);
        throw error;
    }
};

async function sendWhatsAppOTP(mobile, otp) {
    try {
        // Template 'sendotp' expects the full message in {{1}} placeholder
        // Matching customer frontend format
        const message = `Your One-Time Password (OTP) is: ${otp}. Valid for 10 minutes.`;
        
        console.log(`📱 Sending OTP to ${mobile}`);
        console.log(`🔑 OTP: ${otp}`);
        const result = await sendWhatsApp(mobile, message, {
            templateName: 'sendotp'  // Use same template as customer frontend
        });
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to send WhatsApp message');
        }
        
        console.log(`✅ OTP sent successfully via ${result.provider}`);
        return { success: true, provider: result.provider };
    } catch (error) {
        console.error('❌ Error sending WhatsApp OTP:', error);
        throw error;
    }
}

exports.verifyWhatsAppOTP = async (mobile, otp) => {
    try {
        // Find user with mobile and OTP
        const user = await User.findOne({ mobile }).select('+otp +otpExpiry');

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.otp !== otp) {
            return { success: false, message: 'Invalid OTP' };
        }

        // Check if OTP has expired
        if (user.otpExpiry && user.otpExpiry < new Date()) {
            return { success: false, message: 'OTP has expired' };
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return {
            success: true,
            user: { 
                _id: user._id.toString(),
                id: user._id.toString(), // Include both for compatibility
                mobile: user.mobile,
                name: user.name,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Error in verifyWhatsAppOTP:', error);
        throw error;
    }
};
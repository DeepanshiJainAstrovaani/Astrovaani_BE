const User = require('./schemas/userSchema');
const twilio = require('twilio');
require('dotenv').config();

const twilioClient = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const HARDCODED_OTP = "123456";

exports.initiateWhatsAppLogin = async (mobile) => {
    try {
        const otp = HARDCODED_OTP;

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

        // In production, uncomment this to send actual WhatsApp OTP
        // await sendWhatsAppOTP(mobile, otp);

        return { success: true, message: 'OTP set (would send via WhatsApp in production)' };
    } catch (error) {
        console.error('Error in initiateWhatsAppLogin:', error);
        throw error;
    }
};

async function sendWhatsAppOTP(mobile, otp) {
    try {
        await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
            contentVariables: JSON.stringify({ "1": otp }),
            to: `whatsapp:+91${mobile}`
        });
        return { success: true };
    } catch (error) {
        console.error('Twilio error:', error);
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

        if (user.otp !== HARDCODED_OTP) {
            return { success: false, message: 'Invalid OTP' };
        }

        // Check if OTP has expired (optional)
        // if (user.otpExpiry && user.otpExpiry < new Date()) {
        //     return { success: false, message: 'OTP has expired' };
        // }

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return {
            success: true,
            user: { 
                id: user._id,
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
const User = require('./schemas/userSchema');
const axios = require('axios');
require('dotenv').config();

// WhatsApp Business API Configuration
const WHATSAPP_CONFIG = {
    phoneNumberId: "629164643621542",
    accessToken: "EAATuPFpuF0IBQ6kvO3V5GYTN6iNF49RVMb0mQOAMXzl7TF1vOtV937Nb08wOnbuamYW3nLHPUOlSscHekF6aL4pZBP6ZCJUiMSzsBsVR6YqwucALZCejfxsKH65ZBteSSweY3PSWuZAp8wLvN0S9kKfUkyScfu2piBaFl7WqenxSZA5zBEA08fR9Bf1eIkjgZDZD",
    apiVersion: "v19.0"
};

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
        // Format phone number (ensure it has country code)
        let formattedNumber = mobile;
        if (!formattedNumber.startsWith('91') && !formattedNumber.startsWith('+91')) {
            formattedNumber = `91${mobile}`;
        }
        formattedNumber = formattedNumber.replace(/^\+/, ''); // Remove + if present

        console.log('📱 Sending WhatsApp OTP to:', formattedNumber, 'OTP:', otp);

        const url = `https://graph.facebook.com/${WHATSAPP_CONFIG.apiVersion}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;

        const data = {
            messaging_product: "whatsapp",
            to: formattedNumber,
            type: "template",
            template: {
                name: "sendotp",
                language: {
                    code: "en"
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: otp
                            }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: "0",
                        parameters: [
                            {
                                type: "text",
                                text: otp
                            }
                        ]
                    }
                ]
            }
        };

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            family: 4, // Force IPv4 to avoid IPv6 connection issues
            timeout: 10000 // 10 second timeout
        });

        console.log('✅ WhatsApp OTP sent successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ WhatsApp OTP sending failed:', error.response?.data || error.message);
        return { 
            success: false, 
            error: error.response?.data || error.message 
        };
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
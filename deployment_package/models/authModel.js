const db = require('../config/db');
const twilio = require('twilio');
require('dotenv').config();

const twilioClient = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const HARDCODED_OTP = "123456";

exports.initiateWhatsAppLogin = (mobile, callback) => {
    const otp = HARDCODED_OTP;

    // Check if user exists
    db.query(
        'SELECT * FROM users WHERE mobile = ?',
        [mobile],
        (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                // Update existing user
                db.query(
                    'UPDATE users SET otp = ? WHERE mobile = ?',
                    [otp, mobile],
                    (err) => {
                        if (err) return callback(err);
                        // sendWhatsAppOTP(mobile, otp, callback);
                        callback(null, { success: true, message: 'OTP set (would send via WhatsApp in production)' });
                    }
                );
            } else {
                // Create new user
                db.query(
                    'INSERT INTO users (mobile, otp) VALUES (?, ?)',
                    [mobile, otp],
                    (err) => {
                        if (err) return callback(err);
                        // sendWhatsAppOTP(mobile, otp, callback);
                        callback(null, { success: true, message: 'OTP set (would send via WhatsApp in production)' });
                    }
                );
            }
        }
    );
};

function sendWhatsAppOTP(mobile, otp, callback) {
    twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
        contentVariables: '{"1":"409173"}',
        to: 'whatsapp:+918168095773'
    })
        .then(() => callback(null, { success: true }))
        .catch(err => callback(err));
}

exports.verifyWhatsAppOTP = (mobile, otp, callback) => {
    const currentTime = new Date();

    db.query(
        'SELECT * FROM users WHERE mobile = ? AND otp = ?',
        [mobile, HARDCODED_OTP],
        (err, results) => {
            if (err) return callback(err);

            if (results.length === 0) {
                return callback(null, { success: false, message: 'Invalid OTP' });
            }

            // Clear OTP
            db.query(
                'UPDATE users SET otp = NULL WHERE mobile = ?',
                [mobile],
                (err) => {
                    if (err) return callback(err);
                    callback(null, {
                        success: true,
                        user: { mobile: results[0].mobile }
                    });
                }
            );
        }
    );
};
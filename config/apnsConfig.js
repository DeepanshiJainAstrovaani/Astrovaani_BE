const apn = require('node-apn');
const path = require('path');
const fs = require('fs');

// APNs configuration
// You need to get these files from Apple Developer Account:
// 1. AuthKey_XXXXXXXXXX.p8 file (APNs Auth Key)
// 2. Your Team ID
// 3. Your Key ID

let apnProvider = null;

const initializeAPNs = () => {
  try {
    // Check if APNs is disabled via environment variable
    if (process.env.DISABLE_APNS === 'true') {
      console.log('⚠️  APNs disabled via DISABLE_APNS env variable');
      return null;
    }

    // Check if required APNs credentials are available
    const keyPath = process.env.APNS_KEY_PATH || path.join(__dirname, 'AuthKey_XXXXXXXXXX.p8');
    const keyId = process.env.APNS_KEY_ID;
    const teamId = process.env.APNS_TEAM_ID;

    // Validate that all required credentials are provided
    if (!keyId || !teamId || keyId === 'YOUR_KEY_ID' || teamId === 'YOUR_TEAM_ID') {
      console.log('⚠️  APNs credentials not configured. iOS notifications will be disabled.');
      console.log('   To enable APNs, set these environment variables:');
      console.log('   - APNS_KEY_ID');
      console.log('   - APNS_TEAM_ID');
      console.log('   - APNS_KEY_PATH (or place .p8 file in config folder)');
      return null;
    }

    // Check if the .p8 key file exists
    if (!fs.existsSync(keyPath)) {
      console.log('⚠️  APNs key file not found at:', keyPath);
      console.log('   iOS notifications will be disabled.');
      return null;
    }

    const options = {
      token: {
        key: keyPath,
        keyId: keyId,
        teamId: teamId,
      },
      production: process.env.APNS_PRODUCTION === 'true' || process.env.NODE_ENV === 'production',
    };

    apnProvider = new apn.Provider(options);
    console.log('✅ APNs Provider initialized successfully');
    console.log('   Production mode:', options.production);
    
    return apnProvider;
  } catch (error) {
    console.error('❌ APNs initialization error:', error.message);
    console.log('⚠️  iOS notifications will be disabled');
    return null;
  }
};

// Initialize on module load
initializeAPNs();

module.exports = {
  apnProvider,
  initializeAPNs
};

const apn = require('node-apn');
const path = require('path');

// APNs configuration
// You need to get these files from Apple Developer Account:
// 1. AuthKey_XXXXXXXXXX.p8 file (APNs Auth Key)
// 2. Your Team ID
// 3. Your Key ID

let apnProvider = null;

const initializeAPNs = () => {
  try {
    const options = {
      token: {
        key: path.join(__dirname, 'AuthKey_XXXXXXXXXX.p8'), // Path to your .p8 file
        keyId: process.env.APNS_KEY_ID || 'YOUR_KEY_ID', // Your APNs Key ID
        teamId: process.env.APNS_TEAM_ID || 'YOUR_TEAM_ID', // Your Apple Team ID
      },
      production: process.env.NODE_ENV === 'production', // Use production for live app
    };

    apnProvider = new apn.Provider(options);
    console.log('✅ APNs Provider initialized successfully');
    
    return apnProvider;
  } catch (error) {
    console.error('❌ APNs initialization error:', error.message);
    console.log('⚠️  Make sure to:');
    console.log('   1. Download .p8 file from Apple Developer Console');
    console.log('   2. Set APNS_KEY_ID and APNS_TEAM_ID in .env file');
    return null;
  }
};

// Initialize on module load
initializeAPNs();

module.exports = {
  apnProvider,
  initializeAPNs
};

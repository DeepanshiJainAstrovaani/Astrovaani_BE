const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You need to download your Firebase service account key JSON file from Firebase Console
// Firebase Console > Project Settings > Service Accounts > Generate New Private Key

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    // Check if service account key file exists
    const serviceAccount = require('./firebase-service-account.json');
    
    if (!firebaseApp) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
    
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('⚠️  Place your firebase-service-account.json in the config folder');
    return null;
  }
};

// Initialize on module load
initializeFirebase();

module.exports = {
  admin,
  firebaseApp,
  initializeFirebase
};

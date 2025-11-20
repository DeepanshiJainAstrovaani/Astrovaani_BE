const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// You need to download your Firebase service account key JSON file from Firebase Console
// Firebase Console > Project Settings > Service Accounts > Generate New Private Key

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    // Check if Firebase is disabled via environment variable
    if (process.env.DISABLE_FIREBASE === 'true') {
      console.log('⚠️  Firebase disabled via DISABLE_FIREBASE env variable');
      return null;
    }

    // Try to get service account from environment variable or file
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Use service account from environment variable (for deployment)
      console.log('📦 Loading Firebase credentials from environment variable');
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Try to load from file (for local development)
      const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        console.log('⚠️  Firebase service account file not found. FCM notifications will be disabled.');
        console.log('   To enable FCM:');
        console.log('   1. Add FIREBASE_SERVICE_ACCOUNT env variable with JSON content, OR');
        console.log('   2. Place firebase-service-account.json in config folder');
        return null;
      }
      
      console.log('📦 Loading Firebase credentials from file');
      serviceAccount = require('./firebase-service-account.json');
    }
    
    if (!firebaseApp) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
    
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('⚠️  FCM notifications will be disabled');
    return null;
  }
};

// Initialize on module load
initializeFirebase();

module.exports = {
  admin: firebaseApp ? admin : null,
  firebaseApp,
  initializeFirebase
};

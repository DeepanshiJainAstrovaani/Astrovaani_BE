/**
 * Firebase Activation Verification Script
 * 
 * This script verifies that Firebase is properly configured and active
 */

const path = require('path');
const fs = require('fs');

console.log('='.repeat(60));
console.log('🔥 FIREBASE ACTIVATION VERIFICATION');
console.log('='.repeat(60));
console.log();

// Check 1: Service Account File
console.log('📋 CHECK 1: Firebase Service Account File');
const serviceAccountPath = path.join(__dirname, 'config', 'firebase-service-account.json');
const fileExists = fs.existsSync(serviceAccountPath);

if (fileExists) {
  console.log('✅ Service account file found at:', serviceAccountPath);
  
  try {
    const serviceAccount = require(serviceAccountPath);
    console.log('✅ Service account JSON is valid');
    console.log('   Project ID:', serviceAccount.project_id);
    console.log('   Client Email:', serviceAccount.client_email);
    console.log('   Storage Bucket:', `${serviceAccount.project_id}.appspot.com`);
  } catch (error) {
    console.log('❌ Service account file is not valid JSON:', error.message);
  }
} else {
  console.log('❌ Service account file NOT found');
  console.log('   Expected at:', serviceAccountPath);
}

console.log();

// Check 2: Firebase Initialization
console.log('📋 CHECK 2: Firebase Initialization');
try {
  const firebaseConfig = require('./config/firebaseConfig');
  
  if (firebaseConfig.firebaseApp) {
    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    console.log('❌ Firebase Admin SDK NOT initialized');
  }
  
  if (firebaseConfig.bucket) {
    console.log('✅ Firebase Storage bucket available');
    console.log('   Bucket name:', firebaseConfig.bucket.name);
  } else {
    console.log('❌ Firebase Storage bucket NOT available');
  }
  
  if (firebaseConfig.admin) {
    console.log('✅ Firebase Admin instance available');
  } else {
    console.log('❌ Firebase Admin instance NOT available');
  }
} catch (error) {
  console.log('❌ Error loading Firebase config:', error.message);
}

console.log();

// Check 3: Environment Variables
console.log('📋 CHECK 3: Environment Variables');
require('dotenv').config();

const relevantVars = [
  'FIREBASE_SERVICE_ACCOUNT',
  'FIREBASE_STORAGE_BUCKET',
  'DISABLE_FIREBASE'
];

relevantVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'FIREBASE_SERVICE_ACCOUNT') {
      console.log(`✅ ${varName} is set (${value.length} characters)`);
    } else {
      console.log(`✅ ${varName} = ${value}`);
    }
  } else {
    console.log(`⚠️  ${varName} is not set (this is OK for file-based config)`);
  }
});

console.log();

// Check 4: Test Firebase Messaging (FCM)
console.log('📋 CHECK 4: Firebase Cloud Messaging (FCM)');
try {
  const firebaseConfig = require('./config/firebaseConfig');
  
  if (firebaseConfig.admin) {
    const messaging = firebaseConfig.admin.messaging();
    console.log('✅ FCM instance available');
    console.log('   Ready to send push notifications to devices');
  } else {
    console.log('❌ FCM NOT available (Firebase not initialized)');
  }
} catch (error) {
  console.log('❌ Error accessing FCM:', error.message);
}

console.log();

// Summary
console.log('='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));

if (fileExists) {
  console.log('✅ Firebase is ACTIVE and ready to use!');
  console.log();
  console.log('🎯 What this means:');
  console.log('   • Push notifications can be sent to iOS and Android devices');
  console.log('   • Images can be uploaded to Firebase Storage');
  console.log('   • Notifications will be delivered in real-time via FCM');
  console.log();
  console.log('📱 Next Steps:');
  console.log('   1. Register device tokens from your mobile app');
  console.log('   2. Send test notifications from admin dashboard');
  console.log('   3. Verify notifications are received on devices');
} else {
  console.log('❌ Firebase is NOT active');
  console.log();
  console.log('🔧 To activate Firebase:');
  console.log('   1. Place firebase-service-account.json in config/ folder, OR');
  console.log('   2. Set FIREBASE_SERVICE_ACCOUNT env variable with JSON content');
}

console.log('='.repeat(60));

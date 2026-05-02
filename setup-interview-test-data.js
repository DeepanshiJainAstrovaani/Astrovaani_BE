#!/usr/bin/env node
/**
 * Setup Test Data for Interview WhatsApp Notification Test
 * 
 * This script:
 * 1. Creates an admin/interviewer
 * 2. Creates a vendor
 * 3. Assigns interview schedules to vendor
 * 4. Generates interview code
 */

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const axios = require('axios');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Generate a random string
function generateRandom(length = 6) {
  return Math.random().toString(36).substring(2, length + 2);
}

// Generate test data
function generateTestData() {
  const randomSuffix = generateRandom(4);
  return {
    adminName: `TestInterviewer${randomSuffix}`,
    vendorName: `TestVendor${randomSuffix}`,
    vendorEmail: `vendor${randomSuffix}@test.com`,
    vendorWhatsapp: '919876543210', // Test phone number
    vendorPhone: '+919876543210'
  };
}

async function setupTestData() {
  try {
    log('\n🧪 Setting Up Test Data for Interview Notification Test\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    const testData = generateTestData();

    // Step 1: Create Admin/Interviewer
    log('Step 1: Creating Admin/Interviewer...', 'yellow');
    const adminRes = await axios.post(`${API_URL}/auth/register-admin`, {
      name: testData.adminName,
      email: `admin${generateRandom(4)}@test.com`,
      password: 'Test@123456',
      phone: '919876543210',
      expertise: ['Astrology', 'Tarot'],
      languages: ['English', 'Hindi']
    });

    if (!adminRes.data.success) {
      log(`⚠️ Admin creation response:`, 'yellow');
      log(JSON.stringify(adminRes.data, null, 2), 'yellow');
    }

    const adminId = adminRes.data.admin?._id || adminRes.data._id;
    if (!adminId) {
      log('❌ Failed to get admin ID from response', 'red');
      log(JSON.stringify(adminRes.data, null, 2), 'red');
      return;
    }

    log(`✅ Admin created: ${testData.adminName}`, 'green');
    log(`   Admin ID: ${adminId}\n`, 'blue');

    // Step 2: Create Vendor
    log('Step 2: Creating Vendor...', 'yellow');
    const vendorRes = await axios.post(`${API_URL}/vendors/register`, {
      name: testData.vendorName,
      email: testData.vendorEmail,
      phone: testData.vendorPhone,
      whatsapp: testData.vendorWhatsapp,
      category: 'Astrology',
      experience: '5',
      languages: ['English', 'Hindi'],
      onboardingstatus: 'pending'
    });

    if (!vendorRes.data.success) {
      log(`⚠️ Vendor creation response:`, 'yellow');
      log(JSON.stringify(vendorRes.data, null, 2), 'yellow');
    }

    const vendorId = vendorRes.data.vendor?._id || vendorRes.data._id;
    if (!vendorId) {
      log('❌ Failed to get vendor ID from response', 'red');
      log(JSON.stringify(vendorRes.data, null, 2), 'red');
      return;
    }

    log(`✅ Vendor created: ${testData.vendorName}`, 'green');
    log(`   Vendor ID: ${vendorId}`, 'blue');
    log(`   Email: ${testData.vendorEmail}`, 'blue');
    log(`   WhatsApp: ${testData.vendorWhatsapp}\n`, 'blue');

    // Step 3: Generate Interview Code and Create Schedules
    log('Step 3: Creating Interview Schedules...', 'yellow');
    
    const interviewCode = `TEST${generateRandom(8).toUpperCase()}`;
    
    // Create 3 interview slots
    const schedules = [];
    const now = new Date();
    
    for (let i = 0; i < 3; i++) {
      const slotTime = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      slotTime.setHours(10 + i, 0, 0, 0);
      
      schedules.push({
        scheduledAt: slotTime,
        duration: 30,
        status: 'proposed'
      });
    }

    log(`   Interview Code: ${interviewCode}`, 'blue');
    log(`   Creating ${schedules.length} proposed slots:`, 'blue');
    schedules.forEach((slot, i) => {
      const date = new Date(slot.scheduledAt).toLocaleString('en-GB');
      log(`      ${i + 1}. ${date} (${slot.duration} mins)`, 'blue');
    });

    // Update vendor with interview details
    const updateVendorRes = await axios.put(
      `${API_URL}/vendors/${vendorId}`,
      {
        interviewcode: interviewCode,
        interviewerid: adminId,
        schedules: schedules,
        onboardingstatus: 'pending'
      }
    );

    if (!updateVendorRes.data.success) {
      log(`⚠️ Vendor update response:`, 'yellow');
      log(JSON.stringify(updateVendorRes.data, null, 2), 'yellow');
    }

    log(`✅ Interview schedules created\n`, 'green');

    // Step 4: Display test information
    log('═════════════════════════════════════════════════════', 'cyan');
    log('✅ Test Data Setup Complete!', 'green');
    log('═════════════════════════════════════════════════════\n', 'cyan');

    log('📋 Test Data Summary:', 'magenta');
    log(`   Vendor: ${testData.vendorName}`, 'blue');
    log(`   Vendor ID: ${vendorId}`, 'blue');
    log(`   WhatsApp: ${testData.vendorWhatsapp}`, 'blue');
    log(`   Interviewer: ${testData.adminName}`, 'blue');
    log(`   Interviewer ID: ${adminId}`, 'blue');
    log(`   Interview Code: ${interviewCode}`, 'blue');
    log(`   Available Slots: ${schedules.length}`, 'blue');

    log('\n🚀 Next Steps:', 'cyan');
    log(`   1. Run the WhatsApp notification test:`, 'yellow');
    log(`      node test-interview-whatsapp-notification.js`, 'blue');
    
    log(`\n   2. Or test via API directly:`, 'yellow');
    log(`      POST http://localhost:5000/api/vendors/interview/${interviewCode}/select`, 'blue');
    log(`      Body: { "slotId": "<first-slot-id>" }`, 'blue');

    log(`\n   3. View interview page:`, 'yellow');
    log(`      Frontend URL: /interview?code=${interviewCode}`, 'blue');

    log('\n📱 WhatsApp Notification:', 'yellow');
    log('   After slot selection, check WhatsApp on:', 'blue');
    log(`   ${testData.vendorWhatsapp}`, 'green');
    log('   You should receive interview scheduled notification', 'blue');

    return { vendorId, adminId, interviewCode };

  } catch (error) {
    log('\n❌ Setup failed:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.statusText}`, 'red');
      if (typeof error.response.data === 'object') {
        log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    } else if (error.code === 'ECONNREFUSED') {
      log(`   ❌ Cannot connect to ${API_URL}`, 'red');
      log(`   💡 Make sure backend is running!`, 'yellow');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

// Run setup
setupTestData();

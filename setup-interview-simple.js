#!/usr/bin/env node
/**
 * Simple Setup for Interview WhatsApp Notification Test
 * 
 * Uses existing vendors and admins, creates interview schedules
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

function generateRandom(length = 6) {
  return Math.random().toString(36).substring(2, length + 2);
}

async function setupSimpleTestData() {
  try {
    log('\n🧪 Setting Up Simple Test Data\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    // Step 1: Get all vendors
    log('Step 1: Fetching existing vendors and admins...', 'yellow');
    const vendorsRes = await axios.get(`${API_URL}/vendors`);
    const vendors = vendorsRes.data;
    log(`✅ Found ${vendors.length} vendors\n`, 'green');

    // Find a vendor with WhatsApp/phone
    let selectedVendor = null;
    for (const vendor of vendors) {
      if ((vendor.whatsapp || vendor.phone) && !vendor.interviewcode) {
        selectedVendor = vendor;
        break;
      }
    }

    if (!selectedVendor) {
      log('Using first vendor:', 'yellow');
      selectedVendor = vendors[0];
    }

    const vendorId = selectedVendor._id || selectedVendor.id;
    const vendorName = selectedVendor.name;
    const vendorPhone = selectedVendor.whatsapp || selectedVendor.phone || '919876543210';

    log(`✅ Selected Vendor: ${vendorName}`, 'green');
    log(`   Vendor ID: ${vendorId}`, 'blue');
    log(`   Phone/WhatsApp: ${vendorPhone}\n`, 'blue');

    // Step 2: Create interview code and schedules
    log('Step 2: Creating interview schedules...', 'yellow');

    const interviewCode = `TEST${generateRandom(8).toUpperCase()}`;
    const schedules = [];
    const now = new Date();

    // Create 3 interview slots - tomorrow, day after, and 3 days from now
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

    // Use a test interviewer ID (if it exists) or leave empty
    const testInterviewerId = '6774e2e16b86b0a47da4f01e'; // Replace with actual admin ID if needed

    // Step 3: Update vendor with interview details
    log('\n   Updating vendor with interview details...', 'yellow');

    const updateVendorRes = await axios.put(`${API_URL}/vendors/${vendorId}`, {
      interviewcode: interviewCode,
      interviewerid: testInterviewerId,
      schedules: schedules,
      onboardingstatus: 'pending'
    });

    if (!updateVendorRes.data.success) {
      log(`⚠️ Warning:`, 'yellow');
      log(JSON.stringify(updateVendorRes.data, null, 2), 'yellow');
    }

    log(`✅ Interview schedules created\n`, 'green');

    // Step 4: Display summary
    log('═════════════════════════════════════════════════════', 'cyan');
    log('✅ Test Setup Complete!', 'green');
    log('═════════════════════════════════════════════════════\n', 'cyan');

    log('📋 Test Data:', 'magenta');
    log(`   Vendor: ${vendorName}`, 'blue');
    log(`   Vendor ID: ${vendorId}`, 'blue');
    log(`   Phone/WhatsApp: ${vendorPhone}`, 'blue');
    log(`   Interview Code: ${interviewCode}`, 'blue');
    log(`   Available Slots: ${schedules.length}`, 'blue');

    log('\n🚀 Now Run The Notification Test:', 'cyan');
    log(`   node test-interview-whatsapp-notification.js`, 'yellow');

    log('\n📱 Expected WhatsApp Message:', 'yellow');
    log('   Should be sent to:', 'blue');
    log(`   ${vendorPhone}`, 'green');

    return { vendorId, interviewCode, vendorPhone, vendorName };

  } catch (error) {
    log('\n❌ Setup failed:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.statusText}`, 'red');
      if (error.response.data) {
        log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    } else if (error.code === 'ECONNREFUSED') {
      log(`   ❌ Cannot connect to ${API_URL}`, 'red');
      log(`   💡 Backend is not running!`, 'yellow');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

setupSimpleTestData();

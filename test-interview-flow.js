#!/usr/bin/env node
/**
 * Test Vendor Interview Flow
 * 
 * This script tests the complete vendor interview scheduling flow:
 * 1. Get a vendor with interview code
 * 2. Fetch interview details via public API
 * 3. Select a slot via public API
 * 4. Verify confirmation
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
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testInterviewFlow() {
  try {
    log('\n🧪 Testing Vendor Interview Flow\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    // Step 1: Get all vendors to find one with interview code
    log('Step 1: Finding vendor with interview code...', 'yellow');
    const vendorsRes = await axios.get(`${API_URL}/vendors`);
    const vendors = vendorsRes.data;
    
    const vendorWithCode = vendors.find(v => v.interviewcode && v.schedules && v.schedules.length > 0);
    
    if (!vendorWithCode) {
      log('❌ No vendor found with interview code and schedules', 'red');
      log('💡 Tip: Create schedules for a vendor and send notification first', 'yellow');
      return;
    }

    log(`✅ Found vendor: ${vendorWithCode.name} (ID: ${vendorWithCode._id})`, 'green');
    log(`   Interview Code: ${vendorWithCode.interviewcode}`, 'blue');
    log(`   Schedules: ${vendorWithCode.schedules.length}`, 'blue');
    log(`   Status: ${vendorWithCode.onboardingstatus || 'pending'}`, 'blue');

    const interviewCode = vendorWithCode.interviewcode;

    // Step 2: Test GET /api/vendors/interview/:code (public API)
    log('\n\nStep 2: Testing GET /api/vendors/interview/:code...', 'yellow');
    const interviewRes = await axios.get(`${API_URL}/vendors/interview/${interviewCode}`);
    const interview = interviewRes.data;

    if (!interview.success) {
      log(`❌ Failed to get interview: ${interview.message}`, 'red');
      return;
    }

    log('✅ Interview details retrieved successfully', 'green');
    log(`   Vendor: ${interview.vendor.name}`, 'blue');
    log(`   Email: ${interview.vendor.email}`, 'blue');
    log(`   Phone: ${interview.vendor.phone}`, 'blue');
    log(`   Is Scheduled: ${interview.isScheduled}`, 'blue');
    log(`   Available Slots: ${interview.availableSlots.length}`, 'blue');
    
    if (interview.availableSlots.length > 0) {
      log('\n   📅 Available Slots:', 'cyan');
      interview.availableSlots.forEach((slot, idx) => {
        const date = new Date(slot.scheduledAt).toLocaleString('en-GB');
        log(`      ${idx + 1}. ${date} (${slot.duration} mins) - ${slot.status}`, 'blue');
      });
    }

    // Step 3: Check if already scheduled
    if (interview.isScheduled && interview.confirmedSlot) {
      log('\n\n⚠️ Interview already scheduled', 'yellow');
      log('   Confirmed Slot:', 'cyan');
      const date = new Date(interview.confirmedSlot.scheduledAt).toLocaleString('en-GB');
      log(`   📅 ${date} (${interview.confirmedSlot.duration} mins)`, 'blue');
      log('\n✅ Test completed - Vendor already has confirmed slot', 'green');
      return;
    }

    // Step 4: Test slot selection (only if not scheduled)
    if (interview.availableSlots.length > 0) {
      const firstSlot = interview.availableSlots[0];
      
      log('\n\nStep 3: Testing POST /api/vendors/interview/:code/select...', 'yellow');
      log(`   Selecting slot: ${firstSlot.id}`, 'blue');
      
      const selectRes = await axios.post(
        `${API_URL}/vendors/interview/${interviewCode}/select`,
        { slotId: firstSlot.id },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const selection = selectRes.data;
      
      if (!selection.success) {
        log(`❌ Failed to select slot: ${selection.message}`, 'red');
        return;
      }

      log('✅ Slot selected successfully!', 'green');
      log(`   Message: ${selection.message}`, 'blue');
      log('\n   Confirmed Slot:', 'cyan');
      const date = new Date(selection.confirmedSlot.scheduledAt).toLocaleString('en-GB');
      log(`   📅 ${date} (${selection.confirmedSlot.duration} mins)`, 'blue');
      log(`   Status: ${selection.confirmedSlot.status}`, 'blue');
      
      // Step 5: Verify confirmation
      log('\n\nStep 4: Verifying confirmation...', 'yellow');
      const verifyRes = await axios.get(`${API_URL}/vendors/interview/${interviewCode}`);
      const verified = verifyRes.data;
      
      if (verified.isScheduled && verified.confirmedSlot) {
        log('✅ Confirmation verified!', 'green');
        log(`   Status: Interview Scheduled`, 'blue');
        const verifyDate = new Date(verified.confirmedSlot.scheduledAt).toLocaleString('en-GB');
        log(`   Confirmed Time: ${verifyDate}`, 'blue');
      } else {
        log('⚠️ Warning: Confirmation not reflected yet', 'yellow');
      }
    } else {
      log('\n\n⚠️ No available slots to select', 'yellow');
    }

    log('\n\n🎉 Test completed successfully!\n', 'green');
    log('Next steps:', 'cyan');
    log('1. Open browser: http://localhost:3000/interview?code=' + interviewCode, 'blue');
    log('2. Verify UI shows the same data', 'blue');
    log('3. Test slot selection via UI', 'blue');

  } catch (error) {
    log('\n❌ Test failed:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    
    if (error.code === 'ECONNREFUSED') {
      log('\n💡 Tip: Make sure backend is running on ' + API_URL, 'yellow');
    }
  }
}

// Run test
testInterviewFlow();

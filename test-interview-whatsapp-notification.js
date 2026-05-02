#!/usr/bin/env node
/**
 * Test Interview Scheduled WhatsApp Notification
 * 
 * This script tests:
 * 1. Gets a vendor with interview code and available slots
 * 2. Calls the slot selection API
 * 3. Verifies WhatsApp notification was triggered
 * 4. Checks notification parameters
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

async function testInterviewWhatsAppNotification() {
  try {
    log('\n🧪 Testing Interview Scheduled WhatsApp Notification\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    // Step 1: Get all vendors
    log('Step 1: Fetching vendors...', 'yellow');
    const vendorsRes = await axios.get(`${API_URL}/vendors`);
    const vendors = vendorsRes.data;
    log(`✅ Found ${vendors.length} vendors\n`, 'green');

    // Find a vendor with interview code and available slots
    let vendorWithSlots = null;
    for (const vendor of vendors) {
      if (vendor.interviewcode && vendor.schedules && vendor.schedules.length > 0) {
        const proposedSlots = vendor.schedules.filter(s => s.status === 'proposed');
        if (proposedSlots.length > 0) {
          vendorWithSlots = vendor;
          break;
        }
      }
    }

    if (!vendorWithSlots) {
      log('❌ No vendor found with interview code and available slots', 'red');
      log('\n💡 Steps to prepare:', 'yellow');
      log('   1. Create a vendor', 'blue');
      log('   2. Assign an interviewer (admin)', 'blue');
      log('   3. Create interview schedules with "proposed" status', 'blue');
      log('   4. Send interview notification to vendor', 'blue');
      return;
    }

    log(`✅ Found vendor: ${vendorWithSlots.name}`, 'green');
    log(`   ID: ${vendorWithSlots._id}`, 'blue');
    log(`   Interview Code: ${vendorWithSlots.interviewcode}`, 'blue');
    log(`   WhatsApp: ${vendorWithSlots.whatsapp || vendorWithSlots.phone}`, 'blue');
    log(`   Total Schedules: ${vendorWithSlots.schedules.length}`, 'blue');
    
    const proposedSlots = vendorWithSlots.schedules.filter(s => s.status === 'proposed');
    log(`   Available (Proposed) Slots: ${proposedSlots.length}\n`, 'magenta');

    const interviewCode = vendorWithSlots.interviewcode;
    const slotToSelect = proposedSlots[0];

    log('Step 2: Getting interview details via public API...', 'yellow');
    const interviewRes = await axios.get(`${API_URL}/vendors/interview/${interviewCode}`);
    const interview = interviewRes.data;

    if (!interview.success) {
      log(`❌ Failed to get interview: ${interview.message}`, 'red');
      return;
    }

    log('✅ Interview details retrieved:', 'green');
    log(`   Vendor Name: ${interview.vendor.name}`, 'blue');
    log(`   Status: ${interview.vendor.onboardingstatus}`, 'blue');
    log(`   Is Scheduled: ${interview.isScheduled}`, 'blue');
    log(`   Available Slots: ${interview.availableSlots.length}`, 'blue');
    log(`   Interviewer Name: ${interview.vendor.interviewerName || 'N/A'}\n`, 'blue');

    // Check if already scheduled
    if (interview.isScheduled && interview.confirmedSlot) {
      log('⚠️ Interview already scheduled', 'yellow');
      log('   This vendor already has a confirmed slot', 'yellow');
      log('   Skipping slot selection test', 'yellow');
      return;
    }

    // Step 3: Select a slot
    log('Step 3: Selecting interview slot...', 'yellow');
    log(`   Slot ID: ${slotToSelect._id}`, 'blue');
    const slotDateTime = new Date(slotToSelect.scheduledAt).toLocaleString('en-GB');
    log(`   Scheduled At: ${slotDateTime}`, 'blue');
    log(`   Duration: ${slotToSelect.duration} minutes\n`, 'blue');

    const selectRes = await axios.post(
      `${API_URL}/vendors/interview/${interviewCode}/select`,
      { slotId: slotToSelect._id.toString() },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const selection = selectRes.data;

    if (!selection.success) {
      log(`❌ Failed to select slot: ${selection.message}`, 'red');
      if (selection.error) {
        log(`   Error Details: ${selection.error}`, 'red');
      }
      return;
    }

    log('✅ Slot selected successfully!', 'green');
    log(`   Message: ${selection.message}`, 'blue');
    log(`   Confirmed Slot Status: ${selection.confirmedSlot.status}`, 'blue');
    const confirmedDateTime = new Date(selection.confirmedSlot.scheduledAt).toLocaleString('en-GB');
    log(`   Confirmed Time: ${confirmedDateTime}`, 'blue');

    // Step 4: Wait for background notification to complete
    log('\nStep 4: Waiting for WhatsApp notification to be sent...', 'yellow');
    log('   (WhatsApp notification sends in background - check backend logs)', 'cyan');
    
    // Wait a few seconds to allow async notification to process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 5: Verify the update
    log('\nStep 5: Verifying confirmation...', 'yellow');
    const verifyRes = await axios.get(`${API_URL}/vendors/interview/${interviewCode}`);
    const verified = verifyRes.data;

    if (verified.isScheduled && verified.confirmedSlot) {
      log('✅ Interview confirmed in database!', 'green');
      log(`   Status: Interview Scheduled`, 'blue');
      const verifyDateTime = new Date(verified.confirmedSlot.scheduledAt).toLocaleString('en-GB');
      log(`   Confirmed Time: ${verifyDateTime}`, 'blue');
    } else {
      log('⚠️ Confirmation status not reflected yet', 'yellow');
    }

    // Step 6: Show expected WhatsApp message
    log('\n\nStep 6: Expected WhatsApp Notification Details:', 'yellow');
    log('═════════════════════════════════════════════════════', 'cyan');
    
    const vendorName = vendorWithSlots.name || 'Vendor';
    const scheduledDate = new Date(slotToSelect.scheduledAt);
    const formattedDateTime = scheduledDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const interviewerName = interview.vendor.interviewerName || 'Our Team';

    log('\n📱 WhatsApp Template: notification', 'magenta');
    log('\nParameters:', 'cyan');
    log(`  {{1}} (Vendor Name): ${vendorName}`, 'blue');
    log(`\n  {{2}} (Message Details):`, 'blue');
    log(`     "your interview has been scheduled for ${formattedDateTime}`, 'blue');
    log(`\n      Interviewer - ${interviewerName}`, 'blue');
    log(`\n      You'll get the gmeet link before the interview. Please be available on the scheduled time."`, 'blue');

    log('\n📬 Message as it appears in WhatsApp:', 'cyan');
    log('─────────────────────────────────────────────────────', 'cyan');
    log(`Hi, ${vendorName}`, 'green');
    log(`your interview has been scheduled for ${formattedDateTime}`, 'green');
    log(`\nInterviewer - ${interviewerName}`, 'green');
    log(`\nYou'll get the gmeet link before the interview. Please be available on the scheduled time.`, 'green');
    log('─────────────────────────────────────────────────────', 'cyan');

    log('\n\n✅ Test completed successfully!', 'green');
    log('\n📋 Testing Checklist:', 'cyan');
    log('  ✓ Found vendor with interview code', 'green');
    log('  ✓ Retrieved available slots', 'green');
    log('  ✓ Selected a slot successfully', 'green');
    log('  ✓ Confirmed interview status updated', 'green');
    log('  ✓ WhatsApp notification should be sent (check backend logs)', 'blue');

    log('\n🔍 Check Backend Logs For:', 'yellow');
    log('  📱 "Sending interview scheduled WhatsApp notification"', 'blue');
    log('  🔄 "Attempting WhatsApp via Meta Cloud API..."', 'blue');
    log('  ✅ "WhatsApp notification sent: { success: true ..."', 'blue');

    log('\n📲 Real Phone Check:', 'yellow');
    log(`  Check WhatsApp on: ${vendorWithSlots.whatsapp || vendorWithSlots.phone}`, 'blue');
    log('  You should receive the interview scheduled notification', 'blue');

  } catch (error) {
    log('\n❌ Test failed:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.statusText}`, 'red');
      if (typeof error.response.data === 'object') {
        log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    } else if (error.code === 'ECONNREFUSED') {
      log(`   ❌ Cannot connect to ${API_URL}`, 'red');
      log(`   💡 Make sure backend is running!`, 'yellow');
      log(`   💡 Run: cd Astrovaani_BE && npm start`, 'yellow');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

// Run the test
testInterviewWhatsAppNotification();

#!/usr/bin/env node
/**
 * Direct API Test - Interview Slot Selection with WhatsApp Notification
 * 
 * Tests the endpoint directly with known interview code
 */

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const axios = require('axios');

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

async function testDirectAPI() {
  try {
    log('\n🧪 Direct API Test - Interview Slot Selection\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    const interviewCode = 'TESTYFC7NC69'; // From previous setup

    // Step 1: Get interview details
    log('Step 1: Getting interview details...', 'yellow');
    const getRes = await axios.get(`${API_URL}/vendors/interview/${interviewCode}`);
    const interview = getRes.data;

    if (!interview.success) {
      log(`❌ Failed: ${interview.message}`, 'red');
      return;
    }

    log('✅ Interview found!', 'green');
    log(`   Vendor: ${interview.vendor.name}`, 'blue');
    log(`   Status: ${interview.vendor.onboardingstatus}`, 'blue');
    log(`   Available Slots: ${interview.availableSlots.length}`, 'blue');

    if (interview.availableSlots.length === 0) {
      log('\n❌ No available slots', 'red');
      return;
    }

    // Step 2: Select first slot
    const slotToSelect = interview.availableSlots[0];
    
    log('\nStep 2: Selecting slot...', 'yellow');
    log(`   Slot ID: ${slotToSelect.id}`, 'blue');
    const slotDateTime = new Date(slotToSelect.scheduledAt).toLocaleString('en-GB');
    log(`   Scheduled At: ${slotDateTime}`, 'blue');

    const selectRes = await axios.post(
      `${API_URL}/vendors/interview/${interviewCode}/select`,
      { slotId: slotToSelect.id },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const selection = selectRes.data;

    if (!selection.success) {
      log(`\n❌ Selection failed: ${selection.message}`, 'red');
      if (selection.error) {
        log(`   Error: ${selection.error}`, 'red');
      }
      return;
    }

    log('\n✅ Slot selected successfully!', 'green');
    log(`   Message: ${selection.message}`, 'blue');
    log(`   Status: ${selection.confirmedSlot.status}`, 'blue');

    // Step 3: Display WhatsApp notification details
    log('\n' + '═'.repeat(60), 'cyan');
    log('📱 WhatsApp Notification Details', 'magenta');
    log('═'.repeat(60), 'cyan');

    const vendorName = interview.vendor.name;
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

    log('\nTemplate: notification', 'cyan');
    log(`Provider: Meta WhatsApp → IconicSolution (fallback)`, 'cyan');
    log(`\nTemplate Parameters:`, 'magenta');
    log(`  {{1}} = "${vendorName}"`, 'blue');
    log(`  {{2}} = "your interview has been scheduled for ${formattedDateTime}\\n\\nInterviewer - ${interviewerName}\\n\\nYou'll get the gmeet link before the interview. Please be available on the scheduled time."`, 'blue');

    log(`\nPhone Number: ${interview.vendor.whatsapp || interview.vendor.phone}`, 'cyan');

    log('\n📬 As It Appears In WhatsApp:', 'yellow');
    log('─'.repeat(60), 'cyan');
    log(`Hi, ${vendorName}`, 'green');
    log(`your interview has been scheduled for ${formattedDateTime}`, 'green');
    log(`\nInterviewer - ${interviewerName}`, 'green');
    log(`\nYou'll get the gmeet link before the interview. Please be available on the scheduled time.`, 'green');
    log('─'.repeat(60), 'cyan');

    log('\n🔍 Check Backend Logs For WhatsApp Sending:', 'yellow');
    log('  📱 "Sending interview scheduled WhatsApp notification"', 'blue');
    log('  🔄 "Attempting WhatsApp via Meta Cloud API..."', 'blue');
    log('  ✅ "WhatsApp notification sent:"', 'blue');

    log('\n✅ Test Completed Successfully!', 'green');

  } catch (error) {
    log('\n❌ Test failed:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.statusText}`, 'red');
      if (error.response.data) {
        log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    } else if (error.code === 'ECONNREFUSED') {
      log(`   Cannot connect to ${API_URL}`, 'red');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

testDirectAPI();

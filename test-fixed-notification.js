#!/usr/bin/env node
/**
 * Test Fixed Interview Notification - No Newlines
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

async function testFixedImplementation() {
  try {
    log('\n🧪 Testing Fixed Interview Notification (No Newlines)\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    const interviewCode = 'TESTG08LNUSV'; // Latest test code

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
    log(`   Phone: ${interview.vendor.whatsapp || interview.vendor.phone}`, 'blue');
    log(`   Available Slots: ${interview.availableSlots.length}`, 'blue\n');

    if (interview.availableSlots.length === 0) {
      log('❌ No available slots', 'red');
      return;
    }

    // Step 2: Select first slot with fixed implementation
    const slotToSelect = interview.availableSlots[0];
    
    log('Step 2: Selecting slot (with fixed implementation)...', 'yellow');
    log(`   Slot: ${new Date(slotToSelect.scheduledAt).toLocaleString('en-GB')}`, 'blue\n');

    const selectRes = await axios.post(
      `${API_URL}/vendors/interview/${interviewCode}/select`,
      { slotId: slotToSelect.id }
    );

    const selection = selectRes.data;

    if (!selection.success) {
      log(`❌ Selection failed: ${selection.message}`, 'red');
      return;
    }

    log('✅ Slot selected successfully!\n', 'green');

    // Step 3: Display expected message format
    log('═'.repeat(70), 'cyan');
    log('📱 WhatsApp Message (Fixed - No Newlines)', 'magenta');
    log('═'.repeat(70), 'cyan');

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

    log(`\nTemplate Parameters (sent to API):`, 'cyan');
    log(`  {{1}}: ${vendorName}`, 'blue');
    log(`  {{2}}: your interview has been scheduled for ${formattedDateTime}. Interviewer - ${interviewerName}. You'll get the gmeet link before the interview. Please be available on the scheduled time.`, 'blue');

    log(`\n📬 How It Appears In WhatsApp:`, 'yellow');
    log('─'.repeat(70), 'cyan');
    log(`Hi, ${vendorName}`, 'green');
    log(`your interview has been scheduled for ${formattedDateTime}. Interviewer - ${interviewerName}. You'll get the gmeet link before the interview. Please be available on the scheduled time.`, 'green');
    log('─'.repeat(70), 'cyan');

    log('\n🔍 Check Backend Logs For:', 'yellow');
    log('  ✅ "Attempting WhatsApp via Meta Cloud API..."', 'blue');
    log('  ✅ "✅ WhatsApp sent successfully via Meta WhatsApp!"', 'blue');
    log('  OR if Meta fails:', 'blue');
    log('  🔄 "Attempting fallback to IconicSolution..."', 'blue');

    log('\n✅ Test completed successfully!', 'green');
    log('   If provider licenses are active, notification should be sent now', 'blue');

  } catch (error) {
    log('\n❌ Test failed:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      if (error.response.data) {
        log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

testFixedImplementation();

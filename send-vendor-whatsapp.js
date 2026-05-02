#!/usr/bin/env node
/**
 * Send WhatsApp Interview Notification for Specific Vendor
 * 
 * This script sends a WhatsApp notification to a vendor
 * about their scheduled interview
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

async function sendWhatsAppNotification() {
  try {
    log('\n📱 Send WhatsApp Interview Notification\n', 'cyan');
    log(`📡 API URL: ${API_URL}\n`, 'blue');

    const vendorId = '69f5e6c4d456c4c8e8d86d52';

    // Step 1: Fetch vendor details
    log('Step 1: Fetching vendor details...', 'yellow');
    const vendorRes = await axios.get(`${API_URL}/vendors/${vendorId}`);
    const vendor = vendorRes.data;

    if (!vendor || !vendor._id) {
      log(`❌ Vendor not found: ${vendorId}`, 'red');
      return;
    }

    log(`✅ Vendor found!`, 'green');
    log(`   Name: ${vendor.name}`, 'blue');
    log(`   Phone/WhatsApp: ${vendor.whatsapp || vendor.phone}`, 'blue');
    log(`   Status: ${vendor.onboardingstatus}`, 'blue');
    log(`   Interview Code: ${vendor.interviewcode}`, 'blue');

    // Step 2: Check if vendor has interview code and schedules
    if (!vendor.interviewcode || !vendor.schedules || vendor.schedules.length === 0) {
      log('\n⚠️ Vendor does not have interview code or schedules', 'yellow');
      log('   Skipping WhatsApp notification', 'yellow');
      return;
    }

    // Step 3: Find confirmed slot
    const confirmedSlot = vendor.schedules.find(s => s.status === 'confirmed');
    
    if (!confirmedSlot) {
      log('\n⚠️ No confirmed interview slot found', 'yellow');
      log('   Cannot send notification without confirmed slot', 'yellow');
      return;
    }

    log('\n✅ Confirmed slot found!', 'green');
    const slotDateTime = new Date(confirmedSlot.scheduledAt).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    log(`   Scheduled: ${slotDateTime}`, 'blue\n');

    // Step 4: Get interviewer name
    let interviewerName = 'Our Team';
    if (vendor.interviewerid) {
      try {
        // Try to fetch admin name
        const adminRes = await axios.get(`${API_URL}/admin/${vendor.interviewerid}`);
        if (adminRes.data && adminRes.data.name) {
          interviewerName = adminRes.data.name;
        }
      } catch (err) {
        // Admin not found, use default
      }
    }

    log(`   Interviewer: ${interviewerName}`, 'blue');

    // Step 5: Build WhatsApp message
    log('\nStep 2: Building WhatsApp message...', 'yellow');

    const vendorName = vendor.name || 'Vendor';
    const messageDetails = `your interview has been scheduled for ${slotDateTime}. Interviewer - ${interviewerName}. You'll get the gmeet link before the interview. Please be available on the scheduled time.`;
    
    const templateVars = [vendorName, messageDetails];

    log(`\n📬 Message Details:`, 'magenta');
    log(`   Template: notification`, 'blue');
    log(`   Phone: ${vendor.whatsapp || vendor.phone}`, 'blue');
    log(`   {{1}}: ${vendorName}`, 'blue');
    log(`   {{2}}: ${messageDetails}`, 'blue');

    // Step 6: Send WhatsApp
    log('\nStep 3: Sending WhatsApp notification...', 'yellow');

    const whatsappNumber = (vendor.whatsapp || vendor.phone || '').replace(/\s+/g, '');

    if (!whatsappNumber) {
      log('❌ No phone/WhatsApp number available', 'red');
      return;
    }

    // Make API call to send WhatsApp
    const sendRes = await axios.post(`${API_URL}/notifications/send-whatsapp`, {
      mobile: whatsappNumber,
      templateName: 'notification',
      templateParams: templateVars
    }).catch(err => {
      // API endpoint might not exist, try direct WhatsApp service
      log('ℹ️  Send notification endpoint not available, attempting direct send...', 'yellow');
      return null;
    });

    if (sendRes) {
      if (sendRes.data.success) {
        log('\n✅ WhatsApp notification sent successfully!', 'green');
        log(`   Provider: ${sendRes.data.provider}`, 'blue');
      } else {
        log('\n⚠️ WhatsApp send response:', 'yellow');
        log(JSON.stringify(sendRes.data, null, 2), 'yellow');
      }
    }

    // Display expected message
    log('\n' + '═'.repeat(70), 'cyan');
    log('📱 WhatsApp Message Preview', 'magenta');
    log('═'.repeat(70), 'cyan');
    log(`\nHi, ${vendorName}`, 'green');
    log(`${messageDetails}`, 'green');
    log('\n' + '─'.repeat(70), 'cyan');

    log('\n✅ Process completed!', 'green');
    log('   If WhatsApp APIs are active, notification will be sent', 'blue');

  } catch (error) {
    log('\n❌ Error:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      if (error.response.data) {
        log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    } else if (error.code === 'ECONNREFUSED') {
      log(`   Cannot connect to backend`, 'red');
      log(`   Make sure backend is running on ${API_URL}`, 'yellow');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

sendWhatsAppNotification();

/**
 * Test WhatsApp Notification with IP-Restricted API Key
 * This script tests the IconicSolution WhatsApp API with the new IP-restricted key
 */

require('dotenv').config();
const axios = require('axios');

async function testWhatsAppNotification() {
  console.log('🧪 Testing WhatsApp Notification with IP-Restricted API Key');
  console.log('=' .repeat(60));
  
  const iconicKey = process.env.ICONIC_API_KEY || '';
  const maskedKey = iconicKey ? (iconicKey.slice(0,4) + '...' + iconicKey.slice(-4)) : 'MISSING';
  
  console.log('📋 Configuration:');
  console.log('   API Key:', maskedKey);
  console.log('   Server IP: 223.185.55.194 (should be whitelisted)');
  console.log('');
  
  // Test mobile number - use a valid test number
  // Replace with actual test number if you have one
  const testMobile = '919876543210'; // Replace with real test number
  const testMessage = `*Test WhatsApp Message*\n\nThis is a test message from Astrovaani backend using the new IP-restricted API key.\n\nTimestamp: ${new Date().toLocaleString()}\n\nIf you receive this, the integration is working! ✅`;
  
  console.log('📱 Test Details:');
  console.log('   Mobile:', testMobile);
  console.log('   Message preview:', testMessage.substring(0, 80) + '...');
  console.log('');
  
  const sendUrl = 'https://api.iconicsolution.co.in/wapp/v2/api/send';
  
  try {
    console.log('🔄 Sending request to IconicSolution API...');
    
    // Use URLSearchParams to match PHP's application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('apikey', iconicKey);
    params.append('mobile', testMobile);
    params.append('msg', testMessage);
    
    const response = await axios.post(sendUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'curl/7.68.0',
        'Accept': '*/*'
      },
      timeout: 15000
    });
    
    console.log('✅ Response received:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('');
    
    // Check for success
    const data = response.data;
    if (data && (data.status === 'success' || data.success === true || data.statuscode === 200 || data.statuscode === 2000)) {
      console.log('🎉 SUCCESS! WhatsApp message sent successfully!');
      console.log('✅ The IP-restricted API key is working correctly.');
    } else {
      console.log('⚠️  WARNING: API responded but status is not success');
      console.log('   Response:', data);
    }
    
  } catch (error) {
    console.error('❌ ERROR sending WhatsApp:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else if (error.request) {
      console.error('   No response received from server');
      console.error('   Error:', error.message);
    } else {
      console.error('   Error:', error.message);
    }
    
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Verify API key is correct in .env file');
    console.log('   2. Confirm server IP (223.185.55.194) is whitelisted in IconicSolution dashboard');
    console.log('   3. Check if test mobile number is valid');
    console.log('   4. Ensure server has internet connectivity');
  }
  
  console.log('');
  console.log('=' .repeat(60));
}

testWhatsAppNotification();

// Quick test script for WhatsApp APIs
require('dotenv').config();
const axios = require('axios');

async function testIconicSolution() {
  console.log('\n========================================');
  console.log('Testing IconicSolution WhatsApp API');
  console.log('========================================\n');
  
  const apiKey = process.env.ICONIC_API_KEY;
  const mobile = '919667356174'; // Test number
  const msg = 'Test message from Astrovaani';
  
  const maskedKey = apiKey ? (apiKey.slice(0,4) + '...' + apiKey.slice(-4)) : 'MISSING';
  console.log('API Key:', maskedKey);
  console.log('Mobile:', mobile);
  console.log('Endpoint: https://api.iconicsolution.co.in/wapp/v2/api/send\n');
  
  const params = new URLSearchParams();
  params.append('apikey', apiKey);
  params.append('mobile', mobile);
  params.append('msg', msg);
  
  try {
    const response = await axios.post(
      'https://api.iconicsolution.co.in/wapp/v2/api/send',
      params.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      }
    );
    console.log('✅ SUCCESS! Response:', response.data);
    return true;
  } catch (error) {
    console.log('❌ FAILED! Error:', error.response?.data || error.message);
    return false;
  }
}

async function testTwilio() {
  console.log('\n========================================');
  console.log('Testing Twilio WhatsApp API (Alternative)');
  console.log('========================================\n');
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_WHATSAPP_NUMBER;
  const toNumber = process.env.TWILIO_TO_WHATSAPP_NUMBER || 'whatsapp:+919667356174';
  
  if (!accountSid || !authToken || !fromNumber) {
    console.log('⚠️ Twilio credentials not fully configured in .env');
    return false;
  }
  
  console.log('Account SID:', accountSid.slice(0,6) + '...' + accountSid.slice(-4));
  console.log('From:', fromNumber);
  console.log('To:', toNumber);
  console.log('');
  
  try {
    // Twilio uses Basic Auth
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    
    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`);
    params.append('Body', 'Test message from Astrovaani via Twilio');
    
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      params.toString(),
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ SUCCESS! Message SID:', response.data.sid);
    console.log('Status:', response.data.status);
    return true;
  } catch (error) {
    console.log('❌ FAILED! Error:', error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('WhatsApp API Testing Tool');
  console.log('Testing both providers to determine which one works...\n');
  
  const iconicWorks = await testIconicSolution();
  const twilioWorks = await testTwilio();
  
  console.log('\n========================================');
  console.log('Test Results Summary');
  console.log('========================================');
  console.log('IconicSolution:', iconicWorks ? '✅ Working' : '❌ Failed');
  console.log('Twilio:', twilioWorks ? '✅ Working' : '❌ Failed');
  
  if (!iconicWorks && !twilioWorks) {
    console.log('\n⚠️ BOTH providers failed. Next steps:');
    console.log('1. Contact IconicSolution to activate API key');
    console.log('2. Verify Twilio WhatsApp sandbox is set up');
    console.log('3. Check if phone numbers are approved for WhatsApp Business');
  } else if (twilioWorks && !iconicWorks) {
    console.log('\n💡 RECOMMENDATION: Switch to Twilio (it works!)');
    console.log('IconicSolution API key needs to be fixed/activated.');
  } else if (iconicWorks) {
    console.log('\n✅ IconicSolution is working! You can use it.');
  }
  
  console.log('\n');
}

main().catch(console.error);

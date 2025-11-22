require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.ICONIC_API_KEY || '0bf9865d140d4676b28be02813fbf1c8';
const TEST_MOBILE = '919876543210';
const TEST_MSG = 'Test message from Node.js using HTTPS';

async function testHTTPS() {
  console.log('\n━━━ Testing HTTPS Endpoint (Matching PHP) ━━━');
  console.log('🔑 API KEY:', API_KEY.slice(0,4) + '...' + API_KEY.slice(-4));
  console.log('📱 Mobile:', TEST_MOBILE);
  
  // Use HTTPS (not HTTP!) - this is what PHP uses
  const url = 'https://api.iconicsolution.co.in/wapp/v2/api/send';
  
  const params = new URLSearchParams();
  params.append('apikey', API_KEY);
  params.append('mobile', TEST_MOBILE);
  params.append('msg', TEST_MSG);
  
  try {
    console.log('🔄 Sending POST request to:', url);
    const res = await axios.post(url, params.toString(), {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 15000
    });
    
    console.log('✅ Response:', res.data);
    
    if (res.data.status === 'success' || res.data.statuscode === 200) {
      console.log('🎉 SUCCESS! WhatsApp message sent!');
    } else {
      console.log('⚠️ Response not success:', res.data);
    }
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

testHTTPS();

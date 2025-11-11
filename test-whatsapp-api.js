require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.ICONIC_API_KEY || '0bf9865d140d4676b28be02813fbf1c8';
const TEST_MOBILE = '919876543210'; // Replace with actual test number
const TEST_MESSAGE = 'Test message from Node.js API - Astrovaani';

const sendUrl = 'https://api.iconicsolution.co.in/wapp/v2/api/send';

async function testWhatsAppAPI() {
  console.log('🧪 Testing IconicSolution WhatsApp API\n');
  console.log('API Key:', API_KEY.slice(0,4) + '...' + API_KEY.slice(-4));
  console.log('Mobile:', TEST_MOBILE);
  console.log('Endpoint:', sendUrl);
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 1: URLSearchParams (application/x-www-form-urlencoded) - MATCHES PHP
  console.log('TEST 1: URLSearchParams (x-www-form-urlencoded) - PHP-style');
  console.log('-'.repeat(60));
  try {
    const params = new URLSearchParams();
    params.append('apikey', API_KEY);
    params.append('mobile', TEST_MOBILE);
    params.append('msg', TEST_MESSAGE);
    
    console.log('Body:', params.toString());
    console.log('Headers:', { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'curl/7.68.0' });
    
    const res1 = await axios.post(sendUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'curl/7.68.0',
        'Accept': '*/*'
      },
      timeout: 15000
    });
    
    console.log('✅ SUCCESS - Response:', JSON.stringify(res1.data, null, 2));
  } catch (err) {
    console.log('❌ ERROR:', err?.response?.data || err.message);
    if (err?.response?.status) {
      console.log('   HTTP Status:', err.response.status);
      console.log('   Headers:', err.response.headers);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Plain object (axios auto-converts to x-www-form-urlencoded)
  console.log('TEST 2: Plain object (axios auto-conversion)');
  console.log('-'.repeat(60));
  try {
    const data2 = {
      apikey: API_KEY,
      mobile: TEST_MOBILE,
      msg: TEST_MESSAGE
    };
    
    console.log('Body:', data2);
    
    const res2 = await axios.post(sendUrl, data2, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 15000
    });
    
    console.log('✅ SUCCESS - Response:', JSON.stringify(res2.data, null, 2));
  } catch (err) {
    console.log('❌ ERROR:', err?.response?.data || err.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Minimal headers (only Content-Type)
  console.log('TEST 3: Minimal headers (only Content-Type)');
  console.log('-'.repeat(60));
  try {
    const params3 = new URLSearchParams();
    params3.append('apikey', API_KEY);
    params3.append('mobile', TEST_MOBILE);
    params3.append('msg', TEST_MESSAGE);
    
    const res3 = await axios.post(sendUrl, params3.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 15000
    });
    
    console.log('✅ SUCCESS - Response:', JSON.stringify(res3.data, null, 2));
  } catch (err) {
    console.log('❌ ERROR:', err?.response?.data || err.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 4: Different mobile format (without 91 prefix)
  console.log('TEST 4: Different mobile format (without country code)');
  console.log('-'.repeat(60));
  try {
    const params4 = new URLSearchParams();
    params4.append('apikey', API_KEY);
    params4.append('mobile', TEST_MOBILE.replace('91', '')); // Remove country code
    params4.append('msg', TEST_MESSAGE);
    
    const res4 = await axios.post(sendUrl, params4.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'curl/7.68.0'
      },
      timeout: 15000
    });
    
    console.log('✅ SUCCESS - Response:', JSON.stringify(res4.data, null, 2));
  } catch (err) {
    console.log('❌ ERROR:', err?.response?.data || err.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🏁 All tests completed!\n');
  console.log('💡 NEXT STEPS:');
  console.log('   1. If all tests fail with "Invalid API Key" (501):');
  console.log('      - Contact IconicSolution support to verify:');
  console.log('        * API key is active and valid');
  console.log('        * IP whitelisting (may need to whitelist your server IP)');
  console.log('        * Account restrictions or domain locks');
  console.log('   2. If tests succeed:');
  console.log('      - Update vendorController.js with working configuration');
  console.log('   3. Alternative:');
  console.log('      - Ask IconicSolution about template-based messaging');
  console.log('      - Check if they have a different endpoint for Node.js apps');
}

testWhatsAppAPI().catch(console.error);

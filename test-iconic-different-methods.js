require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.ICONIC_API_KEY;
const TEST_MOBILE = '919876543210'; // Test number
const TEST_MSG = 'Test message from Node.js';

async function testMethod1_URLSearchParams() {
  console.log('\n━━━ METHOD 1: URLSearchParams (x-www-form-urlencoded) ━━━');
  const url = 'http://api.iconicsolution.co.in/wapp/v2/api/send';
  const params = new URLSearchParams();
  params.append('apikey', API_KEY);
  params.append('mobile', TEST_MOBILE);
  params.append('msg', TEST_MSG);
  
  try {
    const res = await axios.post(url, params.toString(), {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'curl/7.68.0',
        'Accept': '*/*'
      },
      timeout: 15000
    });
    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

async function testMethod2_QueryString() {
  console.log('\n━━━ METHOD 2: GET with Query String ━━━');
  const url = 'http://api.iconicsolution.co.in/wapp/v2/api/send';
  
  try {
    const res = await axios.get(url, {
      params: {
        apikey: API_KEY,
        mobile: TEST_MOBILE,
        msg: TEST_MSG
      },
      timeout: 15000
    });
    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

async function testMethod3_JSONPost() {
  console.log('\n━━━ METHOD 3: POST with JSON body ━━━');
  const url = 'http://api.iconicsolution.co.in/wapp/v2/api/send';
  
  try {
    const res = await axios.post(url, {
      apikey: API_KEY,
      mobile: TEST_MOBILE,
      msg: TEST_MSG
    }, {
      headers: { 
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

async function testMethod4_ManualFormData() {
  console.log('\n━━━ METHOD 4: Manual form-data string ━━━');
  const url = 'http://api.iconicsolution.co.in/wapp/v2/api/send';
  
  const body = `apikey=${encodeURIComponent(API_KEY)}&mobile=${encodeURIComponent(TEST_MOBILE)}&msg=${encodeURIComponent(TEST_MSG)}`;
  
  try {
    const res = await axios.post(url, body, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 15000
    });
    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

async function testMethod5_HTTPS() {
  console.log('\n━━━ METHOD 5: Try HTTPS endpoint ━━━');
  const url = 'https://api.iconicsolution.co.in/wapp/v2/api/send';
  const params = new URLSearchParams();
  params.append('apikey', API_KEY);
  params.append('mobile', TEST_MOBILE);
  params.append('msg', TEST_MSG);
  
  try {
    const res = await axios.post(url, params.toString(), {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 15000
    });
    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

async function runAllTests() {
  console.log('🔑 API KEY:', API_KEY ? (API_KEY.slice(0,4) + '...' + API_KEY.slice(-4)) : 'MISSING');
  console.log('📱 Test Mobile:', TEST_MOBILE);
  console.log('💬 Test Message:', TEST_MSG);
  
  await testMethod1_URLSearchParams();
  await new Promise(r => setTimeout(r, 1000));
  
  await testMethod2_QueryString();
  await new Promise(r => setTimeout(r, 1000));
  
  await testMethod3_JSONPost();
  await new Promise(r => setTimeout(r, 1000));
  
  await testMethod4_ManualFormData();
  await new Promise(r => setTimeout(r, 1000));
  
  await testMethod5_HTTPS();
}

runAllTests().then(() => {
  console.log('\n✅ All tests completed');
}).catch(err => {
  console.error('\n❌ Test suite error:', err);
});

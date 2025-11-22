const axios = require('axios');

const PROXY_URL = 'https://astrovaani.com/apis/whatsapp_proxy.php';
const TEST_MOBILE = '919876543210';
const TEST_MSG = 'Test message via PHP proxy from Node.js';

async function testPhpProxy() {
  console.log('\n━━━ Testing PHP Proxy ━━━');
  console.log('📡 Proxy URL:', PROXY_URL);
  console.log('📱 Mobile:', TEST_MOBILE);
  console.log('💬 Message:', TEST_MSG);
  
  try {
    console.log('\n🔄 Sending request to PHP proxy...');
    const response = await axios.post(PROXY_URL, {
      mobile: TEST_MOBILE,
      msg: TEST_MSG
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('\n✅ Proxy Response:', response.data);
    
    if (response.data.status === 'success' || response.data.statuscode === 200 || response.data.statuscode === 2000) {
      console.log('\n🎉 SUCCESS! WhatsApp sent via PHP proxy!');
    } else {
      console.log('\n⚠️ Response:', response.data);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    console.error('Status Code:', error.response?.status);
  }
}

testPhpProxy();

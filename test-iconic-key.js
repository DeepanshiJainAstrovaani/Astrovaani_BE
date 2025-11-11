// Test IconicSolution API key with correct endpoint from dashboard
require('dotenv').config();
const axios = require('axios');

async function testIconicAPI() {
  const apiKey = process.env.ICONIC_API_KEY;
  const mobile = '919667356174'; // Test number
  const msg = 'Test from Astrovaani';
  
  console.log('\n====================================');
  console.log('Testing IconicSolution WhatsApp API');
  console.log('====================================\n');
  console.log('API Key:', apiKey ? (apiKey.slice(0,4) + '...' + apiKey.slice(-4)) : 'MISSING');
  console.log('Mobile:', mobile);
  console.log('\nTrying multiple endpoints...\n');
  
  const endpoints = [
    'http://api.iconicsolution.co.in/wapp/v2/api/send',
    'https://api.iconicsolution.co.in/wapp/v2/api/send',
    'http://wa.iconicsolution.co.in/wapp/api/v2/send',
    'https://wa.iconicsolution.co.in/wapp/api/v2/send'
  ];
  
  for (const baseUrl of endpoints) {
    const url = `${baseUrl}?apikey=${encodeURIComponent(apiKey)}&mobile=${encodeURIComponent(mobile)}&msg=${encodeURIComponent(msg)}`;
    console.log(`Testing GET: ${baseUrl}`);
    
    try {
      const response = await axios.get(url, { timeout: 5000 });
      console.log('✅ SUCCESS! Response:', JSON.stringify(response.data, null, 2));
      console.log(`\n🎉 Working endpoint found: ${baseUrl}\n`);
      return { success: true, endpoint: baseUrl, response: response.data };
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        console.log(`  Status ${status}:`, typeof data === 'string' ? data.substring(0, 100) : JSON.stringify(data));
      } else {
        console.log(`  Error: ${error.message}`);
      }
    }
  }
  
  return { success: false };
}

testIconicAPI().then(result => {
  console.log('\n====================================');
  if (result.success) {
    console.log('✅ IconicSolution API is working!');
    console.log(`Use endpoint: ${result.endpoint}`);
  } else {
    console.log('❌ All endpoints failed!');
    console.log('\n📞 Next steps:');
    console.log('1. Contact IconicSolution support');
    console.log('2. Ask them for the correct API endpoint');
    console.log('3. Verify your API key is activated');
    console.log('4. Check if your account is approved for WhatsApp Business');
  }
  console.log('====================================\n');
});


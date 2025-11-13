// Direct test of WhatsApp API - EXACT PHP method
const axios = require('axios');
const FormData = require('form-data');

async function testWhatsApp() {
  console.log('🧪 Testing WhatsApp API (EXACT PHP method)');
  console.log('='.repeat(50));
  
  const apiUrl = 'https://api.iconicsolution.co.in/wapp/v2/api/send';
  
  // Try different API keys
  const apiKeys = [
    { name: 'PHP Key', key: '0bf9865d140d4676b28be02813fbf1c8' },
    { name: '.env Key', key: '0eba14ecf1ab4cf99cf5534edb4173e7' }
  ];
  
  const mobile = '918168095773'; // Test number (replace with your number)
  const msg = '*Test Message from Node.js*\n\nThis is a test message to verify the WhatsApp API integration.\n\nIf you receive this, the API is working correctly!';
  
  console.log('\n📝 Request Details:');
  console.log('   URL:', apiUrl);
  console.log('   API Key:', apiKey.substring(0, 8) + '...');
  console.log('   Mobile:', mobile);
  console.log('   Message:', msg.substring(0, 50) + '...');
  
  try {
    console.log('\n🔄 Sending request...');
    
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('mobile', mobile);
    formData.append('msg', msg);
    
    const response = await axios.post(apiUrl, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });
    
    console.log('\n✅ Response received:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.status === 'success' || response.data.statuscode === 200) {
      console.log('\n🎉 SUCCESS! WhatsApp API is working!');
    } else {
      console.log('\n⚠️  Response received but status unclear');
    }
    
  } catch (error) {
    console.log('\n❌ Error:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('   Message:', error.message);
    }
  }
}

testWhatsApp();

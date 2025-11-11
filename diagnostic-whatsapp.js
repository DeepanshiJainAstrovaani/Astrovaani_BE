/**
 * Comprehensive WhatsApp API Diagnostic Tool
 * Tests multiple scenarios to identify the issue
 */

require('dotenv').config();
const axios = require('axios');

async function comprehensiveDiagnostic() {
  console.log('🔍 COMPREHENSIVE WHATSAPP API DIAGNOSTIC');
  console.log('=' .repeat(70));
  console.log('');
  
  // Test 1: Current IP Check
  console.log('📍 TEST 1: Server IP Address');
  console.log('-'.repeat(70));
  try {
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    console.log('   Current Public IP:', ipResponse.data.ip);
    console.log('   Expected IP:', '223.185.55.194');
    console.log('   Match:', ipResponse.data.ip === '223.185.55.194' ? '✅ YES' : '❌ NO');
  } catch (err) {
    console.log('   ❌ Could not fetch IP:', err.message);
  }
  console.log('');
  
  // Test 2: API Key Configuration
  console.log('📋 TEST 2: API Key Configuration');
  console.log('-'.repeat(70));
  const newKey = process.env.ICONIC_API_KEY || '';
  console.log('   New Key (IP-restricted):', newKey ? (newKey.slice(0,8) + '...' + newKey.slice(-8)) : 'MISSING');
  console.log('   Key Length:', newKey.length);
  console.log('   Key Format:', /^[a-f0-9]{32}$/.test(newKey) ? '✅ Valid MD5-like format' : '⚠️  Unexpected format');
  console.log('');
  
  // Test 3: Try the PHP working key for comparison
  console.log('📋 TEST 3: Compare with PHP Working Key');
  console.log('-'.repeat(70));
  const phpKey = '0bf9865d140d4676b28be02813fbf1c8';
  console.log('   PHP Key:', phpKey.slice(0,8) + '...' + phpKey.slice(-8));
  console.log('');
  
  // Test 4: Test new API key
  console.log('🧪 TEST 4: Testing New IP-Restricted API Key');
  console.log('-'.repeat(70));
  await testApiKey(newKey, 'New IP-Restricted Key');
  console.log('');
  
  // Test 5: Test PHP key for comparison
  console.log('🧪 TEST 5: Testing PHP Working Key (for comparison)');
  console.log('-'.repeat(70));
  await testApiKey(phpKey, 'PHP Working Key');
  console.log('');
  
  // Summary
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('=' .repeat(70));
  console.log('');
  console.log('✅ Actions Completed:');
  console.log('   1. Generated new API key with IP restriction: 223.185.55.194');
  console.log('   2. Updated .env file with new key');
  console.log('   3. Restarted backend server');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Check IconicSolution dashboard to verify:');
  console.log('      - New API key is active/enabled');
  console.log('      - IP whitelist is correctly saved');
  console.log('      - No additional activation required');
  console.log('   2. Wait 2-5 minutes for key activation (some APIs have delay)');
  console.log('   3. Try deleting old/unused API keys from dashboard');
  console.log('   4. Contact IconicSolution support if issue persists');
  console.log('');
  console.log('=' .repeat(70));
}

async function testApiKey(apiKey, label) {
  // PHP uses HTTP (not HTTPS)!
  const sendUrl = 'http://api.iconicsolution.co.in/wapp/v2/api/send';
  const testMobile = '919876543210'; // Test number
  const testMessage = `Test from ${label} at ${new Date().toISOString()}`;
  
  try {
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('mobile', testMobile);
    params.append('msg', testMessage);
    
    console.log('   Sending request...');
    const response = await axios.post(sendUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'curl/7.68.0',
        'Accept': '*/*'
      },
      timeout: 15000
    });
    
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    
    const data = response.data;
    if (data && (data.status === 'success' || data.success === true || data.statuscode === 200 || data.statuscode === 2000)) {
      console.log('   Result: ✅ SUCCESS');
    } else {
      console.log('   Result: ⚠️  Non-success status');
    }
    
  } catch (error) {
    console.log('   Result: ❌ ERROR');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('   Error:', error.message);
    }
  }
}

comprehensiveDiagnostic();

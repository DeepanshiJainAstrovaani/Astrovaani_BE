require('dotenv').config();
const { sendWhatsApp } = require('./utils/whatsappService');

async function testWhatsAppService() {
  console.log('🧪 Testing WhatsApp Service\n');
  
  // Test mobile number (use your own number for testing)
  const testMobile = '9667356174'; // Replace with actual test number
  const testMessage = `*Test Message from AstroVaani*\n\nThis is a test WhatsApp notification sent via the new multi-provider service.\n\nProviders: Twilio (primary), IconicSolution (fallback)\n\nTimestamp: ${new Date().toISOString()}`;
  
  console.log('Test Configuration:');
  console.log('  Mobile:', testMobile);
  console.log('  Message:', testMessage.substring(0, 100) + '...');
  console.log('  Twilio SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
  console.log('  Twilio Token:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
  console.log('  Iconic Key:', process.env.ICONIC_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('  Preferred Provider:', process.env.WHATSAPP_PROVIDER || 'twilio');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    const result = await sendWhatsApp(testMobile, testMessage, { enableFallback: true });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 RESULT:\n');
    console.log('  Success:', result.success ? '✅ YES' : '❌ NO');
    console.log('  Provider Used:', result.provider || 'None');
    
    if (result.success) {
      console.log('  Response:', JSON.stringify(result.response, null, 2));
    } else {
      console.log('  Error:', result.error);
    }
    
    console.log('\n  Attempts:', result.attempts.length);
    result.attempts.forEach((attempt, i) => {
      console.log(`\n  Attempt ${i + 1}: ${attempt.provider}`);
      console.log(`    Success: ${attempt.success ? '✅' : '❌'}`);
      if (attempt.success) {
        console.log(`    Details:`, JSON.stringify(attempt.result, null, 2).split('\n').map(l => '    ' + l).join('\n').trim());
      } else {
        console.log(`    Error: ${attempt.error}`);
      }
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (result.success) {
      console.log('✅ Test PASSED - WhatsApp sent successfully!');
      console.log(`📱 Check the phone number ${testMobile} for the message.`);
    } else {
      console.log('❌ Test FAILED - No provider succeeded');
    }
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testWhatsAppService();

const axios = require('axios');

// WhatsApp Business API Configuration
const WHATSAPP_CONFIG = {
  phoneNumberId: "629164643621542",
  accessToken: "EAATuPFpuF0IBQ6kvO3V5GYTN6iNF49RVMb0mQOAMXzl7TF1vOtV937Nb08wOnbuamYW3nLHPUOlSscHekF6aL4pZBP6ZCJUiMSzsBsVR6YqwucALZCejfxsKH65ZBteSSweY3PSWuZAp8wLvN0S9kKfUkyScfu2piBaFl7WqenxSZA5zBEA08fR9Bf1eIkjgZDZD",
  apiVersion: "v19.0"
};

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via WhatsApp
const sendWhatsAppOTP = async (phoneNumber, otp) => {
  try {
    // Format phone number (ensure it has country code)
    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('91') && !formattedNumber.startsWith('+91')) {
      formattedNumber = `91${phoneNumber}`;
    }
    formattedNumber = formattedNumber.replace(/^\+/, ''); // Remove + if present

    console.log('📱 Sending WhatsApp OTP to:', formattedNumber);
    console.log('🔢 OTP Code:', otp);

    const url = `https://graph.facebook.com/${WHATSAPP_CONFIG.apiVersion}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: formattedNumber,
      type: "template",
      template: {
        name: "sendotp",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otp
              }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: otp
              }
            ]
          }
        ]
      }
    };

    console.log('📤 Sending request to WhatsApp API...');
    console.log('🔗 URL:', url);
    console.log('📦 Payload:', JSON.stringify(data, null, 2));

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      family: 4, // Force IPv4 to avoid IPv6 connection issues
      timeout: 10000 // 10 second timeout
    });

    console.log('✅ WhatsApp OTP sent successfully!');
    console.log('📨 Response:', JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ WhatsApp OTP sending failed!');
    console.error('🔴 Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('📋 Status:', error.response.status);
      console.error('📋 Headers:', error.response.headers);
      console.error('📋 Data:', JSON.stringify(error.response.data, null, 2));
    }
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

// Test function
const testOTP = async () => {
  console.log('🚀 Starting WhatsApp OTP Test (Astrovaani_BE)...');
  console.log('=' .repeat(50));
  
  const testPhoneNumber = "+918789601387";
  const testOTP = generateOTP();
  
  console.log('📞 Test Phone Number:', testPhoneNumber);
  console.log('🔑 Generated OTP (6-digit):', testOTP);
  console.log('=' .repeat(50));
  
  const result = await sendWhatsAppOTP(testPhoneNumber, testOTP);
  
  console.log('=' .repeat(50));
  if (result.success) {
    console.log('🎉 TEST PASSED: OTP sent successfully!');
  } else {
    console.log('💥 TEST FAILED: Could not send OTP');
  }
  console.log('=' .repeat(50));
};

// Run the test
testOTP();

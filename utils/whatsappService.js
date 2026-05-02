const axios = require('axios');
const twilio = require('twilio');

/**
 * Multi-provider WhatsApp Service
 * Supports: Meta WhatsApp Cloud API (primary), IconicSolution (fallback)
 */

// Helper: normalize mobile to E.164 format (+919876543210)
const normalizeMobileE164 = (raw) => {
  if (!raw) return raw;
  let digits = raw.replace(/[^0-9]/g, '');
  if (digits.length === 10) digits = '91' + digits; // assume India
  if (digits.length === 11 && digits.startsWith('0')) digits = '91' + digits.slice(1);
  return '+' + digits;
};

// Helper: normalize mobile without + prefix (919876543210)
const normalizeMobileNoPrefix = (raw) => {
  const e164 = normalizeMobileE164(raw);
  return e164 ? e164.replace('+', '') : e164;
};

/**
 * Send WhatsApp via Meta WhatsApp Cloud API
 * Supports both simple OTP and template-based messages with parameters
 */
async function sendViaMetaWhatsApp(mobile, messageOrOtp, options = {}) {
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
  
  if (!phoneNumberId || !accessToken) {
    throw new Error('Meta WhatsApp credentials not configured');
  }
  
  const mobileFormatted = normalizeMobileNoPrefix(mobile);
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
  
  // Parse template parameters if provided
  const templateName = options.templateName || 'sendotp';
  let templateParams = [];
  
  if (options.templateParams && Array.isArray(options.templateParams)) {
    templateParams = options.templateParams;
  } else if (typeof messageOrOtp === 'string' && messageOrOtp.startsWith('[')) {
    // Try to parse JSON array
    try {
      templateParams = JSON.parse(messageOrOtp);
    } catch {
      templateParams = [messageOrOtp];
    }
  } else {
    templateParams = [messageOrOtp];
  }
  
  // Build body parameters
  const bodyParameters = templateParams.map(param => ({
    type: "text",
    text: String(param)
  }));
  
  const data = {
    messaging_product: "whatsapp",
    to: mobileFormatted,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: bodyParameters
        }
      ]
    }
  };
  
  // For OTP template, add button parameters
  if (templateName === 'sendotp' && templateParams.length > 0) {
    data.template.components.push({
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [
        {
          type: "text",
          text: String(templateParams[0])
        }
      ]
    });
  }
  
  console.log('📱 Sending via Meta WhatsApp Cloud API');
  console.log('   Phone Number ID:', phoneNumberId);
  console.log('   To:', mobileFormatted);
  console.log('   Template:', templateName);
  console.log('   Parameters:', templateParams);
  
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Meta WhatsApp response:', response.data);
    
    return {
      success: true,
      provider: 'meta_whatsapp',
      messageId: response.data.messages?.[0]?.id,
      status: 'sent',
      raw: response.data
    };
  } catch (error) {
    console.error('❌ Meta WhatsApp error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Meta WhatsApp API failed');
  }
}

/**
 * Send WhatsApp via Twilio
 */
async function sendViaTwilio(mobile, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }
  
  const client = twilio(accountSid, authToken);
  const toNumber = 'whatsapp:' + normalizeMobileE164(mobile);
  
  console.log('📱 Sending via Twilio WhatsApp');
  console.log('   From:', fromNumber);
  console.log('   To:', toNumber);
  console.log('   Message length:', message.length);
  
  const response = await client.messages.create({
    from: fromNumber,
    to: toNumber,
    body: message
  });
  
  console.log('✅ Twilio response:', {
    sid: response.sid,
    status: response.status,
    errorCode: response.errorCode,
    errorMessage: response.errorMessage
  });
  
  return {
    success: true,
    provider: 'twilio',
    sid: response.sid,
    status: response.status,
    raw: response
  };
}

/**
 * Send WhatsApp via IconicSolution (Template-based)
 */
async function sendViaIconicSolution(mobile, messageOrParams, templateName = 'sendotp') {
  const apiKey = process.env.ICONIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('IconicSolution API key not configured');
  }
  
  // Use template endpoint (required for IconicSolution)
  const sendUrl = 'https://wa.iconicsolution.co.in/wapp/api/send/bytemplate';
  const mobileFormatted = normalizeMobileNoPrefix(mobile);
  
  // Parse template parameters
  let dvariablesValue;
  if (Array.isArray(messageOrParams)) {
    dvariablesValue = JSON.stringify(messageOrParams);
  } else if (typeof messageOrParams === 'string' && messageOrParams.startsWith('[')) {
    // Already a JSON string
    dvariablesValue = messageOrParams;
  } else {
    // Single parameter or plain message
    dvariablesValue = JSON.stringify([messageOrParams]);
  }
  
  console.log('📱 Sending via IconicSolution WhatsApp');
  console.log('   Mobile:', mobileFormatted);
  console.log('   Template:', templateName);
  console.log('   Variables:', dvariablesValue);
  
  // Use FormData like customer frontend and vendorController
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('apikey', apiKey);
  formData.append('mobile', mobileFormatted);
  formData.append('templatename', templateName);
  formData.append('dvariables', dvariablesValue);
  
  const response = await axios.post(sendUrl, formData, {
    headers: formData.getHeaders(),
    timeout: 15000
  });
  
  console.log('✅ IconicSolution response:', response.data);
  
  // Check for success
  const isSuccess = response.data && (
    response.data.status === 'success' ||
    response.data.success === true ||
    response.data.statuscode === 200 ||
    response.data.statuscode === 2000
  );
  
  if (!isSuccess) {
    throw new Error(response.data?.msg || response.data?.errormsg || 'IconicSolution API returned non-success status');
  }
  
  return {
    success: true,
    provider: 'iconicsolution',
    status: response.data.status,
    raw: response.data
  };
}

/**
 * Send WhatsApp with automatic fallback
 * Tries providers in order: Meta WhatsApp Cloud API → IconicSolution
 * 
 * @param {string} mobile - Mobile number
 * @param {string|Array} message - Message to send or template parameters
 * @param {Object} options - Optional settings
 * @param {string} options.otp - OTP code to send (for Meta WhatsApp)
 * @param {string} options.templateName - Template name for both Meta and IconicSolution
 * @param {Array} options.templateParams - Array of template parameters
 * @param {string} options.provider - Force specific provider: 'meta' or 'iconic'
 */
async function sendWhatsApp(mobile, message, options = {}) {
  const forceProvider = options.provider?.toLowerCase();
  
  // Try Meta WhatsApp first (if not explicitly avoiding it)
  if (!forceProvider || forceProvider === 'meta') {
    try {
      const messageOrOtp = options.otp || message;
      console.log(`\n🔄 Attempting WhatsApp via Meta Cloud API...`);
      const result = await sendViaMetaWhatsApp(mobile, messageOrOtp, options);
      console.log(`✅ WhatsApp sent successfully via Meta WhatsApp!`);
      return {
        success: true,
        provider: 'meta_whatsapp',
        response: result
      };
    } catch (error) {
      console.error(`⚠️  Meta WhatsApp failed:`, error.message);
      
      // If Meta is forced, don't fallback
      if (forceProvider === 'meta') {
        return {
          success: false,
          provider: 'meta_whatsapp',
          error: error.message,
          details: error.response?.data || error
        };
      }
      // Otherwise continue to fallback
      console.log(`🔄 Attempting fallback to IconicSolution...`);
    }
  }
  
  // Fallback to IconicSolution
  try {
    const templateName = typeof options.templateName === 'string' ? options.templateName : 'sendotp';
    console.log(`🔄 Attempting WhatsApp via IconicSolution...`);
    const result = await sendViaIconicSolution(mobile, message, templateName);
    console.log(`✅ WhatsApp sent successfully via IconicSolution!`);
    return {
      success: true,
      provider: 'iconicsolution',
      response: result
    };
  } catch (error) {
    console.error(`❌ All WhatsApp providers failed`);
    console.error(`   Meta: attempted`);
    console.error(`   IconicSolution:`, error.message);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || error
    };
  }
}

module.exports = {
  sendWhatsApp,
  sendViaMetaWhatsApp,
  sendViaTwilio,
  sendViaIconicSolution,
  normalizeMobileE164,
  normalizeMobileNoPrefix
};

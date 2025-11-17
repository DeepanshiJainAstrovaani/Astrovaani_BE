const axios = require('axios');
const twilio = require('twilio');

/**
 * Multi-provider WhatsApp Service
 * Supports: Twilio (primary), IconicSolution (fallback)
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
async function sendViaIconicSolution(mobile, message, templateName = 'admin_login_otp') {
  const apiKey = process.env.ICONIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('IconicSolution API key not configured');
  }
  
  // Use template endpoint (required for IconicSolution)
  const sendUrl = 'https://wa.iconicsolution.co.in/wapp/api/send/bytemplate';
  const mobileFormatted = normalizeMobileNoPrefix(mobile);
  
  console.log('📱 Sending via IconicSolution WhatsApp');
  console.log('   Mobile:', mobileFormatted);
  console.log('   Template:', templateName);
  console.log('   Message length:', message.length);
  
  const params = new URLSearchParams();
  params.append('apikey', apiKey);
  params.append('mobile', mobileFormatted);
  params.append('templatename', templateName);
  params.append('dvariables', message);
  
  const response = await axios.post(sendUrl, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'curl/7.68.0',
      'Accept': '*/*'
    },
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
 * Tries providers in order: Twilio → IconicSolution
 * 
 * @param {string} mobile - Mobile number
 * @param {string} message - Message to send
 * @param {Object} options - Optional settings
 * @param {boolean} options.enableFallback - Enable fallback to other providers (default: true)
 * @param {string} options.templateName - Template name for IconicSolution (default: 'admin_login_otp')
 */
async function sendWhatsApp(mobile, message, options = {}) {
  const preferredProvider = process.env.WHATSAPP_PROVIDER || 'twilio'; // 'twilio' or 'iconic'
  const enableFallback = options.enableFallback !== false;
  const templateName = options.templateName || 'admin_login_otp';
  
  const providers = preferredProvider === 'twilio' 
    ? ['twilio', 'iconicsolution']
    : ['iconicsolution', 'twilio'];
  
  const attempts = [];
  let lastError = null;
  
  for (const provider of providers) {
    try {
      console.log(`\n🔄 Attempting WhatsApp via ${provider}...`);
      
      let result;
      if (provider === 'twilio') {
        result = await sendViaTwilio(mobile, message);
      } else if (provider === 'iconicsolution') {
        result = await sendViaIconicSolution(mobile, message, templateName);
      }
      
      attempts.push({ provider, success: true, result });
      
      console.log(`✅ WhatsApp sent successfully via ${provider}!`);
      return {
        success: true,
        provider,
        response: result,
        attempts
      };
      
    } catch (error) {
      console.error(`❌ ${provider} failed:`, error.message);
      attempts.push({ 
        provider, 
        success: false, 
        error: error.message,
        details: error.response?.data || error
      });
      lastError = error;
      
      if (!enableFallback) {
        break; // Don't try other providers if fallback is disabled
      }
    }
  }
  
  // All providers failed
  console.error('❌ All WhatsApp providers failed');
  return {
    success: false,
    error: lastError?.message || 'All providers failed',
    attempts
  };
}

module.exports = {
  sendWhatsApp,
  sendViaTwilio,
  sendViaIconicSolution,
  normalizeMobileE164,
  normalizeMobileNoPrefix
};

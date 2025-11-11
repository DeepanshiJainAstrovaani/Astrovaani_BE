# IconicSolution WhatsApp API Key Setup

## Current Issue
The API key `0eba14ecf1ab4cf99cf5534edb4173e7` is returning **"Invalid API Key"** error (statuscode 501).

## Possible Causes & Solutions

### 1. API Key Not Activated
- Log in to your IconicSolution dashboard
- Navigate to API Settings / API Keys section
- Verify the key is **Active** (not in test/pending/disabled state)
- If inactive, contact IconicSolution support to activate it

### 2. Wrong API Key Type
IconicSolution may have multiple key types:
- **Panel API Key** (for dashboard access) - won't work for WhatsApp API
- **WhatsApp API Key** (for sending messages) - this is what you need
- Check if you copied the Panel key instead of the WhatsApp/Messaging API key

### 3. Account Not Approved for WhatsApp Business
- WhatsApp Business API requires Facebook Business Manager verification
- Your phone number must be approved by WhatsApp
- Check IconicSolution dashboard for verification status
- Contact their support if verification is pending

### 4. API Endpoint Changed
Current endpoint: `https://api.iconicsolution.co.in/wapp/v2/api/send`
- Check IconicSolution documentation for the latest endpoint
- They may have updated to v3 or a different path

### 5. IP Whitelisting
Some providers require IP whitelisting:
- Check if IconicSolution requires your server IP to be whitelisted
- Add your local development IP and production server IP to allowed list

## How to Test API Key

### Using Postman / cURL
```bash
curl -X POST "https://api.iconicsolution.co.in/wapp/v2/api/send" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "apikey=0eba14ecf1ab4cf99cf5534edb4173e7" \
  -d "mobile=919667356174" \
  -d "msg=Test message from IconicSolution API"
```

Expected success response:
```json
{
  "status": "success",
  "statuscode": 200,
  "msg": "Message sent successfully"
}
```

## Alternative: Use Twilio (Already Configured)
Your .env already has Twilio credentials configured:
- TWILIO_ACCOUNT_SID=AC0cf14173dde1da3ed8d8702013ff449f
- TWILIO_AUTH_TOKEN=a5427413aaff561211204efd28b1e6a5
- TWILIO_FROM_WHATSAPP_NUMBER=+14155238886

If IconicSolution continues to fail, we can switch to Twilio for WhatsApp messaging.

## Next Steps
1. Contact IconicSolution support with:
   - Your account email
   - The API key (first 4 and last 4 chars only for security)
   - Error message: "Invalid API Key, statuscode 501"
   - Ask them to verify key is active and approved for WhatsApp messaging

2. Check IconicSolution dashboard:
   - Look for API key status
   - Look for WhatsApp Business account status
   - Check for any verification pending notices

3. If you get a new/different key, update `.env`:
   ```
   ICONIC_API_KEY=your_new_key_here
   ```
   Then restart backend: `npm start`

## Current Implementation
- Mobile normalized to: `919667356174` (India country code + 10 digits)
- Endpoint: `https://api.iconicsolution.co.in/wapp/v2/api/send`
- Method: POST with form-urlencoded data
- Params: apikey, mobile, msg
- Timeout: 10 seconds
- Detailed logging enabled in backend console

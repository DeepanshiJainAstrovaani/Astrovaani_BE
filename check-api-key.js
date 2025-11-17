require('dotenv').config();

const API_KEY = process.env.ICONIC_API_KEY;

console.log('━━━ API KEY ANALYSIS ━━━');
console.log('Raw value:', API_KEY);
console.log('Length:', API_KEY ? API_KEY.length : 'undefined');
console.log('Type:', typeof API_KEY);
console.log('Has leading space:', API_KEY ? API_KEY[0] === ' ' : 'N/A');
console.log('Has trailing space:', API_KEY ? API_KEY[API_KEY.length - 1] === ' ' : 'N/A');
console.log('Trimmed value:', API_KEY ? API_KEY.trim() : 'undefined');
console.log('Trimmed length:', API_KEY ? API_KEY.trim().length : 'undefined');
console.log('Original === Trimmed:', API_KEY ? API_KEY === API_KEY.trim() : 'N/A');
console.log('Char codes (first 10):', API_KEY ? Array.from(API_KEY.substring(0, 10)).map(c => c.charCodeAt(0)) : 'N/A');
console.log('Char codes (last 10):', API_KEY ? Array.from(API_KEY.substring(API_KEY.length - 10)).map(c => c.charCodeAt(0)) : 'N/A');
console.log('Contains newline:', API_KEY ? API_KEY.includes('\n') : 'N/A');
console.log('Contains return:', API_KEY ? API_KEY.includes('\r') : 'N/A');
console.log('Contains tab:', API_KEY ? API_KEY.includes('\t') : 'N/A');

// Expected key (from your messages)
const EXPECTED = 'adfa9f878d294ed7880405f25b3f17e4';
console.log('\n━━━ COMPARISON ━━━');
console.log('Expected:', EXPECTED);
console.log('Expected length:', EXPECTED.length);
console.log('Matches expected:', API_KEY === EXPECTED);
console.log('Trimmed matches expected:', API_KEY ? API_KEY.trim() === EXPECTED : false);

// Check .env file directly
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');

console.log('\n━━━ .ENV FILE ANALYSIS ━━━');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  const iconicLine = lines.find(line => line.includes('ICONIC_API_KEY'));
  console.log('ICONIC_API_KEY line:', JSON.stringify(iconicLine));
  console.log('Line length:', iconicLine ? iconicLine.length : 'N/A');
  
  if (iconicLine) {
    const match = iconicLine.match(/ICONIC_API_KEY\s*=\s*(.+)/);
    if (match) {
      const rawValue = match[1];
      console.log('Value from regex:', JSON.stringify(rawValue));
      console.log('Value length:', rawValue.length);
      console.log('Value trimmed:', JSON.stringify(rawValue.trim()));
      console.log('Matches expected:', rawValue.trim() === EXPECTED);
    }
  }
} catch (err) {
  console.error('Error reading .env:', err.message);
}

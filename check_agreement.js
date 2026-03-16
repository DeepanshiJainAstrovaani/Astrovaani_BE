require('dotenv').config();
const mongoose = require('mongoose');

async function checkAgreement() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';
    console.log('Connecting to:', uri);
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    const Vendor = require('./models/schemas/vendorSchema');
    const vendors = await Vendor.find({ agreement: { $exists: true, $ne: null } }).limit(5).select('name agreement agreementStatus agreementuploaddate');
    
    console.log('\n📋 Found ' + vendors.length + ' vendors with agreements:\n');
    
    vendors.forEach((v, i) => {
      console.log(`${i+1}. Name: ${v.name}`);
      console.log(`   URL: ${v.agreement}`);
      console.log(`   Status: ${v.agreementStatus}`);
      console.log(`   Upload Date: ${v.agreementuploaddate}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkAgreement();

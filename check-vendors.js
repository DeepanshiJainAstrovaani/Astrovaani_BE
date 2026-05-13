const mongoose = require('mongoose');
const vendorModel = require('./models/vendorModel');

async function checkVendors() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/astrovaani');
    console.log('✅ Connected to MongoDB');

    const vendors = await vendorModel.getAllVendors();
    console.log('Total vendors:', vendors.length);
    
    vendors.slice(0, 10).forEach(v => {
      console.log(`- ${v.name} (${v.phone}): code=${v.interviewcode}`);
    });
    
    // Find one with interview code
    const vendorWithCode = vendors.find(v => v.interviewcode);
    if (vendorWithCode) {
      console.log('\n✅ Found vendor with interview code:');
      console.log('   Name:', vendorWithCode.name);
      console.log('   Code:', vendorWithCode.interviewcode);
      console.log('   ID:', vendorWithCode._id);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkVendors();

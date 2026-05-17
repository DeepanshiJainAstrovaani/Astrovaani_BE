const mongoose = require('mongoose');
require('dotenv').config();

const vendorSchema = require('./models/schemas/vendorSchema');

async function fixVendor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani');
    console.log('✅ Connected to MongoDB');

    const vendor = await vendorSchema.findOne({ 
      interviewcode: 'ASTROVAANI-xHkajYXAI6' 
    });

    if (!vendor) {
      console.log('❌ Vendor not found');
      process.exit(1);
    }

    console.log('\n📋 BEFORE:');
    console.log('Name:', vendor.name);
    console.log('status:', vendor.status);
    console.log('onboardingstatus:', vendor.onboardingstatus);
    console.log('Schedule[0].status:', vendor.schedules?.[0]?.status);

    vendor.status = 'inprocess';
    vendor.onboardingstatus = 'interview scheduled';
    
    if (vendor.schedules && vendor.schedules.length > 0) {
      vendor.schedules[0].status = 'confirmed';
    }

    vendor.markModified('schedules');
    await vendor.save();

    console.log('\n✅ AFTER FIX:');
    console.log('status:', vendor.status);
    console.log('onboardingstatus:', vendor.onboardingstatus);
    console.log('Schedule[0].status:', vendor.schedules?.[0]?.status);

    console.log('\n🎉 Vendor data fixed! Check the Interviews menu.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixVendor();

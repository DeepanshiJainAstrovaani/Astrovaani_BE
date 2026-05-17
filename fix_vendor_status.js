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

    // Change status from 'inprocess' to 'pending' so they show in Interviews menu
    vendor.status = 'pending';
    
    vendor.markModified('schedules');
    await vendor.save();

    console.log('\n✅ AFTER FIX:');
    console.log('status:', vendor.status);
    console.log('onboardingstatus:', vendor.onboardingstatus);
    console.log('Schedule[0].status:', vendor.schedules?.[0]?.status);

    console.log('\n🎉 Vendor status changed to "pending" - should now appear in Interviews > Scheduled!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixVendor();

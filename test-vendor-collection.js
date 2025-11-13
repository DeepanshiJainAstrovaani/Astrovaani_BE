require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('./models/schemas/vendorSchema');

async function testVendorCollection() {
  try {
    console.log('🔍 Testing Vendor Model Collection Access...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected\n');

    // Get collection name
    console.log('📋 Collection Name:', Vendor.collection.collectionName);
    
    // Count documents
    const count = await Vendor.countDocuments();
    console.log('📊 Total Vendors:', count);
    
    // Get sample vendors
    const vendors = await Vendor.find().limit(3).select('name email phone category status');
    console.log('\n📝 Sample Vendors:');
    vendors.forEach((vendor, i) => {
      console.log(`  ${i + 1}. ${vendor.name} - ${vendor.category} (${vendor.status})`);
      console.log(`     Email: ${vendor.email}, Phone: ${vendor.phone}`);
    });
    
    // Check vendors with schedules
    const vendorsWithSchedules = await Vendor.countDocuments({ schedules: { $exists: true, $ne: [] } });
    console.log(`\n⏰ Vendors with Schedules: ${vendorsWithSchedules}`);
    
    // Check vendors with interview codes
    const vendorsWithInterviewCode = await Vendor.countDocuments({ interviewcode: { $exists: true, $ne: '' } });
    console.log(`📋 Vendors with Interview Code: ${vendorsWithInterviewCode}`);
    
    console.log('\n✅ Test Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testVendorCollection();

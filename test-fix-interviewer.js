const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function testFix() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/astrovaani');
    console.log('✅ Connected to MongoDB');

    // Create or find admin
    let admin = await Admin.findOne({ phoneNumber: '8168095773' });
    
    if (!admin) {
      admin = new Admin({
        name: 'Deepanshi',
        phoneNumber: '8168095773',
        email: 'deepanshi@astrovaani.com',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin created with ID:', admin._id);
    } else {
      console.log('✅ Admin already exists with ID:', admin._id);
    }
    
    // Now update the vendor with this admin ID
    const vendorModel = require('./models/vendorModel');
    const vendor = await vendorModel.getVendorByInterviewCode('ASTROVAANI-YCxpFMomAg');
    
    if (vendor) {
      vendor.interviewerid = admin._id;
      await vendor.save();
      console.log('✅ Vendor updated with interviewer ID:', admin._id);
      console.log('   Vendor name:', vendor.name);
      console.log('   Interview code:', vendor.interviewcode);
    } else {
      console.log('❌ Vendor not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testFix();

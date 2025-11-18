require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/schemas/adminSchema');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check and create admin
const checkAndCreateAdmin = async () => {
  try {
    await connectDB();

    const targetNumber = '9667356174';
    
    console.log(`\n🔍 Checking if ${targetNumber} is registered as admin...`);

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ mobile: targetNumber });

    if (existingAdmin) {
      console.log('\n✅ Admin already exists!');
      console.log('Admin Details:', {
        name: existingAdmin.name || 'Not set',
        mobile: existingAdmin.mobile,
        email: existingAdmin.email || 'Not set',
        role: existingAdmin.role,
        isActive: existingAdmin.isActive,
        createdAt: existingAdmin.createdAt
      });
      process.exit(0);
    }

    console.log('\n❌ Admin not found!');
    console.log(`\n📝 Creating admin with mobile: ${targetNumber}...`);

    // Create new admin
    const admin = new Admin({
      name: 'Admin User',
      mobile: targetNumber,
      email: 'admin@astrovaani.com',
      role: 'admin',
      isActive: true
    });

    await admin.save();

    console.log('\n✅ Admin created successfully!');
    console.log('Admin Details:', {
      name: admin.name,
      mobile: admin.mobile,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive
    });
    console.log('\n📱 You can now login with this phone number via OTP');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 11000) {
      console.log('⚠️  Duplicate key error - Admin might already exist');
    }
    process.exit(1);
  }
};

checkAndCreateAdmin();

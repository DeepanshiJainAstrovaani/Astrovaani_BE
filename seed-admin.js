require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed admin data
const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ phoneNumber: '9876543210' });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      console.log('Admin Details:', {
        name: existingAdmin.name,
        phoneNumber: existingAdmin.phoneNumber,
        role: existingAdmin.role
      });
      process.exit(0);
    }

    // Create first admin
    const admin = new Admin({
      name: 'Super Admin',
      phoneNumber: '9876543210', // Change this to your phone number
      email: 'admin@astrovaani.com',
      role: 'super-admin',
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('Admin Details:', {
      name: admin.name,
      phoneNumber: admin.phoneNumber,
      email: admin.email,
      role: admin.role
    });
    console.log('\n📱 You can now login with this phone number');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

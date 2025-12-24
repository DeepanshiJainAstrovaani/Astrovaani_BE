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

    // Admin phone numbers to create
    const adminPhones = [
      { 
        phoneNumber: '8168095773', 
        name: 'Super Admin',
        email: 'admin@astrovaani.com'
      },
      { 
        phoneNumber: '8789601387', 
        name: 'Admin 2',
        email: 'admin2@astrovaani.com'
      },
      { 
        phoneNumber: '9667356174', 
        name: 'Admin 3',
        email: 'admin3@astrovaani.com'
      }
    ];

    for (const adminData of adminPhones) {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ phoneNumber: adminData.phoneNumber });

      if (existingAdmin) {
        console.log(`⚠️  Admin ${adminData.phoneNumber} already exists`);
        console.log('Admin Details:', {
          name: existingAdmin.name,
          phoneNumber: existingAdmin.phoneNumber,
          role: existingAdmin.role
        });
        continue;
      }

      // Create admin
      const admin = new Admin({
        name: adminData.name,
        phoneNumber: adminData.phoneNumber,
        email: adminData.email,
        role: 'super-admin',
        isActive: true
      });

      await admin.save();

      console.log(`✅ Admin ${adminData.phoneNumber} created successfully!`);
      console.log('Admin Details:', {
        name: admin.name,
        phoneNumber: admin.phoneNumber,
        email: admin.email,
        role: admin.role
      });
    }

    console.log('\n📱 All admins can now login with their phone numbers');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

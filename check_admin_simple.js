require('dotenv').config();
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  role: String,
  isActive: Boolean
});

const Admin = mongoose.model('Admin', adminSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const all = await Admin.find();
    console.log(`📊 Total Admins: ${all.length}\n`);
    
    if (all.length === 0) {
      console.log('❌ NO ADMINS FOUND\n');
      console.log('You need to create at least 2 admins first.');
    } else {
      all.forEach((a, i) => {
        console.log(`${i+1}. Name: ${a.name}, Phone: ${a.phoneNumber}, Role: ${a.role}`);
      });
    }
    
    // Check for specific number
    const yourAdmin = await Admin.findOne({ phoneNumber: '8168095773' });
    if (yourAdmin) {
      console.log(`\n✅ FOUND YOUR ADMIN:\n   Name: ${yourAdmin.name}\n   Phone: ${yourAdmin.phoneNumber}`);
    } else {
      console.log(`\n❌ Admin with phone 8168095773 NOT FOUND`);
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

check();

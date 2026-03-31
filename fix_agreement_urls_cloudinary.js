require('dotenv').config();
const mongoose = require('mongoose');

async function fixAgreementURLs() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';
    console.log('Connecting to:', uri);
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');
    
    const Vendor = require('./models/schemas/vendorSchema');
    
    // Find all vendors with agreement URLs
    const vendors = await Vendor.find({ agreement: { $exists: true, $ne: null } });
    
    console.log(`📋 Found ${vendors.length} vendors with agreements to check\n`);
    
    let fixed = 0;
    let skipped = 0;
    
    for (const vendor of vendors) {
      const oldUrl = vendor.agreement;
      
      // Extract the filename from the old URL
      const match = oldUrl.match(/vendor_agreements\/(.+)$/);
      
      if (!match) {
        console.log(`⚠️  Cannot parse URL for ${vendor.name}: ${oldUrl}`);
        skipped++;
        continue;
      }
      
      const filename = match[1];
      
      // Construct new URL using /raw/upload/
      const newUrl = `https://res.cloudinary.com/df8sx5hv4/raw/upload/vendor_agreements/${filename}`;
      
      // Only update if URL actually changed
      if (oldUrl === newUrl) {
        skipped++;
        continue;
      }
      
      console.log(`📝 Updating: ${vendor.name}`);
      console.log(`   Old: ${oldUrl}`);
      console.log(`   New: ${newUrl}`);
      
      vendor.agreement = newUrl;
      await vendor.save();
      fixed++;
      console.log(`   ✅ Updated\n`);
    }
    
    console.log(`\n✨ Summary:`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${vendors.length}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixAgreementURLs();

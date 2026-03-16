/**
 * Script to fix malformed agreement URLs in vendor database
 * Converts filenames to proper Cloudinary URLs
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('./models/schemas/vendorSchema');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';
const CLOUDINARY_CLOUD_NAME = 'df8sx5hv4'; // From your screenshot
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/upload/vendor_agreements/`;

async function fixAgreementUrls() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all vendors with agreement URLs
    const vendors = await Vendor.find({ 
      agreement: { $exists: true, $ne: null, $ne: '' } 
    });

    console.log(`\n📊 Found ${vendors.length} vendors with agreement URLs`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const vendor of vendors) {
      const originalUrl = vendor.agreement;
      
      // Check if it's just a filename (not a full URL)
      if (!originalUrl.startsWith('http')) {
        console.log(`\n🔧 Fixing vendor: ${vendor.name}`);
        console.log(`   Original: ${originalUrl}`);
        
        // Clean the filename (remove any spaces or line breaks)
        const cleanFilename = originalUrl.replace(/\s+/g, '').trim();
        
        // Construct proper Cloudinary URL
        const cloudinaryUrl = `${CLOUDINARY_BASE_URL}${cleanFilename}`;
        
        console.log(`   New URL: ${cloudinaryUrl}`);
        
        // Update the vendor
        vendor.agreement = cloudinaryUrl;
        await vendor.save();
        
        fixedCount++;
        console.log(`   ✅ Fixed!`);
      } else {
        console.log(`✓ Vendor ${vendor.name} already has full URL`);
        skippedCount++;
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Fixed: ${fixedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📊 Total: ${vendors.length}`);

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAgreementUrls();

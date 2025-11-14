const mongoose = require('mongoose');
const Vendor = require('./models/schemas/vendorSchema');
require('dotenv').config(); // Load environment variables

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';

console.log('🔧 Using MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':***@'));

async function cleanupDuplicateConfirmedSlots() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all vendors with schedules
    const vendors = await Vendor.find({ 
      schedules: { $exists: true, $ne: [] } 
    });

    console.log(`📊 Found ${vendors.length} vendors with schedules`);

    let updatedCount = 0;

    for (const vendor of vendors) {
      const confirmedSlots = vendor.schedules.filter(s => s.status === 'confirmed');
      
      if (confirmedSlots.length > 1) {
        console.log(`\n🔧 Fixing vendor: ${vendor.name} (${vendor._id})`);
        console.log(`   Found ${confirmedSlots.length} confirmed slots`);
        
        // Keep only the FIRST confirmed slot and remove all others
        const firstConfirmedSlot = confirmedSlots[0];
        
        // Remove ALL schedules and keep only the first confirmed slot
        vendor.schedules = [firstConfirmedSlot];
        
        // Ensure onboarding status is set
        vendor.onboardingstatus = 'interview scheduled';
        
        await vendor.save();
        
        console.log(`   ✅ Kept only slot: ${firstConfirmedSlot.scheduledAt}`);
        console.log(`   ✅ Removed ${confirmedSlots.length - 1} duplicate confirmed slots`);
        
        updatedCount++;
      } else if (confirmedSlots.length === 1) {
        console.log(`\n✔️ Vendor ${vendor.name} has exactly 1 confirmed slot - OK`);
        
        // Ensure onboarding status is set
        if (vendor.onboardingstatus !== 'interview scheduled') {
          vendor.onboardingstatus = 'interview scheduled';
          await vendor.save();
          console.log(`   ✅ Updated onboardingstatus to 'interview scheduled'`);
        }
      }
    }

    console.log(`\n\n📊 Cleanup Summary:`);
    console.log(`   Total vendors checked: ${vendors.length}`);
    console.log(`   Vendors fixed: ${updatedCount}`);
    console.log(`\n✅ Cleanup completed successfully!`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupDuplicateConfirmedSlots();

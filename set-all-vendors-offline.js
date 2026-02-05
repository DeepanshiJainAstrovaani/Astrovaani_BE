/**
 * Script to set all vendors' chat status and call status to OFFLINE
 * This will update both 'astro' and 'community' collections in MongoDB
 * 
 * Usage: node set-all-vendors-offline.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';

async function setAllVendorsOffline() {
  try {
    console.log('🔧 MongoDB Vendor Status Update Script');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔗 Connecting to MongoDB...`);
    console.log(`   URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':***@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // List all collections to find vendor collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log('📋 Available Collections:', collectionNames.join(', '));
    console.log('');

    // Define collections to update (astro and community)
    const vendorCollections = ['astro', 'community'];
    
    let totalUpdated = 0;

    for (const collectionName of vendorCollections) {
      if (!collectionNames.includes(collectionName)) {
        console.log(`⚠️  Collection '${collectionName}' not found, skipping...`);
        continue;
      }

      console.log(`\n📦 Processing '${collectionName}' collection...`);
      console.log('─────────────────────────────────────────────────');

      const collection = mongoose.connection.db.collection(collectionName);
      
      // Count total vendors before update
      const totalCount = await collection.countDocuments();
      console.log(`   📊 Total documents: ${totalCount}`);

      // Count currently online vendors
      const onlineCount = await collection.countDocuments({
        $or: [
          { chatstatus: { $in: ['online', 'available', 'Online', 'Available'] } },
          { callstatus: { $in: ['online', 'available', 'Online', 'Available'] } },
          { availability: { $in: ['online', 'available', 'Online', 'Available'] } },
          { is_available: true }
        ]
      });
      console.log(`   🟢 Currently online/available: ${onlineCount}`);

      // Update all vendors to offline status
      const updateResult = await collection.updateMany(
        {}, // Match all documents
        {
          $set: {
            chatstatus: 'offline',
            callstatus: 'offline',
            availability: 'offline',
            is_available: false
          }
        }
      );

      console.log(`   ✅ Modified: ${updateResult.modifiedCount} documents`);
      console.log(`   📝 Matched: ${updateResult.matchedCount} documents`);
      
      totalUpdated += updateResult.modifiedCount;

      // Verify the update
      const stillOnline = await collection.countDocuments({
        $or: [
          { chatstatus: { $in: ['online', 'available', 'Online', 'Available'] } },
          { callstatus: { $in: ['online', 'available', 'Online', 'Available'] } },
          { availability: { $in: ['online', 'available', 'Online', 'Available'] } },
          { is_available: true }
        ]
      });
      
      if (stillOnline === 0) {
        console.log(`   ✅ Verification passed: All vendors are now offline`);
      } else {
        console.log(`   ⚠️  Warning: ${stillOnline} vendors still appear online`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎉 COMPLETE: Total ${totalUpdated} vendor records updated to OFFLINE`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Full error:', error);
    process.exit(1);
  }
}

// Run the script
setAllVendorsOffline();

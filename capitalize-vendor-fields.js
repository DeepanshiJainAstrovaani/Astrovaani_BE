/**
 * Script to capitalize first letter of each word in category and skills fields
 * Example: "astrologer" → "Astrologer", "tarot reader" → "Tarot Reader"
 * 
 * Usage: node capitalize-vendor-fields.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrovaani';

// Function to capitalize first letter of each word
function capitalizeWords(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function capitalizeVendorFields() {
  try {
    console.log('🔧 MongoDB Vendor Fields Capitalization Script');
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
      
      // Get all vendors
      const vendors = await collection.find({}).toArray();
      console.log(`   📊 Total documents: ${vendors.length}`);

      let updatedCount = 0;

      for (const vendor of vendors) {
        const updates = {};
        let hasChanges = false;

        // Check and update category
        if (vendor.category && typeof vendor.category === 'string') {
          const capitalizedCategory = capitalizeWords(vendor.category);
          if (capitalizedCategory !== vendor.category) {
            updates.category = capitalizedCategory;
            hasChanges = true;
            console.log(`   📝 ${vendor.name || vendor._id}: category "${vendor.category}" → "${capitalizedCategory}"`);
          }
        }

        // Check and update skills
        if (vendor.skills && typeof vendor.skills === 'string') {
          const capitalizedSkills = capitalizeWords(vendor.skills);
          if (capitalizedSkills !== vendor.skills) {
            updates.skills = capitalizedSkills;
            hasChanges = true;
            console.log(`   📝 ${vendor.name || vendor._id}: skills "${vendor.skills}" → "${capitalizedSkills}"`);
          }
        }

        // Apply updates if there are changes
        if (hasChanges) {
          await collection.updateOne(
            { _id: vendor._id },
            { $set: updates }
          );
          updatedCount++;
        }
      }

      console.log(`\n   ✅ Updated: ${updatedCount} documents in '${collectionName}'`);
      totalUpdated += updatedCount;

      // Show sample of updated data
      console.log(`\n   📋 Sample data after update:`);
      const sampleVendors = await collection.find({}).limit(5).toArray();
      sampleVendors.forEach(v => {
        console.log(`      - ${v.name}: category="${v.category}", skills="${v.skills}"`);
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎉 COMPLETE: Total ${totalUpdated} vendor records updated`);
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
capitalizeVendorFields();

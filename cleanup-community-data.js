/**
 * Script to delete all documents from astro/community collection
 * that don't have a valid joineddate field
 * 
 * Run: node cleanup-community-data.js
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string - update if needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://astrovaaniofficial_db_user:Astrovaani%40123@cluster0.al4qxad.mongodb.net/astro';
const DB_NAME = 'astro';
const COLLECTION_NAME = 'community';

async function cleanupCommunityData() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // First, let's see how many documents we have
    const totalCount = await collection.countDocuments();
    console.log(`📊 Total documents in ${COLLECTION_NAME}: ${totalCount}`);
    
    // Count documents without joineddate
    const withoutJoinedDateCount = await collection.countDocuments({
      $or: [
        { joineddate: { $exists: false } },
        { joineddate: null },
        { joineddate: '' }
      ]
    });
    console.log(`🔍 Documents without valid joineddate: ${withoutJoinedDateCount}`);
    
    // Count documents with joineddate
    const withJoinedDateCount = await collection.countDocuments({
      joineddate: { $exists: true, $ne: null, $ne: '' }
    });
    console.log(`✅ Documents with valid joineddate: ${withJoinedDateCount}`);
    
    if (withoutJoinedDateCount === 0) {
      console.log('✨ No documents to delete. All documents have joineddate!');
      return;
    }
    
    // Show sample of documents that will be deleted
    console.log('\n📋 Sample documents that will be deleted (first 5):');
    const sampleDocs = await collection.find({
      $or: [
        { joineddate: { $exists: false } },
        { joineddate: null },
        { joineddate: '' }
      ]
    }).limit(5).toArray();
    
    sampleDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ID: ${doc._id}, Name: ${doc.name || 'N/A'}, Mobile: ${doc.mobile || 'N/A'}`);
    });
    
    // Confirmation prompt
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question(`\n⚠️  Are you sure you want to delete ${withoutJoinedDateCount} documents? (yes/no): `, resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled by user.');
      return;
    }
    
    // Delete documents without joineddate
    console.log('\n🗑️  Deleting documents without joineddate...');
    const deleteResult = await collection.deleteMany({
      $or: [
        { joineddate: { $exists: false } },
        { joineddate: null },
        { joineddate: '' }
      ]
    });
    
    console.log(`✅ Successfully deleted ${deleteResult.deletedCount} documents`);
    
    // Verify remaining count
    const remainingCount = await collection.countDocuments();
    console.log(`📊 Remaining documents in ${COLLECTION_NAME}: ${remainingCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the script
cleanupCommunityData();

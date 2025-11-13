require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function analyzeMongoDBOnly() {
  try {
    console.log('🔍 Analyzing MongoDB Database...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected\n');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 MongoDB Collections:');
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });
    
    // Check vendors collection
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const vendorsExists = collections.find(col => col.name === 'vendors');
    if (vendorsExists) {
      console.log('\n✅ VENDORS COLLECTION');
      const count = await mongoose.connection.db.collection('vendors').countDocuments();
      console.log(`   📊 Total Documents: ${count}`);
      
      // Get sample document with all fields
      const sampleDoc = await mongoose.connection.db.collection('vendors').findOne();
      if (sampleDoc) {
        console.log('\n   📋 Document Structure:');
        Object.keys(sampleDoc).sort().forEach(key => {
          const value = sampleDoc[key];
          let type = typeof value;
          if (Array.isArray(value)) {
            type = `array[${value.length}]`;
          } else if (value instanceof Date) {
            type = 'Date';
          } else if (value === null) {
            type = 'null';
          }
          console.log(`      ${key.padEnd(20)} : ${type}`);
        });
        
        console.log('\n   📄 Sample Values:');
        console.log(`      name: ${sampleDoc.name || 'N/A'}`);
        console.log(`      email: ${sampleDoc.email || 'N/A'}`);
        console.log(`      phone: ${sampleDoc.phone || 'N/A'}`);
        console.log(`      category: ${sampleDoc.category || 'N/A'}`);
        console.log(`      status: ${sampleDoc.status || 'N/A'}`);
        if (sampleDoc.schedules) {
          console.log(`      schedules: ${Array.isArray(sampleDoc.schedules) ? sampleDoc.schedules.length + ' slots' : 'none'}`);
        }
      }
    } else {
      console.log('\n⚠️  "vendors" collection NOT FOUND');
    }
    
    // Check blogs collection
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const blogsExists = collections.find(col => col.name === 'blogs');
    if (blogsExists) {
      console.log('\n✅ BLOGS COLLECTION');
      const count = await mongoose.connection.db.collection('blogs').countDocuments();
      console.log(`   📊 Total Documents: ${count}`);
      
      const sampleDoc = await mongoose.connection.db.collection('blogs').findOne();
      if (sampleDoc) {
        console.log('\n   📋 Document Structure:');
        Object.keys(sampleDoc).sort().forEach(key => {
          const value = sampleDoc[key];
          let type = typeof value;
          if (Array.isArray(value)) {
            type = `array[${value.length}]`;
          } else if (value instanceof Date) {
            type = 'Date';
          } else if (value === null) {
            type = 'null';
          }
          console.log(`      ${key.padEnd(20)} : ${type}`);
        });
      }
    } else {
      console.log('\n⚠️  "blogs" collection NOT FOUND');
    }
    
    // Check for other collections that might contain vendor data
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔍 Other Collections:');
    for (const col of collections) {
      if (col.name !== 'vendors' && col.name !== 'blogs') {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`   - ${col.name}: ${count} documents`);
      }
    }
    
    await mongoose.connection.close();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ MongoDB Analysis Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (mongoose.connection) await mongoose.connection.close();
  }
}

analyzeMongoDBOnly()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

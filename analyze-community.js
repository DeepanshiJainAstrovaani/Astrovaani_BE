require('dotenv').config();
const mongoose = require('mongoose');

async function analyzeCommunityCollection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('📊 Analyzing COMMUNITY Collection (Vendors)...\n');
    
    const sampleDoc = await mongoose.connection.db.collection('community').findOne();
    
    if (sampleDoc) {
      console.log('📋 Document Structure:');
      Object.keys(sampleDoc).sort().forEach(key => {
        const value = sampleDoc[key];
        let type = typeof value;
        let sample = '';
        
        if (Array.isArray(value)) {
          type = `array[${value.length}]`;
          sample = value.length > 0 ? ` (e.g., ${JSON.stringify(value[0])})` : '';
        } else if (value instanceof Date) {
          type = 'Date';
          sample = ` (${value.toISOString()})`;
        } else if (typeof value === 'string' && value.length > 0) {
          sample = ` (${value.substring(0, 30)}...)`;
        } else if (typeof value === 'number') {
          sample = ` (${value})`;
        } else if (value === null) {
          type = 'null';
        }
        
        console.log(`   ${key.padEnd(25)} : ${type}${sample}`);
      });
      
      console.log('\n📄 Full Sample Document:');
      console.log(JSON.stringify(sampleDoc, null, 2).substring(0, 1500) + '...');
    }
    
    // Check a few more documents
    console.log('\n\n📊 Checking field consistency across all documents...');
    const allDocs = await mongoose.connection.db.collection('community').find().limit(88).toArray();
    
    const fieldFrequency = {};
    allDocs.forEach(doc => {
      Object.keys(doc).forEach(key => {
        fieldFrequency[key] = (fieldFrequency[key] || 0) + 1;
      });
    });
    
    console.log('\n📈 Field Frequency:');
    Object.entries(fieldFrequency)
      .sort((a, b) => b[1] - a[1])
      .forEach(([field, count]) => {
        const percentage = ((count / allDocs.length) * 100).toFixed(1);
        console.log(`   ${field.padEnd(25)} : ${count}/${allDocs.length} (${percentage}%)`);
      });
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeCommunityCollection();

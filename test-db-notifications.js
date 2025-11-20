const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections in database:');
    collections.forEach(c => {
      console.log(`   ✓ ${c.name}`);
    });
    console.log('');
    
    // Check for notification collections
    const notifCollection = collections.find(c => 
      c.name === 'pushnotifications' || 
      c.name === 'notifications' ||
      c.name === 'messagenotifications'
    );
    
    if (!notifCollection) {
      console.log('⚠️  No notification collection found yet.');
      console.log('   This is normal if you haven\'t sent any notifications.');
      console.log('\n✅ API is ready to accept notifications!\n');
      mongoose.connection.close();
      return;
    }
    
    const collectionName = notifCollection.name;
    console.log(`📊 Found notification collection: "${collectionName}"\n`);
    
    // Get count
    const count = await mongoose.connection.db.collection(collectionName).countDocuments();
    console.log(`📈 Total notifications: ${count}\n`);
    
    if (count === 0) {
      console.log('ℹ️  No notifications sent yet.');
      console.log('   Upload an image and send a test notification to see it here!\n');
      mongoose.connection.close();
      return;
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Get latest notifications
    const latest = await mongoose.connection.db.collection(collectionName)
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    console.log(`📝 Latest ${latest.length} notification(s):\n`);
    
    latest.forEach((notif, index) => {
      console.log(`╔═══════════════════════════════════════════════════════╗`);
      console.log(`║  NOTIFICATION #${index + 1}                                        ║`);
      console.log(`╚═══════════════════════════════════════════════════════╝\n`);
      
      console.log(`🆔 ID:              ${notif._id}`);
      console.log(`📌 Title:           ${notif.title || 'N/A'}`);
      console.log(`📝 Body:            ${notif.body || 'N/A'}`);
      console.log(`🖼️  Image URL:       ${notif.imageUrl || '❌ No image'}`);
      console.log(`🎯 Target Type:     ${notif.targetType || 'all'}`);
      console.log(`⚡ Priority:        ${notif.priority || 'default'}`);
      console.log(`🔔 Sound:           ${notif.sound || 'default'}`);
      console.log(`📊 Status:          ${notif.status || 'draft'}`);
      console.log(`📅 Created:         ${notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'N/A'}`);
      console.log(`📤 Sent At:         ${notif.sentAt ? new Date(notif.sentAt).toLocaleString() : '⏳ Not sent yet'}`);
      
      console.log(`\n📦 Data Fields:`);
      if (notif.data && Object.keys(notif.data).length > 0) {
        Object.entries(notif.data).forEach(([key, value]) => {
          console.log(`   • ${key}: ${value || 'empty'}`);
        });
      } else {
        console.log(`   (No additional data)`);
      }
      
      console.log(`\n📊 Delivery Stats:`);
      if (notif.stats) {
        console.log(`   • Total Targeted:  ${notif.stats.totalTargeted || 0}`);
        console.log(`   • Success Count:   ${notif.stats.successCount || 0}`);
        console.log(`   • Failure Count:   ${notif.stats.failureCount || 0}`);
        if (notif.stats.successCount > 0) {
          const rate = ((notif.stats.successCount / notif.stats.totalTargeted) * 100).toFixed(2);
          console.log(`   • Success Rate:    ${rate}%`);
        }
      } else {
        console.log(`   (No stats available)`);
      }
      
      console.log('\n');
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Get stats by status
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];
    
    const statusStats = await mongoose.connection.db.collection(collectionName)
      .aggregate(pipeline)
      .toArray();
    
    console.log('📊 Notifications by Status:\n');
    statusStats.forEach(stat => {
      const emoji = stat._id === 'sent' ? '✅' : 
                    stat._id === 'failed' ? '❌' : 
                    stat._id === 'sending' ? '📤' : '📋';
      console.log(`   ${emoji} ${stat._id.toUpperCase()}: ${stat.count}`);
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Check for images
    const withImages = await mongoose.connection.db.collection(collectionName)
      .countDocuments({ imageUrl: { $exists: true, $ne: null, $ne: '' } });
    
    console.log('🖼️  Notifications with Images:\n');
    console.log(`   • Total with images: ${withImages}`);
    console.log(`   • Total without:     ${count - withImages}`);
    
    if (withImages > 0) {
      console.log('\n   Recent image URLs:');
      const imagesOnly = await mongoose.connection.db.collection(collectionName)
        .find({ imageUrl: { $exists: true, $ne: null, $ne: '' } })
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();
      
      imagesOnly.forEach((notif, i) => {
        console.log(`   ${i + 1}. ${notif.imageUrl}`);
      });
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Database check complete!\n');
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
}

testDatabase();

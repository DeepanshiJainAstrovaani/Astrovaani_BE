require('dotenv').config();
const mongoose = require('mongoose');

async function viewNotifications() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    
    // Get MongoDB URI from environment
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please make sure .env file exists with MONGODB_URI');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}\n`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections found:');
    collections.forEach(c => {
      console.log(`   • ${c.name}`);
    });
    console.log('');
    
    // Find notification collection
    const notifCollectionNames = ['pushnotifications', 'notifications', 'messagenotifications'];
    const notifCollection = collections.find(c => 
      notifCollectionNames.includes(c.name.toLowerCase())
    );
    
    if (!notifCollection) {
      console.log('⚠️  No notification collection found.');
      console.log('   This means no notifications have been sent yet.\n');
      console.log('✅ System is ready - send your first notification!\n');
      mongoose.connection.close();
      return;
    }
    
    const collectionName = notifCollection.name;
    console.log(`📬 Using collection: "${collectionName}"\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Get all notifications
    const allNotifications = await mongoose.connection.db
      .collection(collectionName)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    if (allNotifications.length === 0) {
      console.log('📭 No notifications sent yet.\n');
      console.log('   Upload an image and send your first notification to see it here!\n');
      mongoose.connection.close();
      return;
    }
    
    console.log(`📊 TOTAL NOTIFICATIONS: ${allNotifications.length}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Display each notification
    allNotifications.forEach((notif, index) => {
      console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
      console.log(`║  📧 NOTIFICATION #${(index + 1).toString().padEnd(48)} ║`);
      console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);
      
      // Basic Info
      console.log(`🆔 ID:              ${notif._id}`);
      console.log(`📌 Title:           ${notif.title || 'N/A'}`);
      console.log(`📝 Body:            ${(notif.body || 'N/A').substring(0, 100)}${notif.body?.length > 100 ? '...' : ''}`);
      
      // Image
      if (notif.imageUrl) {
        console.log(`🖼️  Image URL:       ✅ ${notif.imageUrl}`);
        console.log(`   └─ Preview:      ${notif.imageUrl.substring(0, 80)}...`);
      } else {
        console.log(`🖼️  Image URL:       ❌ No image`);
      }
      
      // Targeting
      console.log(`\n🎯 TARGETING:`);
      console.log(`   Target Type:     ${notif.targetType || 'all'}`);
      if (notif.targetUsers && notif.targetUsers.length > 0) {
        console.log(`   Target Users:    ${notif.targetUsers.length} users`);
      }
      if (notif.targetSegment) {
        console.log(`   Segment:         ${notif.targetSegment}`);
      }
      
      // Settings
      console.log(`\n⚙️  SETTINGS:`);
      console.log(`   Priority:        ${notif.priority || 'default'}`);
      console.log(`   Sound:           ${notif.sound || 'default'}`);
      if (notif.badge) {
        console.log(`   Badge:           ${notif.badge}`);
      }
      
      // Custom Data
      console.log(`\n📦 CUSTOM DATA:`);
      if (notif.data && typeof notif.data === 'object') {
        const dataEntries = Object.entries(notif.data);
        if (dataEntries.length > 0) {
          dataEntries.forEach(([key, value]) => {
            if (value) {
              console.log(`   • ${key.padEnd(15)} ${value}`);
            }
          });
        } else {
          console.log(`   (No custom data)`);
        }
      } else {
        console.log(`   (No custom data)`);
      }
      
      // Status & Delivery
      console.log(`\n📊 STATUS & DELIVERY:`);
      const statusEmoji = {
        'sent': '✅',
        'sending': '📤',
        'failed': '❌',
        'draft': '📋',
        'scheduled': '⏰'
      };
      console.log(`   Status:          ${statusEmoji[notif.status] || '❓'} ${(notif.status || 'draft').toUpperCase()}`);
      
      if (notif.stats) {
        console.log(`   Total Targeted:  ${notif.stats.totalTargeted || 0}`);
        console.log(`   ✅ Success:       ${notif.stats.successCount || 0}`);
        console.log(`   ❌ Failed:        ${notif.stats.failureCount || 0}`);
        
        if (notif.stats.totalTargeted > 0) {
          const successRate = ((notif.stats.successCount / notif.stats.totalTargeted) * 100).toFixed(2);
          console.log(`   📈 Success Rate:  ${successRate}%`);
        }
      } else {
        console.log(`   (No delivery stats)`);
      }
      
      // Timestamps
      console.log(`\n📅 TIMESTAMPS:`);
      console.log(`   Created:         ${notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'N/A'}`);
      console.log(`   Sent:            ${notif.sentAt ? new Date(notif.sentAt).toLocaleString() : '⏳ Not sent yet'}`);
      if (notif.scheduledFor) {
        console.log(`   Scheduled For:   ${new Date(notif.scheduledFor).toLocaleString()}`);
      }
      
      // Created By
      if (notif.createdBy) {
        console.log(`\n👤 Created By:      ${notif.createdBy}`);
      }
      
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Summary Statistics
    console.log('📊 SUMMARY STATISTICS:\n');
    
    const statusGroups = allNotifications.reduce((acc, n) => {
      const status = n.status || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('   By Status:');
    Object.entries(statusGroups).forEach(([status, count]) => {
      const emoji = status === 'sent' ? '✅' : status === 'failed' ? '❌' : '📋';
      console.log(`      ${emoji} ${status.toUpperCase()}: ${count}`);
    });
    
    const withImages = allNotifications.filter(n => n.imageUrl).length;
    console.log(`\n   With Images:     ${withImages} / ${allNotifications.length}`);
    console.log(`   Without Images:  ${allNotifications.length - withImages} / ${allNotifications.length}`);
    
    const totalTargeted = allNotifications.reduce((sum, n) => sum + (n.stats?.totalTargeted || 0), 0);
    const totalSuccess = allNotifications.reduce((sum, n) => sum + (n.stats?.successCount || 0), 0);
    const totalFailed = allNotifications.reduce((sum, n) => sum + (n.stats?.failureCount || 0), 0);
    
    if (totalTargeted > 0) {
      console.log(`\n   Total Devices:   ${totalTargeted}`);
      console.log(`   ✅ Delivered:     ${totalSuccess}`);
      console.log(`   ❌ Failed:        ${totalFailed}`);
      console.log(`   📈 Overall Rate:  ${((totalSuccess / totalTargeted) * 100).toFixed(2)}%`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log('✅ Done!\n');
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack:', error.stack);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
}

viewNotifications();

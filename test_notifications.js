const mongoose = require('mongoose');
require('dotenv').config();

const PushNotification = require('./models/schemas/notificationSchema');

async function checkNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB\n');
    
    // Get all notifications
    const notifications = await PushNotification.find().sort({ createdAt: -1 }).limit(5);
    
    console.log(`��� Found ${notifications.length} recent notifications:\n`);
    
    notifications.forEach((notif, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`��� Notification ${index + 1}:`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`ID:           ${notif._id}`);
      console.log(`Title:        ${notif.title}`);
      console.log(`Body:         ${notif.body}`);
      console.log(`Image URL:    ${notif.imageUrl || 'No image'}`);
      console.log(`Target Type:  ${notif.targetType}`);
      console.log(`Priority:     ${notif.priority || 'default'}`);
      console.log(`Sound:        ${notif.sound || 'default'}`);
      console.log(`Status:       ${notif.status}`);
      console.log(`Created:      ${notif.createdAt}`);
      console.log(`Sent At:      ${notif.sentAt || 'Not sent yet'}`);
      console.log(`\nData fields:`);
      console.log(JSON.stringify(notif.data, null, 2));
      console.log(`\nStats:`);
      console.log(JSON.stringify(notif.stats, null, 2));
    });
    
    // Get total count
    const totalCount = await PushNotification.countDocuments();
    console.log(`\n\n��� Total notifications in database: ${totalCount}`);
    
    // Get count by status
    const statusCounts = await PushNotification.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log(`\n��� Notifications by status:`);
    statusCounts.forEach(s => {
      console.log(`   ${s._id}: ${s.count}`);
    });
    
    mongoose.connection.close();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

checkNotifications();

require('dotenv').config();
const cron = require('node-cron');
const { runSync } = require('./sync-mysql-to-mongodb');

console.log('🔄 MySQL → MongoDB Auto-Sync Scheduler Started');
console.log('⏰ Schedule: Every 3 hours');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Schedule sync every 3 hours: 0 */3 * * *
// This runs at: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00
const cronSchedule = process.env.SYNC_CRON_SCHEDULE || '0 */3 * * *';

cron.schedule(cronSchedule, async () => {
  console.log('\n⏰ Scheduled sync triggered at', new Date().toISOString());
  try {
    await runSync();
  } catch (error) {
    console.error('❌ Scheduled sync failed:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Indian Standard Time
});

// Run sync immediately on startup (optional)
const runOnStartup = process.env.SYNC_ON_STARTUP === 'true';
if (runOnStartup) {
  console.log('🚀 Running initial sync on startup...\n');
  runSync()
    .then(() => console.log('\n✅ Initial sync completed'))
    .catch(error => console.error('\n❌ Initial sync failed:', error));
}

console.log('✅ Scheduler is running');
console.log('📅 Next sync scheduled for:', getNextCronTime(cronSchedule));
console.log('🛑 Press Ctrl+C to stop\n');

// Helper function to calculate next cron execution time
function getNextCronTime(cronExpression) {
  const cronParser = require('cron-parser');
  try {
    const interval = cronParser.parseExpression(cronExpression);
    return interval.next().toString();
  } catch (error) {
    return 'Unable to calculate';
  }
}

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Scheduler stopped');
  process.exit(0);
});

// Log every hour to show it's still running
setInterval(() => {
  console.log('💓 Scheduler heartbeat at', new Date().toISOString());
}, 60 * 60 * 1000); // Every hour

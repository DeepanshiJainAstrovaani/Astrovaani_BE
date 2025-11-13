require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// Import MongoDB models
const Vendor = require('./models/schemas/vendorSchema');
const Blog = require('./models/schemas/blogSchema');

// MySQL Connection Configuration (from PHP connection.php)
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'astr_astrovaani',
  password: process.env.MYSQL_PASSWORD || 'Astrovaani@123',
  database: process.env.MYSQL_DATABASE || 'astr_astrovaani',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// MongoDB Connection (from .env)
const MONGODB_URI = process.env.MONGODB_URI;

let mysqlPool;
let syncStats = {
  vendors: { synced: 0, failed: 0, skipped: 0 },
  blogs: { synced: 0, failed: 0, skipped: 0 },
  startTime: null,
  endTime: null
};

// Connect to databases
async function connectDatabases() {
  try {
    console.log('🔌 Connecting to MySQL...');
    mysqlPool = mysql.createPool(MYSQL_CONFIG);
    await mysqlPool.query('SELECT 1'); // Test connection
    console.log('✅ MySQL connected');

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
}

// Sync Vendors from MySQL to MongoDB
async function syncVendors() {
  console.log('\n📊 Starting Vendor Sync...');
  
  try {
    // Fetch all vendors from MySQL community table
    const [mysqlVendors] = await mysqlPool.query(`
      SELECT *
      FROM community
      ORDER BY id ASC
    `);

    console.log(`   Found ${mysqlVendors.length} vendors in MySQL`);

    for (const mysqlVendor of mysqlVendors) {
      try {
        // Check if vendor exists in MongoDB by email or phone
        const existingVendor = await Vendor.findOne({
          $or: [
            { email: mysqlVendor.email },
            { phone: mysqlVendor.phone }
          ]
        });

        // Prepare MongoDB document - map all MySQL community fields
        const vendorData = {
          id: mysqlVendor.id,
          name: mysqlVendor.name || '',
          photo: mysqlVendor.photo || '',
          phone: mysqlVendor.phone || '',
          whatsapp: mysqlVendor.whatsapp || '',
          gender: mysqlVendor.gender || '',
          email: mysqlVendor.email || '',
          age: mysqlVendor.age || '',
          category: mysqlVendor.category || '',
          skills: mysqlVendor.skills || '',
          experience: mysqlVendor.experience || '',
          pincode: mysqlVendor.pincode || '',
          city: mysqlVendor.city || '',
          reason: mysqlVendor.reason || '',
          state: mysqlVendor.state || '',
          language: mysqlVendor.language || '',
          joineddate: mysqlVendor.joineddate || '',
          status: mysqlVendor.status || '',
          consultation: mysqlVendor.consultation || '',
          accountholder: mysqlVendor.accountholder || '',
          accountno: mysqlVendor.accountno || '',
          ifsc: mysqlVendor.ifsc || '',
          availability: mysqlVendor.availability || 'offline',
          target: mysqlVendor.target || '',
          otp: mysqlVendor.otp || '',
          priceperminute: mysqlVendor.priceperminute || '',
          '25minrate': mysqlVendor['25minrate'] || '',
          '30minrate': mysqlVendor['30minrate'] || '',
          '45minrate': mysqlVendor['45minrate'] || '',
          '1hourrate': mysqlVendor['1hourrate'] || '',
          '90minrate': mysqlVendor['90minrate'] || '',
          '15minrate': mysqlVendor['15minrate'] || '',
          about: mysqlVendor.about || '',
          reasoncomment: mysqlVendor.reasoncomment || '',
          documentstatus: mysqlVendor.documentstatus || '',
          rating: mysqlVendor.rating || '',
          onboardingstatus: mysqlVendor.onboardingstatus || '',
          otpverification: mysqlVendor.otpverification || '',
          interviewerid: mysqlVendor.interviewerid || '',
          interviewcode: mysqlVendor.interviewcode || '',
          agreement: mysqlVendor.agreement || '',
          agreementuploaddate: mysqlVendor.agreementuploaddate || '',
          approvedby: mysqlVendor.approvedby || '',
          chatstatus: mysqlVendor.chatstatus || '',
          callstatus: mysqlVendor.callstatus || '',
          bookingcount: mysqlVendor.bookingcount || '',
          agree: mysqlVendor.agree || '',
          paymentdetails: mysqlVendor.paymentdetails || '',
          photo2: mysqlVendor.photo2 || '',
          photo3: mysqlVendor.photo3 || '',
          photo4: mysqlVendor.photo4 || '',
          photo5: mysqlVendor.photo5 || '',
          updatedAt: mysqlVendor.updated_at || new Date(),
          isVerified: mysqlVendor.isVerified || false,
          is_available: mysqlVendor.is_available !== undefined ? mysqlVendor.is_available : true,
          // Preserve existing schedules if vendor exists (schedules are managed in MongoDB)
          schedules: existingVendor ? existingVendor.schedules : []
        };

        if (existingVendor) {
          // Update existing vendor
          await Vendor.findByIdAndUpdate(existingVendor._id, vendorData, { new: true });
          syncStats.vendors.synced++;
          console.log(`   ✅ Updated: ${mysqlVendor.name} (${mysqlVendor.email})`);
        } else {
          // Create new vendor
          await Vendor.create(vendorData);
          syncStats.vendors.synced++;
          console.log(`   ➕ Created: ${mysqlVendor.name} (${mysqlVendor.email})`);
        }
      } catch (error) {
        syncStats.vendors.failed++;
        console.error(`   ❌ Failed to sync vendor ${mysqlVendor.name}:`, error.message);
      }
    }

    console.log(`✅ Vendor sync completed: ${syncStats.vendors.synced} synced, ${syncStats.vendors.failed} failed`);
  } catch (error) {
    console.error('❌ Vendor sync error:', error);
    throw error;
  }
}

// Sync Blogs from MySQL to MongoDB
async function syncBlogs() {
  console.log('\n📝 Starting Blog Sync...');
  
  try {
    // Fetch all blogs from MySQL
    const [mysqlBlogs] = await mysqlPool.query(`
      SELECT 
        id,
        title,
        slug,
        content,
        excerpt,
        author,
        category,
        tags,
        featured_image,
        status,
        views,
        published_at,
        created_at,
        updated_at
      FROM blogs
      ORDER BY id ASC
    `);

    console.log(`   Found ${mysqlBlogs.length} blogs in MySQL`);

    for (const mysqlBlog of mysqlBlogs) {
      try {
        // Check if blog exists in MongoDB by slug
        const existingBlog = await Blog.findOne({ slug: mysqlBlog.slug });

        // Prepare MongoDB document
        const blogData = {
          title: mysqlBlog.title || '',
          slug: mysqlBlog.slug || '',
          content: mysqlBlog.content || '',
          excerpt: mysqlBlog.excerpt || '',
          author: mysqlBlog.author || 'Admin',
          category: mysqlBlog.category || 'General',
          tags: mysqlBlog.tags ? mysqlBlog.tags.split(',').map(t => t.trim()) : [],
          featuredImage: mysqlBlog.featured_image || '',
          status: mysqlBlog.status || 'draft',
          views: parseInt(mysqlBlog.views) || 0,
          publishedAt: mysqlBlog.published_at || null,
          createdAt: mysqlBlog.created_at || new Date(),
          updatedAt: mysqlBlog.updated_at || new Date()
        };

        if (existingBlog) {
          // Update existing blog
          await Blog.findByIdAndUpdate(existingBlog._id, blogData, { new: true });
          syncStats.blogs.synced++;
          console.log(`   ✅ Updated: ${mysqlBlog.title}`);
        } else {
          // Create new blog
          await Blog.create(blogData);
          syncStats.blogs.synced++;
          console.log(`   ➕ Created: ${mysqlBlog.title}`);
        }
      } catch (error) {
        syncStats.blogs.failed++;
        console.error(`   ❌ Failed to sync blog ${mysqlBlog.title}:`, error.message);
      }
    }

    console.log(`✅ Blog sync completed: ${syncStats.blogs.synced} synced, ${syncStats.blogs.failed} failed`);
  } catch (error) {
    console.error('❌ Blog sync error:', error);
    throw error;
  }
}

// Main sync function
async function runSync() {
  syncStats.startTime = new Date();
  console.log('🔄 Starting MySQL → MongoDB Sync');
  console.log('⏰ Start Time:', syncStats.startTime.toISOString());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    await connectDatabases();
    await syncVendors();
    await syncBlogs();
    
    syncStats.endTime = new Date();
    const duration = (syncStats.endTime - syncStats.startTime) / 1000;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Sync Completed Successfully!');
    console.log('⏰ End Time:', syncStats.endTime.toISOString());
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log('\n📊 Summary:');
    console.log(`   Vendors: ${syncStats.vendors.synced} synced, ${syncStats.vendors.failed} failed`);
    console.log(`   Blogs: ${syncStats.blogs.synced} synced, ${syncStats.blogs.failed} failed`);
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    throw error;
  } finally {
    // Close connections
    if (mysqlPool) await mysqlPool.end();
    if (mongoose.connection) await mongoose.connection.close();
    console.log('\n👋 Database connections closed');
  }
}

// Run sync if called directly
if (require.main === module) {
  runSync()
    .then(() => {
      console.log('✅ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { runSync, syncVendors, syncBlogs };

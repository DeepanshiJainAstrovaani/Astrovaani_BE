# CyberPanel Database Setup Guide for Astrovaani

## Step 1: Access CyberPanel Database Management

1. **Login to CyberPanel**
   - Go to your CyberPanel URL (usually `https://your-server-ip:8090`)
   - Login with your admin credentials

2. **Navigate to Database Section**
   - Click on "Databases" in the left sidebar
   - Select "Create Database"

## Step 2: Create Database and User

1. **Create Database**
   - Database Name: `astrovaani` (it will be created as `username_astrovaani`)
   - Click "Create Database"

2. **Create Database User**
   - Username: `astrovaani_user`
   - Password: `Generate a strong password`
   - Click "Create User"

3. **Grant Privileges**
   - Select the database: `username_astrovaani`
   - Select the user: `astrovaani_user`
   - Grant "All Privileges"
   - Click "Grant Privileges"

## Step 3: Access phpMyAdmin

1. **Open phpMyAdmin**
   - In CyberPanel, go to "Databases" → "phpMyAdmin"
   - Or access directly: `https://your-domain.com:8090/databases/phpMyAdmin`

2. **Login to phpMyAdmin**
   - Username: `astrovaani_user`
   - Password: `your_password`
   - Select your database: `username_astrovaani`

## Step 4: Import Database Schema

1. **In phpMyAdmin:**
   - Click on your database name (`username_astrovaani`)
   - Click on "SQL" tab at the top
   - Copy and paste the content from `cyberpanel_database_setup.sql`
   - **Important**: Replace `your_username_astrovaani` with your actual database name
   - Click "Go" to execute

2. **Verify Tables Created:**
   After execution, you should see these tables:
   - `users` - User authentication
   - `community` - Vendors/Astrologers
   - `booking` - Appointments/Sessions
   - `blog` - Blog posts
   - `horoscope` - Daily horoscopes
   - `contact` - Contact form submissions
   - `payments` - Payment transactions

## Step 5: Note Your Database Credentials

**Save these details for your .env file:**

```
DB_HOST=localhost
DB_USER=astrovaani_user
DB_PASSWORD=your_strong_password
DB_NAME=username_astrovaani
DB_PORT=3306
```

## Step 6: Test Database Connection

You can test the connection by creating a simple PHP file:

```php
<?php
$host = 'localhost';
$username = 'astrovaani_user';
$password = 'your_password';
$database = 'username_astrovaani';

$connection = mysqli_connect($host, $username, $password, $database);

if ($connection) {
    echo "Database connection successful!";
    
    // Test query
    $result = mysqli_query($connection, "SELECT COUNT(*) as count FROM community");
    $row = mysqli_fetch_assoc($result);
    echo "<br>Vendors in database: " . $row['count'];
} else {
    echo "Connection failed: " . mysqli_connect_error();
}
?>
```

## Database Structure Overview

### Main Tables:
1. **`users`** - Stores user authentication data (phone, name, email)
2. **`community`** - Stores vendor/astrologer profiles
3. **`booking`** - Manages appointments and sessions
4. **`blog`** - Blog posts and articles
5. **`horoscope`** - Daily horoscope predictions
6. **`contact`** - Contact form submissions
7. **`payments`** - Payment transaction records

### Sample Data Included:
- 4 sample vendors (Astrologer, Tarot Reader, Numerologist, Palmist)
- 3 sample blog posts
- Today's horoscope for 4 zodiac signs (Aries, Taurus, Gemini, Cancer)

## Common Issues and Solutions

### Issue 1: Database name format
- CyberPanel creates databases as `username_databasename`
- Make sure to use the correct format in your .env file

### Issue 2: User permissions
- Ensure the database user has all necessary privileges
- Check in CyberPanel → Databases → List Databases

### Issue 3: Connection refused
- Verify that MySQL service is running
- Check firewall settings for port 3306

### Issue 4: Charset issues
- The schema uses `utf8mb4` charset for full Unicode support
- This supports emojis and special characters

## Next Steps

After setting up the database:

1. ✅ **Database Setup Complete**
2. 🔄 **Next: Deploy Node.js Application**
3. 🔄 **Configure Environment Variables**
4. 🔄 **Test API Endpoints**
5. 🔄 **Update Frontend API URL**

## Backup Recommendations

- Set up automatic database backups in CyberPanel
- Go to "Databases" → "Database Backups"
- Schedule daily backups to avoid data loss

---

**Need Help?** 

If you encounter any issues during database setup, common solutions:
1. Check CyberPanel logs: `/usr/local/lsws/logs/`
2. MySQL logs: `/var/log/mysql/`
3. Restart MySQL service: `systemctl restart mysql`

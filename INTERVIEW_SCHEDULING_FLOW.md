# 📋 Interview Scheduling Complete Flow

## 🎯 Complete User Journey

### **PHP System (How It Works Now)**

```
Admin Panel → Add Slots → Send WhatsApp → Vendor Clicks Link → Vendor Selects Slot → Interview Scheduled
```

---

## 📊 Database Structure

### **Table: `scheduling_interview`**
```sql
CREATE TABLE scheduling_interview (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adminid INT,              -- Admin/Interviewer ID
    vendorid INT,             -- Vendor ID
    timing VARCHAR(255),      -- e.g., "14-11-2025 , 10:00 AM"
    status VARCHAR(50)        -- 'open', 'selected'
);
```

### **Table: `community` (Vendors)**
```sql
interviewcode VARCHAR(255),      -- e.g., "ASTROVAANI-ABC123"
interviewerid VARCHAR(50),       -- Admin ID who will interview
onboardingstatus VARCHAR(50)     -- '', 'interview scheduled'
```

---

## 🔄 Complete Flow

### **Step 1: Admin Adds Interview Slots**
**File:** `public_html/scheduling_interview.php` (Admin panel)

**Action:**
- Admin selects vendor
- Admin adds multiple date/time slots
- Slots saved to `scheduling_interview` table with status='open'

**API:**
```php
// apis/adddate.php
INSERT INTO scheduling_interview 
(adminid, vendorid, timing, status) 
VALUES 
('1', '68', '14-11-2025 , 10:00 AM', 'open')
```

---

### **Step 2: Admin Sends WhatsApp Notification**
**File:** `public_html/apis/notifyvendor.php`

**Action:**
1. Generate interview code: `ASTROVAANI-{random}`
2. Update vendor:
   ```sql
   UPDATE community 
   SET interviewcode='ASTROVAANI-ABC123', 
       interviewerid='1'
   WHERE id='68'
   ```
3. Create booking link:
   ```
   https://astrovaani.com/schedule_interview.php?interviewcode=ASTROVAANI-ABC123
   ```
4. Send WhatsApp with slots and link

**WhatsApp Message:**
```
Dear Vendor Name,

Your interview has been scheduled.

Proposed slots:
1. 14-11-2025 , 10:00 AM
2. 14-11-2025 , 02:00 PM
3. 15-11-2025 , 10:00 AM

Please click on the link below:
https://astrovaani.com/schedule_interview.php?interviewcode=ASTROVAANI-ABC123

Meeting link: https://meet.google.com/xxx

Contact: support@astrovaani.com
```

---

### **Step 3: Vendor Opens Link**
**URL:** `https://astrovaani.com/schedule_interview.php?interviewcode=ASTROVAANI-ABC123`

**What Happens:**
```php
// Get vendor by interview code
$vendordetails = mysqli_query($conn, 
    "SELECT * FROM community 
     WHERE interviewcode='ASTROVAANI-ABC123'"
);

// Get vendor ID and interviewer ID
$vendorid = $row['id'];              // e.g., 68
$interviewerid = $row['interviewerid']; // e.g., 1
$onboardingstatus = $row['onboardingstatus']; // '' or 'interview scheduled'
```

---

### **Step 4: Vendor Sees Available Slots**
**Display:**
```php
// Fetch all open slots for this vendor
$datedetails = mysqli_query($conn,
    "SELECT * FROM scheduling_interview 
     WHERE adminid='$interviewerid' 
     AND vendorid='$vendorid' 
     ORDER BY id ASC"
);
```

**UI Shows:**
```
┌─────────────────────────────────────┐
│  Select a time for your interview   │
├─────────────────────────────────────┤
│                                     │
│  ○ 14-11-2025 , 10:00 AM           │
│                                     │
│  ○ 14-11-2025 , 02:00 PM           │
│                                     │
│  ○ 15-11-2025 , 10:00 AM           │
│                                     │
│         [Schedule Button]           │
└─────────────────────────────────────┘
```

---

### **Step 5: Vendor Selects a Slot**
**Action:** Vendor clicks radio button and clicks "Schedule"

**API:** `apis/schedule.php`

**What Happens:**
```php
// Get selected slot ID
$timing = $_POST['timing']; // e.g., slot ID = 45

// Mark selected slot as 'selected'
UPDATE scheduling_interview 
SET status='selected' 
WHERE id='45'

// Mark vendor as 'interview scheduled'
UPDATE community 
SET onboardingstatus='interview scheduled' 
WHERE id='68'
```

---

### **Step 6: Confirmation Screen**
**Display:**
```
┌────────────────────────────────────────┐
│ Your interview has been scheduled      │
│ successfully                           │
├────────────────────────────────────────┤
│                                        │
│  👤 Admin Name - Interviewer           │
│                                        │
│  🕐 14-11-2025 , 10:00 AM             │
│                                        │
│  Be prepared and available!            │
└────────────────────────────────────────┘
```

---

## 🔑 Key Points

### **Interview Code:**
- **Purpose:** Unique identifier for vendor's interview process
- **Format:** `ASTROVAANI-{random}` (e.g., `ASTROVAANI-4DRIs9IVI5`)
- **Used in:** WhatsApp link parameter
- **Security:** Only vendor with this code can access their slots

### **Slot Status:**
- **`open`:** Available for selection
- **`selected`:** Vendor has chosen this slot

### **Onboarding Status:**
- **`''` (empty):** Vendor has not scheduled yet
- **`'interview scheduled'`:** Vendor has selected a slot

### **MySQL `scheduling_interview` Table:**
```
+----+---------+----------+----------------------+----------+
| id | adminid | vendorid | timing               | status   |
+----+---------+----------+----------------------+----------+
| 45 | 1       | 68       | 14-11-2025 , 10:00 AM| open     |
| 46 | 1       | 68       | 14-11-2025 , 02:00 PM| open     |
| 47 | 1       | 68       | 15-11-2025 , 10:00 AM| selected |
+----+---------+----------+----------------------+----------+
```

---

## 🎯 What We Need for Node.js Admin Panel

### **1. MongoDB Schema (Already Have):**
```javascript
// vendorSchema.js
schedules: [{
  scheduledAt: Date,        // Interview date/time
  duration: Number,         // Duration in minutes
  status: String,           // 'proposed', 'confirmed', 'completed'
  _id: ObjectId,
  createdAt: Date
}]
```

### **2. Frontend Page Needed:**
**Similar to:** `schedule_interview.php`

**URL:** `https://astrovaani.com/vendor-interview?code=ASTROVAANI-ABC123`

**Features:**
- ✅ Get vendor by interview code
- ✅ Display available slots
- ✅ Radio button selection
- ✅ Submit selection
- ✅ Show confirmation

### **3. Backend API Needed:**
```javascript
// GET /api/vendors/interview/:interviewCode
// - Get vendor by interview code
// - Return vendor details and available slots

// POST /api/vendors/interview/:interviewCode/select
// - Mark slot as selected
// - Update vendor onboardingstatus
// - Return confirmation
```

---

## 📝 Comparison: PHP vs Node.js

| Feature | PHP (Current) | Node.js (Need) |
|---------|--------------|----------------|
| **Slots Table** | `scheduling_interview` (MySQL) | `schedules` array (MongoDB) |
| **Vendor Table** | `community` (MySQL) | `community` collection (MongoDB) |
| **Selection Page** | `schedule_interview.php` ✅ | Need to create ❌ |
| **Selection API** | `apis/schedule.php` ✅ | Need to create ❌ |
| **WhatsApp Link** | Works ✅ | Sends link ✅ but no page ❌ |

---

## ✅ Action Items

### **1. Create Vendor Interview Selection Page**
**File:** `astrovaani_web_fe/src/pages/VendorInterview.js`
- Public page (no login required)
- Get `?code=` from URL
- Display vendor slots
- Submit selection

### **2. Create Backend APIs**
```javascript
// GET /api/vendors/interview/:code
router.get('/interview/:code', vendorController.getInterviewByCode);

// POST /api/vendors/interview/:code/select
router.post('/interview/:code/select', vendorController.selectInterviewSlot);
```

### **3. Update Vendor Controller**
```javascript
// Get vendor and slots by interview code
exports.getInterviewByCode = async (req, res) => {
  const { code } = req.params;
  const vendor = await Vendor.findOne({ interviewcode: code });
  // Return vendor + schedules with status='proposed'
};

// Select a slot
exports.selectInterviewSlot = async (req, res) => {
  const { code } = req.params;
  const { slotId } = req.body;
  // Update schedule status to 'confirmed'
  // Update vendor onboardingstatus to 'interview scheduled'
};
```

---

## 🎉 Summary

**Current Issue:** 
- ✅ Admin can add slots
- ✅ Admin can send WhatsApp notification
- ❌ **Missing:** Vendor interview selection page (like PHP's `schedule_interview.php`)

**Solution:**
- Need to create a public page where vendor can click the WhatsApp link and select their interview slot

**Next Steps:**
1. Create vendor interview selection page (frontend)
2. Create backend APIs for getting/selecting slots
3. Test complete flow

---

**Want me to create the vendor interview selection page now?** 🚀

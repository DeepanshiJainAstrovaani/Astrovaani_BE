# 📱 WhatsApp Template Creation Guide

## 🎯 Why You Need a Template

IconicSolution WhatsApp Business API requires **pre-approved templates** for sending messages. You cannot send free-form text messages - they must use approved templates.

## ✅ Current Status

From your dashboard, you have:
- ✅ 17 approved templates
- ✅ WhatsApp numbers active: 919891041434, 919540500325
- ✅ License valid until 12/03/2025

## 📝 Create Interview Notification Template

### Step 1: Access Template Creation

1. Go to your IconicSolution dashboard
2. Click **"Add New Official Template"** (green button)

### Step 2: Fill Template Details

**Template Name:** `vendor_interview_notification`
- Use lowercase, underscores only
- No spaces or special characters

**Category:** `UTILITY`
- This is a business notification, not marketing

**Language:** `English`

**Select Category:** `Marketing` or `Utility` (choose Utility for business notifications)

### Step 3: Create Message Template

**Message Format:**
```
*Dear {{1}}*,

We are pleased to inform you that your joining application has been approved. Your interview has been scheduled.

{{2}}

Please click on the link below to select an available slot for your interview:

{{3}}

{{4}}

Should you have any questions or need further assistance, feel free to reach out to us at support@astrovaani.com

*Note:* If you're unable to click on the link, please save this number in your contacts, and the link will become clickable.
```

**Variable Mapping:**
- `{{1}}` = Vendor Name (e.g., "Neeraj gunwant")
- `{{2}}` = Proposed Slots Text (e.g., "Proposed slots:\n1. 14-11-2025 10:00 AM (30 mins)")
- `{{3}}` = Interview Booking Link (e.g., "https://astrovaani.com/interview?code=ASTROVAANI-ABC123")
- `{{4}}` = Meeting Link (optional, e.g., "Meeting link: https://meet.google.com/xxx")

**Note:** The link now points to the new React public page `/interview?code=...` (no login required)

### Step 4: Add Buttons (Optional)

If you want to add buttons:
- Click **"Add Button"**
- Button Type: **URL**
- Button Text: "Book Interview Slot"
- URL: `{{3}}` (use variable)

### Step 5: Select WhatsApp Number

**Important:** Select one of your active numbers from dropdown:
- `919891041434`, OR
- `919540500325`

### Step 6: Save Template

1. Click **"Save Template"**
2. Template will be submitted to **Facebook/WhatsApp** for approval
3. Status will show as **"PENDING"**

### Step 7: Wait for Approval

- **Approval Time:** 24-48 hours (sometimes faster)
- **Check Status:** Refresh your template dashboard
- **Status Changes:** PENDING → APPROVED
- Once approved, status will show **"APPROVED"** (green)

---

## 🔄 Alternative: Use Existing Template Temporarily

While waiting for approval, you can use an existing approved template:

### Option 1: Use "onboarding" Template
```env
# In .env file
WHATSAPP_TEMPLATE_NAME=onboarding
```

### Option 2: Use "vendor_booking_alert" Template
```env
# In .env file
WHATSAPP_TEMPLATE_NAME=vendor_booking_alert
```

**Note:** The message format must match the template structure. Check the template preview to see what variables it expects.

---

## 🧪 Testing with Dummy Mode

While template is being approved, keep dummy mode enabled:

```env
# In .env file
WHATSAPP_DUMMY=true
```

This allows you to:
- ✅ Test slot management
- ✅ Test interview code generation
- ✅ Test notification logging
- ❌ Not send real WhatsApp (simulated)

---

## ✅ Once Template is Approved

### Step 1: Update .env

```env
# Set your approved template name
WHATSAPP_TEMPLATE_NAME=vendor_interview_notification

# Disable dummy mode
WHATSAPP_DUMMY=false
```

### Step 2: Deploy to Render

```bash
git add .
git commit -m "Update WhatsApp template name"
git push origin master
```

Wait 2-3 minutes for Render to redeploy.

### Step 3: Test Notification

1. Open admin panel
2. Go to Schedule page
3. Select vendor
4. Add slots
5. Click "🔔 Notify Vendor"
6. Should now work! ✅

### Step 4: Expected Success Response

```json
{
  "status": "success",
  "statuscode": 200,
  "msg": "Message sent successfully",
  "messageId": "wamid_xxx..."
}
```

---

## 📊 Template Best Practices

### ✅ Do:
- Use clear, professional language
- Keep variables simple ({{1}}, {{2}}, etc.)
- Add helpful instructions
- Include contact information
- Use *bold* for emphasis (WhatsApp formatting)

### ❌ Don't:
- Use promotional language (if category is UTILITY)
- Add too many variables (max 10)
- Use special characters in template name
- Send without Facebook approval

---

## 🔍 Troubleshooting

### Template Rejected?
**Reasons:**
- Used promotional language in UTILITY category
- Violated WhatsApp policies
- Missing required information

**Solution:**
- Read rejection reason carefully
- Modify template based on feedback
- Resubmit for approval

### Template Taking Too Long?
**Normal time:** 24-48 hours
**If longer:** Contact IconicSolution support

### Can't Find Template Section?
**Location options:**
- "Official WAPP Template Report"
- "Templates" menu
- "Manage Templates" button

---

## 📝 Template Checklist

Before submitting:

- [ ] Template name is lowercase with underscores only
- [ ] Category is set correctly (UTILITY for business)
- [ ] Language is English
- [ ] Message uses variables ({{1}}, {{2}}, etc.)
- [ ] Message is professional and clear
- [ ] WhatsApp number is selected (919891041434 or 919540500325)
- [ ] Buttons added (if needed)
- [ ] Footer added (if needed)
- [ ] Reviewed for typos and formatting
- [ ] Saved successfully

---

## 🎯 Summary

**Current Issue:** Need to create template for vendor interview notifications

**Solution:**
1. Create template named `vendor_interview_notification`
2. Use UTILITY category
3. Add message with 4 variables
4. Wait for Facebook approval (24-48 hours)
5. Update .env with template name
6. Disable dummy mode
7. Test notification

**Status:** ⏳ Awaiting template creation and approval

**Next:** Create template on IconicSolution dashboard

---

## 📞 Support

- **IconicSolution Support:** support@iconicsolution.co.in
- **WhatsApp Policy:** https://www.whatsapp.com/legal/business-policy
- **Template Guidelines:** Check IconicSolution documentation

---

**Date:** November 13, 2025  
**Action Required:** Create and get approval for WhatsApp template  
**Expected Time:** 24-48 hours for approval

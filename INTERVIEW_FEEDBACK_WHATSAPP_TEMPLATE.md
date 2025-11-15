# Interview Feedback WhatsApp Template Setup

## Overview
When an admin approves a vendor's interview feedback and sets the status to "In Process" (Approve - Send for Agreement), the vendor receives a WhatsApp notification informing them that their interview is complete and they'll be contacted for the agreement signing.

---

## Template Details

### Template Name
```
interview_feedback_approved
```

### Template Language
English

### Template Category
**TRANSACTIONAL** (or ACCOUNT_UPDATE - choose based on IconicSolution's available categories)

---

## Template Content

### Header
*No header required*

### Body
```
Dear {{1}},

We would like to inform you that your interview has been successfully completed. You will be notified soon regarding your onboarding status.

Once your application is approved, we will proceed with the final step of signing the onboarding agreement to officially bring you on board with Astrovaani.
```

### Footer
*Optional:*
```
- Team Astrovaani
```

### Buttons
*No buttons required*

---

## Template Variables

| Position | Variable | Description | Example |
|----------|----------|-------------|---------|
| {{1}} | Vendor Name | Full name of the vendor | "Jiten Bhardwaj" |

---

## API Integration

### Endpoint
```
POST https://wa.iconicsolution.co.in/wapp/api/send/bytemplate
```

### Request Parameters
```javascript
{
  "apikey": "YOUR_API_KEY",
  "mobile": "919876543210",  // Include country code
  "templatename": "interview_feedback_approved",
  "dvariables": ["Vendor Name"]
}
```

### Example cURL Request
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_API_KEY" \
  -F "mobile=919876543210" \
  -F "templatename=interview_feedback_approved" \
  -F 'dvariables=["Jiten Bhardwaj"]'
```

---

## Integration Flow

### When is this template used?
This template is triggered automatically when:
1. Admin opens Interview Feedback form for a vendor
2. Admin submits feedback with decision: **"✅ Approve - Send for Agreement"**
3. Backend updates vendor status to `inprocess`
4. WhatsApp notification is sent automatically

### Code Location
- **Backend:** `Astrovaani_BE/controllers/vendorController.js` → `updateVendor` function
- **Frontend:** `astrovaani_web_fe/src/pages/admin/InterviewFeedback.js`

### Backend Logic
```javascript
// In updateVendor function
if (isInterviewFeedback && isApprovedForAgreement) {
  // Send WhatsApp using template: interview_feedback_approved
  // Variables: [vendorName]
}
```

---

## Setup Instructions

### Step 1: Create Template in IconicSolution Dashboard
1. Log in to https://wa.iconicsolution.co.in
2. Navigate to **Templates** section
3. Click **Create New Template**
4. Enter template name: `interview_feedback_approved`
5. Select category: **TRANSACTIONAL** or **ACCOUNT_UPDATE**
6. Select language: **English**
7. Enter the body text with variable placeholder `{{1}}`
8. Submit for approval

### Step 2: Wait for WhatsApp Approval
- Template approval typically takes 24-48 hours
- You'll receive notification once approved
- Status will change from "PENDING" to "APPROVED"

### Step 3: Test Template
Once approved, test the template:

```bash
# Test with your own number first
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_API_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=interview_feedback_approved" \
  -F 'dvariables=["Test Vendor"]'
```

### Step 4: Enable in Production
- Template is already integrated in the code
- No code changes needed after template approval
- Notifications will be sent automatically when admin approves interview feedback

---

## Complete Vendor Flow

### 1. Interview Scheduling
- Admin schedules interview → Vendor receives **`vendor_interview_notification_`** template

### 2. Slot Selection Reminder
- Admin sends reminder → Vendor receives **`slotreminder`** template

### 3. Meeting Link
- Admin sends meeting link → Vendor receives **`vendor_meeting_link_notification`** template

### 4. Interview Reminder
- Admin sends reminder before interview → Vendor receives **`interview_reminder`** template

### 5. Interview Feedback (NEW) ✅
- Admin approves feedback → Vendor receives **`interview_feedback_approved`** template
- Vendor status changes to "In Process"
- Vendor moves from "Interviews" to "Vendors → In Process" tab

### 6. Agreement (Pending Implementation)
- After admin sends agreement → Vendor receives agreement WhatsApp notification
- Vendor signs agreement → Status changes to "Active"

---

## Testing Checklist

- [ ] Template created in IconicSolution dashboard
- [ ] Template approved by WhatsApp
- [ ] Template tested with test mobile number
- [ ] Backend logs show successful API call
- [ ] Vendor receives WhatsApp message
- [ ] Message content is correct with vendor name
- [ ] Notification logged in database
- [ ] Vendor status updated to "inprocess"
- [ ] Vendor appears in "In Process" tab

---

## Troubleshooting

### Template Not Found Error
```json
{
  "error": "Template not found"
}
```
**Solution:** Ensure template name is exactly `interview_feedback_approved` and is approved.

### Template Not Approved
**Solution:** Wait for WhatsApp approval (24-48 hours). Check template status in IconicSolution dashboard.

### Variable Mismatch Error
**Solution:** Ensure you're sending exactly 1 variable (vendor name) in the `dvariables` array.

### Mobile Number Error
**Solution:** Ensure mobile number includes country code (e.g., `919876543210` for India).

---

## Related Templates

All interview-related templates:
1. `vendor_interview_notification_` - Initial interview notification with slot selection link
2. `slotreminder` - Reminder to select interview slot
3. `vendor_meeting_link_notification` - Meeting link after slot selection
4. `interview_reminder` - Interview reminder before scheduled time
5. `interview_feedback_approved` - **NEW** - Feedback completion and next steps

---

## Next Steps

After this template is approved and working:
1. **Agreement Flow:** Implement agreement sending via WhatsApp
2. **Vendor Activation:** Final activation after agreement signed
3. **Welcome Message:** Send welcome message when vendor goes active

---

**Last Updated:** November 15, 2025  
**Status:** ✅ Code Integrated, ⏳ Template Pending Approval

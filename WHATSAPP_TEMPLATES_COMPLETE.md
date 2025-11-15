# WhatsApp Template Setup Required for Interview Flow

## Complete Template List

You need to create and get approved the following WhatsApp templates in your IconicSolution dashboard:

---

## 1. Interview Notification (Initial Slot Selection)

**Template Name:** `vendor_interview_notification_`

**Body:**
```
Dear {{1}},

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, and we invite you to book a suitable time slot.

Please click on the link below to select an available slot for your interview:

{{2}}

Should you have any questions or need further assistance, feel free to reach out to us at support@astrovaani.com

*Note:* If you're unable to click on the link, please save this number in your contacts, and the link will become clickable.
```

**Variables:**
- {{1}} = Vendor Name (e.g., "Jiten Bhardwaj")
- {{2}} = Interview Link (e.g., "https://astrovaani.com/interview?code=ASTROVAANI-abc123")

---

## 2. Slot Selection Reminder

**Template Name:** `slotreminder`

**Body:**
```
Dear {{1}},

This is a friendly reminder to select your interview slot.

Please click on the link below to choose a suitable time:

{{2}}

If you have any questions, feel free to contact us.

- Team Astrovaani
```

**Variables:**
- {{1}} = Vendor Name
- {{2}} = Interview Link

---

## 3. Meeting Link Notification

**Template Name:** `vendor_meeting_link_notification`

**Body:**
```
🎉 Great news, {{1}}!

Your interview with Astrovaani is confirmed!

📅 Date & Time: {{3}} at {{4}}
🔗 Meeting Link: {{2}}

Please join on time. Good luck!

- Team Astrovaani
```

**Variables:**
- {{1}} = Vendor Name
- {{2}} = Meeting Link (e.g., "https://meet.google.com/abc-def-ghi")
- {{3}} = Date (e.g., "15 Nov 2025")
- {{4}} = Time (e.g., "02:30 PM")

---

## 4. Interview Reminder

**Template Name:** `interview_reminder`

**Body:**
```
⏰ Interview Reminder

Dear {{1}},

This is a reminder about your upcoming interview with Astrovaani.

📅 Date & Time: {{2}} at {{3}}
⏱️ Duration: {{4}} minutes
🔗 Meeting Link: {{5}}

Please join on time. We look forward to speaking with you!

- Team Astrovaani
```

**Variables:**
- {{1}} = Vendor Name
- {{2}} = Date (e.g., "15 Nov 2025")
- {{3}} = Time (e.g., "02:30 PM")
- {{4}} = Duration (e.g., "30")
- {{5}} = Meeting Link

---

## 5. Interview Feedback Approved (NEW - REQUIRED) ✅

**Template Name:** `interview_feedback_approved`

**Body:**
```
Dear {{1}},

We would like to inform you that your interview has been successfully completed. You will be notified soon regarding your onboarding status.

Once your application is approved, we will proceed with the final step of signing the onboarding agreement to officially bring you on board with Astrovaani.
```

**Variables:**
- {{1}} = Vendor Name

**When sent:**
- Automatically triggered when admin submits interview feedback with decision: "✅ Approve - Send for Agreement"
- Vendor status changes to "inprocess"
- Vendor moves from Interviews to Vendors → In Process tab

---

## Template Setup Steps

### For Each Template:

1. **Login to IconicSolution Dashboard**
   - URL: https://wa.iconicsolution.co.in
   - Use your account credentials

2. **Create New Template**
   - Navigate to Templates section
   - Click "Create New Template"
   - Enter the exact template name (case-sensitive)
   - Select category: **TRANSACTIONAL** or **ACCOUNT_UPDATE**
   - Select language: **English**

3. **Enter Template Content**
   - Copy the body text exactly as shown above
   - Replace variable placeholders with `{{1}}`, `{{2}}`, etc.
   - Add footer if needed (optional): `- Team Astrovaani`

4. **Submit for Approval**
   - Review the template
   - Submit to WhatsApp for approval
   - Wait 24-48 hours for approval

5. **Test After Approval**
   ```bash
   curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
     -F "apikey=YOUR_API_KEY" \
     -F "mobile=91YOUR_MOBILE" \
     -F "templatename=TEMPLATE_NAME" \
     -F 'dvariables=["Test Name","Test Link"]'
   ```

---

## Current Status

| Template Name | Status | Priority | Usage |
|--------------|--------|----------|-------|
| `vendor_interview_notification_` | ✅ Approved | High | Initial interview notification |
| `slotreminder` | ✅ Approved | Medium | Slot selection reminder |
| `vendor_meeting_link_notification` | ⏳ Pending | High | Meeting link after slot selection |
| `interview_reminder` | ⏳ Pending | Medium | Interview reminder |
| `interview_feedback_approved` | ⏳ **NEW - REQUIRED** | **High** | **After interview completion** |

---

## Integration Points

### Backend: `vendorController.js`

1. **notifyVendorSlots** → Uses `vendor_interview_notification_`
2. **sendReminder** → Uses `slotreminder`
3. **sendMeetingLink** → Uses `vendor_meeting_link_notification`
4. **notifyVendor** → Uses `interview_reminder`
5. **updateVendor** → Uses `interview_feedback_approved` (NEW) ✅

### Frontend: `InterviewFeedback.js`

When admin submits feedback:
```javascript
{
  interviewRating: "5",
  interviewNotes: "good",
  interviewStatus: "completed",
  onboardingstatus: "inprocess",  // ✅ Triggers WhatsApp
  status: "inprocess"
}
```

---

## Testing Checklist

After templates are approved:

- [ ] Test `vendor_interview_notification_` - Schedule interview
- [ ] Test `slotreminder` - Send reminder
- [ ] Test `vendor_meeting_link_notification` - Send meeting link
- [ ] Test `interview_reminder` - Send interview reminder
- [ ] Test `interview_feedback_approved` - Submit feedback with "Approve - Send for Agreement"

---

## Message Flow Example

**For Vendor "Jiten Bhardwaj":**

1. **Day 1:** Interview Scheduled
   - Template: `vendor_interview_notification_`
   - Message: "Dear Jiten Bhardwaj, your application has been approved. Please select interview slot: https://astrovaani.com/interview?code=ABC123"

2. **Day 2:** Slot Selection Reminder
   - Template: `slotreminder`
   - Message: "Dear Jiten Bhardwaj, reminder to select your interview slot: https://astrovaani.com/interview?code=ABC123"

3. **Day 3:** Vendor Selects Slot → Admin Sends Meeting Link
   - Template: `vendor_meeting_link_notification`
   - Message: "Great news, Jiten Bhardwaj! Interview confirmed on 15 Nov 2025 at 02:30 PM. Link: https://meet.google.com/xyz"

4. **Day 4:** Interview Reminder
   - Template: `interview_reminder`
   - Message: "Reminder for Jiten Bhardwaj: Interview tomorrow 15 Nov 2025 at 02:30 PM (30 mins). Link: https://meet.google.com/xyz"

5. **Day 5:** Interview Completed → Admin Approves Feedback ✅ **NEW**
   - Template: `interview_feedback_approved`
   - Message: "Dear Jiten Bhardwaj, your interview has been successfully completed. You will be notified soon regarding your onboarding status. Once approved, we will proceed with signing the agreement."

6. **Day 6:** Agreement Sent (Future Implementation)
   - Template: TBD
   - Message: Agreement link and instructions

7. **Day 7:** Vendor Activated (Future Implementation)
   - Template: TBD
   - Message: Welcome message

---

## Important Notes

1. **Template Names Must Match Exactly** - The backend code uses these exact template names
2. **Variable Order Matters** - Variables must be in the correct order
3. **Test Each Template** - After approval, test with a real mobile number
4. **Monitor Logs** - Check backend logs for API responses
5. **Check Notification Table** - All WhatsApp attempts are logged in the database

---

## Next Steps

1. ✅ Create `interview_feedback_approved` template in IconicSolution dashboard
2. ⏳ Wait for WhatsApp approval (24-48 hours)
3. ✅ Test template with test mobile number
4. ✅ Enable in production (already integrated in code)
5. ✅ Test end-to-end: Submit interview feedback → Verify WhatsApp received

---

**Last Updated:** November 15, 2025  
**Documentation:** `INTERVIEW_FEEDBACK_WHATSAPP_TEMPLATE.md`  
**Code Location:** `Astrovaani_BE/controllers/vendorController.js`

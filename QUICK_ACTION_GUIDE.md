# Quick Action Guide - WhatsApp Templates with Buttons

## ✅ What's Been Done

All backend code is complete and ready. Just need to create 6 templates in IconicSolution dashboard.

---

## 🎯 Templates to Create (Copy-Paste Ready)

### Template 5: vendor_meeting_link_with_button (WITH BUTTON ⭐)

**Template Name:** `vendor_meeting_link_with_button`  
**Category:** TRANSACTIONAL  
**Variables:** 3

**Body Text:**
```
Dear *{{1}}*,

Your interviewer, *{{2}}*, is waiting for you to join the interview scheduled on *{{3}}*.

Make sure you've downloaded the Google Meet app to join if you're joining from your phone.

We wish you the very best of luck for your interview.
```

**Button Setup:**
- Add Quick Reply Button
- Button Text: `Join Interview`
- Button Type: URL
- URL: Dynamic - Use `{{{1}}}` as placeholder

**When Used:** Admin sends meeting link from Scheduled Interviews page

---

### Template 6: vendor_schedule_interview_button (WITH BUTTON ⭐)

**Template Name:** `vendor_schedule_interview_button`  
**Category:** TRANSACTIONAL  
**Variables:** 1

**Body Text:**
```
Dear *{{1}}*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, book a suitable time slot for your interview.
```

**Button Setup:**
- Add Quick Reply Button
- Button Text: `Schedule Interview`
- Button Type: URL
- URL: Dynamic - Use `{{{1}}}` as placeholder

**When Used:** Admin schedules interview and clicks "Notify Vendor"

---

## 🔧 Backend Implementation (Already Done ✅)

### Template 5 Usage (sendMeetingLink):
```javascript
// Admin sends meeting link
POST /api/vendors/:id/send-link
Body: {
  "meetingLink": "https://meet.google.com/abc-def-ghi",
  "slotId": "SLOT_ID"
}

// Backend automatically sends:
- Template: vendor_meeting_link_with_button
- Variables: [vendorName, interviewerName, formattedTiming]
- Button URL: meetingLink
```

### Template 6 Usage (notifyVendorSlots):
```javascript
// Admin clicks "Notify Vendor"
POST /api/vendors/:id/notify-slots

// Backend automatically sends:
- Template: vendor_schedule_interview_button
- Variables: [vendorName]
- Button URL: interviewBookingLink
```

---

## 📱 How Buttons Work

### For Template 5:
1. Vendor receives WhatsApp message
2. Sees "Join Interview" button
3. Taps button → **Opens Google Meet directly**
4. No need to copy-paste URL!

### For Template 6:
1. Vendor receives WhatsApp message
2. Sees "Schedule Interview" button
3. Taps button → **Opens slot selection page**
4. Can immediately select preferred time!

---

## 📝 Complete Template List

| # | Template Name | Button | Status |
|---|---------------|--------|--------|
| 1 | vendor_rejected_no_response | No | ⏳ Create |
| 2 | vendor_interview_completed | No | ⏳ Create |
| 3 | vendor_approved_agreement_ready | Optional | ⏳ Create |
| 4 | vendor_agreement_rejected | No | ⏳ Create |
| 5 | vendor_meeting_link_with_button | **Yes** ⭐ | ⏳ Create |
| 6 | vendor_schedule_interview_button | **Yes** ⭐ | ⏳ Create |

---

## 🚀 Next Steps

1. **Login to IconicSolution Dashboard**
   - URL: https://wa.iconicsolution.co.in

2. **Create All 6 Templates**
   - Use exact content from `TEMPLATES_COPY_PASTE.md`
   - For Templates 5 & 6: Add Quick Reply Button as shown above

3. **Submit for Approval**
   - WhatsApp review: 24-48 hours

4. **Test After Approval**
   - Test Template 5: Send meeting link → Check button works
   - Test Template 6: Notify vendor → Check button works

5. **Go Live** 🎉
   - Everything else is ready!

---

## ⚠️ Important Notes

### Button Configuration:
- Button URL placeholder: `{{{1}}}` (triple braces)
- Actual URL sent via API parameter: `buttondata`
- Maximum 1 button per template
- Button text max 20 characters

### Variables:
- Template 5: 3 variables (Name, Interviewer, Time)
- Template 6: 1 variable (Name only)
- Use `*{{1}}*` for bold text

---

## 📚 Full Documentation

- **Quick Reference:** `TEMPLATES_COPY_PASTE.md`
- **Complete Guide:** `COMPLETE_TEMPLATES_WITH_BUTTONS.md`
- **Implementation:** `FINAL_SUMMARY.md`

---

**Status:** ✅ Code Complete | ⏳ Templates Pending  
**Action Required:** Create 6 templates in IconicSolution dashboard  
**Time Needed:** 30 minutes to create + 24-48 hours for approval

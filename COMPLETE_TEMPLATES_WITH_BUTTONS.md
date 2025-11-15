# Complete WhatsApp Templates with Buttons - Final Documentation

## All 6 Templates for Vendor Onboarding Flow

---

## Template 1: vendor_rejected_no_response ❌

**When:** Admin cancels interview (no response/no show)

**Variables:** 1 - Vendor Name  
**Buttons:** None

**Body:**
```
Dear *{{1}}*,

Thank you for showing interest in joining Astrovaani. After reviewing your application and attempting to proceed with the interview process, we regret to inform you that your application has been rejected at this time due to the following reasons:

1. Despite multiple attempts, we were unable to schedule your interview as we did not receive a response from your side.

2. Based on the information provided, your availability does not align with our requirements. Timeliness is crucial for maintaining an excellent customer experience during consultations.

We encourage you to resubmit your application in the future if circumstances change and you meet the outlined criteria.
```

---

## Template 2: vendor_interview_completed ✅

**When:** Admin submits feedback "Approve - Send for Agreement"

**Variables:** 1 - Vendor Name  
**Buttons:** None

**Body:**
```
Dear *{{1}}*,

We would like to inform you that your interview has been successfully completed. You will be notified soon regarding your onboarding status.

Once your application is approved, we will share your login credentials with you. Following that, we will proceed with the final step of signing the onboarding agreement to officially bring you on board with Astrovaani.
```

---

## Template 3: vendor_approved_agreement_ready 🎉

**When:** Admin approves vendor for agreement

**Variables:** 1 - Vendor Name  
**Buttons:** 1 - "Download App" (optional)

**Body:**
```
Dear *{{1}}*,

Thank you for your patience! Congratulations! Your interview has been successfully approved and your onboarding agreement is ready. You're now just one step away from getting onboard with Astrovaani.

Please follow the steps below to complete your onboarding documentation process:

1. Download our astrologer app to login your vendor account

2. After login, Download your onboarding agreement from your account.

3. Review, sign, and upload the agreement back to your account.

Once we verify the agreement, your profile will go live on Astrovaani, and you'll be ready to connect with clients.
```

**Button (if supported):**
- Text: "Download App"
- Type: URL
- URL: Dynamic (app download link)

---

## Template 4: vendor_agreement_rejected ❌

**When:** Admin rejects uploaded agreement

**Variables:** 2 - Vendor Name, Rejection Reason  
**Buttons:** None

**Body:**
```
Dear *{{1}}*,

We regret to inform you that your agreement has been rejected due to the following reason:

Reason: {{2}}

To proceed further, we kindly request you to follow one of the options below:

1. Sign Digitally: Ensure that you place your signature on every page of the agreement. Before uploading, preview the document on your device to confirm that the signatures are visible.

2. Or Sign Manually: Print the agreement, sign it on every page, and upload the scanned copy in PDF format to your account.
```

---

## Template 5: vendor_meeting_link_with_button 🔗 NEW

**When:** Admin sends meeting link (from Scheduled interviews)

**Variables:** 3 - Vendor Name, Interviewer Name, Interview Timing  
**Buttons:** 1 - "Join Interview" with Google Meet link

**Body:**
```
Dear *{{1}}*,

Your interviewer, {{2}}, is waiting for you to join the interview scheduled on {{3}}

Make sure you've downloaded the Google Meet app to join if you're joining from your phone.

We wish you the very best of luck for your interview.
```

**Button:**
- Text: "Join Interview"
- Type: URL
- URL: Dynamic (Google Meet link passed via API)

**Variables Explanation:**
- {{1}} = Vendor Name (bold) - e.g., "Jiten Bhardwaj"
- {{2}} = Interviewer Name - e.g., "Admin" or "Interviewer Name"
- {{3}} = Interview Timing - e.g., "15 Nov 2025 at 02:30 PM"

**Button URL:** The actual Google Meet link (e.g., https://meet.google.com/abc-def-ghi)

---

## Template 6: vendor_schedule_interview_button 📅 NEW

**When:** Admin schedules interview and notifies vendor (from Interviews page)

**Variables:** 1 - Vendor Name  
**Buttons:** 1 - "Schedule Interview" with booking page link

**Body:**
```
Dear *{{1}}*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, book a suitable time slot for your interview.
```

**Button:**
- Text: "Schedule Interview"
- Type: URL
- URL: Dynamic (interview booking link passed via API)

**Variables Explanation:**
- {{1}} = Vendor Name (bold) - e.g., "Jiten Bhardwaj"

**Button URL:** Interview slot selection page (e.g., https://astrovaani.com/interview?code=ASTROVAANI-abc123)

---

## Template Summary Table

| # | Template Name | Variables | Button | When Used |
|---|---------------|-----------|--------|-----------|
| 1 | `vendor_rejected_no_response` | 1 (Name) | No | Cancel interview |
| 2 | `vendor_interview_completed` | 1 (Name) | No | Feedback approved |
| 3 | `vendor_approved_agreement_ready` | 1 (Name) | Optional | Agreement ready |
| 4 | `vendor_agreement_rejected` | 2 (Name, Reason) | No | Agreement rejected |
| 5 | `vendor_meeting_link_with_button` | 3 (Name, Interviewer, Time) | **Yes** | Send meeting link |
| 6 | `vendor_schedule_interview_button` | 1 (Name) | **Yes** | Schedule interview |

---

## Backend Integration Status

### ✅ Implemented:

| Template | Function | Route | Status |
|----------|----------|-------|--------|
| Template 1 | `cancelInterview` | POST /api/vendors/:id/cancel-interview | ✅ Done |
| Template 2 | `updateVendor` | PUT /api/vendors/:id | ✅ Done |
| Template 3 | `approveVendorForAgreement` | POST /api/vendors/:id/approve-agreement | ✅ Done |
| Template 4 | `rejectVendorAgreement` | POST /api/vendors/:id/reject-agreement | ✅ Done |
| Template 5 | `sendMeetingLink` | POST /api/vendors/:id/send-link | ✅ **UPDATED** |
| Template 6 | `notifyVendorSlots` | POST /api/vendors/:id/notify-slots | ✅ **UPDATED** |

---

## Button Implementation Details

### How Buttons Work in WhatsApp Templates:

1. **Create Template in IconicSolution Dashboard:**
   - When creating template, add a "URL Button"
   - Button text: "Join Interview" or "Schedule Interview"
   - URL type: Dynamic (will be passed via API)

2. **Send via API:**
   - Template variables sent via `dvariables`
   - Button URL sent via `buttons` parameter
   - Example API call structure

### API Call Examples:

**Template 5 (Meeting Link with Button):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=918168095773" \
  -F "templatename=vendor_meeting_link_with_button" \
  -F 'dvariables=["Jiten Bhardwaj","Admin","15 Nov 2025 at 02:30 PM"]' \
  -F 'buttons=[{"type":"url","url":"https://meet.google.com/abc-def-ghi"}]'
```

**Template 6 (Schedule Interview with Button):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=918168095773" \
  -F "templatename=vendor_schedule_interview_button" \
  -F 'dvariables=["Jiten Bhardwaj"]' \
  -F 'buttons=[{"type":"url","url":"https://astrovaani.com/interview?code=ASTROVAANI-abc123"}]'
```

**Note:** Button parameter format may vary. If `buttons` doesn't work, try:
- `button_url`
- `dynamic_url`
- Check IconicSolution API documentation for exact parameter name

---

## Complete Vendor Journey with All Templates

```
NEW VENDOR
   ↓
1. ADMIN SCHEDULES INTERVIEW
   → Template 6: vendor_schedule_interview_button 📅 NEW
   → Button: "Schedule Interview" (opens slot selection)
   ↓
2a. VENDOR SELECTS SLOT
    → Vendor clicks button → Opens booking page
    → Selects preferred time slot
    → Confirmed!
    ↓
2b. VENDOR DOESN'T RESPOND
    → Admin clicks "Cancel Interview"
    → Template 1: vendor_rejected_no_response ❌
    → END
    ↓
3. ADMIN SENDS MEETING LINK
   → Template 5: vendor_meeting_link_with_button 🔗 NEW
   → Button: "Join Interview" (opens Google Meet)
   → Variables: Name, Interviewer, Time
   ↓
4. INTERVIEW HAPPENS
   → Vendor clicks "Join Interview" button
   → Opens Google Meet directly
   → Interview conducted
   ↓
5a. INTERVIEW FEEDBACK: APPROVE
    → Admin submits: "Approve - Send for Agreement"
    → Template 2: vendor_interview_completed ✅
    → Status: inprocess
    ↓
5b. INTERVIEW FEEDBACK: REJECT
    → Template 1: vendor_rejected_no_response ❌
    → END
    ↓
6. ADMIN APPROVES FOR AGREEMENT
   → Template 3: vendor_approved_agreement_ready 🎉
   → Optional Button: "Download App"
   → Status: agreement pending
   ↓
7a. VENDOR UPLOADS AGREEMENT
    → Admin reviews
    ↓
7b. AGREEMENT REJECTED
    → Template 4: vendor_agreement_rejected ❌
    → Reason provided
    → Loop back to step 7
    ↓
8. AGREEMENT APPROVED
   → Status: active
   → Vendor LIVE ✅
```

---

## Template Creation Checklist

### IconicSolution Dashboard Steps:

**For Templates WITHOUT Buttons (1, 2, 3, 4):**
1. ✅ Login to IconicSolution
2. ✅ Create New Template
3. ✅ Enter template name exactly
4. ✅ Select category: TRANSACTIONAL
5. ✅ Enter body with variables `{{1}}`, `{{2}}`
6. ✅ Use `*{{1}}*` for bold vendor name
7. ✅ Submit for approval

**For Templates WITH Buttons (5, 6):**
1. ✅ All steps above, PLUS:
2. ✅ Add "Call to Action" or "Button" section
3. ✅ Select "URL Button" type
4. ✅ Enter button text: "Join Interview" or "Schedule Interview"
5. ✅ Select "Dynamic URL" (URL will be sent via API)
6. ✅ Submit for approval

---

## Testing After Approval

### Test Template 5 (Meeting Link):
```javascript
// From backend:
POST /api/vendors/VENDOR_ID/send-link
Body: {
  "meetingLink": "https://meet.google.com/test-link",
  "slotId": "SLOT_ID"
}

// Expected WhatsApp:
- Message with vendor name, interviewer name, timing
- Button: "Join Interview"
- Clicking button → Opens Google Meet link
```

### Test Template 6 (Schedule Interview):
```javascript
// From backend:
POST /api/vendors/VENDOR_ID/notify-slots

// Expected WhatsApp:
- Message with vendor name
- Button: "Schedule Interview"
- Clicking button → Opens https://astrovaani.com/interview?code=ABC123
```

---

## Important Notes

### Button URL Format:
- **IconicSolution may require specific button format**
- Check their documentation for:
  - Parameter name: `buttons`, `button_url`, or `dynamic_url`
  - JSON structure for button data
  - Maximum URL length limits

### Fallback:
- If buttons don't work, templates will still send
- Users can copy-paste URL from message
- Buttons enhance UX but aren't critical

### Variable Formatting:
- **Bold:** Use `*{{1}}*` (asterisks around variable)
- **Regular:** Use `{{1}}` without asterisks
- **Platform name:** "Google Meet" is hardcoded in Template 5

---

## Support & Troubleshooting

### Button Not Appearing:
1. Check template has URL button configured
2. Verify button parameter in API call
3. Check IconicSolution dashboard for button setup
4. Contact IconicSolution support for button format

### URL Not Working:
1. Verify URL is valid and accessible
2. Check URL encoding (no special characters issues)
3. Test URL independently before sending
4. Ensure URL uses HTTPS (not HTTP)

---

**Last Updated:** November 15, 2025  
**Status:** ✅ All 6 Templates Ready | Code Updated | Buttons Implemented  
**Next:** Create templates in IconicSolution with button configuration

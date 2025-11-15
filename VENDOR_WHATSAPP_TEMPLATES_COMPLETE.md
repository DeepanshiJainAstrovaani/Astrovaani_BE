# Complete Vendor WhatsApp Templates Documentation

## Overview
This document contains all WhatsApp templates required for the vendor onboarding flow in Astrovaani.

---

## Template 1: Vendor Interview Notification (Initial)

**Template Name:** `vendor_interview_notification_`

**When Sent:** When admin schedules interview and clicks "Notify Vendor"

**Body:**
```
Dear *{{1}}*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, and we invite you to book a suitable time slot.

Please click on the link below to select an available slot for your interview:

{{2}}

Should you have any questions or need further assistance, feel free to reach out to us at support@astrovaani.com

*Note:* If you're unable to click on the link, please save this number in your contacts, and the link will become clickable.
```

**Variables:**
- {{1}} = Vendor Name (bold)
- {{2}} = Interview Link

**Status:** ✅ Approved

---

## Template 2: Slot Selection Reminder

**Template Name:** `slotreminder`

**When Sent:** When admin clicks "Send Reminder" for pending slot selection

**Body:**
```
Dear *{{1}}*,

This is a friendly reminder to select your interview slot.

Please click on the link below to choose a suitable time:

{{2}}

If you have any questions, feel free to contact us.

- Team Astrovaani
```

**Variables:**
- {{1}} = Vendor Name (bold)
- {{2}} = Interview Link

**Status:** ✅ Approved

---

## Template 3: Meeting Link Notification

**Template Name:** `vendor_meeting_link_notification`

**When Sent:** When admin sends meeting link after vendor selects slot

**Body:**
```
🎉 Great news, *{{1}}*!

Your interview with Astrovaani is confirmed!

📅 Date & Time: {{3}} at {{4}}
🔗 Meeting Link: {{2}}

Please join on time. Good luck!

- Team Astrovaani
```

**Variables:**
- {{1}} = Vendor Name (bold)
- {{2}} = Meeting Link
- {{3}} = Date (e.g., "15 Nov 2025")
- {{4}} = Time (e.g., "02:30 PM")

**Status:** ⏳ Pending Approval

---

## Template 4: Interview Reminder

**Template Name:** `interview_reminder`

**When Sent:** When admin clicks "Notify Vendor" for scheduled interview

**Body:**
```
⏰ Interview Reminder

Dear *{{1}}*,

This is a reminder about your upcoming interview with Astrovaani.

📅 Date & Time: {{2}} at {{3}}
⏱️ Duration: {{4}} minutes
🔗 Meeting Link: {{5}}

Please join on time. We look forward to speaking with you!

- Team Astrovaani
```

**Variables:**
- {{1}} = Vendor Name (bold)
- {{2}} = Date
- {{3}} = Time
- {{4}} = Duration
- {{5}} = Meeting Link

**Status:** ⏳ Pending Approval

---

## Template 5: Vendor Rejected (No Response/No Show) ❌ NEW

**Template Name:** `vendor_rejected_no_response`

**When Sent:** When admin clicks "Cancel Interview" or rejects vendor before interview

**Body:**
```
Dear *{{1}}*,

Thank you for showing interest in joining Astrovaani. After reviewing your application and attempting to proceed with the interview process, we regret to inform you that your application has been rejected at this time due to the following reasons:

1. Despite multiple attempts, we were unable to schedule your interview as we did not receive a response from your side.

2. Based on the information provided, your availability does not align with our requirements. Timeliness is crucial for maintaining an excellent customer experience during consultations.

We encourage you to resubmit your application in the future if circumstances change and you meet the outlined criteria.
```

**Variables:**
- {{1}} = Vendor Name (bold)

**Status:** ⏳ **NEW - Needs Creation & Approval**

**Trigger Location:** Interviews page → "Cancel Interview" button

---

## Template 6: Interview Completed (Feedback Submitted) ✅ UPDATED

**Template Name:** `vendor_interview_completed`

**When Sent:** When admin submits interview feedback with "Approve - Send for Agreement"

**Body:**
```
Dear *{{1}}*,

We would like to inform you that your interview has been successfully completed. You will be notified soon regarding your onboarding status.

Once your application is approved, we will share your login credentials with you. Following that, we will proceed with the final step of signing the onboarding agreement to officially bring you on board with Astrovaani.
```

**Variables:**
- {{1}} = Vendor Name (bold)

**Status:** ⏳ **UPDATED - Needs Creation & Approval**

**Trigger Location:** Interview Feedback page → "Approve - Send for Agreement" → Save Feedback

---

## Template 7: Vendor Approved - Agreement Ready 🎉 NEW

**Template Name:** `vendor_approved_agreement_ready`

**When Sent:** When admin approves vendor in Edit Vendor page (after interview)

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

**Buttons:**
- Button 1: "Download App" → Link to app download

**Variables:**
- {{1}} = Vendor Name (bold)

**Status:** ⏳ **NEW - Needs Creation & Approval**

**Trigger Location:** Vendors → In Process → Edit Vendor → Approve button (or similar action)

---

## Template 8: Agreement Rejected ❌ NEW

**Template Name:** `vendor_agreement_rejected`

**When Sent:** When admin rejects agreement (no signature or other issues)

**Body:**
```
Dear *{{1}}*,

We regret to inform you that your agreement has been rejected due to the following reason:

Reason: {{2}}

To proceed further, we kindly request you to follow one of the options below:

1. Sign Digitally: Ensure that you place your signature on every page of the agreement. Before uploading, preview the document on your device to confirm that the signatures are visible.

2. Or Sign Manually: Print the agreement, sign it on every page, and upload the scanned copy in PDF format to your account.
```

**Variables:**
- {{1}} = Vendor Name (bold)
- {{2}} = Rejection Reason (e.g., "No signature was found on your agreement")

**Status:** ⏳ **NEW - Needs Creation & Approval**

**Trigger Location:** Vendors → In Process → Edit Vendor → Reject Agreement button

---

## Template Summary Table

| # | Template Name | When Used | Status | Priority | Variables |
|---|---------------|-----------|--------|----------|-----------|
| 1 | `vendor_interview_notification_` | Interview scheduled | ✅ Approved | High | name, link |
| 2 | `slotreminder` | Slot selection reminder | ✅ Approved | Medium | name, link |
| 3 | `vendor_meeting_link_notification` | Meeting link sent | ⏳ Pending | High | name, link, date, time |
| 4 | `interview_reminder` | Interview reminder | ⏳ Pending | Medium | name, date, time, duration, link |
| 5 | `vendor_rejected_no_response` | No response/no show | ⏳ **NEW** | Medium | name |
| 6 | `vendor_interview_completed` | Interview completed | ⏳ **UPDATED** | High | name |
| 7 | `vendor_approved_agreement_ready` | Agreement ready | ⏳ **NEW** | High | name |
| 8 | `vendor_agreement_rejected` | Agreement rejected | ⏳ **NEW** | Medium | name, reason |

---

## Complete Vendor Journey Flow

```
1. NEW VENDOR APPLICATION
   ↓
2. ADMIN SCHEDULES INTERVIEW
   → WhatsApp: vendor_interview_notification_ ✅
   ↓
3a. VENDOR SELECTS SLOT
    → Status: "interview scheduled"
    → WhatsApp: vendor_meeting_link_notification ⏳
    ↓
3b. VENDOR DOESN'T RESPOND
    → Admin cancels
    → WhatsApp: vendor_rejected_no_response ❌ NEW
    → END
    ↓
4. INTERVIEW HAPPENS
   → Optional: WhatsApp: interview_reminder ⏳
   ↓
5a. INTERVIEW FEEDBACK: APPROVE
    → Status: "inprocess"
    → WhatsApp: vendor_interview_completed ✅ UPDATED
    → Moved to "In Process" tab
    ↓
5b. INTERVIEW FEEDBACK: REJECT
    → Status: "rejected"
    → WhatsApp: vendor_rejected_no_response ❌ NEW
    → END
    ↓
6. ADMIN APPROVES FOR AGREEMENT
   → WhatsApp: vendor_approved_agreement_ready 🎉 NEW
   → App link sent
   ↓
7a. VENDOR UPLOADS AGREEMENT
    → Admin reviews
    ↓
7b. AGREEMENT REJECTED
    → WhatsApp: vendor_agreement_rejected ❌ NEW
    → Loop back to step 7
    ↓
8. AGREEMENT APPROVED
   → Status: "active"
   → Vendor goes live
   → END
```

---

## Code Integration Points

### 1. Cancel Interview (Rejection - No Response)
**File:** `vendorController.js`
**Function:** `cancelInterview`
**Template:** `vendor_rejected_no_response`

### 2. Interview Feedback (Completed)
**File:** `vendorController.js`
**Function:** `updateVendor`
**Template:** `vendor_interview_completed` (UPDATED from `interview_feedback_approved`)

### 3. Approve for Agreement
**File:** `vendorController.js`
**Function:** `approveVendorForAgreement` (NEW FUNCTION)
**Template:** `vendor_approved_agreement_ready`

### 4. Reject Agreement
**File:** `vendorController.js`
**Function:** `rejectVendorAgreement` (NEW FUNCTION)
**Template:** `vendor_agreement_rejected`

---

## Next Steps

1. ✅ Update existing template name: `interview_feedback_approved` → `vendor_interview_completed`
2. ⏳ Create new templates in IconicSolution dashboard:
   - `vendor_rejected_no_response`
   - `vendor_interview_completed` (updated content)
   - `vendor_approved_agreement_ready` (with button)
   - `vendor_agreement_rejected`
3. ⏳ Update backend code to use new templates
4. ⏳ Add agreement management functionality
5. ⏳ Test all templates end-to-end

---

**Last Updated:** November 15, 2025  
**Documentation Status:** Complete - Ready for Implementation

# WhatsApp Templates - Copy-Paste Ready

## Quick Reference: Exact Template Content

Copy these exactly into IconicSolution dashboard.

---

## Template 1: vendor_rejected_no_response

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 1 (Vendor Name)

**Body:**
```
Dear *{{1}}*,

Thank you for showing interest in joining Astrovaani. After reviewing your application and attempting to proceed with the interview process, we regret to inform you that your application has been rejected at this time due to the following reasons:

1. Despite multiple attempts, we were unable to schedule your interview as we did not receive a response from your side.

2. Based on the information provided, your availability does not align with our requirements. Timeliness is crucial for maintaining an excellent customer experience during consultations.

We encourage you to resubmit your application in the future if circumstances change and you meet the outlined criteria.
```

---

## Template 2: vendor_interview_completed

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 1 (Vendor Name)

**Body:**
```
Dear *{{1}}*,

We would like to inform you that your interview has been successfully completed. You will be notified soon regarding your onboarding status.

Once your application is approved, we will share your login credentials with you. Following that, we will proceed with the final step of signing the onboarding agreement to officially bring you on board with Astrovaani.
```

---

## Template 3: vendor_approved_agreement_ready

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 1 (Vendor Name)

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

---

## Template 4: vendor_agreement_rejected

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 2 (Vendor Name, Rejection Reason)

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

## Template 5: vendor_meeting_link_with_button

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 3 (Vendor Name, Interviewer Name, Interview Timing)  
**Buttons:** 1 (Join Interview - Dynamic URL)

**Body:**
```
Dear *{{1}}*,

Your interviewer, {{2}}, is waiting for you to join the interview scheduled on {{3}}

Make sure you've downloaded the Google Meet app to join if you're joining from your phone.

We wish you the very best of luck for your interview.
```

**Button:**
- Type: URL Button
- Text: "Join Interview"
- URL: Dynamic (Meeting link - passed via API)

**Note:** The platform name "Google Meet" is hardcoded in the template. Variables: Vendor Name, Interviewer Name, Interview Timing.

---

## Template 6: vendor_schedule_interview_button

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 1 (Vendor Name)  
**Buttons:** 1 (Schedule Interview - Dynamic URL)

**Body:**
```
Dear *{{1}}*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, book a suitable time slot for your interview.
```

**Button:**
- Type: URL Button
- Text: "Schedule Interview"
- URL: Dynamic (Interview booking link - passed via API)

**Note:** Simpler version of Template 1 with a button for quick slot selection.

---

## Important Notes

### Bold Formatting
- Use `*{{1}}*` (with asterisks) to make vendor name appear bold
- Example: `Dear *{{1}}*,` will display as: Dear **Jiten Bhardwaj**,

### Variables
- Template 1, 2, 3: Use `{{1}}` only
- Template 4: Use `{{1}}` and `{{2}}`
- Template 5: Use `{{1}}`, `{{2}}`, `{{3}}` (Vendor Name, Interviewer Name, Timing)
- Template 6: Use `{{1}}` only (Vendor Name)
- Variable order matters!

### Buttons
- Template 5 & 6: Include URL buttons
- Button URLs are dynamic (passed via API, not in template)
- IconicSolution API parameter: `buttons` or similar (check documentation)

### Testing Commands

**Template 1:**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_rejected_no_response" \
  -F 'dvariables=["Test Vendor"]'
```

**Template 2:**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_interview_completed" \
  -F 'dvariables=["Test Vendor"]'
```

**Template 3:**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_approved_agreement_ready" \
  -F 'dvariables=["Test Vendor"]'
```

**Template 4:**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_agreement_rejected" \
  -F 'dvariables=["Test Vendor","No signature was found on your agreement"]'
```

**Template 5 (With Button):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_meeting_link_with_button" \
  -F 'dvariables=["Test Vendor","Admin Name","15 Nov 2025 at 02:30 PM"]' \
  -F 'buttons=[{"type":"url","url":"https://meet.google.com/abc-def-ghi"}]'
```

**Template 6 (With Button):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_schedule_interview_button" \
  -F 'dvariables=["Test Vendor"]' \
  -F 'buttons=[{"type":"url","url":"https://astrovaani.com/interview?code=ABC123"}]'
```

**Note:** Button parameter format may vary. Check IconicSolution API documentation for exact syntax.

---

## Template 5: vendor_meeting_link_with_button

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 3 (Vendor Name, Interviewer Name, Timing)  
**Button:** Quick Reply Button - "Join Interview"

**Body:**
```
Dear *{{1}}*,

Your interviewer, *{{2}}*, is waiting for you to join the interview scheduled on *{{3}}*.

Make sure you've downloaded the Google Meet app to join if you're joining from your phone.

We wish you the very best of luck for your interview.
```

**Button Configuration:**
- Type: Quick Reply Button
- Button Text: "Join Interview"
- Button URL: Dynamic (meeting link passed via API)
- Button Parameter: `{{{1}}}`

**API Implementation:**
```javascript
{
  templatename: "vendor_meeting_link_with_button",
  dvariables: ["Vendor Name", "Interviewer Name", "Date & Time"],
  buttondata: "https://meet.google.com/xyz-abc-def"
}
```

---

## Template 6: vendor_schedule_interview_button

**Category:** TRANSACTIONAL  
**Language:** English  
**Variables:** 1 (Vendor Name)  
**Button:** Quick Reply Button - "Schedule Interview"

**Body:**
```
Dear *{{1}}*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, book a suitable time slot for your interview.
```

**Button Configuration:**
- Type: Quick Reply Button
- Button Text: "Schedule Interview"
- Button URL: Dynamic (slot selection page URL passed via API)
- Button Parameter: `{{{1}}}`

**API Implementation:**
```javascript
{
  templatename: "vendor_schedule_interview_button",
  dvariables: ["Vendor Name"],
  buttondata: "https://astrovaani.com/vendor-interview/VENDOR_ID"
}
```

---

## Testing Commands with Buttons

**Template 5 (Meeting Link with Button):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_meeting_link_with_button" \
  -F 'dvariables=["Test Vendor","Interviewer Name","November 15, 2025 at 3:00 PM"]' \
  -F "buttondata=https://meet.google.com/test-link"
```

**Template 6 (Schedule Interview with Button):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_KEY" \
  -F "mobile=91YOUR_NUMBER" \
  -F "templatename=vendor_schedule_interview_button" \
  -F 'dvariables=["Test Vendor"]' \
  -F "buttondata=https://astrovaani.com/vendor-interview/123456"
```

---

## Summary: All 6 Templates

1. **vendor_rejected_no_response** - No response/rejection (1 variable)
2. **vendor_interview_completed** - Interview completed notification (1 variable)
3. **vendor_approved_agreement_ready** - Agreement ready (1 variable)
4. **vendor_agreement_rejected** - Agreement rejected with reason (2 variables)
5. **vendor_meeting_link_with_button** - Meeting link with "Join Interview" button (3 variables + button)
6. **vendor_schedule_interview_button** - Slot selection with "Schedule Interview" button (1 variable + button)

---

**Created:** November 15, 2025  
**Updated:** November 15, 2025  
**Ready to copy-paste into IconicSolution dashboard!**

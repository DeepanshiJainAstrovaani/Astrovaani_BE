# WhatsApp Template Creation Guide - IconicSolution Dashboard

## Templates to Create (4 New Templates)

You need to create these 4 new templates in your IconicSolution WhatsApp dashboard:

---

## Template 1: Vendor Rejected (No Response) ❌

### Basic Information
- **Template Name:** `vendor_rejected_no_response`
- **Category:** TRANSACTIONAL or ACCOUNT_UPDATE
- **Language:** English

### Template Content

**Body:**
```
Dear *{{1}}*,

Thank you for showing interest in joining Astrovaani. After reviewing your application and attempting to proceed with the interview process, we regret to inform you that your application has been rejected at this time due to the following reasons:

1. Despite multiple attempts, we were unable to schedule your interview as we did not receive a response from your side.

2. Based on the information provided, your availability does not align with our requirements. Timeliness is crucial for maintaining an excellent customer experience during consultations.

We encourage you to resubmit your application in the future if circumstances change and you meet the outlined criteria.
```

**Footer:** (Optional)
```
- Team Astrovaani
```

**Buttons:** None

**Variables:**
- {{1}} = Vendor Name (will appear in bold using *)

**When Used:** Admin clicks "Cancel Interview" button

---

## Template 2: Interview Completed ✅

### Basic Information
- **Template Name:** `vendor_interview_completed`
- **Category:** TRANSACTIONAL or ACCOUNT_UPDATE  
- **Language:** English

### Template Content

**Body:**
```
Dear *{{1}}*,

We would like to inform you that your interview has been successfully completed. You will be notified soon regarding your onboarding status.

Once your application is approved, we will share your login credentials with you. Following that, we will proceed with the final step of signing the onboarding agreement to officially bring you on board with Astrovaani.
```

**Footer:** (Optional)
```
- Team Astrovaani
```

**Buttons:** None

**Variables:**
- {{1}} = Vendor Name (will appear in bold using *)

**When Used:** Admin submits interview feedback with "Approve - Send for Agreement"

---

## Template 3: Vendor Approved - Agreement Ready 🎉

### Basic Information
- **Template Name:** `vendor_approved_agreement_ready`
- **Category:** TRANSACTIONAL or ACCOUNT_UPDATE
- **Language:** English

### Template Content

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

**Footer:** (Optional)
```
- Team Astrovaani
```

**Buttons:** (If supported)
- Button 1: "Download App" → URL to app download link

**Variables:**
- {{1}} = Vendor Name (will appear in bold using *)

**When Used:** Admin approves vendor for agreement (from In Process tab)

**Note:** If buttons are not supported or difficult to configure, you can omit them. The app download link can be sent separately or included in the vendor's account dashboard.

---

## Template 4: Agreement Rejected ❌

### Basic Information
- **Template Name:** `vendor_agreement_rejected`
- **Category:** TRANSACTIONAL or ACCOUNT_UPDATE
- **Language:** English

### Template Content

**Body:**
```
Dear *{{1}}*,

We regret to inform you that your agreement has been rejected due to the following reason:

Reason: {{2}}

To proceed further, we kindly request you to follow one of the options below:

1. Sign Digitally: Ensure that you place your signature on every page of the agreement. Before uploading, preview the document on your device to confirm that the signatures are visible.

2. Or Sign Manually: Print the agreement, sign it on every page, and upload the scanned copy in PDF format to your account.
```

**Footer:** (Optional)
```
- Team Astrovaani
```

**Buttons:** None

**Variables:**
- {{1}} = Vendor Name (will appear in bold using *)
- {{2}} = Rejection Reason (e.g., "No signature was found on your agreement")

**When Used:** Admin rejects vendor's agreement submission

---

## Step-by-Step Template Creation Process

### Step 1: Login to IconicSolution Dashboard
1. Go to https://wa.iconicsolution.co.in
2. Login with your credentials
3. Navigate to **Templates** section

### Step 2: Create Each Template
For each of the 4 templates above:

1. Click **"Create New Template"** or **"Add Template"**

2. **Fill Basic Information:**
   - Template Name: (copy exactly as shown above)
   - Category: Select **TRANSACTIONAL** or **ACCOUNT_UPDATE**
   - Language: **English**

3. **Add Header:** (Optional)
   - You can skip this or add a simple text header if needed
   - Example: "Astrovaani Notification"

4. **Add Body:**
   - Copy the body text exactly as shown above
   - Make sure `*{{1}}*` is written with asterisks for bold formatting
   - Variables should be `{{1}}`, `{{2}}`, etc.

5. **Add Footer:** (Optional)
   - Add "- Team Astrovaani" if desired

6. **Add Buttons:** (Only for Template 3 if supported)
   - For `vendor_approved_agreement_ready`
   - Add button: "Download App" with your app URL
   - This is optional - skip if difficult

7. **Review:**
   - Check that all variable placeholders are correct
   - Preview how the message will look

8. **Submit for Approval:**
   - Click **Submit** or **Send for Approval**
   - WhatsApp will review it (24-48 hours)

### Step 3: Wait for Approval
- Templates typically take 24-48 hours for WhatsApp approval
- You'll receive notification when approved
- Status will change from "PENDING" to "APPROVED"

### Step 4: Test Templates
Once approved, test each template:

```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_API_KEY" \
  -F "mobile=91YOUR_MOBILE" \
  -F "templatename=TEMPLATE_NAME" \
  -F 'dvariables=["Test Name"]'
```

For template 4 (with 2 variables):
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_API_KEY" \
  -F "mobile=91YOUR_MOBILE" \
  -F "templatename=vendor_agreement_rejected" \
  -F 'dvariables=["Test Name","No signature found"]'
```

---

## Important Notes

### Formatting Rules
1. **Bold Text:** Use `*text*` for bold (e.g., `*{{1}}*` will make the vendor name bold)
2. **Variables:** Must use exact format `{{1}}`, `{{2}}`, etc.
3. **Emojis:** Can be used in body text (✅, ❌, 🎉, etc.)
4. **Line Breaks:** Preserve line breaks as shown in templates

### Variable Guidelines
1. Template 1, 2, 3: **1 variable** (Vendor Name)
2. Template 4: **2 variables** (Vendor Name, Rejection Reason)
3. Variables must be in correct order
4. Always test with sample data

### Common Mistakes to Avoid
1. ❌ Don't use `{1}` - use `{{1}}`
2. ❌ Don't skip asterisks for bold - use `*{{1}}*`
3. ❌ Don't change variable order
4. ❌ Don't add extra spaces around variables
5. ✅ Copy templates exactly as shown

---

## Template Status Tracking

After creation, track status:

| Template Name | Created | Submitted | Approved | Tested | Live |
|---------------|---------|-----------|----------|--------|------|
| `vendor_rejected_no_response` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `vendor_interview_completed` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `vendor_approved_agreement_ready` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `vendor_agreement_rejected` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

Mark ✅ as you complete each step!

---

## Backend Integration Status

✅ **Code Already Integrated!**

All backend code is ready and will automatically use these templates once approved:

| Template | Function | Route | Status |
|----------|----------|-------|--------|
| `vendor_rejected_no_response` | `cancelInterview` | `POST /api/vendors/:id/cancel-interview` | ✅ Ready |
| `vendor_interview_completed` | `updateVendor` | `PUT /api/vendors/:id` | ✅ Ready |
| `vendor_approved_agreement_ready` | `approveVendorForAgreement` | `POST /api/vendors/:id/approve-agreement` | ✅ Ready |
| `vendor_agreement_rejected` | `rejectVendorAgreement` | `POST /api/vendors/:id/reject-agreement` | ✅ Ready |

**No code changes needed after template approval!** 🎉

---

## Next Steps

1. ✅ Create all 4 templates in IconicSolution dashboard
2. ⏳ Wait for WhatsApp approval (24-48 hours)
3. ✅ Test each template with real mobile number
4. ✅ Update frontend to add new buttons (approve agreement, reject agreement)
5. ✅ Test complete flow end-to-end

---

## Support

If you encounter issues:
1. Check template name spelling (must be exact)
2. Verify variable count matches
3. Test with simple message first
4. Check backend logs for API responses
5. Contact IconicSolution support if needed

---

**Last Updated:** November 15, 2025  
**Status:** Templates Documented - Ready for Creation

# 📱 WhatsApp Template: vendor_schedule_interview_with_button

## ✅ Template Created & Configured

**Template Name:** `vendor_schedule_interview_with_button`  
**Status:** ⏳ Pending Approval (check IconicSolution dashboard)  
**Created:** November 18, 2025

---

## 📋 Template Configuration

### **Message Body:**
```
Dear *{{1}}*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, book a suitable time slot for your interview.
```

### **Variables:**
- `{{1}}` - Vendor Name

### **Button:**
- **Text:** "Schedule Interview"
- **Type:** Dynamic URL Button
- **URL:** Complete interview link (passed via API)

### **Sample URL:**
```
https://astrovaani-web-fe.vercel.app/interview?code=ASTROVAANI-ABC123
```

---

## 🔧 Backend Implementation

### **Function:** `scheduleInterview()` in `controllers/vendorController.js`

### **Template Configuration:**
```javascript
{
  templatename: "vendor_schedule_interview_with_button",
  dvariables: ["Vendor Name"],
  buttons: [{
    type: "url",
    url: "https://astrovaani-web-fe.vercel.app/interview?code=INTERVIEW_CODE"
  }]
}
```

### **Code Changes Made:**
1. ✅ Updated template name to `vendor_schedule_interview_with_button`
2. ✅ Changed base URL to Vercel: `https://astrovaani-web-fe.vercel.app`
3. ✅ Updated interview path to `/interview?code=`
4. ✅ Configured button to send complete dynamic URL
5. ✅ Updated template variables (1 variable: vendor name only)

---

## 📝 Example Message

**Received by Vendor:**
```
Dear *Neeraj gunwant*,

We are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, book a suitable time slot for your interview.
```

**[Schedule Interview]** ← Button that opens:  
`https://astrovaani-web-fe.vercel.app/interview?code=ASTROVAANI-BlhKXK4iQ9`

---

## 🧪 Testing

### **Manual Test:**
1. Go to Interviews page in admin panel
2. Click "Save and Notify Vendor" for a vendor
3. Check backend logs for:
   ```
   🔄 Sending WhatsApp via template: vendor_schedule_interview_with_button
      Mobile: 918168095773
      Variables: [ 'Neeraj gunwant' ]
      Button URL: https://astrovaani-web-fe.vercel.app/interview?code=ASTROVAANI-BlhKXK4iQ9
   ```
4. Check vendor's WhatsApp for the message with button

### **cURL Test (After Template Approval):**
```bash
curl -X POST "https://wa.iconicsolution.co.in/wapp/api/send/bytemplate" \
  -F "apikey=YOUR_API_KEY" \
  -F "mobile=918168095773" \
  -F "templatename=vendor_schedule_interview_with_button" \
  -F 'dvariables=["Neeraj gunwant"]' \
  -F 'buttons=[{"type":"url","url":"https://astrovaani-web-fe.vercel.app/interview?code=ASTROVAANI-TEST123"}]'
```

---

## ⚠️ Important Notes

1. **Template Approval Required:**
   - Check IconicSolution dashboard for template approval status
   - WhatsApp typically takes 15 minutes to 24 hours for approval
   - Template must be approved before messages will be delivered

2. **URL Format:**
   - Interview page URL: `https://astrovaani-web-fe.vercel.app/interview?code=CODE`
   - Code format: `ASTROVAANI-` + random string
   - Example: `ASTROVAANI-BlhKXK4iQ9`

3. **Button Configuration:**
   - Full URL is passed from backend (not hardcoded in template)
   - Button type: `url`
   - Only 1 button allowed per template

4. **Error Handling:**
   - If template not approved: API will return error
   - If button URL invalid: Message will fail
   - Check `Notification` collection in MongoDB for logs

---

## 📊 Differences from Previous Template

| Aspect | Old (`vendor_schedule_interview_button`) | New (`vendor_schedule_interview_with_button`) |
|--------|------------------------------------------|-----------------------------------------------|
| Base URL | `https://astrovaani.com` | `https://astrovaani-web-fe.vercel.app` |
| Path | `/vendor-interview?code=` | `/interview?code=` |
| Variables | 1 (name only) | 1 (name only) |
| Button | Static URL + dynamic code | Complete dynamic URL |
| Status | ❌ Delivery errors | ⏳ Pending test |

---

## 🚀 Next Steps

1. ⏳ **Wait for template approval** in IconicSolution dashboard
2. ✅ **Test the notification** by scheduling interview slots
3. ✅ **Verify button URL** works correctly on mobile
4. ✅ **Check vendor receives** the message successfully
5. 📝 **Update documentation** once confirmed working

---

**Updated:** November 18, 2025  
**Status:** Code deployed to Render, waiting for template approval

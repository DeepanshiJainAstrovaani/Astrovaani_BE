# Slot Management Testing Guide

## Overview
This guide covers testing all slot management features in the Astrovaani admin panel.

## Features to Test

1. **Add Slot** - Create new interview slots
2. **Remove Single Slot** - Delete individual slots
3. **Clear All Slots** - Remove all slots at once
4. **Save Slots** - Persist slots to database
5. **Notify Vendor** - Send WhatsApp notification

## Prerequisites

- Admin access to Astrovaani admin panel
- At least one vendor in the system
- Backend API running (Render: https://astrovaani-be.onrender.com/api)

## Test Scenarios

### Test 1: Add New Slots

**Steps:**
1. Navigate to admin panel
2. Click on a vendor's "Schedule Interview" button
3. Select date and time using the date picker
4. Set duration (default 30 minutes)
5. Click "Add" button

**Expected Result:**
- Slot appears in "Scheduled Dates" section
- Slot shows correct date and time
- No duplicate slot error

**Edge Cases:**
- Try adding duplicate slot → Should show error
- Try adding overlapping slot → Should show error
- Add slot in the past → Date picker should prevent this

### Test 2: Remove Single Slot

**Steps:**
1. Add multiple slots (2-3)
2. Click the "✕" button on one slot
3. Verify slot is removed from UI

**Expected Result:**
- Slot disappears immediately from UI
- Other slots remain unchanged
- If slot was saved to backend, DELETE request is sent

**Verification:**
```
Check browser console for:
DELETE /api/vendors/{vendorId}/schedules/{scheduleId}
```

### Test 3: Clear All Slots

**Steps:**
1. Add multiple slots (3-5)
2. Click "Clear All" button
3. Confirm the dialog

**Expected Result:**
- Confirmation dialog shows: "Are you sure you want to clear all X slot(s)?"
- After confirmation, all slots disappear
- Success message appears
- Button changes to "Clearing..." during operation

**Verification:**
```
Check browser console for:
DELETE /api/vendors/{vendorId}/schedules
Response: { message: "All X schedule(s) cleared successfully" }
```

### Test 4: Save Slots to Database

**Steps:**
1. Add 2-3 slots
2. Click "Save slots" button
3. Wait for success message
4. Refresh the page

**Expected Result:**
- "Slots saved" alert appears
- After refresh, slots still appear in UI
- Slots now have `_id` field (from database)

**Verification:**
```
Check browser console for:
POST /api/vendors/{vendorId}/schedules
Body: { slots: [...] }
Response: { proposed: [...], confirmed: [...] }
```

### Test 5: No Slot Duplication

**Purpose:** Verify fix for slot duplication bug

**Steps:**
1. Add a slot
2. Click "Save slots"
3. Add another slot
4. Click "Save slots" again
5. Refresh page

**Expected Result:**
- Only 2 slots appear (not 4)
- First slot was NOT duplicated when saving second slot

### Test 6: Delete Saved Slot

**Steps:**
1. Add a slot
2. Save it to backend
3. Refresh page to confirm it's in database
4. Click "✕" to remove it
5. Refresh page again

**Expected Result:**
- Slot disappears from UI immediately
- After refresh, slot is still gone (deleted from database)

**Verification:**
```
DELETE /api/vendors/{vendorId}/schedules/{scheduleId}
Should receive 200 OK response
```

### Test 7: Clear All with Mixed Slots

**Steps:**
1. Add some new unsaved slots
2. Add some slots and save them
3. Refresh page (so saved slots load from backend)
4. Add more new slots
5. Click "Clear All"

**Expected Result:**
- All slots (both saved and unsaved) are cleared
- Backend confirms all removed

### Test 8: WhatsApp Notification

**Steps:**
1. Add 2-3 slots
2. Click "🔔 Notify Vendor" button
3. Wait for response

**Expected Result:**
- "Vendor notified" alert appears
- Interview code is generated
- WhatsApp message sent to vendor's number

**Verification:**
```
POST /api/vendors/{vendorId}/notify
Body: { slots: [...], vendor: {...} }
Response: { message: "Vendor notified successfully" }
```

**Check:**
- Backend logs for WhatsApp API response
- Vendor should receive WhatsApp message with:
  - Interview code
  - List of available slots
  - Instructions

### Test 9: Button States

**Test all button states:**

**"Add" button:**
- Disabled when no date selected
- Enabled when date and time selected

**"Notify Vendor" button:**
- Disabled when no slots exist
- Disabled while sending (shows "Sending...")
- Enabled when slots exist and not sending

**"Save slots" button:**
- Disabled when saving (shows "Saving...")
- Enabled when not saving

**"Clear All" button:**
- Only visible when slots exist
- Disabled when saving/clearing
- Shows confirmation dialog before action

### Test 10: Error Handling

**Test error scenarios:**

**Backend API Down:**
1. Stop backend server (or disconnect internet)
2. Try to save slots
3. Expected: Error message displayed

**Invalid Vendor ID:**
1. Manually navigate to `/admin/schedule/invalid-id`
2. Try operations
3. Expected: Appropriate error messages

**Network Timeout:**
1. Simulate slow connection
2. Verify loading states work correctly

## API Endpoints Reference

```
GET    /api/vendors/:id/schedules     - Get all slots for vendor
POST   /api/vendors/:id/schedules     - Create/save slots (replaces existing)
DELETE /api/vendors/:id/schedules     - Clear all slots
DELETE /api/vendors/:id/schedules/:id - Delete single slot
POST   /api/vendors/:id/notify        - Send notification
```

## Console Debugging

### Check Slot State
Open browser console and type:
```javascript
// This won't work directly, but you can add in component:
console.log('Current slots:', slots);
console.log('Confirmed slots:', confirmed);
```

### Monitor API Calls
Open Network tab in DevTools:
- Filter by "Fetch/XHR"
- Watch for DELETE, POST requests
- Check request/response payloads

## Common Issues

### Issue: Slots duplicating
**Solution:** This should be fixed in latest version. Verify backend `createVendorSchedules` replaces slots.

### Issue: "✕" button not working
**Solution:** Check console for errors. Verify DELETE endpoint is accessible.

### Issue: "Clear All" not appearing
**Solution:** Button only shows when slots.length > 0. Add at least one slot.

### Issue: WhatsApp notification failing
**Solution:** 
- Check ICONIC_API_KEY in backend .env
- Verify vendor has valid WhatsApp number
- Check backend logs for API response

## Success Criteria

✅ Can add multiple slots without duplicates  
✅ Can remove individual slots  
✅ Can clear all slots with confirmation  
✅ Slots persist after page refresh  
✅ No slot duplication when saving multiple times  
✅ WhatsApp notifications send successfully  
✅ All buttons show correct states  
✅ Error messages are clear and helpful  

## Reporting Issues

If you find any bugs:

1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check backend logs (if accessible)
4. Include screenshots if helpful
5. Report with:
   - Browser and version
   - What you expected
   - What actually happened
   - Any error messages

## Notes

- All slot operations are asynchronous
- Always wait for success/error messages
- Refresh page to verify database changes
- Check both frontend state AND backend state

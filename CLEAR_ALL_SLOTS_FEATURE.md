# Clear All Slots Feature

## Overview
Added functionality to clear all proposed interview slots for a vendor in one action.

## Backend Changes

### 1. New Controller Function (`controllers/vendorController.js`)

Added `clearAllVendorSchedules` function:

```javascript
exports.clearAllVendorSchedules = async (req, res) => {
  try {
    const vendorId = req.params.id;
    
    const vendor = await vendorModel.getVendorById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Clear all schedules
    const removedCount = vendor.schedules.length;
    vendor.schedules = [];

    await vendor.save();
    res.json({ 
      message: `All ${removedCount} schedule(s) cleared successfully`,
      proposed: [],
      confirmed: []
    });
  } catch (error) {
    console.error('Error clearing schedules:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};
```

### 2. New Route (`routes/vendorRoutes.js`)

Added DELETE endpoint:
```javascript
// DELETE /api/vendors/:id/schedules (clear all)
router.delete('/:id/schedules', vendorController.clearAllVendorSchedules);
```

**Note:** This route must come BEFORE the specific schedule deletion route (`/:id/schedules/:scheduleId`) in the routing order.

## Frontend Changes

### 1. New Function (`src/pages/admin/SchedulePage.js`)

Added `clearAllSlots` function with confirmation dialog:

```javascript
const clearAllSlots = async () => {
  if (!vendorId) return;
  
  // Confirm action
  if (!window.confirm(`Are you sure you want to clear all ${slots.length} slot(s)?`)) {
    return;
  }
  
  setSaving(true);
  setErrorMessage('');
  try {
    const res = await fetch(`${API_URL}/vendors/${vendorId}/schedules`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let errMsg = 'Failed to clear slots';
      try {
        const parsed = JSON.parse(text || '{}');
        errMsg = parsed.message || parsed.error || text || errMsg;
      } catch (e) {
        errMsg = text || errMsg;
      }
      throw new Error(errMsg);
    }
    
    const data = await res.json();
    setSlots([]);
    alert(data.message || 'All slots cleared successfully');
  } catch (e) {
    console.error('Clear all slots error:', e);
    setErrorMessage(e.message || 'Failed to clear slots');
  } finally {
    setSaving(false);
  }
};
```

### 2. UI Button

Added "Clear All" button in the Scheduled Dates section:

```javascript
<div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
  {slots.length > 0 && (
    <button 
      onClick={clearAllSlots} 
      style={{ 
        background: '#ef4444', 
        color: '#fff', 
        border: 'none', 
        padding: '10px 16px', 
        borderRadius: 10, 
        cursor: 'pointer', 
        fontSize: 14,
        opacity: saving ? 0.65 : 1 
      }}
      disabled={saving}
    >
      Clear All
    </button>
  )}
  <button onClick={() => saveSlots()} style={{ ...styles.btnPrimary, marginLeft: 'auto' }}>
    {saving ? 'Saving...' : 'Save slots'}
  </button>
</div>
```

## Features

1. **Confirmation Dialog**: Prompts user to confirm before clearing all slots
2. **Shows Count**: Displays the number of slots that will be removed
3. **Error Handling**: Properly handles and displays errors
4. **Loading State**: Disables button and shows loading state during operation
5. **Auto-hide**: Button only appears when there are slots to clear
6. **Visual Design**: Red button to indicate destructive action

## API Endpoint

### DELETE `/api/vendors/:id/schedules`

**Request:**
```
DELETE /api/vendors/123456/schedules
```

**Response (Success):**
```json
{
  "message": "All 5 schedule(s) cleared successfully",
  "proposed": [],
  "confirmed": []
}
```

**Response (Error):**
```json
{
  "message": "Vendor not found"
}
```

## Testing

1. Create multiple interview slots for a vendor
2. Click "Clear All" button
3. Confirm the dialog
4. Verify all slots are removed from the UI
5. Refresh the page to verify slots are removed from database

## Related Endpoints

- `POST /api/vendors/:id/schedules` - Create/save slots (replaces existing)
- `DELETE /api/vendors/:id/schedules/:scheduleId` - Delete single slot
- `DELETE /api/vendors/:id/schedules` - Delete all slots (new)

## Deployment

- Backend: Auto-deployed to Render on push to master
- Frontend: Needs manual build/deployment if hosted separately

## Commit

- Backend: `ae12773` - "Add clear all slots functionality for vendor schedules"
- Frontend: `8ad8868` - "Add clear all slots button in schedule page"

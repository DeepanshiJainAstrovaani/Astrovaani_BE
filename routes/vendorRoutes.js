const express = require('express');
const vendorController = require('../controllers/vendorController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// POST /api/vendors/check-duplicate
router.post('/check-duplicate', async (req, res) => {
  const vendorModel = require('../models/vendorModel');
  const { whatsapp, email } = req.body;
  try {
    const existingVendor = await vendorModel.findByWhatsappOrEmail(whatsapp, email);
    if (existingVendor) {
      return res.status(409).json({ message: 'WhatsApp number or email already exists. Please use a different one.' });
    }
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Configure fields for multiple images
const photoUpload = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 },
  { name: 'photo5', maxCount: 1 }
]);

// GET /api/vendors
router.get('/', vendorController.getAllVendors);

// GET /api/vendors/filter?category=:category
router.get('/filter', vendorController.getVendorsByCategory);

// ==================== PUBLIC INTERVIEW ROUTES ====================
// These routes MUST come before /:id routes to avoid conflicts
// These routes are public (no authentication) for vendor interview selection

// GET /api/vendors/interview/:code - Get interview details by code
router.get('/interview/:code', vendorController.getInterviewByCode);

// POST /api/vendors/interview/:code/select - Select an interview slot
router.post('/interview/:code/select', vendorController.selectInterviewSlot);

// ==================== VENDOR CRUD ROUTES ====================

// POST /api/vendors
router.post('/', photoUpload, vendorController.createVendor);

// GET /api/vendors/:id
router.get('/:id', vendorController.getVendorById);

// GET /api/vendors/:id/schedules
router.get('/:id/schedules', vendorController.getVendorSchedules);

// POST /api/vendors/:id/schedules
router.post('/:id/schedules', vendorController.createVendorSchedules);

// DELETE /api/vendors/:id/schedules (clear all)
router.delete('/:id/schedules', vendorController.clearAllVendorSchedules);

// DELETE /api/vendors/:id/schedules/:scheduleId
router.delete('/:id/schedules/:scheduleId', vendorController.deleteVendorSchedule);

// POST /api/vendors/:id/notify
router.post('/:id/notify-slots', vendorController.notifyVendorSlots);

// PUT /api/vendors/:id
router.put('/:id', photoUpload, vendorController.updateVendor);

// DELETE /api/vendors/:id
router.delete('/:id', vendorController.deleteVendor);

// ==================== INTERVIEW MANAGEMENT ROUTES ====================
// Admin routes for managing interviews

// POST /api/vendors/:id/send-link - Send meeting link
router.post('/:id/send-link', vendorController.sendMeetingLink);

// POST /api/vendors/:id/notify - Send interview reminder (for scheduled)
router.post('/:id/notify', vendorController.notifyVendor);

// POST /api/vendors/:id/reminder - Send reminder to select slot (for pending)
router.post('/:id/reminder', vendorController.sendReminder);

// POST /api/vendors/:id/schedule - Schedule interview slots
router.post('/:id/schedule', vendorController.scheduleInterview);

// POST /api/vendors/:id/cancel-interview - Cancel interview
router.post('/:id/cancel-interview', vendorController.cancelInterview);

// ==================== AGREEMENT MANAGEMENT ROUTES ====================
// Admin routes for managing vendor agreements

// POST /api/vendors/:id/approve-agreement - Send agreement ready notification
router.post('/:id/approve-agreement', vendorController.approveVendorForAgreement);

// POST /api/vendors/:id/reject-agreement - Reject agreement with reason
router.post('/:id/reject-agreement', vendorController.rejectVendorAgreement);

module.exports = router;
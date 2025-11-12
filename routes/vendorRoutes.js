const express = require('express');
const vendorController = require('../controllers/vendorController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

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
router.post('/:id/notify', vendorController.notifyVendorSlots);

// PUT /api/vendors/:id
router.put('/:id', photoUpload, vendorController.updateVendor);

// DELETE /api/vendors/:id
router.delete('/:id', vendorController.deleteVendor);



module.exports = router;
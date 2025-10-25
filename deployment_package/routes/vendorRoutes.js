const express = require('express');
const vendorController = require('../controllers/vendorController');

const router = express.Router();

// GET /api/vendors
router.get('/', vendorController.getAllVendors);

// GET /api/vendors/filter?category=:category
router.get('/filter', vendorController.getVendorsByCategory);

// POST /api/vendors
router.post('/', vendorController.createVendor);

// GET /api/vendors/:id
router.get('/:id', vendorController.getVendorById);

// PUT /api/vendors/:id
router.put('/:id', vendorController.updateVendor);

// DELETE /api/vendors/:id
router.delete('/:id', vendorController.deleteVendor);



module.exports = router;
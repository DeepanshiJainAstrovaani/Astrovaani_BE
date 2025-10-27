const vendorModel = require('../models/vendorModel');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const results = await vendorModel.getAllVendors();
    res.json(results);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    const vendorData = req.body;
    const vendor = await vendorModel.createVendor(vendorData);
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get a vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    console.log('🔵 Fetching vendor with ID:', vendorId);
    const vendor = await vendorModel.getVendorById(vendorId);
    
    if (!vendor) {
      console.log('⚠️ Vendor not found with ID:', vendorId);
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    console.log('✅ Vendor found:', {
      id: vendor._id,
      name: vendor.name,
      priceperminute: vendor.priceperminute,
      category: vendor.category
    });
    
    res.json(vendor);
  } catch (error) {
    console.error('🔴 Error fetching vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Update a vendor by ID
exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendorData = req.body;
    const vendor = await vendorModel.updateVendor(vendorId, vendorData);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Delete a vendor by ID
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await vendorModel.deleteVendor(vendorId);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get vendors by category
exports.getVendorsByCategory = async (req, res) => {
  try {
    const category = req.query.category; 
    console.log('Received category:', category);

    if (!category) {
      console.log('No category provided');
      return res.status(400).json({ message: 'Category is required' });
    }

    const results = await vendorModel.getVendorsByCategory(category);
    console.log('Results:', results);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching vendors by category:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};
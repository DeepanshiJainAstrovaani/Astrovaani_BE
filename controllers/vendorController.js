const vendorModel = require('../models/vendorModel');

// Get all vendors
exports.getAllVendors = (req, res) => {
  vendorModel.getAllVendors((err, results) => {
    if (err) {
      console.error('Error fetching vendors:', err);
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
};

// Create a new vendor
exports.createVendor = (req, res) => {
  const vendorData = req.body;

  vendorModel.createVendor(vendorData, (err, results) => {
    if (err) {
      console.error('Error creating vendor:', err);
      res.status(500).send('Database error');
      return;
    }
    res.status(201).json({ id: results.insertId, ...vendorData });
  });
};

// Get a vendor by ID
exports.getVendorById = (req, res) => {
  const vendorId = req.params.id;

  vendorModel.getVendorById(vendorId, (err, results) => {
    if (err) {
      console.error('Error fetching vendor:', err);
      res.status(500).send('Database error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Vendor not found');
      return;
    }
    res.json(results[0]);
  });
};

// Update a vendor by ID
exports.updateVendor = (req, res) => {
  const vendorId = req.params.id;
  const vendorData = req.body;

  vendorModel.updateVendor(vendorId, vendorData, (err, results) => {
    if (err) {
      console.error('Error updating vendor:', err);
      res.status(500).send('Database error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Vendor not found');
      return;
    }
    res.json({ id: vendorId, ...vendorData });
  });
};

// Delete a vendor by ID
exports.deleteVendor = (req, res) => {
  const vendorId = req.params.id;

  vendorModel.deleteVendor(vendorId, (err, results) => {
    if (err) {
      console.error('Error deleting vendor:', err);
      res.status(500).send('Database error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Vendor not found');
      return;
    }
    res.status(204).send();
  });
};

// Get vendors by category
exports.getVendorsByCategory = (req, res) => {
    const category = req.query.category; 
    console.log('Received category:', category);  // Add this line

    if (!category) {
      console.log('No category provided');  // Add this line
      return res.status(400).json({ message: 'Category is required' });
    }

    vendorModel.getVendorsByCategory(category, (err, results) => {
      if (err) {
        console.error('Error fetching vendors by category:', err);
        return res.status(500).send('Database error');
      }

      console.log('Results:', results); // Log the results

      if (results.length === 0) {
        return res.status(404).json({ message: 'No vendors found for this category' });
      }

      res.json(results);
    });
};
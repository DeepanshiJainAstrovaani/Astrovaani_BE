const db = require('../config/db');

// Fetch all vendors
exports.getAllVendors = (callback) => {
  const query = 'SELECT * FROM community';
  db.query(query, callback);
};

// Create a new vendor
exports.createVendor = (data, callback) => {
  const query = 'INSERT INTO community SET ?';
  db.query(query, data, callback);
};

// Get a vendor by ID
exports.getVendorById = (id, callback) => {
  const query = 'SELECT * FROM community WHERE id = ?';
  db.query(query, [id], callback);
};

// Update a vendor by ID
exports.updateVendor = (id, data, callback) => {
  const query = 'UPDATE community SET ? WHERE id = ?';
  db.query(query, [data, id], callback);
};

// Delete a vendor by ID
exports.deleteVendor = (id, callback) => {
  const query = 'DELETE FROM community WHERE id = ?';
  db.query(query, [id], callback);
};

// Fetch vendors by category
exports.getVendorsByCategory = (category, callback) => {
    const query = 'SELECT * FROM community WHERE category = ?';
    db.query(query, [category], callback);
};
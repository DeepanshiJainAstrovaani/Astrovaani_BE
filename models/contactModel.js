const db = require('../config/db');

// Fetch all contacts
exports.getAllContacts = (callback) => {
  const query = 'SELECT * FROM contact';
  db.query(query, callback);
};

// Create a new contact
exports.createContact = (data, callback) => {
  const query = 'INSERT INTO contact SET ?';
  db.query(query, data, callback);
};

// Get a contact by ID
exports.getContactById = (id, callback) => {
  const query = 'SELECT * FROM contact WHERE id = ?';
  db.query(query, [id], callback);
};

// Update a contact by ID
exports.updateContact = (id, data, callback) => {
  const query = 'UPDATE contact SET ? WHERE id = ?';
  db.query(query, [data, id], callback);
};

// Delete a contact by ID
exports.deleteContact = (id, callback) => {
  const query = 'DELETE FROM contact WHERE id = ?';
  db.query(query, [id], callback);
};
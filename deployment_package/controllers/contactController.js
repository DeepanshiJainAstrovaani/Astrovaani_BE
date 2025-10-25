const contactModel = require('../models/contactModel');

// Get all contacts
exports.getAllContacts = (req, res) => {
  contactModel.getAllContacts((err, results) => {
    if (err) {
      console.error('Error fetching contacts:', err);
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
};

// Create a new contact
exports.createContact = (req, res) => {
  const { name, phone, email, query, submitdate } = req.body;
  const newContact = { name, phone, email, query, submitdate };

  contactModel.createContact(newContact, (err, results) => {
    if (err) {
      console.error('Error creating contact:', err);
      res.status(500).send('Database error');
      return;
    }
    res.status(201).json({ id: results.insertId, ...newContact });
  });
};

// Get a contact by ID
exports.getContactById = (req, res) => {
  const contactId = req.params.id;

  contactModel.getContactById(contactId, (err, results) => {
    if (err) {
      console.error('Error fetching contact:', err);
      res.status(500).send('Database error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Contact not found');
      return;
    }
    res.json(results[0]);
  });
};

// Update a contact by ID
exports.updateContact = (req, res) => {
  const contactId = req.params.id;
  const { name, phone, email, query, submitdate } = req.body;
  const updatedContact = { name, phone, email, query, submitdate };

  contactModel.updateContact(contactId, updatedContact, (err, results) => {
    if (err) {
      console.error('Error updating contact:', err);
      res.status(500).send('Database error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Contact not found');
      return;
    }
    res.json({ id: contactId, ...updatedContact });
  });
};

// Delete a contact by ID
exports.deleteContact = (req, res) => {
  const contactId = req.params.id;

  contactModel.deleteContact(contactId, (err, results) => {
    if (err) {
      console.error('Error deleting contact:', err);
      res.status(500).send('Database error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Contact not found');
      return;
    }
    res.status(204).send();
  });
};
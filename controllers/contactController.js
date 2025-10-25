const contactModel = require('../models/contactModel');

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const results = await contactModel.getAllContacts();
    res.json(results);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
};

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { name, phone, email, query, submitdate, message } = req.body;
    const newContact = { name, phone, email, query, submitdate, message };

    const contact = await contactModel.createContact(newContact);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
};

// Get a contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await contactModel.getContactById(contactId);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
};

// Update a contact by ID
exports.updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { name, phone, email, query, submitdate, message, status } = req.body;
    const updatedContact = { name, phone, email, query, submitdate, message, status };

    const contact = await contactModel.updateContact(contactId, updatedContact);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await contactModel.deleteContact(contactId);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
};
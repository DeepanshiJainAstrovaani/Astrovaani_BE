const Contact = require('./schemas/contactSchema');

// Fetch all contacts
exports.getAllContacts = async () => {
  try {
    return await Contact.find({}).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Create a new contact
exports.createContact = async (data) => {
  try {
    const contact = await Contact.create(data);
    return contact;
  } catch (error) {
    throw error;
  }
};

// Get a contact by ID
exports.getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw error;
  }
};

// Update a contact by ID
exports.updateContact = async (id, data) => {
  try {
    return await Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  } catch (error) {
    throw error;
  }
};

// Delete a contact by ID
exports.deleteContact = async (id) => {
  try {
    return await Contact.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};
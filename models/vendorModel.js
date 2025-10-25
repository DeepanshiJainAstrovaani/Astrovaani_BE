const Vendor = require('./schemas/vendorSchema');

// Fetch all vendors
exports.getAllVendors = async () => {
  try {
    return await Vendor.find({});
  } catch (error) {
    throw error;
  }
};

// Create a new vendor
exports.createVendor = async (data) => {
  try {
    const vendor = await Vendor.create(data);
    return vendor;
  } catch (error) {
    throw error;
  }
};

// Get a vendor by ID
exports.getVendorById = async (id) => {
  try {
    return await Vendor.findById(id);
  } catch (error) {
    throw error;
  }
};

// Update a vendor by ID
exports.updateVendor = async (id, data) => {
  try {
    return await Vendor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  } catch (error) {
    throw error;
  }
};

// Delete a vendor by ID
exports.deleteVendor = async (id) => {
  try {
    return await Vendor.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

// Fetch vendors by category
exports.getVendorsByCategory = async (category) => {
  try {
    return await Vendor.find({ category });
  } catch (error) {
    throw error;
  }
};
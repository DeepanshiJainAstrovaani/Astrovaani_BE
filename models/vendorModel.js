// Find vendor by whatsapp or email
exports.findByWhatsappOrEmail = async (whatsapp, email) => {
  try {
    if (whatsapp && !email) {
      return await Vendor.findOne({ whatsapp });
    }
    if (email && !whatsapp) {
      return await Vendor.findOne({ email });
    }
    if (whatsapp && email) {
      // Used only for legacy code, not for separate checks
      return await Vendor.findOne({ $or: [ { whatsapp }, { email } ] });
    }
    return null;
  } catch (error) {
    throw error;
  }
};
const Vendor = require('./schemas/vendorSchema');

// Fetch all vendors
exports.getAllVendors = async () => {
  try {
    const vendors = await Vendor.find({}).lean();
    // Convert _id to id for each vendor
    return vendors.map(v => ({
      ...v,
      id: v._id.toString(),
      _id: undefined
    }));
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

// Get vendor by interview code (for public interview selection page)
exports.getVendorByInterviewCode = async (interviewCode) => {
  try {
    return await Vendor.findOne({ interviewcode: interviewCode });
  } catch (error) {
    throw error;
  }
};
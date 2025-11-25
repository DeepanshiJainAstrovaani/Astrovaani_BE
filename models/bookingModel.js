// Get all bookings (admin)
exports.getAllBookings = async (filters = {}) => {
  try {
    const query = {};
    if (filters.status) {
      query.status = filters.status;
    }
    const bookings = await Booking.find(query)
      .populate('user_id', 'name mobile email')
      .populate('vendor_id', 'name category subcategory phone image_url rating experience_years')
      .sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw error;
  }
};
const Booking = require('./schemas/bookingSchema');

exports.createBooking = async (data) => {
  try {
    const booking = await Booking.create(data);
    return booking;
  } catch (error) {
    throw error;
  }
};

exports.updateBookingStatus = async (bookingId, status) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );
    return booking;
  } catch (error) {
    throw error;
  }
};

exports.getBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('user_id', 'name mobile email')
      .populate('vendor_id', 'name category subcategory phone experience_years');
    return booking;
  } catch (error) {
    throw error;
  }
};

exports.getBookingsByUser = async (userId, filters = {}) => {
  try {
    const query = { user_id: userId };
    
    // Add status filter if provided
    if (filters.status) {
      query.status = filters.status;
    }
    
    const bookings = await Booking.find(query)
      .populate('vendor_id', 'name category subcategory phone image_url rating experience_years')
      .sort({ createdAt: -1 });
    
    return bookings;
  } catch (error) {
    throw error;
  }
};

exports.getBookingsByVendor = async (vendorId, filters = {}) => {
  try {
    const query = { vendor_id: vendorId };
    
    // Add status filter if provided
    if (filters.status) {
      query.status = filters.status;
    }
    
    const bookings = await Booking.find(query)
      .populate('user_id', 'name mobile email')
      .sort({ createdAt: -1 });
    
    return bookings;
  } catch (error) {
    throw error;
  }
};

exports.updatePaymentStatus = async (bookingId, paymentStatus, paymentId) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        payment_status: paymentStatus,
        payment_id: paymentId
      },
      { new: true, runValidators: true }
    );
    return booking;
  } catch (error) {
    throw error;
  }
};
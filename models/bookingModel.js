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
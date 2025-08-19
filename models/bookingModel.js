const db = require('../config/db');

exports.createBooking = (data, callback) => {
  const query = 'INSERT INTO booking SET ?';
  db.query(query, data, callback);
};

exports.updateBookingStatus = (bookingId, status, callback) => {
  const query = 'UPDATE booking SET status = ? WHERE id = ?';
  db.query(query, [status, bookingId], callback);
};
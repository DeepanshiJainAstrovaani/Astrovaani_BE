const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/astro'; // Update if needed

const bookingSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  vendor_id: mongoose.Schema.Types.ObjectId,
  name: String,
  gender: String,
  birthplace: String,
  birthdate: Date,
  birthtime: String,
  bookingtype: String,
  booking_date: Date,
  booking_time: String,
  duration: Number,
  status: String,
  total_amount: Number,
  payment_status: String,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'booking' });

const Booking = mongoose.model('Booking', bookingSchema);

async function createPendingBooking() {
  await mongoose.connect(MONGO_URI);

  const booking = new Booking({
    user_id: new mongoose.Types.ObjectId('68fc9e93d9894ef82d8a0d3c'), // Use a valid user_id
    vendor_id: new mongoose.Types.ObjectId('691f69045ccc313abf8a9f2a'), // Use a valid vendor_id
    name: 'Test Pending',
    gender: 'Male',
    birthplace: 'Delhi, India',
    birthdate: new Date('2025-11-26T00:00:00.000Z'),
    birthtime: '10:00',
    bookingtype: 'call',
    booking_date: new Date('2025-11-26T00:00:00.000Z'),
    booking_time: '10:00',
    duration: 15,
    status: 'pending',
    total_amount: 100,
    payment_status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await booking.save();
  console.log('Pending booking created:', booking);
  await mongoose.disconnect();
}

createPendingBooking().catch(console.error);

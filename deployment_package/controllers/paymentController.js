// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bookingModel = require('../models/bookingModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// POST /api/payment/create-order
// body: { amount, currency?, receipt?, bookingId? }
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, bookingId } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'amount is required (in INR)' });
    }

    // Razorpay expects amount in paise
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Incoming body:", req.body);
    console.log("Order created:", order);

    // You can optionally store (bookingId, order.id) mapping in DB if you have a column
    // For now we just return it to the client.
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      bookingId: bookingId || null,
    });
  } catch (err) {
    console.error('Razorpay createOrder error:', err);
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

// POST /api/payment/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId }
exports.verifyPayment = (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  console.log('Verify body:', req.body);

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.error('Missing payment verification fields:', req.body);
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  // verify signature
  const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(signBody)
    .digest('hex');

  console.log('Expected Signature:', expectedSignature);
  console.log('Received Signature:', razorpay_signature);

  const isValid = expectedSignature === razorpay_signature;
  console.log('Is Valid:', isValid);

  if (!isValid) {
    // Optionally flag booking as failed
    if (bookingId) {
      bookingModel.updateBookingStatus(bookingId, 'payment_failed', (err) => {
        if (err) console.error('Failed to set booking payment_failed:', err);
        return res.status(400).json({ error: 'Invalid signature' });
      });
    } else {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    return;
  }

  // Signature is valid → mark booking as paid
  if (bookingId) {
    bookingModel.updateBookingStatus(bookingId, 'paid', (err) => {
      if (err) {
        console.error('Failed to set booking paid:', err);
        return res.status(500).json({ error: 'Payment verified but failed to update booking' });
      }
      return res.status(200).json({
        success: true,
        message: 'Payment verified & booking marked as paid',
        paymentId: razorpay_payment_id,
      });
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Payment verified',
      paymentId: razorpay_payment_id,
    });
  }
};

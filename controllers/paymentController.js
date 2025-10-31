// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bookingModel = require('../models/bookingModel');

// Initialize Razorpay only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay credentials not found. Payment features will be disabled.');
}

// POST /api/payment/create-order
// body: { amount, currency?, receipt?, bookingId? }
exports.createOrder = async (req, res) => {
  try {
    console.log('🔵 Create order request received');
    console.log('🔵 Request body:', req.body);
    console.log('🔵 Razorpay initialized:', !!razorpay);
    
    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('🔴 Razorpay not initialized - missing credentials');
      return res.status(503).json({ 
        error: 'Payment service is not configured. Razorpay credentials are missing. Please contact support.',
        details: 'RAZORPAY_KEY_ID or RAZORPAY_SECRET not set'
      });
    }

    const { amount, currency = 'INR', receipt, bookingId } = req.body;

    if (!amount) {
      console.error('🔴 Amount missing in request');
      return res.status(400).json({ error: 'amount is required (in INR)' });
    }

    // Razorpay expects amount in paise
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };
    
    console.log('🟡 Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created successfully:", order);

    // You can optionally store (bookingId, order.id) mapping in DB if you have a column
    // For now we just return it to the client.
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      bookingId: bookingId || null,
    });
  } catch (err) {
    console.error('🔴 Razorpay createOrder error:', err);
    console.error('🔴 Error message:', err.message);
    console.error('🔴 Error stack:', err.stack);
    return res.status(500).json({ 
      error: 'Failed to create Razorpay order',
      message: err.message,
      details: err.error?.description || 'Unknown error'
    });
  }
};

// POST /api/payment/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId }
exports.verifyPayment = async (req, res) => {
  // Check if Razorpay is configured
  if (!razorpay || !process.env.RAZORPAY_SECRET) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please contact support.' 
    });
  }

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
      try {
        await bookingModel.updateBookingStatus(bookingId, 'cancelled');
        console.log('⚠️ Booking marked as cancelled due to invalid signature:', bookingId);
      } catch (err) {
        console.error('🔴 Failed to set booking cancelled:', err);
      }
    }
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  // Signature is valid → mark booking as confirmed and payment as completed
  if (bookingId) {
    try {
      // Update payment status first
      await bookingModel.updatePaymentStatus(bookingId, 'completed', razorpay_payment_id);
      
      // Then update booking status to confirmed
      await bookingModel.updateBookingStatus(bookingId, 'confirmed');
      
      console.log('✅ Booking marked as confirmed with payment completed:', bookingId);
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified & booking confirmed',
        paymentId: razorpay_payment_id,
        bookingId: bookingId
      });
    } catch (err) {
      console.error('🔴 Failed to update booking:', err);
      return res.status(500).json({ 
        error: 'Payment verified but failed to update booking',
        message: err.message 
      });
    }
  } else {
    return res.status(200).json({
      success: true,
      message: 'Payment verified',
      paymentId: razorpay_payment_id,
    });
  }
};

const express = require('express');
const {
  createStripeCheckoutSession,
  createCodOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  verifyStripeSession
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout-session', protect, createStripeCheckoutSession);
router.post('/cod-order', protect, createCodOrder);
router.post('/razorpay-order', protect, createRazorpayOrder);
router.post('/verify-razorpay-payment', protect, verifyRazorpayPayment);
router.post('/verify-session', protect, verifyStripeSession);

module.exports = router;

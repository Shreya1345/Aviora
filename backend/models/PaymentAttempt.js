const mongoose = require('mongoose');

const paymentAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['razorpay', 'paypal', 'stripe'], required: true },
  providerOrderId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      name: String,
      imageUrl: String
    }
  ],
  totalAmount: { type: Number, required: true },
  currency: { type: String, enum: ['INR', 'USD'], default: 'USD', required: true },
  paymentAmountMinor: { type: Number, min: 1 },
  paymentCurrency: { type: String, enum: ['INR', 'USD'] },
  exchangeRate: { type: Number, min: 0 },
  exchangeRateDate: String,
  address: {
    fullName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });

module.exports = mongoose.model('PaymentAttempt', paymentAttemptSchema);

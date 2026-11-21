const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
  paymentAmountMinor: { type: Number, min: 1 },
  paymentCurrency: { type: String, enum: ['INR', 'USD'] },
  exchangeRate: { type: Number, min: 0 },
  exchangeRateDate: String,
  address: {
    fullName: { type: String, required: true },
    email: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  paymentId: { type: String, unique: true, sparse: true },
  paymentProvider: { type: String, enum: ['razorpay', 'paypal', 'stripe', 'test', 'cod'] },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

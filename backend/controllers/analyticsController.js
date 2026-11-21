const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });

    const orders = await Order.find({}).select('totalAmount currency').lean();
    const revenueByCurrency = orders.reduce((totals, order) => {
      if (order.currency === 'USD') totals.revenueUsd += order.totalAmount;
      else if (order.currency === 'INR') totals.revenueInr += order.totalAmount;
      return totals;
    }, { revenueUsd: 0, revenueInr: 0 });

    res.json({ totalOrders, totalProducts, totalUsers, ...revenueByCurrency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };

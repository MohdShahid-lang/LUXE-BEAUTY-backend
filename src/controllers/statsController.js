const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getStats = async (req, res) => {
  try {
    const [users, ordersList, products] = await Promise.all([
      User.countDocuments(),
      Order.find({}, { totalAmount: 1 }),
      Product.countDocuments()
    ]);

    const sales = ordersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    return res.json({ users, orders: ordersList.length, products, sales });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStats
};

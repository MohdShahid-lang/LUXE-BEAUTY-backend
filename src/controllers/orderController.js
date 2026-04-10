const Order = require('../models/Order');
const Product = require('../models/Product');
const { serializeOrder } = require('../utils/serializers');
const { isValidObjectId } = require('../utils/validators');

const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const orders = await Order.find(filter)
      .populate('items.productId')
      .sort({ createdAt: -1 });

    return res.json(orders.map(serializeOrder));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one order item is required' });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));

    const invalidItem = normalizedItems.find(
      (item) =>
        !isValidObjectId(item.productId) ||
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(item.price)
    );

    if (invalidItem) {
      return res.status(400).json({ error: 'Order items contain invalid data' });
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const existingProducts = await Product.countDocuments({ _id: { $in: productIds } });
    if (existingProducts !== productIds.length) {
      return res.status(400).json({ error: 'One or more products were not found' });
    }

    const order = await Order.create({
      userId: req.user.id,
      totalAmount: Number(totalAmount),
      items: normalizedItems
    });

    return res.status(201).json(serializeOrder(order));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(serializeOrder(order));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus
};

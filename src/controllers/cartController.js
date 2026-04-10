const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { serializeProduct, toId } = require('../utils/serializers');
const { isValidObjectId } = require('../utils/validators');

const serializeCartItem = (cartItemDoc) => {
  const product =
    cartItemDoc.productId && typeof cartItemDoc.productId === 'object' && cartItemDoc.productId.name
      ? serializeProduct(cartItemDoc.productId)
      : null;

  return {
    id: toId(cartItemDoc._id),
    userId: toId(cartItemDoc.userId),
    productId: product ? product.id : toId(cartItemDoc.productId),
    quantity: cartItemDoc.quantity,
    product,
    createdAt: cartItemDoc.createdAt,
    updatedAt: cartItemDoc.updatedAt
  };
};

const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id })
      .populate({
        path: 'productId',
        populate: { path: 'categoryId' }
      })
      .sort({ createdAt: -1 });

    return res.json(cartItems.map(serializeCartItem));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const normalizedQuantity = Number(quantity) || 1;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: 'Valid productId is required' });
    }

    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingItem = await CartItem.findOne({ userId: req.user.id, productId });

    if (existingItem) {
      existingItem.quantity += normalizedQuantity;
      await existingItem.save();

      const populatedItem = await CartItem.findById(existingItem._id).populate({
        path: 'productId',
        populate: { path: 'categoryId' }
      });

      return res.json(serializeCartItem(populatedItem));
    }

    const cartItem = await CartItem.create({
      userId: req.user.id,
      productId,
      quantity: normalizedQuantity
    });

    const populatedItem = await CartItem.findById(cartItem._id).populate({
      path: 'productId',
      populate: { path: 'categoryId' }
    });

    return res.status(201).json(serializeCartItem(populatedItem));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const normalizedQuantity = Number(quantity);

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cart item id' });
    }

    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { quantity: normalizedQuantity },
      { new: true, runValidators: true }
    ).populate({
      path: 'productId',
      populate: { path: 'categoryId' }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    return res.json(serializeCartItem(cartItem));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cart item id' });
    }

    const cartItem = await CartItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    return res.json({ message: 'Cart item removed successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem
};

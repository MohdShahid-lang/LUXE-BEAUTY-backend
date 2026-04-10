const Category = require('../models/Category');
const Product = require('../models/Product');
const { serializeProduct } = require('../utils/serializers');
const { isValidObjectId } = require('../utils/validators');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId').sort({ createdAt: -1 });
    return res.json(products.map(serializeProduct));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const product = await Product.findById(req.params.id).populate('categoryId');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(serializeProduct(product));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Valid categoryId is required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const product = await Product.create({
      name: name?.trim(),
      description: description?.trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      imageUrl: imageUrl || null,
      categoryId: category._id
    });

    return res.status(201).json(serializeProduct(product));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Valid categoryId is required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        description: description?.trim(),
        price: Number(price),
        stock: Number(stock) || 0,
        imageUrl: imageUrl || null,
        categoryId: category._id
      },
      { new: true, runValidators: true }
    ).populate('categoryId');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(serializeProduct(product));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const incrementProductView = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('categoryId');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(serializeProduct(product));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  incrementProductView
};

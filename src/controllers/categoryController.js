const Category = require('../models/Category');
const { serializeCategory } = require('../utils/serializers');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories.map(serializeCategory));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({ name: name.trim() });
    return res.status(201).json(serializeCategory(category));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory
};

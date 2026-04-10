const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    viewCount: { type: Number, required: true, default: 0, min: 0 },
    imageUrl: { type: String, default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

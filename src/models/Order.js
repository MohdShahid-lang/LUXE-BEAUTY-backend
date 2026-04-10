const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    items: [orderItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

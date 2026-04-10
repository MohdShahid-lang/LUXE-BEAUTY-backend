const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_skin';

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

module.exports = connectDatabase;

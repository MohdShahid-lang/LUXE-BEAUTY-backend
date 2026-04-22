const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

module.exports = connectDatabase;

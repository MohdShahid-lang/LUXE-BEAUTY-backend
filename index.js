require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err.message);
    process.exit(1);
  }
};

startServer();

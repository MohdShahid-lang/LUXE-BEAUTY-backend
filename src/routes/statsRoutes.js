const express = require('express');

const statsController = require('../controllers/statsController');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', adminAuth, statsController.getStats);

module.exports = router;

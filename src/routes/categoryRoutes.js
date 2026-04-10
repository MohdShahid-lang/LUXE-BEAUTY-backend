const express = require('express');

const categoryController = require('../controllers/categoryController');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', adminAuth, categoryController.createCategory);

module.exports = router;

const express = require('express');

const orderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, orderController.getOrders);
router.post('/', auth, orderController.createOrder);
router.put('/:id/status', adminAuth, orderController.updateOrderStatus);

module.exports = router;

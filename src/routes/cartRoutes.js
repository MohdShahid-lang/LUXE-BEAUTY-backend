const express = require('express');

const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, cartController.getCart);
router.post('/', auth, cartController.addToCart);
router.put('/:id', auth, cartController.updateCartItemQuantity);
router.delete('/:id', auth, cartController.removeCartItem);

module.exports = router;

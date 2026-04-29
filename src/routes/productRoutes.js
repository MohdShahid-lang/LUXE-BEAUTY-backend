const express = require('express');

const productController = require('../controllers/productController');
const { adminAuth } = require('../middleware/authMiddleware');
const { uploadProductImage } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.patch('/:id/view', productController.incrementProductView);
router.post('/', adminAuth, uploadProductImage, productController.createProduct);
router.put('/:id', adminAuth, uploadProductImage, productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;

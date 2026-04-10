const express = require('express');

const userController = require('../controllers/userController');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', adminAuth, userController.getUsers);
router.put('/:id', adminAuth, userController.updateUser);
router.delete('/:id', adminAuth, userController.deleteUser);

module.exports = router;

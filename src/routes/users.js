const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', authMiddleware(['admin']), userController.getUserById);
router.get('/:id/profile', authMiddleware(['admin']), userController.getUserProfile);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);
router.delete('/:id/profile', authMiddleware(['admin']), userController.deleteUserProfile);

module.exports = router;

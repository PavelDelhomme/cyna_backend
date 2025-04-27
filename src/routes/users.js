const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', authMiddleware(['admin']), userController.getUserById);
router.get('/:id/profile', authMiddleware(['admin']), userController.getUserProfile);

router.patch('/:id', authMiddleware(), userController.updateUser);
router.patch('/:id/password', authMiddleware(), userController.updatePassword);
router.delete('/:id', authMiddleware(), userController.deleteUser);
router.delete('/:id/profile', authMiddleware(), userController.deleteUserProfile);

module.exports = router;

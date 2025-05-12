const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', authMiddleware(['admin']), userController.getUserById);
router.delete('/:id', authMiddleware(), userController.deleteUser);

module.exports = router;

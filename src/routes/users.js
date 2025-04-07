const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.get('/me', authMiddleware(), userController.getCurrentUser);
router.post('/', authMiddleware(['admin']), userController.createUser);
router.put('/:id', authMiddleware(), userController.updateUser);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

module.exports = router;

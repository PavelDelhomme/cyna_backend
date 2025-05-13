const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/get-profile/:id', authMiddleware(['user', 'admin']), userController.getUserProfile);
router.patch('/update-profile/:id', authMiddleware(['user', 'admin']), userController.updateUser);
router.patch('/update-password/:id', authMiddleware(['user', 'admin']), userController.updatePassword);
router.delete('/delete-profile/:id', authMiddleware(['user', 'admin']), userController.deleteUserProfile);

module.exports = router;

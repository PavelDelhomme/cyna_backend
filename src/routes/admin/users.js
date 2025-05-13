const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-users', authMiddleware(['admin']), userController.getAllUsers);
router.get('/get-user/:id', authMiddleware(['admin']), userController.getUserById);
router.delete('/delete-user/:id', authMiddleware(['admin']), userController.deleteUser);
router.post('/assign-role/:userId', authMiddleware(['admin']), userController.assignRoleToUser);

module.exports = router;

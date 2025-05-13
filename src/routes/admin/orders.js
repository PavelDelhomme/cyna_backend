const express = require('express');
const router = express.Router();
const devController = require('../../controllers/devController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-orders', authMiddleware(['admin']), devController.listOrders);
router.post('/create-order', authMiddleware(['admin']), devController.createOrder);
router.delete('/delete-order/:id', authMiddleware(['admin']), devController.deleteOrder);

module.exports = router;
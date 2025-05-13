const express = require('express');
const router = express.Router();
const devController = require('../../controllers/devController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-payments', authMiddleware(['admin']), devController.listPayments);
router.post('/create-payment', authMiddleware(['admin']), devController.createPayment);
router.delete('/delete-payment/:id', authMiddleware(['admin']), devController.deletePayment);

module.exports = router;

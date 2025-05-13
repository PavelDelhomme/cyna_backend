const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/payments', authMiddleware(['admin, user']), paymentController.listPayments);
//router.post('/carts/create', authMiddleware(), cartController.createCart);
router.post('/payments/user/create/:userId', authMiddleware(['admin, user']), paymentController.createPayment);
router.patch('/payments/user/update/:userId', authMiddleware(['admin, user']), paymentController.updatePayment);
router.delete('/payments/user/delete/:userId', authMiddleware(['admin, user']), paymentController.deletePayment);


module.exports = router;
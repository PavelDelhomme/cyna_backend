const express = require('express');
const router = express.Router();

const cartController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/carts', authMiddleware(['admin, user']), cartController.listCarts);
//router.post('/carts/create', authMiddleware(), cartController.createCart);
router.post('/carts/user/create/:userId', authMiddleware(['admin, user']), cartController.createCartForUser);
router.post('/carts/:cartId/add-product/:productId', authMiddleware(['admin, user']), cartController.addProductToCart);
router.post('/carts/:cartId/add-service/:serviceId', authMiddleware(['admin, user']), cartController.addServiceToCart);
router.patch('/carts/user/update/:userId', authMiddleware(['admin, user']), cartController.updateCartForUser);
router.delete('/carts/user/delete/:userId', authMiddleware(['admin, user']), cartController.deleteCart);


module.exports = router;
const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const ord     = require('../controllers/orderController');

router.get('/',           auth(['user','admin']), ord.listOrders);
router.get('/user/:userId', auth(['user','admin']), ord.getUserOrders);
router.post('/',          auth(['user','admin']), ord.createOrder);
router.delete('/:id',     auth(['admin']),        ord.deleteOrder);
router.patch('/:id/status', auth(['admin']),      ord.updateOrderStatus);
router.get('/count',      ord.countOrders);
router.get('/pending-count', ord.countPendingOrders);
router.get('/product-sales-details', ord.productSalesDetails);
router.get('/service-sales-details', ord.serviceSalesDetails);
router.get('/pending-orders', ord.pendingOrders);

module.exports = router;
